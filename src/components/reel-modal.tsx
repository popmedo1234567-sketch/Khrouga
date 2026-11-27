"use client";
import { useEffect } from "react";
import { WhatsApp, X } from "./icons";
import { bookingMessage, waLink } from "@/lib/format";
import type { Place } from "@/lib/constants";

/** مشغّل الريل — فيديو رأسي في نافذة كاملة */
export default function ReelModal({ place, onClose }: { place: Place; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-3" role="dialog" aria-modal="true" aria-label={`ريل ${place.name}`}>
      <button type="button" onClick={onClose} className="absolute inset-0 cursor-zoom-out bg-[#0a0710]/85 backdrop-blur-md" aria-label="إغلاق" />
      <div className="pop-in relative w-full max-w-[min(420px,92vw)]">
        <div className="relative overflow-hidden rounded-[28px] border border-white/15 bg-black shadow-[0_40px_90px_-30px_rgba(0,0,0,.9)]">
          <video
            src={place.reelUrl ?? undefined}
            poster={place.imageUrl ?? undefined}
            autoPlay
            muted
            loop
            playsInline
            controls
            className="aspect-[9/16] w-full bg-black object-cover"
          />
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 left-3 grid h-11 w-11 place-items-center rounded-full bg-black/55 text-white backdrop-blur transition-transform hover:scale-110 active:scale-95"
            aria-label="إغلاق الريل"
          >
            <X width={20} height={20} />
          </button>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 pt-16 text-white">
            <p className="font-display text-lg font-semibold">{place.name}</p>
            <p className="text-sm text-white/75">{place.area} · {place.type}</p>
          </div>
        </div>
        {place.whatsapp && (
          <a
            href={waLink(place.whatsapp, bookingMessage(place))}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-3 flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-mint px-5 py-3 font-bold text-white transition-transform hover:scale-[1.02] active:scale-95"
          >
            <WhatsApp width={20} height={20} /> احجز على واتساب
          </a>
        )}
      </div>
    </div>
  );
}
