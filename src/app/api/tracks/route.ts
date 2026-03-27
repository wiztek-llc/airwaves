import { NextResponse } from "next/server";
import { queueManager } from "@/lib/queue";

/**
 * GET /api/tracks?stationId=xxx — Get the next track for a station.
 * Returns track metadata (not audio). Use /api/tracks/[id]/audio for the file.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const stationId = url.searchParams.get("stationId");

  if (!stationId) {
    return NextResponse.json({ error: "stationId required" }, { status: 400 });
  }

  const track = queueManager.getNextTrack(stationId);

  if (!track) {
    return NextResponse.json(
      { error: "no_tracks", message: "No tracks available. Station may need seeding." },
      { status: 404 }
    );
  }

  return NextResponse.json(track);
}
