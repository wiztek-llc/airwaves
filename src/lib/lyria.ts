import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export interface GeneratedTrack {
  id: string;
  stationId: string;
  audio: Buffer;
  mimeType: string;
  prompt: string;
  generatedAt: number;
}

/**
 * Generate a full song using Lyria 3 Pro.
 * Returns the raw audio buffer and metadata.
 */
export async function generateTrack(
  stationId: string,
  prompt: string
): Promise<GeneratedTrack> {
  const response = await ai.models.generateContent({
    model: "lyria-3-pro-preview",
    contents: prompt,
    config: {
      responseModalities: ["AUDIO"],
    },
  });

  if (!response.candidates || response.candidates.length === 0) {
    throw new Error("No candidates returned — likely safety filtered");
  }

  const candidate = response.candidates[0];

  if (candidate.finishReason === "SAFETY") {
    throw new Error("Content blocked by safety filters");
  }

  // Find the audio part in the response
  const parts = candidate.content?.parts ?? [];
  for (const part of parts) {
    if (part.inlineData?.data) {
      const audioBuffer = Buffer.from(part.inlineData.data, "base64");
      const mimeType = part.inlineData.mimeType ?? "audio/mp3";
      const id = `${stationId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

      return {
        id,
        stationId,
        audio: audioBuffer,
        mimeType,
        prompt,
        generatedAt: Date.now(),
      };
    }
  }

  throw new Error("No audio data in response");
}

/**
 * Simple rate limiter for 10 RPM.
 */
class RateLimiter {
  private timestamps: number[] = [];
  private readonly maxPerMinute: number;

  constructor(maxPerMinute: number = 10) {
    this.maxPerMinute = maxPerMinute;
  }

  async acquire(): Promise<void> {
    const now = Date.now();
    this.timestamps = this.timestamps.filter((t) => now - t < 60_000);

    if (this.timestamps.length >= this.maxPerMinute) {
      const waitMs = 60_000 - (now - this.timestamps[0]) + 200;
      console.log(`[lyria] Rate limited, waiting ${Math.round(waitMs / 1000)}s`);
      await new Promise((r) => setTimeout(r, waitMs));
    }

    this.timestamps.push(Date.now());
  }
}

export const rateLimiter = new RateLimiter(10);

/**
 * Generate a track with rate limiting and retry logic.
 */
export async function generateTrackThrottled(
  stationId: string,
  prompt: string,
  maxRetries: number = 2
): Promise<GeneratedTrack> {
  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    try {
      await rateLimiter.acquire();
      console.log(`[lyria] Generating track for ${stationId} (attempt ${attempt})`);
      const start = Date.now();
      const track = await generateTrack(stationId, prompt);
      const elapsed = ((Date.now() - start) / 1000).toFixed(1);
      console.log(
        `[lyria] Generated ${stationId} track: ${track.id} (${(track.audio.length / 1024 / 1024).toFixed(1)}MB, ${elapsed}s)`
      );
      return track;
    } catch (error: unknown) {
      const err = error as { status?: number; message?: string };
      if (err.status === 429 && attempt <= maxRetries) {
        const waitMs = Math.pow(2, attempt) * 2000 + Math.random() * 1000;
        console.log(`[lyria] Rate limited (429), retry in ${Math.round(waitMs / 1000)}s`);
        await new Promise((r) => setTimeout(r, waitMs));
        continue;
      }
      if (err.status === 503 && attempt <= maxRetries) {
        const waitMs = 5000 * attempt;
        console.log(`[lyria] Service unavailable (503), retry in ${Math.round(waitMs / 1000)}s`);
        await new Promise((r) => setTimeout(r, waitMs));
        continue;
      }
      throw error;
    }
  }
  throw new Error("Max retries exceeded");
}
