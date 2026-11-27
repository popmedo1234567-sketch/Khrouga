import { NextResponse } from "next/server";
import { ensureSeed, getPlace, similarPlaces } from "@/lib/queries";

export const dynamic = "force-dynamic";

/** GET /api/places/:slug — مكان واحد + أماكن شبهه */
export async function GET(_req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  await ensureSeed();
  const place = await getPlace(slug).catch(() => null);
  if (!place) return NextResponse.json({ error: "المكان مش موجود" }, { status: 404 });
  const similar = await similarPlaces(place).catch(() => []);
  return NextResponse.json({ place, similar });
}
