"use client";
import Link from "next/link";
import { useState } from "react";
import type { Place } from "@/lib/constants";
import { TYPES, toArabicDigits } from "@/lib/constants";
import { isStale, money, priceLevel, updatedLabel, waLink, bookingMessage } from "@/lib/format";
import { Clock, Heart, Pin, Reel, Star, WhatsApp } from "./icons";
import ReelModal from "./reel-modal";

const typeEmoji = (t: string) => TYPES.find((x) => x.id === t)?.emoji ?? "📍";

export default function PlaceCard({
  place,
  isFav,
  onFav,
  index = 0,
}: {
  place: Place;
  isFav: boolean;
  onFav: (slug: string) => void;
  index?: number;
}) {
  const [showReel, setShowReel] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const level = priceLevel(place.avgPrice);
  const peek = place.menuItems.slice(0, 2);

  return (
    <>
      <article
        className="reveal card card-lift group relative flex flex-col overflow-hidden rounded-[26px] border border-line"
        style={{ ["--reveal-delay" as string]: `${Math.min(index, 8) * 60}ms` }}
      >
        {/* ---------- الصورة ---------- */}
        <div className="relative aspect-[16/11] overflow-hidden bg-surface2">
          {place.imageUrl && !imgFailed ? (
            <img
              src={place.imageUrl}
              alt={place.name}
              loading="lazy"
              onError={() => setImgFailed(true)}
              className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.08]"
            />
          ) : (
            <div className="grid h-full w-full place-items-center bg-[radial-gradient(circle_at_30%_20%,var(--spice-soft),var(--surface2))] text-6xl">
              {typeEmoji(place.type)}
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

          {/* شارة السعر */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1.5 backdrop-blur-md">
            <span className="font-display text-base font-bold text-saffron">{money(place.avgPrice)}</span>
            <span className="text-[0.7rem] font-semibold text-white/85">ج / للفرد</span>
          </div>

          {/* المفضلة */}
          <button
            type="button"
            onClick={() => onFav(place.slug)}
            aria-pressed={isFav}
            aria-label={isFav ? `شيل ${place.name} من المفضلة` : `ضيف ${place.name} للمفضلة`}
            className={`absolute top-3 left-3 z-30 grid h-11 w-11 place-items-center rounded-full backdrop-blur-md transition-all duration-300 active:scale-90 ${
              isFav ? "bg-spice text-spiceink" : "bg-black/45 text-white hover:bg-black/65"
            }`}
          >
            <Heart width={21} height={21} fill={isFav ? "currentColor" : "none"} className={isFav ? "scale-110" : ""} />
          </button>

          {/* النوع والمنطقة */}
          <div className="absolute bottom-3 right-3 left-3 flex items-end justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate font-display text-[1.75rem] font-semibold leading-tight text-white drop-shadow">{place.name}</p>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs font-semibold text-white/85">
                <span className="rounded-full bg-white/20 px-2 py-0.5 backdrop-blur">{typeEmoji(place.type)} {place.type}</span>
                <span className="truncate">{place.area}</span>
              </p>
            </div>
            {place.reelUrl && (
              <button
                type="button"
                onClick={() => setShowReel(true)}
                className="relative z-30 grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white/95 text-ink transition-transform hover:scale-110 active:scale-95"
                aria-label={`شوف ريل ${place.name}`}
              >
                <span className="absolute inset-0 animate-ping rounded-full bg-white/50" aria-hidden />
                <Reel width={22} height={22} className="relative" />
              </button>
            )}
          </div>
        </div>

        {/* ---------- المحتوى ---------- */}
        <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 rounded-full bg-saffron/15 px-2.5 py-1 font-bold text-saffron">
              <Star width={14} height={14} fill="currentColor" stroke="none" /> {toArabicDigits(place.rating.toFixed(1))}
            </span>
            <span className="rounded-full bg-surface2 px-2.5 py-1 font-semibold text-muted">{level.symbol} {level.label}</span>
            {place.tags.slice(0, 2).map((t) => (
              <span key={t} className="rounded-full border border-line px-2.5 py-1 font-semibold text-inksoft">{t}</span>
            ))}
          </div>

          <p className="line-clamp-2 text-sm leading-6 text-muted">{place.address}</p>

          {/* المنيو المختصر */}
          {peek.length > 0 && (
            <ul className="space-y-1.5 rounded-2xl bg-surface2/70 p-3">
              {peek.map((item) => (
                <li key={item.name} className="flex items-baseline gap-2 text-sm">
                  <span className="font-semibold text-inksoft">{item.name}</span>
                  <span className="flex-1 translate-y-[-3px] border-b border-dotted border-line" aria-hidden />
                  <span className="font-display font-bold text-spice">{money(item.price)} ج</span>
                </li>
              ))}
              {place.menuItems.length > 2 && (
                <li className="pt-0.5 text-xs font-semibold text-muted">+ {place.menuItems.length - 2} أصناف في صفحة المكان</li>
              )}
            </ul>
          )}

          {/* الأجواء */}
          <div className="flex flex-wrap gap-1.5">
            {place.moods.slice(0, 4).map((m) => (
              <span key={m} className="rounded-lg bg-mint/12 px-2 py-1 text-[0.7rem] font-bold text-mint">{m}</span>
            ))}
          </div>

          {/* آخر تحديث */}
          <p className={`flex items-center gap-1.5 text-[0.72rem] font-semibold ${isStale(place.updatedAt) ? "text-saffron" : "text-muted"}`}>
            <Clock width={14} height={14} />
            {updatedLabel(place.updatedAt)}
            {isStale(place.updatedAt) && <span className="rounded-full bg-saffron/15 px-1.5 py-0.5">السعر محتاج تأكيد</span>}
          </p>

          {/* الأزرار */}
          <div className="mt-auto grid grid-cols-[1fr_auto] gap-2 pt-1">
            {place.whatsapp ? (
              <a
                href={waLink(place.whatsapp, bookingMessage(place))}
                target="_blank"
                rel="noreferrer noopener"
                className="relative z-30 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-mint px-4 py-3 text-sm font-bold text-white transition-all hover:brightness-110 active:scale-95"
              >
                <WhatsApp width={19} height={19} /> احجز واتساب
              </a>
            ) : (
              <span className="grid min-h-12 place-items-center rounded-2xl bg-surface2 px-4 text-sm font-semibold text-muted">الحجز مش متاح</span>
            )}
            <div className="relative z-30 flex gap-2">
              <a
                href={place.mapsUrl ?? "#"}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="افتح الخريطة"
                className="grid h-12 w-12 place-items-center rounded-2xl border border-line bg-surface text-inksoft transition-colors hover:border-spice hover:text-spice active:scale-95"
              >
                <Pin width={20} height={20} />
              </a>
              <Link
                href={`/p/${place.slug}`}
                className="grid h-12 w-12 place-items-center rounded-2xl border border-line bg-surface text-inksoft transition-colors hover:border-spice hover:text-spice active:scale-95"
                aria-label={`تفاصيل ${place.name}`}
              >
                <span className="font-display text-sm font-bold">التفاصيل</span>
              </Link>
            </div>
          </div>
        </div>

        {/* اللينك الممتد لكل الكارت */}
        <Link href={`/p/${place.slug}`} className="absolute inset-0 z-20" aria-label={`افتح صفحة ${place.name}`} tabIndex={-1}>
          <span className="sr-only">{place.name}</span>
        </Link>
      </article>

      {showReel && <ReelModal place={place} onClose={() => setShowReel(false)} />}
    </>
  );
}
