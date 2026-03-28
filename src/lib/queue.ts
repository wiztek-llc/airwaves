import { generateTrackThrottled, type GeneratedTrack } from "./lyria";
import { stations } from "./stations";
import {
  generateLyriaPrompt,
  generateTrackMetadata,
  generateSeed,
} from "./prompt-engine";
import { generateCoverArt } from "./cover-art";
import {
  uploadAudio,
  uploadCover,
  uploadTrackMeta,
  downloadAudio,
  downloadCover,
  downloadTrackMeta,
  listStationTracks,
} from "./r2";

export interface TrackMeta {
  id: string;
  stationId: string;
  mimeType: string;
  generatedAt: number;
  sizeBytes: number;
  seed: number;
  title: string;
  artist: string;
  coverUrl: string;
}

interface StationQueue {
  stationId: string;
  tracks: TrackMeta[];
  generating: boolean;
  r2TrackIds: string[]; // all track IDs in R2 for this station
  r2Loaded: boolean;
}

/**
 * Queue manager with R2 persistence.
 * On play: picks random tracks from R2 catalog.
 * Background: generates new tracks to grow the catalog.
 */
class QueueManager {
  private queues: Map<string, StationQueue> = new Map();
  private audioCache: Map<string, Buffer> = new Map();
  private coverCache: Map<string, Buffer> = new Map();
  private readonly bufferSize = 3;

  constructor() {
    for (const station of stations) {
      this.queues.set(station.id, {
        stationId: station.id,
        tracks: [],
        generating: false,
        r2TrackIds: [],
        r2Loaded: false,
      });
    }
  }

  /**
   * Get the next track for a station.
   * Picks from queue (loaded from R2 catalog or freshly generated).
   */
  getNextTrack(stationId: string): TrackMeta | null {
    const queue = this.queues.get(stationId);
    if (!queue) return null;

    const track = queue.tracks.shift() ?? null;

    // Keep the queue filled
    if (queue.tracks.length < this.bufferSize - 1) {
      this.fillFromCatalog(stationId);
    }

    return track;
  }

  /**
   * Get audio — memory cache first, then R2.
   */
  async getAudio(trackId: string): Promise<{ audio: Buffer; mimeType: string } | null> {
    const cached = this.audioCache.get(trackId);
    if (cached) return { audio: cached, mimeType: "audio/mp3" };

    const r2Result = await downloadAudio(trackId);
    if (r2Result) {
      this.audioCache.set(trackId, r2Result.audio);
      return r2Result;
    }

    return null;
  }

  /**
   * Get cover art — memory cache first, then R2.
   */
  async getCover(trackId: string): Promise<Buffer | null> {
    const cached = this.coverCache.get(trackId);
    if (cached) return cached;

    const r2Cover = await downloadCover(trackId);
    if (r2Cover) {
      this.coverCache.set(trackId, r2Cover);
      return r2Cover;
    }

    return null;
  }

  evictFromCache(trackId: string) {
    this.audioCache.delete(trackId);
    this.coverCache.delete(trackId);
  }

  getStatus(): Record<string, { queueLength: number; generating: boolean; catalogSize: number }> {
    const status: Record<string, { queueLength: number; generating: boolean; catalogSize: number }> = {};
    for (const [id, queue] of this.queues) {
      status[id] = {
        queueLength: queue.tracks.length,
        generating: queue.generating,
        catalogSize: queue.r2TrackIds.length,
      };
    }
    return status;
  }

  /**
   * Seed a station — first loads existing tracks from R2 catalog.
   * Only generates new tracks if the catalog is empty.
   */
  async seedStation(stationId: string, count: number = 2): Promise<void> {
    const queue = this.queues.get(stationId);
    if (!queue) throw new Error(`Unknown station: ${stationId}`);

    // Load R2 catalog if not already loaded
    if (!queue.r2Loaded) {
      await this.loadR2Catalog(queue);
    }

    // If we have tracks in R2, fill the queue from catalog
    if (queue.r2TrackIds.length > 0 && queue.tracks.length === 0) {
      console.log(`[queue] ${stationId} has ${queue.r2TrackIds.length} tracks in R2, loading random selection...`);
      await this.fillFromCatalogImmediate(queue, count);

      // Also kick off background generation to grow the catalog
      this.generateInBackground(stationId);
      return;
    }

    // No tracks in R2 — generate fresh
    console.log(`[queue] ${stationId} has no tracks in R2, generating ${count} fresh...`);
    for (let i = 0; i < count; i++) {
      try {
        await this.generateForStation(queue);
      } catch (error) {
        console.error(`[queue] Failed to seed ${stationId}:`, error);
      }
    }
  }

  /**
   * Load the R2 catalog for a station (list of all track IDs).
   */
  private async loadR2Catalog(queue: StationQueue): Promise<void> {
    try {
      console.log(`[queue] Loading R2 catalog for ${queue.stationId}...`);
      queue.r2TrackIds = await listStationTracks(queue.stationId);
      queue.r2Loaded = true;
      console.log(`[queue] ${queue.stationId}: ${queue.r2TrackIds.length} tracks in R2`);
    } catch (err) {
      console.error(`[queue] Failed to load R2 catalog for ${queue.stationId}:`, err);
      queue.r2Loaded = true; // Mark as loaded even on error to prevent retry loops
    }
  }

  /**
   * Fill the queue with random tracks from the R2 catalog.
   * Loads metadata from R2 (no audio download yet — that happens on play).
   */
  private async fillFromCatalog(stationId: string): Promise<void> {
    const queue = this.queues.get(stationId);
    if (!queue || queue.generating) return;

    if (!queue.r2Loaded) {
      await this.loadR2Catalog(queue);
    }

    if (queue.r2TrackIds.length === 0) {
      // No catalog — generate fresh
      this.refillQueue(stationId);
      return;
    }

    queue.generating = true;
    try {
      await this.fillFromCatalogImmediate(queue, this.bufferSize - queue.tracks.length);
    } finally {
      queue.generating = false;
    }

    // Always try to grow the catalog in the background if under 1000 tracks
    if (queue.r2TrackIds.length < 1000) {
      this.generateInBackground(stationId);
    }
  }

  /**
   * Immediately load N random tracks from R2 into the queue.
   */
  private async fillFromCatalogImmediate(
    queue: StationQueue,
    count: number
  ): Promise<void> {
    // Pick random track IDs (avoid recently queued ones)
    const queuedIds = new Set(queue.tracks.map((t) => t.id));
    const available = queue.r2TrackIds.filter((id) => !queuedIds.has(id));

    if (available.length === 0) {
      console.log(`[queue] ${queue.stationId}: all catalog tracks already in queue`);
      return;
    }

    // Shuffle and pick
    const shuffled = available.sort(() => Math.random() - 0.5);
    const picks = shuffled.slice(0, count);

    for (const trackId of picks) {
      try {
        const meta = await downloadTrackMeta(trackId);
        if (meta) {
          const trackMeta: TrackMeta = {
            id: meta.id as string,
            stationId: meta.stationId as string,
            mimeType: (meta.mimeType as string) || "audio/mp3",
            generatedAt: meta.generatedAt as number,
            sizeBytes: meta.sizeBytes as number,
            seed: meta.seed as number,
            title: meta.title as string,
            artist: meta.artist as string,
            coverUrl: `/api/tracks/cover?id=${meta.id}`,
          };
          queue.tracks.push(trackMeta);
          console.log(
            `[queue] ${queue.stationId}: loaded from R2 — "${trackMeta.title}" by ${trackMeta.artist}`
          );
        }
      } catch (err) {
        console.error(`[queue] Failed to load track ${trackId} from R2:`, err);
      }
    }
  }

  /**
   * Background generation to grow the catalog (non-blocking).
   * Retries up to 3 times if generation fails (e.g. safety filter).
   */
  private generateInBackground(stationId: string): void {
    const queue = this.queues.get(stationId);
    if (!queue || queue.generating) return;

    queue.generating = true;

    const attempt = async (retries: number): Promise<void> => {
      try {
        await this.generateForStation(queue);
        console.log(`[queue] ${stationId}: background generation complete, catalog now ${queue.r2TrackIds.length} tracks`);
      } catch (err) {
        if (retries > 0) {
          console.log(`[queue] ${stationId}: generation failed, retrying (${retries} left)...`);
          await new Promise((r) => setTimeout(r, 3000));
          return attempt(retries - 1);
        }
        console.error(`[queue] Background generation failed for ${stationId} after all retries:`, err);
      }
    };

    attempt(3).finally(() => {
      queue.generating = false;
    });
  }

  private async refillQueue(stationId: string): Promise<void> {
    const queue = this.queues.get(stationId);
    if (!queue || queue.generating) return;

    queue.generating = true;
    console.log(
      `[queue] Refilling ${stationId} (${queue.tracks.length}/${this.bufferSize})`
    );

    try {
      while (queue.tracks.length < this.bufferSize) {
        await this.generateForStation(queue);
        console.log(
          `[queue] Refilled ${stationId} (queue: ${queue.tracks.length}/${this.bufferSize})`
        );
      }
    } catch (error) {
      console.error(`[queue] Refill failed for ${stationId}:`, error);
    } finally {
      queue.generating = false;
    }
  }

  /**
   * Full generation pipeline:
   * 1. Gemini generates prompt + metadata
   * 2. Lyria generates audio + Imagen generates cover
   * 3. Everything uploads to R2 (audio, cover, metadata JSON)
   */
  private async generateForStation(
    queue: StationQueue
  ): Promise<GeneratedTrack> {
    const seed = generateSeed();
    console.log(`[queue] ${queue.stationId} | seed: ${seed} | Starting parallel pipeline...`);

    // Stage 1: Prompt + metadata in parallel
    const [lyriaPrompt, metadata] = await Promise.all([
      generateLyriaPrompt(queue.stationId, seed),
      generateTrackMetadata(queue.stationId, seed).catch((err) => {
        console.error(`[queue] Metadata generation failed, using fallback:`, err);
        return { title: `Track #${seed % 10000}`, artist: "airwaves.fm" };
      }),
    ]);

    console.log(
      `[queue] ${queue.stationId} | seed: ${seed} | "${metadata.title}" by ${metadata.artist}`
    );

    // Stage 2: Audio + cover in parallel
    const [track, coverBuffer] = await Promise.all([
      generateTrackThrottled(queue.stationId, lyriaPrompt),
      generateCoverArt(metadata.title, metadata.artist, lyriaPrompt.substring(0, 200), queue.stationId).catch(
        (err) => {
          console.error(`[queue] Cover art generation failed:`, err);
          return null;
        }
      ),
    ]);

    // Build metadata
    const trackMeta: TrackMeta = {
      id: track.id,
      stationId: track.stationId,
      mimeType: track.mimeType,
      generatedAt: track.generatedAt,
      sizeBytes: track.audio.length,
      seed,
      title: metadata.title,
      artist: metadata.artist,
      coverUrl: `/api/tracks/cover?id=${track.id}`,
    };

    // Stage 3: Upload everything to R2 + cache in memory
    const uploads: Promise<void>[] = [
      uploadAudio(track.id, track.audio, track.mimeType)
        .then(() => {})
        .catch((err) => console.error(`[r2] Audio upload failed:`, err)),
      uploadTrackMeta(track.id, trackMeta as unknown as Record<string, unknown>)
        .catch((err) => console.error(`[r2] Meta upload failed:`, err)),
    ];

    if (coverBuffer) {
      uploads.push(
        uploadCover(track.id, coverBuffer)
          .then(() => {})
          .catch((err) => console.error(`[r2] Cover upload failed:`, err))
      );
      this.coverCache.set(track.id, coverBuffer);
    }

    this.audioCache.set(track.id, track.audio);
    await Promise.all(uploads);

    // Add to queue and catalog
    queue.tracks.push(trackMeta);
    queue.r2TrackIds.push(track.id);

    console.log(
      `[queue] ${queue.stationId} | seed: ${seed} | Done! "${metadata.title}" (${(track.audio.length / 1024 / 1024).toFixed(1)}MB, r2: uploaded, catalog: ${queue.r2TrackIds.length})`
    );

    return track;
  }
}

export const queueManager = new QueueManager();
