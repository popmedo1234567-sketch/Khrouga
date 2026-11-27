import { NextResponse } from "next/server";
import { db } from "@/db";
import { places } from "@/db/schema";
import { sql } from "drizzle-orm";
import { isAdminRequest } from "@/lib/auth";
import { SEED_PLACES, mapsUrl } from "@/lib/seed-data";

export const dynamic = "force-dynamic";

/** POST /api/admin/seed?mode=append|replace — زرع الأمثلة من الأدمن */
export async function POST(req: Request) {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (process.env.NODE_ENV === "production" && process.env.ENABLE_DEMO_SEED !== "true") {
    return NextResponse.json({ error: "البيانات التجريبية معطلة في الإنتاج" }, { status: 403 });
  }
  const mode = new URL(req.url).searchParams.get("mode") === "replace" ? "replace" : "append";

  const values = SEED_PLACES.map((p) => ({
    slug: p.slug,
    name: p.name,
    area: p.area,
    address: p.address,
    type: p.type,
    moods: p.moods,
    tags: p.tags,
    avgPrice: p.avgPrice,
    menuItems: p.menuItems,
    imageUrl: p.imageUrl,
    gallery: p.gallery,
    reelUrl: p.reelUrl,
    whatsapp: p.whatsapp,
    mapsUrl: mapsUrl(p.mapsQuery),
    rating: p.rating,
    hours: p.hours,
    notes: p.notes,
    featured: p.featured ?? false,
    updatedAt: new Date(Date.now() - p.updatedDaysAgo * 86_400_000),
  }));

  if (mode === "replace") await db.execute(sql`truncate table places restart identity`);
  await db
    .insert(places)
    .values(values)
    .onConflictDoUpdate({
      target: places.slug,
      set: { avgPrice: sql`excluded.avg_price`, menuItems: sql`excluded.menu_items`, updatedAt: new Date() },
    });

  const [{ count }] = await db.select({ count: sql<number>`count(*)::int` }).from(places);
  return NextResponse.json({ ok: true, mode, count });
}
