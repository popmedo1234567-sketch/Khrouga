import Link from "next/link";
import type { ReactNode } from "react";
import type { Place } from "@/lib/constants";
import { toArabicDigits } from "@/lib/constants";
import { money } from "@/lib/format";
import { Clock, Pin, Star, WhatsApp } from "./icons";
import HeroCta from "./hero-cta";

type Props = { places: Place[]; areas: string[] };

/** الهيرو: عنوان كبير + كولاج بطاقات الأماكن + إحصاءات حية */
export default function Hero({ places, areas }: Props) {
  const spots = places.filter((p) => p.featured).slice(0, 3).concat(places.filter((p) => !p.featured)).slice(0, 3);
  const cheapest = places.reduce((a, b) => (a && a.avgPrice <= b.avgPrice ? a : b), places[0]);
  const best = places.reduce((a, b) => (a && a.rating >= b.rating ? a : b), places[0]);
  const fresh = places.filter((p) => Date.now() - +new Date(p.updatedAt) < 7 * 86_400_000).length;

  return (
    <section className="relative overflow-hidden pt-6 pb-10 sm:pt-10">
      {/* خلفية طبقية: توهجات + مشربية + أفق */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_85%_-10%,var(--glow-a),transparent_60%),radial-gradient(90%_70%_at_10%_0%,var(--glow-b),transparent_55%),radial-gradient(80%_60%_at_50%_110%,var(--glow-c),transparent_60%)]" />
        <div className="pattern absolute inset-x-0 top-0 h-[420px] opacity-90 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-l from-transparent via-line to-transparent" />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr]">
        {/* النص */}
        <div className="relative">
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-3.5 py-1.5 text-xs font-bold text-inksoft backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-mint" />
            </span>
            {toArabicDigits(places.length)} مكان · {toArabicDigits(areas.length)} منطقة · {toArabicDigits(fresh)} مكان اتحدّث من أسبوع
          </p>

          <h1 className="mt-5 font-display text-[clamp(2.6rem,9vw,4.6rem)] font-bold leading-[1.08]">
            <span className="line-mask" style={{ ["--line-delay" as string]: "60ms" }}>
              <span>مش عارفين</span>
            </span>
            <span className="line-mask" style={{ ["--line-delay" as string]: "180ms" }}>
              <span>
                تخرجوا <span className="relative inline-block text-spice">فين
                  <svg viewBox="0 0 120 14" className="absolute -bottom-1 right-0 w-full text-saffron" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" aria-hidden>
                    <path d="M3 9.5C22 4.5 48 3 117 6.5" />
                  </svg>
                </span>؟
              </span>
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-8 text-inksoft sm:text-lg">
            حدد <b className="text-ink">المنطقة</b> و<b className="text-ink">الميزانية</b> و<b className="text-ink">المزاج</b>،
            وخروجة هتقترح عليك أماكن بأسعارها الحقيقية، صورها، ريلاتها، لينك الخريطة — وتحجز على واتساب في ضغطة واحدة.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="#filters"
              className="group inline-flex min-h-14 items-center gap-2 rounded-2xl bg-ink px-6 py-4 font-display text-base font-bold text-bg transition-transform hover:scale-[1.03] active:scale-95"
            >
              ابدأ الفلترة
              <span className="transition-transform duration-300 group-hover:translate-y-1" aria-hidden>↓</span>
            </Link>
            <HeroCta />
          </div>

          {/* إحصاءات */}
          <dl className="mt-9 grid max-w-lg grid-cols-3 gap-3">
            <Stat
              icon={<Clock width={16} height={16} />}
              label="أرخص خروجة"
              value={cheapest ? `${money(cheapest.avgPrice)} ج` : "—"}
              hint={cheapest?.area ?? ""}
            />
            <Stat icon={<Star width={16} height={16} fill="currentColor" stroke="none" />} label="أعلى تقييم" value={best ? toArabicDigits(best.rating.toFixed(1)) : "—"} hint={best?.name ?? ""} />
            <Stat icon={<Pin width={16} height={16} />} label="مناطق مغطاة" value={toArabicDigits(areas.length)} hint="القاهرة والجيزة" />
          </dl>
        </div>

        {/* كولاج البطاقات */}
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="relative h-[26rem] sm:h-[30rem]">
            {spots.map((p, i) => (
              <Link
                key={p.slug}
                href={`/p/${p.slug}`}
                className="group absolute block overflow-hidden rounded-[28px] border border-line bg-surface shadow-[0_40px_70px_-40px_rgba(0,0,0,.7)] transition-all duration-500 hover:z-30 hover:scale-[1.03]"
                style={{
                  ["--tilt" as string]: `${[-7, 5, -2][i]}deg`,
                  ["--float-duration" as string]: `${7 + i}s`,
                  width: ["72%", "62%", "54%"][i],
                  top: [`${i * 27}%`, `${8 + i * 27}%`, `${16 + i * 26}%`][i],
                  right: [`${i * 14}%`, `${4 + i * 18}%`, `${2 + i * 22}%`][i],
                  zIndex: 10 - i,
                  rotate: `${[-7, 5, -2][i]}deg`,
                }}
              >
                <span className="floaty block">
                  <span className="relative block aspect-[4/3] overflow-hidden bg-surface2">
                    {p.imageUrl && (
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        loading={i === 0 ? "eager" : "lazy"}
                        className="h-full w-full object-cover transition-transform duration-[2500ms] ease-out group-hover:scale-110"
                      />
                    )}
                    <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                    <span className="absolute inset-x-0 bottom-0 p-3 text-white">
                      <span className="block truncate font-display text-base font-bold">{p.name}</span>
                      <span className="flex items-center gap-2 text-[0.7rem] text-white/80">
                        <span>{p.area}</span>
                        <span className="rounded-full bg-saffron px-1.5 py-0.5 font-bold text-black">{money(p.avgPrice)} ج</span>
                      </span>
                    </span>
                  </span>
                </span>
              </Link>
            ))}

            {/* شارات عائمة */}
            <span className="absolute -top-2 left-0 z-20 inline-flex items-center gap-1.5 rounded-2xl border border-line bg-surface px-3 py-2 text-xs font-bold text-inksoft shadow-lg floaty" style={{ ["--float-duration" as string]: "6s" }}>
              <WhatsApp width={16} height={16} className="text-mint" /> حجز مباشر من غير اتصال
            </span>
            <span className="absolute bottom-2 left-2 z-20 inline-flex items-center gap-1.5 rounded-2xl border border-line bg-surface px-3 py-2 text-xs font-bold text-inksoft shadow-lg floaty" style={{ ["--float-duration" as string]: "8.5s" }}>
              <Clock width={16} height={16} className="text-spice" /> اتأكد من السعر قبل الحجز
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ icon, label, value, hint }: { icon: ReactNode; label: string; value: string; hint: string }) {
  return (
    <div className="reveal is-in rounded-2xl border border-line bg-surface/70 p-3 backdrop-blur">
      <dt className="flex items-center gap-1.5 text-[0.7rem] font-bold text-muted">
        <span className="text-spice">{icon}</span>
        {label}
      </dt>
      <dd className="mt-1 font-display text-lg font-bold leading-tight">{value}</dd>
      <dd className="truncate text-[0.68rem] text-muted">{hint}</dd>
    </div>
  );
}
