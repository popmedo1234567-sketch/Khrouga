"use client";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import type { MenuItem, Place } from "@/lib/constants";
import { toArabicDigits } from "@/lib/constants";
import { bookingMessage, isStale, money, priceLevel, updatedLabel, waLink } from "@/lib/format";
import { useFavorites } from "@/hooks/use-favorites";
import { Check, Clock, Coin, Heart, Pin, Reel, Share, Users, WhatsApp } from "./icons";
import ReelModal from "./reel-modal";

const WHEN = ["النهاردة", "بكرة", "ويك إند"];
const PEOPLE = [2, 3, 4, 6, 8];

/** كارت الحجز: العدد + الموعد + اختيار الأصناف + واتساب */
export function BookingCard({ place }: { place: Place }) {
  const [people, setPeople] = useState(2);
  const [when, setWhen] = useState(WHEN[0]);
  const [picked, setPicked] = useState<number[]>([]);
  const [reel, setReel] = useState(false);
  const { isFav, toggle, ready } = useFavorites();

  const chosen: MenuItem[] = useMemo(() => picked.map((i) => place.menuItems[i]).filter(Boolean), [picked, place.menuItems]);
  const perPerson = chosen.reduce((s, i) => s + i.price, 0);
  const total = perPerson ? perPerson * people : place.avgPrice * people;

  const toggleItem = (i: number) => setPicked((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));
  const level = priceLevel(place.avgPrice);
  const fav = ready && isFav(place.slug);

  return (
    <aside className="card sticky top-24 rounded-[28px] border border-line p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-muted">احجز أو اسأل على الواتساب</p>
          <p className="mt-1 font-display text-3xl font-bold text-spice">
            {toArabicDigits(money(total))} <span className="text-base text-ink">ج</span>
          </p>
          <p className="text-xs font-semibold text-muted">
            {chosen.length ? `${toArabicDigits(people)} أفراد × الأصناف المختارة` : `تقدير ${toArabicDigits(people)} أفراد × ${money(place.avgPrice)} ج`}
          </p>
        </div>
        <span className="rounded-2xl bg-saffron/15 px-2.5 py-1.5 text-center text-xs font-bold text-saffron">
          {level.symbol}
          <span className="mt-0.5 block text-[0.65rem]">{level.label}</span>
        </span>
      </div>

      <div className="mt-4 space-y-3">
        <Field label="العدد" icon={<Users width={15} height={15} />}>
          <div className="flex flex-wrap gap-1.5">
            {PEOPLE.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setPeople(n)}
                className={`min-h-10 min-w-10 rounded-xl border px-2.5 text-sm font-bold transition-all active:scale-95 ${
                  people === n ? "border-transparent bg-ink text-bg" : "border-line bg-surface text-inksoft hover:border-ink/40"
                }`}
              >
                {toArabicDigits(n)}
              </button>
            ))}
          </div>
        </Field>

        <Field label="إمتى؟" icon={<Clock width={15} height={15} />}>
          <div className="flex flex-wrap gap-1.5">
            {WHEN.map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => setWhen(w)}
                className={`min-h-10 rounded-xl border px-3 text-sm font-bold transition-all active:scale-95 ${
                  when === w ? "border-transparent bg-mint text-white" : "border-line bg-surface text-inksoft hover:border-mint/50"
                }`}
              >
                {w}
              </button>
            ))}
          </div>
        </Field>
      </div>

      <div className="mt-5 grid gap-2">
        {place.whatsapp && (
          <a
            href={waLink(place.whatsapp, bookingMessage(place, chosen, people, when))}
            target="_blank"
            rel="noreferrer noopener"
            className="group inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-mint px-5 py-4 font-display text-base font-bold text-white transition-all hover:brightness-110 active:scale-95"
          >
            <WhatsApp width={21} height={21} className="transition-transform group-hover:-rotate-6" />
            ابعت رسالة الحجز
          </a>
        )}
        <div className="grid grid-cols-3 gap-2">
          <a
            href={place.mapsUrl ?? "#"}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex min-h-12 items-center justify-center gap-1.5 rounded-2xl border border-line bg-surface px-2 py-3 text-xs font-bold text-inksoft transition-colors hover:border-spice hover:text-spice active:scale-95"
          >
            <Pin width={17} height={17} /> الخريطة
          </a>
          {place.reelUrl ? (
            <button
              type="button"
              onClick={() => setReel(true)}
              className="inline-flex min-h-12 items-center justify-center gap-1.5 rounded-2xl border border-line bg-surface px-2 py-3 text-xs font-bold text-inksoft transition-colors hover:border-spice hover:text-spice active:scale-95"
            >
              <Reel width={17} height={17} /> الريل
            </button>
          ) : (
            <span className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-dashed border-line px-2 py-3 text-xs font-semibold text-muted">
              مفيش ريل
            </span>
          )}
          <button
            type="button"
            onClick={() => toggle(place.slug)}
            aria-pressed={fav}
            className={`inline-flex min-h-12 items-center justify-center gap-1.5 rounded-2xl border px-2 py-3 text-xs font-bold transition-all active:scale-95 ${
              fav ? "border-transparent bg-spice text-spiceink" : "border-line bg-surface text-inksoft hover:border-spice hover:text-spice"
            }`}
          >
            <Heart width={17} height={17} fill={fav ? "currentColor" : "none"} />
            {fav ? "محفوظ" : "احفظ"}
          </button>
        </div>
      </div>

      <p className={`mt-4 flex items-center gap-1.5 border-t border-line pt-3 text-xs font-semibold ${isStale(place.updatedAt) ? "text-saffron" : "text-muted"}`}>
        <Clock width={14} height={14} />
        {updatedLabel(place.updatedAt)}
        {isStale(place.updatedAt) ? " — اسأل على السعر في الرسالة" : " — اتأكد من السعر النهائي قبل الحجز"}
      </p>

      {reel && <ReelModal place={place} onClose={() => setReel(false)} />}
    </aside>
  );
}

function Field({ label, icon, children }: { label: string; icon: ReactNode; children: ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-muted">
        <span className="text-spice">{icon}</span>
        {label}
      </p>
      {children}
    </div>
  );
}

/** اختيار أصناف المنيو مع جمع الحساب مباشرة */
export function MenuPicker({ place }: { place: Place }) {
  const [picked, setPicked] = useState<number[]>([]);
  const toggle = (i: number) => setPicked((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));
  const total = picked.reduce((s, i) => s + (place.menuItems[i]?.price ?? 0), 0);

  if (!place.menuItems.length) {
    return <p className="rounded-2xl border border-dashed border-line p-4 text-sm text-muted">المنيو لسه متضافش — اسأل المكان على واتساب.</p>;
  }

  return (
    <div>
      <ul className="divide-y divide-line overflow-hidden rounded-[22px] border border-line bg-surface">
        {place.menuItems.map((item, i) => {
          const on = picked.includes(i);
          return (
            <li key={item.name + i}>
              <button
                type="button"
                onClick={() => toggle(i)}
                aria-pressed={on}
                className={`flex w-full items-center gap-3 px-4 py-3.5 text-right transition-colors ${on ? "bg-spice/8" : "hover:bg-surface2"}`}
              >
                <span
                  className={`grid h-6 w-6 shrink-0 place-items-center rounded-lg border-2 transition-all ${
                    on ? "border-spice bg-spice text-spiceink" : "border-line bg-surface text-transparent"
                  }`}
                >
                  <Check width={15} height={15} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold">{item.name}</span>
                  {item.note && <span className="block truncate text-xs text-muted">{item.note}</span>}
                </span>
                <span className="flex items-baseline gap-1 font-display font-bold text-ink">
                  {money(item.price)}
                  <span className="text-xs text-spice">ج</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-surface2 p-4">
        <span className="flex items-center gap-1.5 text-sm font-bold text-inksoft">
          <Coin width={17} height={17} className="text-saffron" />
          {picked.length ? `اخترت ${toArabicDigits(picked.length)} أصناف` : "اختار أصنافك عشان تحسبها"}
        </span>
        <span className="font-display text-xl font-bold text-spice">{toArabicDigits(money(total))} ج</span>
      </div>

      {place.whatsapp && picked.length > 0 && (
        <a
          href={waLink(place.whatsapp, bookingMessage(place, picked.map((i) => place.menuItems[i])))}
          target="_blank"
          rel="noreferrer noopener"
          className="mt-3 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border-2 border-mint px-5 py-3 text-sm font-bold text-mint transition-colors hover:bg-mint hover:text-white active:scale-95"
        >
          <WhatsApp width={18} height={18} /> ابعت الطلب ده على واتساب
        </a>
      )}
    </div>
  );
}

/** معرض الصور + زرار المشاركة */
export function Gallery({ place }: { place: Place }) {
  const shots = [place.imageUrl, ...place.gallery].filter(Boolean) as string[];
  const [active, setActive] = useState(0);
  if (!shots.length) return null;

  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden rounded-[26px] border border-line bg-surface2">
        <img
          key={shots[active]}
          src={shots[active]}
          alt={`${place.name} — صورة ${active + 1}`}
          className="pop-in h-full w-full object-cover"
        />
        {place.reelUrl && (
          <span className="absolute top-3 right-3 rounded-full bg-black/55 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">
            🎬 فيه ريل للمكان ده
          </span>
        )}
      </div>
      {shots.length > 1 && (
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
          {shots.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`صورة ${i + 1}`}
              className={`h-16 w-20 shrink-0 overflow-hidden rounded-2xl border-2 transition-all ${
                active === i ? "border-spice" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ShareButton({ place }: { place: Place }) {
  const [copied, setCopied] = useState(false);
  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const text = `${place.name} — ${place.area} · من ${place.avgPrice} ج للفرد. شوفه على خروجة:`;
    try {
      if (navigator.share) {
        await navigator.share({ title: place.name, text, url });
        return;
      }
      await navigator.clipboard.writeText(`${text} ${url}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* المستخدم قفل نافذة المشاركة */
    }
  };

  return (
    <button
      type="button"
      onClick={share}
      className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-line bg-surface px-4 py-2.5 text-sm font-bold text-inksoft transition-colors hover:border-spice hover:text-spice active:scale-95"
    >
      <Share width={18} height={18} />
      {copied ? "اتنسخ اللينك ✓" : "شارك الخروجة"}
    </button>
  );
}

export function BackLink() {
  return (
    <Link href="/" className="group inline-flex min-h-11 items-center gap-2 text-sm font-bold text-muted transition-colors hover:text-spice">
      <span className="grid h-9 w-9 place-items-center rounded-full border border-line transition-transform group-hover:-translate-x-1" aria-hidden>
        →
      </span>
      ارجع لكل الأماكن
    </Link>
  );
}
