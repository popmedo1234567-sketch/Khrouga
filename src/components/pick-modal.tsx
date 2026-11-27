"use client";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import type { Place } from "@/lib/constants";
import { money, updatedLabel, waLink, bookingMessage } from "@/lib/format";
import { Dice, Pin, WhatsApp, X } from "./icons";

const prefersReduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** "اختارلي أنا" — روليت الأماكن */
export default function PickModal({ candidates, onClose }: { candidates: Place[]; onClose: () => void }) {
  const [round, setRound] = useState(0);
  const [tick, setTick] = useState(0);
  const [picked, setPicked] = useState<Place | null>(null);

  const pool = useMemo(() => candidates, [candidates]);
  const rolling = picked === null;

  useEffect(() => {
    if (!pool.length) return;
    const key = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", key);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", key);
      document.body.style.overflow = "";
    };
  }, [pool.length, onClose]);

  useEffect(() => {
    if (!pool.length) return;
    setPicked(null);
    if (prefersReduced()) {
      setPicked(pool[Math.floor(Math.random() * pool.length)]);
      return;
    }
    let n = 0;
    const spin = setInterval(() => {
      n += 1;
      setTick(Math.floor(Math.random() * pool.length));
      if (n > 18) {
        clearInterval(spin);
        setPicked(pool[Math.floor(Math.random() * pool.length)]);
      }
    }, 85);
    return () => clearInterval(spin);
  }, [round, pool]);

  useEffect(() => {
    if (picked && !prefersReduced()) {
      const el = document.getElementById("pick-title");
      el?.animate?.(
        [{ transform: "scale(.86)", opacity: 0 }, { transform: "scale(1)", opacity: 1 }],
        { duration: 420, easing: "cubic-bezier(.22,1,.36,1)" },
      );
    }
  }, [picked]);

  if (!pool.length) {
    return (
      <Shell onClose={onClose}>
        <p className="text-center text-lg font-semibold">مفيش أماكن بالفلاتر دي 😅</p>
        <p className="mt-2 text-center text-sm text-muted">زوّد الميزانية شوية أو شيل جو من الاختيارات.</p>
      </Shell>
    );
  }

  const shown = rolling ? pool[tick % pool.length] : picked!;

  return (
    <Shell onClose={onClose} wide={Boolean(picked)}>
      {rolling ? (
        <div className="py-6 text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-spice text-spiceink spin-slow">
            <Dice width={32} height={32} />
          </span>
          <p className="mt-5 text-sm font-semibold tracking-wide text-muted">بنلف على الأماكن…</p>
          <div className="relative mt-3 h-24 overflow-hidden rounded-3xl border border-line bg-surface2">
            <div className="absolute inset-x-0 top-1/2 h-12 -translate-y-1/2 border-y border-dashed border-spice/40" aria-hidden />
            <div key={tick} className="pop-in flex h-full flex-col items-center justify-center px-4">
              <p className="truncate font-display text-xl font-bold">{shown.name}</p>
              <p className="text-xs text-muted">{shown.area} · {money(shown.avgPrice)} ج</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative">
          {/* قصاصات احتفالية */}
          {!prefersReduced() && (
            <div className="pointer-events-none absolute inset-x-0 -top-2 flex justify-between px-6" aria-hidden>
              {Array.from({ length: 9 }).map((_, i) => (
                <span
                  key={i}
                  className="block h-3 w-1.5 rounded-full"
                  style={{
                    background: ["var(--spice)", "var(--saffron)", "var(--mint)", "var(--plum)"][i % 4],
                    animation: `float-y ${1.4 + (i % 5) * 0.25}s ease-in-out ${i * 0.07}s infinite`,
                  }}
                />
              ))}
            </div>
          )}
          <div className="overflow-hidden rounded-3xl border border-line">
            <div className="relative aspect-[16/9] bg-surface2">
              {shown.imageUrl && (
                <img src={shown.imageUrl} alt={shown.name} className="h-full w-full object-cover" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <p className="text-xs font-bold text-saffron">دي خروجة النهاردة 🎉</p>
                <p id="pick-title" className="font-display text-2xl font-bold leading-tight">{shown.name}</p>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-white/85">
                  <Pin width={15} height={15} /> {shown.area} · {shown.type} · {money(shown.avgPrice)} ج للفرد
                </p>
              </div>
            </div>
            <div className="space-y-3 bg-surface p-4">
              <p className="text-xs font-semibold text-muted">{updatedLabel(shown.updatedAt)}</p>
              <div className="grid gap-2 sm:grid-cols-2">
                <Link
                  href={`/p/${shown.slug}`}
                  onClick={onClose}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-ink px-4 py-3 text-sm font-bold text-bg transition-transform hover:scale-[1.02] active:scale-95"
                >
                  افتح صفحة المكان
                </Link>
                {shown.whatsapp && (
                  <a
                    href={waLink(shown.whatsapp, bookingMessage(shown))}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-mint px-4 py-3 text-sm font-bold text-white transition-transform hover:scale-[1.02] active:scale-95"
                  >
                    <WhatsApp width={18} height={18} /> احجز دلوقتي
                  </a>
                )}
              </div>
              <button
                type="button"
                onClick={() => setRound((r) => r + 1)}
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-line px-4 py-3 text-sm font-bold text-inksoft transition-colors hover:border-spice hover:text-spice active:scale-95"
              >
                <Dice width={18} height={18} /> مش مقتنع؟ لفّ تاني
              </button>
            </div>
          </div>
        </div>
      )}
    </Shell>
  );
}

function Shell({ children, onClose, wide }: { children: ReactNode; onClose: () => void; wide?: boolean }) {
  return (
    <div className="fixed inset-0 z-[85] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="اختارلي أنا">
      <button type="button" className="absolute inset-0 cursor-pointer bg-[#0a0710]/80 backdrop-blur-md" onClick={onClose} aria-label="إغلاق" />
      <div className={`pop-in relative w-full ${wide ? "max-w-md" : "max-w-sm"} rounded-[28px] border border-line bg-surface p-4 shadow-[0_50px_100px_-40px_rgba(0,0,0,.9)]`}>
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-3 -left-3 z-10 grid h-10 w-10 place-items-center rounded-full border border-line bg-surface text-inksoft transition-transform hover:scale-110 active:scale-95"
          aria-label="إغلاق"
        >
          <X width={18} height={18} />
        </button>
        {children}
      </div>
    </div>
  );
}
