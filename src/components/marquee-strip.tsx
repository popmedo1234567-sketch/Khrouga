import type { Place } from "@/lib/constants";
import { toArabicDigits } from "@/lib/constants";

/** شريط متحرك بمناطق وأجواء وأسعار حقيقية من الداتا */
export default function MarqueeStrip({ places, areas }: { places: Place[]; areas: string[] }) {
  const rowA = [
    ...areas.map((a) => ({ text: a, count: places.filter((p) => p.area === a).length })),
    { text: "حجز واتساب", count: 0 },
    { text: "ريلات بالأجواء", count: 0 },
  ];
  const rowB = [
    ...places.slice(0, 9).map((p) => ({ text: `${p.name} · ${p.avgPrice} ج`, count: 0 })),
    { text: "أكد السعر قبل الحجز", count: 0 },
  ];

  return (
    <div className="relative border-y border-line bg-surface2/70 py-3" aria-hidden>
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-bg to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-bg to-transparent" />
      <Row items={rowA} duration="42s" />
      <Row items={rowB} duration="55s" reverse className="mt-2 opacity-70" />
    </div>
  );
}

function Row({
  items,
  duration,
  reverse,
  className = "",
}: {
  items: { text: string; count: number }[];
  duration: string;
  reverse?: boolean;
  className?: string;
}) {
  const doubled = [...items, ...items];
  return (
    <div className={`marquee ${reverse ? "marquee-rev" : ""} ${className}`} style={{ ["--marquee-duration" as string]: duration }}>
      {doubled.map((it, i) => (
        <span key={i} className="mx-3 flex shrink-0 items-center gap-2 whitespace-nowrap text-sm font-bold text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-spice" />
          {it.text}
          {it.count > 0 && <span className="text-xs text-inksoft">({toArabicDigits(it.count)})</span>}
        </span>
      ))}
    </div>
  );
}
