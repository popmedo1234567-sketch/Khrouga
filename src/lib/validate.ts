import type { NewPlaceRow } from "@/db/schema";
import type { MenuItem } from "./constants";
import { slugify } from "./constants";
import { mapsUrl } from "./seed-data";

type Body = Record<string, unknown>;

const str = (v: unknown, max = 500) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const arr = (v: unknown, maxLength = 80) =>
  (Array.isArray(v) ? v.map((x) => str(x, maxLength)).filter(Boolean).slice(0, 20) : []);
const num = (v: unknown, fallback = 0) => {
  const n = typeof v === "number" ? v : Number(str(v));
  return Number.isFinite(n) ? n : fallback;
};

function cleanMenu(v: unknown): MenuItem[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((i) => {
      const item = (i ?? {}) as Body;
      return { name: str(item.name, 120), price: Math.max(0, Math.round(num(item.price))), note: str(item.note, 120) || undefined };
    })
    .filter((i) => i.name && i.price > 0)
    .slice(0, 25);
}

/** التحقق من بيانات المكان القادمة من الأدمن */
export function parsePlace(body: Body, id?: number): { data?: NewPlaceRow; error?: string } {
  const name = str(body.name, 120);
  const area = str(body.area, 80);
  const type = str(body.type, 80);
  if (!name) return { error: "اسم المكان مطلوب" };
  if (!area) return { error: "المنطقة مطلوبة" };
  if (!type) return { error: "نوع المكان مطلوب" };

  const avgPrice = Math.max(0, Math.round(num(body.avgPrice)));
  const slugRaw = str(body.slug, 120) || slugify(name, `place-${Date.now()}`);
  const maps = str(body.mapsUrl, 400);

  const data: NewPlaceRow = {
    slug: slugify(slugRaw, `place-${Date.now()}`),
    name,
    area,
    address: str(body.address, 300) || area,
    type,
    moods: arr(body.moods),
    tags: arr(body.tags),
    avgPrice,
    menuItems: cleanMenu(body.menuItems),
    imageUrl: str(body.imageUrl, 4_000_000) || null,
    gallery: arr(body.gallery, 2_000),
    reelUrl: str(body.reelUrl, 500) || null,
    whatsapp: str(body.whatsapp, 20).replace(/[^\d]/g, "") || null,
    mapsUrl: maps || mapsUrl(`${name} ${area}`),
    rating: Math.min(5, Math.max(0, num(body.rating, 0))),
    hours: str(body.hours, 80) || null,
    notes: str(body.notes, 1000) || null,
    featured: Boolean(body.featured),
    updatedAt: new Date(),
  };
  void id;
  return { data };
}
