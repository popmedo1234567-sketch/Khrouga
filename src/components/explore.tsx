"use client";
import { useEffect, useMemo, useState } from "react";
import type { Filters, Place } from "@/lib/constants";
import { DEFAULT_FILTERS, toArabicDigits } from "@/lib/constants";
import { filterPlaces, priceHistogram } from "@/lib/filter";
import { useFavorites } from "@/hooks/use-favorites";
import FilterConsole from "./filter-console";
import PlaceCard from "./place-card";
import PickModal from "./pick-modal";
import { Dice, Heart, X } from "./icons";

type Props = {
  places: Place[];
  areas: string[];
  initialFilters: Filters;
  initialView: "all" | "favs";
};

/** منطقة الاستكشاف: الفلاتر + الشبكة + المفضلة + روليت الأماكن */
export default function Explore({ places, areas, initialFilters, initialView }: Props) {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [view, setView] = useState<"all" | "favs">(initialView);
  const [picking, setPicking] = useState(false);
  const { favs, toggle, clear } = useFavorites();

  const results = useMemo(() => filterPlaces(places, filters), [places, filters]);
  const visible = useMemo(
    () => (view === "favs" ? results.filter((p) => favs.includes(p.slug)) : results),
    [view, results, favs],
  );

  const areaCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const p of places) map[p.area] = (map[p.area] ?? 0) + 1;
    return map;
  }, [places]);

  const histogram = useMemo(() => priceHistogram(places), [places]);

  const activeCount =
    (filters.area ? 1 : 0) +
    (filters.budget < DEFAULT_FILTERS.budget ? 1 : 0) +
    filters.moods.length +
    filters.types.length +
    (filters.q ? 1 : 0) +
    (filters.sort !== "smart" ? 1 : 0);

  // مزامنة الفلاتر مع الرابط (قابل للمشاركة) من غير إعادة تحميل
  useEffect(() => {
    const sp = new URLSearchParams();
    if (filters.q) sp.set("q", filters.q);
    if (filters.area) sp.set("area", filters.area);
    if (filters.budget < DEFAULT_FILTERS.budget) sp.set("budget", String(filters.budget));
    if (filters.moods.length) sp.set("mood", filters.moods.join(","));
    if (filters.types.length) sp.set("type", filters.types.join(","));
    if (filters.sort !== "smart") sp.set("sort", filters.sort);
    if (view === "favs") sp.set("view", "favorites");
    const qs = sp.toString();
    window.history.replaceState(null, "", qs ? `/?${qs}` : "/");
  }, [filters, view]);

  // الهيرو بيبعت الحدث ده عشان يفتح الروليت
  useEffect(() => {
    const open = () => setPicking(true);
    window.addEventListener("khrouga:pick", open);
    return () => {
      window.removeEventListener("khrouga:pick", open);
    };
  }, []);

  const gridKey = `${view}|${filters.area}|${filters.budget}|${filters.types.join()}|${filters.moods.join()}|${filters.sort}`;
  const patch = (p: Partial<Filters>) => setFilters((prev) => ({ ...prev, ...p }));
  const cheapest = visible.reduce<Place | null>((a, b) => (!a || b.avgPrice < a.avgPrice ? b : a), null);

  return (
    <div className="space-y-6">
      <FilterConsole
        filters={filters}
        onChange={patch}
        areas={areas}
        areaCounts={areaCounts}
        histogram={histogram}
        resultCount={visible.length}
        totalCount={places.length}
        activeCount={activeCount}
        onReset={() => {
          setFilters(DEFAULT_FILTERS);
          setView("all");
        }}
        onPick={() => setPicking(true)}
      />

      {/* رأس النتائج */}
      <div id="results" className="flex flex-wrap items-center justify-between gap-3 scroll-mt-40">
        <div className="flex items-center gap-1 rounded-full border border-line bg-surface p-1">
          {(["all", "favs"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className={`inline-flex min-h-11 items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-all active:scale-95 ${
                view === v ? "bg-ink text-bg" : "text-muted hover:text-ink"
              }`}
            >
              {v === "favs" ? <Heart width={17} height={17} fill={favs.length ? "currentColor" : "none"} /> : <Dice width={17} height={17} />}
              {v === "all" ? "كل الأماكن" : "المفضلة"}
              {v === "favs" && favs.length > 0 && (
                <span className={`rounded-full px-1.5 text-xs ${view === v ? "bg-bg/25 text-bg" : "bg-spice text-spiceink"}`}>{favs.length}</span>
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 text-sm text-muted">
          {cheapest && view === "all" && (
            <span className="hidden sm:inline">
              أرخص نتيجة: <b className="text-ink">{cheapest.name}</b> بـ {toArabicDigits(cheapest.avgPrice)} ج
            </span>
          )}
          {view === "favs" && favs.length > 0 && (
            <button type="button" onClick={clear} className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-line px-3 py-2 text-xs font-bold text-inksoft transition-colors hover:border-spice hover:text-spice">
              <X width={15} height={15} /> امسح المفضلة
            </button>
          )}
        </div>
      </div>

      {/* الشبكة */}
      {visible.length > 0 ? (
        <div key={gridKey} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((place, i) => (
            <PlaceCard key={place.slug} place={place} index={i} isFav={favs.includes(place.slug)} onFav={toggle} />
          ))}
        </div>
      ) : (
        <EmptyState view={view} favCount={favs.length} onReset={() => { setFilters(DEFAULT_FILTERS); setView("all"); }} onGoFavs={() => setView("all")} />
      )}

      {picking && <PickModal candidates={view === "favs" ? visible : results} onClose={() => setPicking(false)} />}
    </div>
  );
}

function EmptyState({
  view,
  favCount,
  onReset,
  onGoFavs,
}: {
  view: "all" | "favs";
  favCount: number;
  onReset: () => void;
  onGoFavs: () => void;
}) {
  const favsEmpty = view === "favs";
  return (
    <div className="reveal is-in card overflow-hidden rounded-[28px] border border-dashed border-line p-10 text-center">
      <svg viewBox="0 0 120 90" className="mx-auto h-24 w-32 text-spice" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
        <ellipse cx="60" cy="66" rx="42" ry="16" className="opacity-25" />
        <path d="M60 12c-16 0-28 12-28 26 0 16 12 24 28 24s28-8 28-24c0-14-12-26-28-26Z" className="opacity-60" />
        <path d="M52 36c1.6-2 4-3 6.6-3M69 44c-2 3-5.4 4.6-9 4.6" />
        <path d="M22 22 14 14M98 22l8-8" className="opacity-40" />
      </svg>
      <h3 className="mt-4 font-display text-2xl font-bold">
        {favsEmpty ? (favCount ? "مفيش نتائج بالفلاتر دي" : "لسه مضفتش حاجة للمفضلة") : "مفيش مكان مطابق للفلاتر دي"}
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-muted">
        {favsEmpty
          ? "دوس على القلب ❤ في أي كارت عشان تحفظه هنا على موبايلك — المفضلة بتشتغل من غير تسجيل دخول."
          : "جرّب تزوّد الميزانية، أو تشيل جو/نوع من الاختيارات، أو تختار منطقة تانية."}
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <button type="button" onClick={onReset} className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-ink px-5 py-3 text-sm font-bold text-bg transition-transform hover:scale-[1.03] active:scale-95">
          ارجع لكل الأماكن
        </button>
        {favsEmpty && favCount > 0 && (
          <button type="button" onClick={onGoFavs} className="inline-flex min-h-12 items-center gap-2 rounded-2xl border border-line px-5 py-3 text-sm font-bold text-inksoft transition-colors hover:border-spice hover:text-spice">
            اعرض كل النتائج
          </button>
        )}
      </div>
    </div>
  );
}
