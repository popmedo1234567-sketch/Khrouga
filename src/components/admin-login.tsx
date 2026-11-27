"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";
import { Logo, Shield } from "./icons";

/** شاشة دخول الأدمن */
export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setBusy(false);
    if (res.ok) {
      router.refresh();
      return;
    }
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    setError(data.error ?? "حصل خطأ، حاول تاني");
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-14">
      <form onSubmit={submit} className="card w-full rounded-[28px] border border-line p-6 sm:p-8">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-spice to-saffron text-spiceink">
          <Logo width={30} height={30} />
        </span>
        <h1 className="mt-4 font-display text-2xl font-bold">لوحة تحكم خروجة</h1>
        <p className="mt-1 text-sm leading-7 text-muted">
          هنا بتضيف الأماكن، بتحدّث الأسعار، وبترفع الصور. اكتب كلمة السر عشان تدخل.
        </p>

        <label className="mt-6 block">
          <span className="flex items-center gap-1.5 text-sm font-bold text-inksoft">
            <Shield width={16} height={16} className="text-mint" /> كلمة السر
          </span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            autoFocus
            className="mt-2 h-14 w-full rounded-2xl border border-line bg-surface2 px-4 text-base font-semibold outline-none transition-colors focus:border-spice focus:bg-surface"
            placeholder="••••••••"
          />
        </label>

        {error && (
          <p role="alert" className="mt-3 rounded-2xl bg-spice/12 px-4 py-3 text-sm font-bold text-spice">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy || !password}
          className="mt-5 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-ink px-5 py-4 font-display text-base font-bold text-bg transition-transform enabled:hover:scale-[1.02] enabled:active:scale-95 disabled:opacity-50"
        >
          {busy ? "بيتحقق…" : "ادخل اللوحة"}
        </button>

        {process.env.NODE_ENV !== "production" && (
          <p className="mt-4 text-center text-xs text-muted">
            القيمة الافتراضية للتطوير المحلي فقط: <code className="rounded bg-surface2 px-1.5 py-0.5 font-mono">khrouga2026</code>
          </p>
        )}
      </form>
    </div>
  );
}
