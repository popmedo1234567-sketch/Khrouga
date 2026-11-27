/**
 * سكريبت زرع البيانات التجريبية.
 * التشغيل: npx tsx src/db/seed.ts
 * (أو من لوحة الأدمن: زرار «ازرع الأمثلة» → POST /api/admin/seed)
 */
import "dotenv/config";
import { sql } from "drizzle-orm";
import { db } from "./index";
import { places } from "./schema";
import { SEED_PLACES, mapsUrl } from "../lib/seed-data";

async function main() {
  console.log(`🌱 زرع ${SEED_PLACES.length} مكان...`);
  await db.execute(sql`truncate table places restart identity`);
  await db.insert(places).values(
    SEED_PLACES.map((p) => ({
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
    })),
  );
  const [{ count }] = await db.select({ count: sql<number>`count(*)::int` }).from(places);
  console.log(`✅ تمام — في الجدول ${count} مكان`);
  process.exit(0);
}

main().catch((e) => {
  console.error("❌ فشل الزرع:", e);
  process.exit(1);
});
