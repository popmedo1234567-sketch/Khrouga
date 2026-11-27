import { db } from "@/db";
import { places } from "@/db/schema";
import type { PlaceRow } from "@/db/schema";
import { asc, desc, eq, sql } from "drizzle-orm";
import type { Place } from "./constants";
import { SEED_PLACES, mapsUrl } from "./seed-data";

/** تحويل صف الداتا إلى DTO نظيف (تواريخ ISO) */
export function toPlace(row: PlaceRow): Place {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    area: row.area,
    address: row.address,
    type: row.type,
    moods: row.moods ?? [],
    tags: row.tags ?? [],
    avgPrice: row.avgPrice,
    menuItems: row.menuItems ?? [],
    imageUrl: row.imageUrl,
    gallery: row.gallery ?? [],
    reelUrl: row.reelUrl,
    whatsapp: row.whatsapp,
    mapsUrl: row.mapsUrl,
    rating: row.rating,
    hours: row.hours,
    notes: row.notes,
    featured: row.featured,
    updatedAt: row.updatedAt.toISOString(),
  };
}

/**
 * بيانات الأمثلة للتطوير المحلي فقط. الإنتاج لازم يبدأ بأماكن حقيقية من لوحة الأدمن.
 * لو محتاج ديمو منشور، اضبط ENABLE_DEMO_SEED=true صراحةً.
 */
let seeded = false;
export async function ensureSeed() {
  if (seeded || (process.env.NODE_ENV === "production" && process.env.ENABLE_DEMO_SEED !== "true")) return;
  try {
    const [{ count }] = await db.select({ count: sql<number>`count(*)::int` }).from(places);
    if (count === 0) {
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
    }
    seeded = true;
  } catch {
    // الجدول لسه مش متعمل — هنسيب الواجهة تعرض حالة فاضية
  }
}

export type ListOptions = {
  area?: string;
  type?: string;
  moods?: string[];
  maxPrice?: number;
  q?: string;
};

/** الفلترة الحقيقية في SQL (تُستخدم من /api/places) */
export async function listPlaces(opts: ListOptions = {}) {
  const conds = [];
  if (opts.area) conds.push(eq(places.area, opts.area));
  if (opts.type) conds.push(eq(places.type, opts.type));
  // && هو معامل التقاطع في Postgres — string_to_array بيتجنّب مشاكل تمرير المصفوفات كـ param
  if (opts.moods?.length) conds.push(sql`${places.moods} && string_to_array(${opts.moods.join(",")}, ',')`);
  if (opts.maxPrice) conds.push(sql`${places.avgPrice} <= ${opts.maxPrice}`);
  if (opts.q) {
    const like = `%${opts.q}%`;
    conds.push(sql`(${places.name} ilike ${like} or ${places.address} ilike ${like} or ${places.type} ilike ${like})`);
  }

  const rows = await (conds.length
    ? db.select().from(places).where(sql.join(conds, sql` and `)).orderBy(desc(places.featured), asc(places.avgPrice))
    : db.select().from(places).orderBy(desc(places.featured), asc(places.avgPrice)));
  return rows.map(toPlace);
}

export async function allPlaces(): Promise<Place[]> {
  return listPlaces();
}

export async function getPlace(slug: string): Promise<Place | null> {
  const rows = await db.select().from(places).where(eq(places.slug, slug)).limit(1);
  return rows[0] ? toPlace(rows[0]) : null;
}

/** أماكن شبه دي (نفس المنطقة أو نفس الأجواء) لعرضها في صفحة التفاصيل */
export async function similarPlaces(place: Place, limit = 3): Promise<Place[]> {
  const rows = await db
    .select()
    .from(places)
    .where(
      sql`${places.slug} <> ${place.slug} and (${places.area} = ${place.area} or ${places.moods} && string_to_array(${place.moods.join(",") || "__none__"}, ','))`,
    )
    .orderBy(desc(places.featured), asc(places.avgPrice))
    .limit(limit);
  return rows.map(toPlace);
}

export async function areaStats() {
  const rows = await db
    .select({ area: places.area, count: sql<number>`count(*)::int`, avg: sql<number>`round(avg(${places.avgPrice}))::int` })
    .from(places)
    .groupBy(places.area)
    .orderBy(desc(sql`count(*)`));
  return rows;
}
