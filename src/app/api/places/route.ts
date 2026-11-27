import { NextResponse } from "next/server";
import { ensureSeed, listPlaces } from "@/lib/queries";

export const dynamic = "force-dynamic";

/** GET /api/places?area=&type=&mood=رومانسي,شلة&maxPrice=&q= */
export async function GET(req: Request) {
  const sp = new URL(req.url).searchParams;
  const list = (v: string | null) => (v ? v.split(",").map((s) => s.trim()).filter(Boolean) : []);

  await ensureSeed();
  const places = await listPlaces({
    area: sp.get("area") ?? undefined,
    type: sp.get("type") ?? undefined,
    moods: list(sp.get("mood")),
    maxPrice: sp.get("maxPrice") ? Number(sp.get("maxPrice")) : undefined,
    q: sp.get("q") ?? undefined,
  }).catch((e) => {
    console.error("places query failed", e);
    return [];
  });

  return NextResponse.json({ count: places.length, places }, { headers: { "Cache-Control": "public, max-age=30" } });
}
