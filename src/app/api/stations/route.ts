import { NextResponse } from "next/server";
import { queueManager } from "@/lib/queue";
import { stations } from "@/lib/stations";

/**
 * GET /api/stations — List all stations with queue status.
 */
export async function GET() {
  const status = queueManager.getStatus();

  const data = stations.map((s) => ({
    ...s,
    queue: status[s.id] ?? { queueLength: 0, generating: false },
  }));

  return NextResponse.json(data);
}

/**
 * POST /api/stations — Seed a station with initial tracks.
 * Body: { stationId: string, count?: number }
 */
export async function POST(request: Request) {
  const { stationId, count = 1 } = await request.json();

  if (!stationId) {
    return NextResponse.json({ error: "stationId required" }, { status: 400 });
  }

  // Don't await — seed in the background
  queueManager.seedStation(stationId, count).catch((err) => {
    console.error(`[api] Seed failed for ${stationId}:`, err);
  });

  return NextResponse.json({ status: "seeding", stationId, count });
}
