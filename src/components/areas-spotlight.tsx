import Link from "next/link";
import type { Place } from "@/lib/constants";
import { toArabicDigits } from "@/lib/constants";
import { money } from "@/lib/format";
import { Pin } from "./icons";

/** أبرز المناطق مع عدد الأماكن ونطاق السعر */
export default function AreasSpotlight({ places }: { places: Place[] }) {
  const areas = Array.from(new Set(places.map((p) => p.area))).map((area) => {
    const list = places.filter((p) => p.area === area);
    const prices = list.map((p) => p.avgPrice);
    return {
      area,
      count: list.length,
      min: Math.min(...prices),
      max: Math.max(...prices),
      cover: list.find((p) => p.imageUrl)?.imageUrl ?? null,
      sample: list[0],
    };
  }).sort((a, b) => b.count - a.count);

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="reveal is-in flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold tracking-[0.25em] text-mint">لفّ القاهرة</p>
          <h2 className="mt-1 font-display text-[clamp(1.6rem,4.5vw,2.4rem)] font-bold">اختار المنطقة وإحنا نكمل</h2>
        </div>
        <p className="max-w-sm text-sm text-muted">
          كل منطقة فيها أماكن متراجعة بأسعارها. دوس على المنطقة عشان الفلاتر تتظبط لوحدها.
        </p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {areas.map((a, i) => (
          <Link
            key={a.area}
            href={`/?area=${encodeURIComponent(a.area)}`}
            className="reveal card card-lift group relative block min-h-[10.5rem] overflow-hidden rounded-[24px] border border-line p-4"
            style={{ ["--reveal-delay" as string]: `${i * 55}ms` }}
          >
            {a.cover && (
              <img
                src={a.cover}
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover opacity-30 transition-all duration-[1400ms] group-hover:scale-110 group-hover:opacity-45"
              />
            )}
            <span className="absolute inset-0 bg-gradient-to-t from-bg via-bg/70 to-transparent" />
            <span className="relative flex h-full flex-col justify-end">
              <span className="flex items-center gap-1.5 text-xs font-bold text-spice">
                <Pin width={15} height={15} /> {toArabicDigits(a.count)} مكان
              </span>
              <span className="mt-1 block font-display text-xl font-bold">{a.area}</span>
              <span className="mt-1 block text-xs font-semibold text-muted">
                من {money(a.min)} إلى {money(a.max)} ج
              </span>
              <span className="mt-2 inline-flex w-fit items-center gap-1 rounded-full bg-surface/90 px-2.5 py-1 text-[0.7rem] font-bold text-inksoft opacity-0 transition-all duration-300 group-hover:opacity-100">
                اعرض الأماكن ←
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
