import type { Filters } from "@/lib/constants";
import { BUDGET, DEFAULT_FILTERS, SORTS } from "@/lib/constants";
import { loadCatalog } from "@/lib/loader";
import Hero from "@/components/hero";
import MarqueeStrip from "@/components/marquee-strip";
import ReelsStrip from "@/components/reels-strip";
import Explore from "@/components/explore";
import AreasSpotlight from "@/components/areas-spotlight";
import HowItWorks from "@/components/how-it-works";

export const dynamic = "force-dynamic";

type SearchParams = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
const list = (v: string) => v.split(",").map((s) => s.trim()).filter(Boolean);

export default async function HomePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const { places, areas } = await loadCatalog();

  // الفلاتر من الرابط — عشان أي لينك مشترك يفتح على نفس النتائج
  const budget = Math.min(BUDGET.max, Math.max(BUDGET.min, Number(one(sp.budget)) || DEFAULT_FILTERS.budget));
  const sortRaw = one(sp.sort);
  const filters: Filters = {
    q: one(sp.q),
    area: areas.includes(one(sp.area)) ? one(sp.area) : "",
    budget,
    moods: list(one(sp.mood)),
    types: list(one(sp.type)),
    sort: SORTS.some((s) => s.id === sortRaw) ? (sortRaw as Filters["sort"]) : "smart",
  };
  const view = one(sp.view) === "favorites" ? "favs" : "all";
  const key = JSON.stringify({ filters, view });

  const reels = places.filter((p) => p.reelUrl).slice(0, 8);

  return (
    <>
      <Hero places={places} areas={areas} />
      <MarqueeStrip places={places} areas={areas} />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <Explore key={key} places={places} areas={areas} initialFilters={filters} initialView={view} />
      </div>

      <ReelsStrip places={reels} />
      <AreasSpotlight places={places} />
      <HowItWorks places={places} />
    </>
  );
}
