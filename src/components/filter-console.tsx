"use client";
import { useState } from "react";
import type { ReactNode } from "react";
import { BUDGET, MOODS, SORTS, TYPES, toArabicDigits } from "@/lib/constants";
import type { Filters } from "@/lib/constants";
import { Chevron, Coin, Dice, Filter, MoodIcon, Search, X } from "./icons";

type Props = {
  filters: Filters;
  onChange: (patch: Partial<Filters>) => void;
  areas: string[];
  areaCounts: Record<string, number>;
  histogram: number[];
  resultCount: number;
  totalCount: number;
  activeCount: number;
  onReset: () => void;
  onPick: () => void;
};

export default function FilterConsole(p: Props) {
  const [open, setOpen] = useState(false);
  const { filters: f } = p;
  const pct = ((f.budget - BUDGET.min) / (BUDGET.max - BUDGET.min)) * 100;
  const maxBucket = Math.max(1, ...p.histogram);

  const toggleIn = (list: string[], v: string) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  const presets = [
    { label: "اقتصادي", value: 150 },
    { label: "متوسط", value: 300 },
    { label: "فوق المتوسط", value: 500 },
    { label: "مفتوح", value: BUDGET.max },
  ];

  return (
    <section
      id="filters"
      className="card sticky top-16 z-40 rounded-[28px] border border-line/90 bg-surface/92 p-4 backdrop-blur-xl sm:p-5"
    >
      {/* الصف الدائم */}
      <div className="flex flex-wrap items-center gap-3">
        <label className="group relative flex min-h-12 min-w-[13rem] flex-1 items-center">
          <Search width={19} height={19} className="pointer-events-none absolute right-4 text-muted transition-colors group-focus-within:text-spice" />
          <input
            type="search"
            value={f.q}
            onChange={(e) => p.onChange({ q: e.target.value })}
            placeholder="دوّر على مكان أو منطقة أو صنف…"
            aria-label="بحث"
            className="h-12 w-full rounded-2xl border border-line bg-surface2/80 pr-11 pl-4 text-sm font-semibold text-ink outline-none transition-all placeholder:text-muted/80 focus:border-spice focus:bg-surface"
          />
        </label>

        <button
          type="button"
          onClick={p.onPick}
          className="group relative inline-flex min-h-12 items-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-l from-spice via-spice to-saffron px-5 py-3 text-sm font-extrabold text-spiceink shadow-[0_16px_30px_-16px_var(--spice)] transition-transform hover:scale-[1.03] active:scale-95"
        >
          <Dice width={20} height={20} className="transition-transform duration-500 group-hover:rotate-[200deg]" />
          اختارلي أنا
          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-white/25 transition-transform duration-700 group-hover:translate-x-full" aria-hidden />
        </button>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="inline-flex min-h-12 items-center gap-2 rounded-2xl border border-line bg-surface2 px-4 py-3 text-sm font-bold text-inksoft md:hidden"
        >
          <Filter width={19} height={19} /> الفلاتر
          {p.activeCount > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-spice px-1 text-[0.65rem] text-spiceink">{p.activeCount}</span>}
        </button>
      </div>

      {/* شرائح المناطق */}
      <div className="no-scrollbar -mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-1">
        <Chip active={f.area === ""} onClick={() => p.onChange({ area: "" })}>
          كل المناطق <span className="text-muted">({p.totalCount})</span>
        </Chip>
        {p.areas.map((a) => (
          <Chip key={a} active={f.area === a} onClick={() => p.onChange({ area: f.area === a ? "" : a })}>
            {a} <span className="opacity-70">({p.areaCounts[a] ?? 0})</span>
          </Chip>
        ))}
      </div>

      {/* بقية الفلاتر */}
      <div className={`${open ? "mt-4 block" : "hidden"} md:mt-4 md:block`}>
        <div className="grid gap-5 md:grid-cols-2">
          {/* الميزانية */}
          <div className="rounded-3xl border border-line bg-surface2/60 p-4">
            <div className="flex items-baseline justify-between gap-2">
              <span className="flex items-center gap-1.5 text-sm font-bold text-inksoft">
                <Coin width={17} height={17} className="text-saffron" /> الميزانية للفرد
              </span>
              <span className="font-display text-xl font-bold text-spice">
                حتى {toArabicDigits(f.budget.toLocaleString("en-US"))} ج
              </span>
            </div>

            <input
              type="range"
              className="slider mt-1"
              min={BUDGET.min}
              max={BUDGET.max}
              step={BUDGET.step}
              value={f.budget}
              onChange={(e) => p.onChange({ budget: Number(e.target.value) })}
              aria-label="أقصى سعر للفرد بالجنيه"
              style={{ ["--fill" as string]: `${pct}%` }}
            />

            {/* هيستوجرام الأسعار */}
            <div className="flex h-8 items-end gap-1" aria-hidden>
              {p.histogram.map((c, i) => {
                const inRange = (BUDGET.min + (i + 1) * ((BUDGET.max - BUDGET.min) / p.histogram.length)) <= f.budget + 1;
                return (
                  <span
                    key={i}
                    className="flex-1 rounded-t-md transition-all duration-500"
                    style={{
                      height: `${Math.max(8, (c / maxBucket) * 100)}%`,
                      background: inRange ? "var(--spice)" : "var(--line)",
                      opacity: inRange ? 0.85 : 0.6,
                    }}
                  />
                );
              })}
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {presets.map((pr) => (
                <button
                  key={pr.label}
                  type="button"
                  onClick={() => p.onChange({ budget: pr.value })}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all active:scale-95 ${
                    f.budget === pr.value ? "bg-saffron text-black" : "border border-line bg-surface text-muted hover:text-ink"
                  }`}
                >
                  {pr.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {/* الأجواء */}
            <div>
              <p className="mb-2 text-sm font-bold text-inksoft">المزاج إيه النهاردة؟</p>
              <div className="flex flex-wrap gap-2">
                {MOODS.map((m) => {
                  const on = f.moods.includes(m.id);
                  return (
                    <button
                      key={m.id}
                      type="button"
                      title={m.hint}
                      onClick={() => p.onChange({ moods: toggleIn(f.moods, m.id) })}
                      aria-pressed={on}
                      className={`inline-flex min-h-11 items-center gap-1.5 rounded-2xl border px-3.5 py-2 text-sm font-bold transition-all active:scale-95 ${
                        on
                          ? "border-transparent bg-spice text-spiceink shadow-[0_10px_24px_-14px_var(--spice)]"
                          : "border-line bg-surface text-inksoft hover:-translate-y-0.5 hover:border-spice/60"
                      }`}
                    >
                      <MoodIcon icon={m.icon} width={17} height={17} />
                      {m.id}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* الأنواع */}
            <div>
              <p className="mb-2 text-sm font-bold text-inksoft">نوع المكان</p>
              <div className="flex flex-wrap gap-2">
                {TYPES.map((t) => {
                  const on = f.types.includes(t.id);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => p.onChange({ types: toggleIn(f.types, t.id) })}
                      aria-pressed={on}
                      className={`inline-flex min-h-11 items-center gap-1.5 rounded-2xl border px-3.5 py-2 text-sm font-bold transition-all active:scale-95 ${
                        on ? "border-transparent bg-mint text-white" : "border-line bg-surface text-inksoft hover:-translate-y-0.5 hover:border-mint/60"
                      }`}
                    >
                      <span aria-hidden>{t.emoji}</span>
                      {t.id}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* الترتيب + إعادة الضبط */}
        <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-line pt-4">
          <div className="no-scrollbar flex flex-1 gap-1.5 overflow-x-auto">
            {SORTS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => p.onChange({ sort: s.id })}
                className={`whitespace-nowrap rounded-xl px-3 py-2 text-xs font-bold transition-colors ${
                  f.sort === s.id ? "bg-ink text-bg" : "bg-surface2 text-muted hover:text-ink"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-muted">
              <b className="font-display text-lg text-ink">{toArabicDigits(p.resultCount)}</b> مكان جاهز
            </span>
            {p.activeCount > 0 && (
              <button
                type="button"
                onClick={p.onReset}
                className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-line px-3 py-2 text-xs font-bold text-inksoft transition-colors hover:border-spice hover:text-spice active:scale-95"
              >
                <X width={15} height={15} /> امسح الفلاتر
              </button>
            )}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="mt-3 flex w-full items-center justify-center gap-1.5 py-1 text-xs font-bold text-muted md:hidden"
        aria-label={open ? "اقفل الفلاتر" : "افتح الفلاتر"}
      >
        {open ? "اقفل" : "اعرض"} الفلاتر
        <Chevron width={16} height={16} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
    </section>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex min-h-11 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-bold transition-all active:scale-95 ${
        active ? "border-transparent bg-ink text-bg" : "border-line bg-surface2/70 text-inksoft hover:border-ink/40"
      }`}
    >
      {children}
    </button>
  );
}
