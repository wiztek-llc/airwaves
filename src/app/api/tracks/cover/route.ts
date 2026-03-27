import { queueManager } from "@/lib/queue";

/**
 * GET /api/tracks/cover?id=xxx — Serve cover art image.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const trackId = url.searchParams.get("id");

  if (!trackId) {
    return new Response("id required", { status: 400 });
  }

  const cover = await queueManager.getCover(trackId);

  if (!cover) {
    // Return a 1x1 transparent PNG as fallback
    return new Response(null, { status: 404 });
  }

  return new Response(cover, {
    headers: {
      "Content-Type": "image/png",
      "Content-Length": cover.length.toString(),
      "Cache-Control": "public, max-age=86400",
    },
  });
}
