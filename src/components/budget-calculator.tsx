"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import type { Place } from "@/lib/constants";
import { toArabicDigits } from "@/lib/constants";
import { money } from "@/lib/format";
import { Coin, Users, Wallet } from "./icons";

/** حاسبة الخروجة: كام فرد × كام جنيه = مين المكان المناسب؟ */
export default function BudgetCalculator({ places }: { places: Place[] }) {
  const [people, setPeople] = useState(2);
  const [perPerson, setPerPerson] = useState(250);
  const total = people * perPerson;

  const matches = useMemo(
    () =>
      places
        .filter((p) => p.avgPrice <= perPerson)
        .sort((a, b) => b.rating - a.rating || a.avgPrice - b.avgPrice)
        .slice(0, 3),
    [places, perPerson],
  );

  return (
    <div className="card rounded-[28px] border border-line p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-saffron/18 text-saffron">
          <Wallet width={21} height={21} />
        </span>
        <div>
          <h3 className="font-display text-xl font-bold">احسب خروجتك</h3>
          <p className="text-xs text-muted">حرّك الأرقام وشوف مين اللي هيناسبكم</p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-sm font-bold text-inksoft">
            <Users width={16} height={16} className="text-mint" /> هتكونوا كام فرد؟
          </p>
          <div className="flex flex-wrap gap-2">
            {[2, 3, 4, 6, 8].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setPeople(n)}
                className={`min-h-11 min-w-11 rounded-2xl border px-3 text-sm font-bold transition-all active:scale-95 ${
                  people === n ? "border-transparent bg-mint text-white" : "border-line bg-surface text-inksoft hover:border-mint/60"
                }`}
              >
                {toArabicDigits(n)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-baseline justify-between">
            <p className="flex items-center gap-1.5 text-sm font-bold text-inksoft">
              <Coin width={16} height={16} className="text-saffron" /> ميزانية الفرد
            </p>
            <p className="font-display text-lg font-bold text-spice">{toArabicDigits(money(perPerson))} ج</p>
          </div>
          <input
            type="range"
            className="slider mt-1"
            min={50}
            max={800}
            step={10}
            value={perPerson}
            onChange={(e) => setPerPerson(Number(e.target.value))}
            aria-label="ميزانية الفرد"
            style={{ ["--fill" as string]: `${((perPerson - 50) / 750) * 100}%` }}
          />
        </div>

        <div className="rounded-3xl bg-gradient-to-l from-spice/12 to-saffron/12 p-4">
          <p className="text-xs font-bold text-muted">الإجمالي المتوقع للكل</p>
          <p className="font-display text-[2.2rem] font-bold leading-tight text-ink">
            {toArabicDigits(total.toLocaleString("en-US"))} <span className="text-lg text-spice">جنيه</span>
          </p>
          <p className="mt-1 text-xs font-semibold text-muted">
            {matches.length > 0
              ? `فيه ${toArabicDigits(places.filter((p) => p.avgPrice <= perPerson).length)} مكان في الميزانية دي`
              : "مفيش مكان بالسعر ده — زوّد الميزانية شوية"}
          </p>
        </div>

        <ul className="space-y-2">
          {matches.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/p/${p.slug}`}
                className="group flex items-center gap-3 rounded-2xl border border-line bg-surface p-2.5 transition-all hover:-translate-y-0.5 hover:border-spice/50"
              >
                <span className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-surface2">
                  {p.imageUrl && <img src={p.imageUrl} alt="" loading="lazy" className="h-full w-full object-cover" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold">{p.name}</span>
                  <span className="block truncate text-xs text-muted">{p.area} · {p.type}</span>
                </span>
                <span className="shrink-0 text-left">
                  <span className="block font-display text-sm font-bold text-spice">{money(p.avgPrice)} ج</span>
                  <span className="block text-[0.68rem] text-muted">{toArabicDigits(money(p.avgPrice * people))} للكل</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
