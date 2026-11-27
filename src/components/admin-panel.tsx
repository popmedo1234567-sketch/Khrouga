"use client";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import type { MenuItem, Place } from "@/lib/constants";
import { MOODS, TAG_PRESETS, TYPES, toArabicDigits } from "@/lib/constants";
import { isStale, money, updatedLabel } from "@/lib/format";
import { compressImage } from "@/lib/compress";
import { Check, Clock, Coin, Logo, Logout, Pencil, Pin, Plus, Search, Trash, Upload, X } from "./icons";

type Draft = {
  id?: number;
  name: string;
  slug: string;
  area: string;
  address: string;
  type: string;
  moods: string[];
  tags: string[];
  avgPrice: number;
  menuItems: MenuItem[];
  imageUrl: string;
  gallery: string;
  reelUrl: string;
  whatsapp: string;
  mapsUrl: string;
  rating: number;
  hours: string;
  notes: string;
  featured: boolean;
};

const emptyDraft = (): Draft => ({
  name: "",
  slug: "",
  area: "",
  address: "",
  type: TYPES[0].id,
  moods: [],
  tags: [],
  avgPrice: 200,
  menuItems: [{ name: "", price: 0 }],
  imageUrl: "",
  gallery: "",
  reelUrl: "",
  whatsapp: "",
  mapsUrl: "",
  rating: 4.5,
  hours: "",
  notes: "",
  featured: false,
});

const toDraft = (p: Place): Draft => ({
  id: p.id,
  name: p.name,
  slug: p.slug,
  area: p.area,
  address: p.address,
  type: p.type,
  moods: p.moods,
  tags: p.tags,
  avgPrice: p.avgPrice,
  menuItems: p.menuItems.length ? p.menuItems : [{ name: "", price: 0 }],
  imageUrl: p.imageUrl ?? "",
  gallery: p.gallery.join("\n"),
  reelUrl: p.reelUrl ?? "",
  whatsapp: p.whatsapp ?? "",
  mapsUrl: p.mapsUrl ?? "",
  rating: p.rating,
  hours: p.hours ?? "",
  notes: p.notes ?? "",
  featured: p.featured,
});

/** لوحة الأدمن: قائمة + محرر + رفع صور + زرع الأمثلة */
export default function AdminPanel({ places, areas, openNew, allowDemo }: { places: Place[]; areas: string[]; openNew: boolean; allowDemo: boolean }) {
  const [list, setList] = useState(places);
  const [draft, setDraft] = useState<Draft | null>(openNew ? emptyDraft() : null);
  const [q, setQ] = useState("");
  const [toast, setToast] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const router = useRouter();

  const flash = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(""), 3200);
  };

  const stats = useMemo(() => {
    const prices = list.map((p) => p.avgPrice);
    return {
      total: list.length,
      avg: prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0,
      stale: list.filter((p) => isStale(p.updatedAt)).length,
      areas: new Set(list.map((p) => p.area)).size,
    };
  }, [list]);

  const filtered = list.filter((p) => `${p.name} ${p.area} ${p.type}`.includes(q.trim()));

  const json = async (url: string, method: string, body?: unknown) => {
    const res = await fetch(url, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error((data as { error?: string }).error ?? "حصل خطأ");
    return data;
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (!draft) return;
    setBusy(true);
    try {
      const payload = {
        ...draft,
        gallery: draft.gallery.split("\n").map((s) => s.trim()).filter(Boolean),
        menuItems: draft.menuItems.filter((m) => m.name.trim() && m.price > 0),
      };
      const data = draft.id
        ? ((await json("/api/admin/places", "PUT", payload)) as { place: Place })
        : ((await json("/api/admin/places", "POST", payload)) as { place: Place });
      setList((prev) => {
        const next = prev.filter((p) => p.id !== data.place.id);
        return [data.place, ...next];
      });
      setDraft(null);
      flash(draft.id ? "اتحدّث المكان ✓" : "اتضاف المكان ✓");
      router.refresh();
    } catch (err) {
      flash((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: number) => {
    setBusy(true);
    try {
      await json(`/api/admin/places/${id}`, "DELETE");
      setList((prev) => prev.filter((p) => p.id !== id));
      setConfirmId(null);
      flash("اتمسح المكان");
      router.refresh();
    } catch (err) {
      flash((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const seed = async () => {
    setBusy(true);
    try {
      const data = (await json("/api/admin/seed?mode=append", "POST")) as { count: number };
      flash(`زرع الأمثلة تمام — في الجدول ${data.count} مكان`);
      router.refresh();
      window.setTimeout(() => window.location.reload(), 700);
    } catch (err) {
      flash((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const logout = async () => {
    await json("/api/admin/logout", "POST");
    router.refresh();
  };

  const upload = async (file: File) => {
    if (!draft) return;
    setBusy(true);
    try {
      const dataUrl = await compressImage(file);
      const data = (await json("/api/admin/upload", "POST", { dataUrl, name: draft.name || draft.slug })) as { url: string; provider: string };
      setDraft({ ...draft, imageUrl: data.url });
      flash(data.provider === "supabase" ? "اترفعت على Supabase Storage ✓" : "اتخزنت الصورة في الداتابيز ✓");
    } catch (err) {
      flash((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-spice to-saffron text-spiceink">
            <Logo width={26} height={26} />
          </span>
          <div>
            <h1 className="font-display text-2xl font-bold leading-tight">لوحة تحكم خروجة</h1>
            <p className="text-xs text-muted">إدارة الأماكن والأسعار والصور</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {allowDemo && (
            <button type="button" onClick={seed} disabled={busy} className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-line bg-surface px-4 py-2.5 text-sm font-bold text-inksoft transition-colors hover:border-mint hover:text-mint disabled:opacity-50">
              <Plus width={17} height={17} /> ازرع الأمثلة
            </button>
          )}
          <button type="button" onClick={logout} className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-line bg-surface px-4 py-2.5 text-sm font-bold text-inksoft transition-colors hover:border-spice hover:text-spice">
            <Logout width={17} height={17} /> خروج
          </button>
          <button type="button" onClick={() => setDraft(emptyDraft())} className="inline-flex min-h-11 items-center gap-2 rounded-2xl bg-ink px-4 py-2.5 text-sm font-bold text-bg transition-transform hover:scale-[1.03] active:scale-95">
            <Plus width={17} height={17} /> مكان جديد
          </button>
        </div>
      </header>

      <dl className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={<Coin width={17} height={17} />} label="إجمالي الأماكن" value={toArabicDigits(stats.total)} />
        <Stat icon={<Pin width={17} height={17} />} label="مناطق مغطاة" value={toArabicDigits(stats.areas)} />
        <Stat icon={<Coin width={17} height={17} />} label="متوسط سعر الفرد" value={`${money(stats.avg)} ج`} />
        <Stat icon={<Clock width={17} height={17} />} label="أسعار محتاجة تحديث" value={toArabicDigits(stats.stale)} warn={stats.stale > 0} />
      </dl>

      <label className="relative mt-6 flex min-h-12 items-center">
        <Search width={18} height={18} className="pointer-events-none absolute right-4 text-muted" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="دوّر في الأماكن…"
          aria-label="بحث في الأماكن"
          className="h-12 w-full rounded-2xl border border-line bg-surface pr-11 pl-4 text-sm font-semibold outline-none transition-colors focus:border-spice"
        />
      </label>

      <ul className="mt-4 space-y-2">
        {filtered.map((p) => (
          <li key={p.id} className="card flex flex-wrap items-center gap-3 rounded-3xl border border-line p-3">
            <span className="h-16 w-20 shrink-0 overflow-hidden rounded-2xl bg-surface2">
              {p.imageUrl && <img src={p.imageUrl} alt="" className="h-full w-full object-cover" />}
            </span>
            <span className="min-w-[10rem] flex-1">
              <span className="flex flex-wrap items-center gap-2">
                <span className="font-display text-base font-bold">{p.name}</span>
                {p.featured && <span className="rounded-full bg-saffron/20 px-2 py-0.5 text-[0.65rem] font-bold text-saffron">مميّز</span>}
              </span>
              <span className="mt-0.5 block text-xs text-muted">
                {p.area} · {p.type} · {money(p.avgPrice)} ج · {p.menuItems.length} صنف
              </span>
              <span className={`mt-0.5 block text-[0.7rem] font-semibold ${isStale(p.updatedAt) ? "text-saffron" : "text-muted"}`}>
                {updatedLabel(p.updatedAt)}
              </span>
            </span>
            {confirmId === p.id ? (
              <span className="flex items-center gap-2">
                <button type="button" onClick={() => remove(p.id)} disabled={busy} className="min-h-11 rounded-2xl bg-spice px-4 py-2.5 text-sm font-bold text-spiceink">
                  أيوة امسح
                </button>
                <button type="button" onClick={() => setConfirmId(null)} className="min-h-11 rounded-2xl border border-line px-4 py-2.5 text-sm font-bold text-inksoft">
                  لأ
                </button>
              </span>
            ) : (
              <span className="flex gap-2">
                <button type="button" onClick={() => setDraft(toDraft(p))} className="grid h-11 w-11 place-items-center rounded-2xl border border-line bg-surface text-inksoft transition-colors hover:border-mint hover:text-mint" aria-label={`تعديل ${p.name}`}>
                  <Pencil width={18} height={18} />
                </button>
                <a href={`/p/${p.slug}`} target="_blank" rel="noreferrer" className="grid h-11 w-11 place-items-center rounded-2xl border border-line bg-surface px-2 text-xs font-bold text-inksoft transition-colors hover:border-spice hover:text-spice" aria-label={`معاينة ${p.name}`}>
                  معاينة
                </a>
                <button type="button" onClick={() => setConfirmId(p.id)} className="grid h-11 w-11 place-items-center rounded-2xl border border-line bg-surface text-inksoft transition-colors hover:border-spice hover:text-spice" aria-label={`حذف ${p.name}`}>
                  <Trash width={18} height={18} />
                </button>
              </span>
            )}
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="card rounded-3xl border border-dashed border-line p-10 text-center text-sm text-muted">
            {allowDemo ? "مفيش نتائج — جرّب «ازرع الأمثلة» أو ضيف مكان جديد." : "مفيش نتائج — ضيف أول مكان حقيقي من زر «مكان جديد»."}
          </li>
        )}
      </ul>

      {draft && (
        <Editor
          draft={draft}
          setDraft={setDraft}
          areas={areas}
          busy={busy}
          onSave={save}
          onClose={() => setDraft(null)}
          onUpload={upload}
        />
      )}

      {toast && (
        <div className="pop-in fixed bottom-5 left-1/2 z-[90] -translate-x-1/2 rounded-2xl border border-line bg-surface px-5 py-3 text-sm font-bold shadow-[0_30px_60px_-30px_rgba(0,0,0,.8)]">
          {toast}
        </div>
      )}
    </div>
  );
}

function Stat({ icon, label, value, warn }: { icon: ReactNode; label: string; value: string; warn?: boolean }) {
  return (
    <div className="card rounded-3xl border border-line p-4">
      <dt className="flex items-center gap-1.5 text-xs font-bold text-muted">
        <span className={warn ? "text-saffron" : "text-spice"}>{icon}</span>
        {label}
      </dt>
      <dd className="mt-1.5 font-display text-2xl font-bold">{value}</dd>
    </div>
  );
}

function Editor({
  draft,
  setDraft,
  areas,
  busy,
  onSave,
  onClose,
  onUpload,
}: {
  draft: Draft;
  setDraft: (d: Draft) => void;
  areas: string[];
  busy: boolean;
  onSave: (e: FormEvent) => void;
  onClose: () => void;
  onUpload: (f: File) => void;
}) {
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft({ ...draft, [k]: v });
  const toggleArr = (k: "moods" | "tags", v: string) =>
    set(k, draft[k].includes(v) ? draft[k].filter((x) => x !== v) : [...draft[k], v]);

  return (
    <div className="fixed inset-0 z-[88] flex items-end justify-center sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label="محرر المكان">
      <button type="button" className="absolute inset-0 bg-[#0a0710]/80 backdrop-blur-md" onClick={onClose} aria-label="إغلاق المحرر" />
      <form
        onSubmit={onSave}
        className="relative max-h-[92dvh] w-full max-w-3xl overflow-y-auto thin-scroll rounded-t-[28px] border border-line bg-surface p-5 sm:rounded-[28px] sm:p-6"
      >
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-xl font-bold">{draft.id ? "تعديل مكان" : "مكان جديد"}</h2>
          <button type="button" onClick={onClose} className="grid h-11 w-11 place-items-center rounded-2xl border border-line text-inksoft hover:border-spice hover:text-spice" aria-label="إغلاق">
            <X width={18} height={18} />
          </button>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <TextField label="اسم المكان *" value={draft.name} onChange={(v) => set("name", v)} placeholder="كافيه ريش ١٩٠٨" />
          <TextField label="المنطقة *" value={draft.area} onChange={(v) => set("area", v)} list={areas} placeholder="وسط البلد" />
          <TextField label="العنوان" value={draft.address} onChange={(v) => set("address", v)} placeholder="٢٩ شارع طلعت حرب" />
          <TextField label="النوع *" value={draft.type} onChange={(v) => set("type", v)} list={TYPES.map((t) => t.id)} />
          <TextField label="رقم واتساب (بدون +)" value={draft.whatsapp} onChange={(v) => set("whatsapp", v)} placeholder="201001234567" />
          <TextField label="ساعات العمل" value={draft.hours} onChange={(v) => set("hours", v)} placeholder="٩ ص – ١ ص" />
          <NumberField label="متوسط سعر الفرد (ج) *" value={draft.avgPrice} onChange={(v) => set("avgPrice", v)} />
          <NumberField label="التقييم (٠ – ٥)" value={draft.rating} onChange={(v) => set("rating", v)} step={0.1} max={5} />
          <TextField label="الرابط على الخرائط" value={draft.mapsUrl} onChange={(v) => set("mapsUrl", v)} placeholder="https://maps.google.com/?q=…" wide />
          <TextField label="لينك الريل (mp4 أو ريلز)" value={draft.reelUrl} onChange={(v) => set("reelUrl", v)} placeholder="https://…/reel.mp4" wide />
          <TextField label="الـ slug (اختياري — يفضل فاضي)" value={draft.slug} onChange={(v) => set("slug", v)} placeholder="cafe-riche" wide />
        </div>

        {/* الصورة */}
        <div className="mt-5 rounded-3xl border border-line bg-surface2/60 p-4">
          <p className="text-sm font-bold text-inksoft">صورة الغلاف</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="h-20 w-28 shrink-0 overflow-hidden rounded-2xl border border-line bg-surface">
              {draft.imageUrl && <img src={draft.imageUrl} alt="" className="h-full w-full object-cover" />}
            </span>
            <label className="inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-2xl bg-ink px-4 py-3 text-sm font-bold text-bg transition-transform hover:scale-[1.02] active:scale-95">
              <Upload width={18} height={18} /> ارفع صورة
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) onUpload(f);
                  e.target.value = "";
                }}
              />
            </label>
            <span className="text-xs text-muted">أو الصق رابط مباشر</span>
          </div>
          <input
            value={draft.imageUrl.startsWith("data:") ? "" : draft.imageUrl}
            onChange={(e) => set("imageUrl", e.target.value)}
            placeholder={draft.imageUrl.startsWith("data:") ? "صورة مرفوعة مخزّنة في الداتابيز ✓" : "https://…/photo.jpg"}
            className="mt-3 h-12 w-full rounded-2xl border border-line bg-surface px-4 text-sm outline-none focus:border-spice"
          />
          <label className="mt-3 block">
            <span className="text-xs font-bold text-muted">صور إضافية (رابط في كل سطر)</span>
            <textarea
              value={draft.gallery}
              onChange={(e) => set("gallery", e.target.value)}
              rows={2}
              className="mt-1 w-full rounded-2xl border border-line bg-surface p-3 text-sm outline-none focus:border-spice"
              placeholder="https://…/1.jpg"
            />
          </label>
        </div>

        {/* الأجواء والتاجات */}
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <ChipsField label="الأجواء" options={MOODS.map((m) => m.id)} selected={draft.moods} onToggle={(v) => toggleArr("moods", v)} />
          <ChipsField label="تاجات" options={TAG_PRESETS} selected={draft.tags} onToggle={(v) => toggleArr("tags", v)} />
        </div>

        {/* المنيو */}
        <div className="mt-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-inksoft">المنيو وأسعاره</p>
            <button type="button" onClick={() => set("menuItems", [...draft.menuItems, { name: "", price: 0 }])} className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-line px-3 py-2 text-xs font-bold text-inksoft hover:border-mint hover:text-mint">
              <Plus width={15} height={15} /> صنف
            </button>
          </div>
          <ul className="mt-3 space-y-2">
            {draft.menuItems.map((item, i) => (
              <li key={i} className="flex flex-wrap items-center gap-2 rounded-2xl border border-line bg-surface2/50 p-2">
                <input
                  value={item.name}
                  onChange={(e) => {
                    const next = [...draft.menuItems];
                    next[i] = { ...item, name: e.target.value };
                    set("menuItems", next);
                  }}
                  placeholder="اسم الصنف"
                  className="h-11 min-w-[9rem] flex-1 rounded-xl border border-line bg-surface px-3 text-sm outline-none focus:border-spice"
                />
                <input
                  type="number"
                  min={0}
                  value={item.price || ""}
                  onChange={(e) => {
                    const next = [...draft.menuItems];
                    next[i] = { ...item, price: Number(e.target.value) };
                    set("menuItems", next);
                  }}
                  placeholder="السعر"
                  className="h-11 w-24 rounded-xl border border-line bg-surface px-3 text-sm outline-none focus:border-spice"
                />
                <input
                  value={item.note ?? ""}
                  onChange={(e) => {
                    const next = [...draft.menuItems];
                    next[i] = { ...item, note: e.target.value };
                    set("menuItems", next);
                  }}
                  placeholder="ملاحظة (اختياري)"
                  className="h-11 min-w-[8rem] flex-1 rounded-xl border border-line bg-surface px-3 text-sm outline-none focus:border-spice"
                />
                <button
                  type="button"
                  onClick={() => set("menuItems", draft.menuItems.filter((_, x) => x !== i))}
                  className="grid h-11 w-11 place-items-center rounded-xl border border-line text-inksoft hover:border-spice hover:text-spice"
                  aria-label="حذف الصنف"
                >
                  <Trash width={17} height={17} />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <label className="mt-5 flex items-center gap-3 rounded-2xl border border-line bg-surface2/60 p-4">
          <span className={`grid h-7 w-7 place-items-center rounded-xl border-2 transition-all ${draft.featured ? "border-spice bg-spice text-spiceink" : "border-line bg-surface text-transparent"}`}>
            <Check width={16} height={16} />
          </span>
          <input type="checkbox" checked={draft.featured} onChange={(e) => set("featured", e.target.checked)} className="sr-only" />
          <span className="text-sm font-bold text-inksoft">مكان مميّز (يظهر في الأول وفي الهيرو)</span>
        </label>

        <label className="mt-3 block">
          <span className="text-xs font-bold text-muted">ملاحظات للزوار (نصيحة الحجز، أحسن وقت، إلخ)</span>
          <textarea
            value={draft.notes}
            onChange={(e) => set("notes", e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-2xl border border-line bg-surface p-3 text-sm leading-7 outline-none focus:border-spice"
            placeholder="أحسن ترابيزة هي الركن وقت الغروب…"
          />
        </label>

        <div className="sticky bottom-0 -mx-5 mt-6 flex gap-2 border-t border-line bg-surface px-5 pt-4 sm:-mx-6 sm:px-6">
          <button type="submit" disabled={busy || !draft.name || !draft.area} className="inline-flex min-h-13 flex-1 items-center justify-center gap-2 rounded-2xl bg-ink px-5 py-4 font-display text-base font-bold text-bg transition-transform enabled:hover:scale-[1.01] enabled:active:scale-95 disabled:opacity-50">
            {busy ? "بيحفظ…" : draft.id ? "احفظ التعديلات" : "أضف المكان"}
          </button>
          <button type="button" onClick={onClose} className="inline-flex min-h-13 items-center justify-center rounded-2xl border border-line px-5 py-4 text-sm font-bold text-inksoft hover:border-spice hover:text-spice">
            إلغاء
          </button>
        </div>
      </form>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  list,
  wide,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  list?: string[];
  wide?: boolean;
}) {
  const id = `f-${label.replace(/\W/g, "")}`;
  return (
    <label className={`block ${wide ? "sm:col-span-2" : ""}`}>
      <span className="text-xs font-bold text-muted">{label}</span>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        list={list ? `${id}-list` : undefined}
        className="mt-1 h-12 w-full rounded-2xl border border-line bg-surface px-4 text-sm font-semibold outline-none transition-colors focus:border-spice"
      />
      {list && (
        <datalist id={`${id}-list`}>
          {list.map((o) => (
            <option key={o} value={o} />
          ))}
        </datalist>
      )}
    </label>
  );
}

function NumberField({
  label,
  value,
  onChange,
  step = 1,
  max,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
  max?: number;
}) {
  return (
    <label className="block">
      <span className="text-xs font-bold text-muted">{label}</span>
      <input
        type="number"
        value={value || ""}
        min={0}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 h-12 w-full rounded-2xl border border-line bg-surface px-4 text-sm font-semibold outline-none transition-colors focus:border-spice"
      />
    </label>
  );
}

function ChipsField({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div className="rounded-3xl border border-line bg-surface2/40 p-4">
      <p className="text-sm font-bold text-inksoft">{label}</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => onToggle(o)}
            aria-pressed={selected.includes(o)}
            className={`min-h-10 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all active:scale-95 ${
              selected.includes(o) ? "border-transparent bg-spice text-spiceink" : "border-line bg-surface text-inksoft hover:border-spice/60"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}
