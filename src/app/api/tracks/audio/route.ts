import { queueManager } from "@/lib/queue";

/**
 * GET /api/tracks/audio?id=xxx — Stream the audio file for a track.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const trackId = url.searchParams.get("id");

  if (!trackId) {
    return new Response("id required", { status: 400 });
  }

  const result = await queueManager.getAudio(trackId);

  if (!result) {
    return new Response("Track not found", { status: 404 });
  }

  return new Response(result.audio, {
    headers: {
      "Content-Type": result.mimeType,
      "Content-Length": result.audio.length.toString(),
      "Cache-Control": "public, max-age=86400",
      "Accept-Ranges": "bytes",
    },
  });
}
