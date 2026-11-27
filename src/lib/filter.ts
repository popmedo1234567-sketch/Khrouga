import type { Filters, Place } from "./constants";
import { BUDGET } from "./constants";

/** الفلترة والترتيب — نفس الدالة بتشتغل في المتصفح وفي /api/places */
export function filterPlaces(list: Place[], f: Filters): Place[] {
  const q = f.q.trim();
  const out = list.filter((p) => {
    if (f.area && p.area !== f.area) return false;
    if (p.avgPrice > f.budget) return false;
    if (f.types.length && !f.types.includes(p.type)) return false;
    if (f.moods.length && !f.moods.some((m) => p.moods.includes(m))) return false;
    if (q) {
      const hay = `${p.name} ${p.area} ${p.address} ${p.type} ${p.tags.join(" ")} ${p.moods.join(" ")}`;
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  const by: Record<Filters["sort"], (a: Place, b: Place) => number> = {
    smart: (a, b) => Number(b.featured) - Number(a.featured) || b.rating - a.rating || a.avgPrice - b.avgPrice,
    "price-asc": (a, b) => a.avgPrice - b.avgPrice,
    "price-desc": (a, b) => b.avgPrice - a.avgPrice,
    rating: (a, b) => b.rating - a.rating,
    new: (a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt),
  };
  return [...out].sort(by[f.sort]);
}

/** توزيع الأسعار على الشرائح — بيظهر شريط صغير جنب سلايدر الميزانية */
export function priceHistogram(list: Place[], buckets = 5) {
  const size = (BUDGET.max - BUDGET.min) / buckets;
  const counts = Array(buckets).fill(0) as number[];
  for (const p of list) {
    const i = Math.min(buckets - 1, Math.max(0, Math.floor((p.avgPrice - BUDGET.min) / size)));
    counts[i] += 1;
  }
  return counts;
}
