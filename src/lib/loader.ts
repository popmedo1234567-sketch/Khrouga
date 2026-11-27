import { allPlaces, ensureSeed } from "./queries";
import type { Place } from "./constants";

/** تحميل كل الأماكن + المناطق الموجودة (للاستخدام في الصفحات السيرفرية) */
export async function loadCatalog(): Promise<{ places: Place[]; areas: string[] }> {
  await ensureSeed();
  const places = await allPlaces().catch(() => [] as Place[]);
  const areas = Array.from(new Set(places.map((p) => p.area)));
  return { places, areas };
}
