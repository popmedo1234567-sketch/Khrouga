"use client";
import { useState } from "react";
import Link from "next/link";
import type { Place } from "@/lib/constants";
import { money } from "@/lib/format";
import { Reel } from "./icons";
import ReelModal from "./reel-modal";

/** شريط الريلات: فيديوهات رأسية حقيقية بتفتح في نافذة كاملة */
export default function ReelsStrip({ places }: { places: Place[] }) {
  const [active, setActive] = useState<Place | null>(null);
  if (places.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="reveal is-in flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold tracking-[0.25em] text-spice">شوف بعينك</p>
          <h2 className="mt-1 font-display text-[clamp(1.6rem,4.5vw,2.4rem)] font-bold">ريلات من الأماكن</h2>
        </div>
        <p className="max-w-xs text-sm text-muted">
          اسحب بالشريط — دوس على أي ريل عشان يتشغّل، ولو عجبك احجز فورًا.
        </p>
      </div>

      <div className="no-scrollbar -mx-4 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2">
        {places.map((p, i) => (
          <button
            key={p.slug}
            type="button"
            onClick={() => setActive(p)}
            className="reveal group relative aspect-[9/15] w-[9.5rem] shrink-0 snap-start overflow-hidden rounded-[24px] border border-line bg-surface2 text-right sm:w-44"
            style={{ ["--reveal-delay" as string]: `${i * 70}ms` }}
            aria-label={`شغّل ريل ${p.name}`}
          >
            {p.imageUrl && (
              <img
                src={p.imageUrl}
                alt={p.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1600ms] group-hover:scale-110"
              />
            )}
            <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/10" />
            <span className="absolute top-3 right-3 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-ink transition-transform duration-300 group-hover:scale-110">
              <Reel width={19} height={19} />
            </span>
            <span className="absolute inset-x-0 bottom-0 p-3 text-white">
              <span className="block truncate font-display text-sm font-bold">{p.name}</span>
              <span className="block truncate text-[0.7rem] text-white/75">{p.area}</span>
              <span className="mt-1 inline-block rounded-full bg-saffron px-2 py-0.5 text-[0.7rem] font-bold text-black">{money(p.avgPrice)} ج</span>
            </span>
          </button>
        ))}
      </div>

      <div className="reveal is-in mt-5 flex items-center justify-between gap-3">
        <Link href="/?sort=new" className="link-underline text-sm font-bold text-spice">
          شوف الأماكن الأحدث تحديثًا ←
        </Link>
        <span className="text-xs text-muted">{places.length} ريل متاح</span>
      </div>

      {active && <ReelModal place={active} onClose={() => setActive(null)} />}
    </section>
  );
}
