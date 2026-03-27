import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.R2_BUCKET_NAME!;

/**
 * Upload a track's audio to R2.
 */
export async function uploadAudio(
  trackId: string,
  audio: Buffer,
  mimeType: string
): Promise<string> {
  const key = `tracks/${trackId}.mp3`;

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: audio,
      ContentType: mimeType,
    })
  );

  console.log(`[r2] Uploaded audio: ${key} (${(audio.length / 1024 / 1024).toFixed(1)}MB)`);
  return key;
}

/**
 * Upload cover art to R2.
 */
export async function uploadCover(
  trackId: string,
  image: Buffer
): Promise<string> {
  const key = `covers/${trackId}.png`;

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: image,
      ContentType: "image/png",
    })
  );

  console.log(`[r2] Uploaded cover: ${key} (${(image.length / 1024).toFixed(0)}KB)`);
  return key;
}

/**
 * Download audio from R2.
 */
export async function downloadAudio(
  trackId: string
): Promise<{ audio: Buffer; mimeType: string } | null> {
  const key = `tracks/${trackId}.mp3`;

  try {
    const response = await s3.send(
      new GetObjectCommand({
        Bucket: BUCKET,
        Key: key,
      })
    );

    const chunks: Uint8Array[] = [];
    const stream = response.Body as AsyncIterable<Uint8Array>;
    for await (const chunk of stream) {
      chunks.push(chunk);
    }

    return {
      audio: Buffer.concat(chunks),
      mimeType: response.ContentType || "audio/mp3",
    };
  } catch {
    return null;
  }
}

/**
 * Download cover art from R2.
 */
export async function downloadCover(trackId: string): Promise<Buffer | null> {
  const key = `covers/${trackId}.png`;

  try {
    const response = await s3.send(
      new GetObjectCommand({
        Bucket: BUCKET,
        Key: key,
      })
    );

    const chunks: Uint8Array[] = [];
    const stream = response.Body as AsyncIterable<Uint8Array>;
    for await (const chunk of stream) {
      chunks.push(chunk);
    }

    return Buffer.concat(chunks);
  } catch {
    return null;
  }
}

/**
 * Check if a track exists in R2.
 */
export async function trackExists(trackId: string): Promise<boolean> {
  try {
    await s3.send(
      new HeadObjectCommand({
        Bucket: BUCKET,
        Key: `tracks/${trackId}.mp3`,
      })
    );
    return true;
  } catch {
    return false;
  }
}

/**
 * Save track metadata JSON to R2.
 */
export async function uploadTrackMeta(
  trackId: string,
  meta: Record<string, unknown>
): Promise<void> {
  const key = `meta/${trackId}.json`;
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: JSON.stringify(meta),
      ContentType: "application/json",
    })
  );
}

/**
 * Load track metadata JSON from R2.
 */
export async function downloadTrackMeta(
  trackId: string
): Promise<Record<string, unknown> | null> {
  const key = `meta/${trackId}.json`;
  try {
    const response = await s3.send(
      new GetObjectCommand({ Bucket: BUCKET, Key: key })
    );
    const chunks: Uint8Array[] = [];
    const stream = response.Body as AsyncIterable<Uint8Array>;
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    return JSON.parse(Buffer.concat(chunks).toString("utf-8"));
  } catch {
    return null;
  }
}

/**
 * List all track IDs for a given station from R2.
 * Scans the meta/ prefix for JSON files matching the station ID.
 */
export async function listStationTracks(
  stationId: string
): Promise<string[]> {
  const prefix = `meta/${stationId}-`;
  const trackIds: string[] = [];

  let continuationToken: string | undefined;
  do {
    const response = await s3.send(
      new ListObjectsV2Command({
        Bucket: BUCKET,
        Prefix: prefix,
        ContinuationToken: continuationToken,
      })
    );

    for (const obj of response.Contents ?? []) {
      if (obj.Key) {
        // meta/lofi-chill-1234567890-abc123.json → lofi-chill-1234567890-abc123
        const trackId = obj.Key.replace("meta/", "").replace(".json", "");
        trackIds.push(trackId);
      }
    }

    continuationToken = response.IsTruncated
      ? response.NextContinuationToken
      : undefined;
  } while (continuationToken);

  return trackIds;
}
