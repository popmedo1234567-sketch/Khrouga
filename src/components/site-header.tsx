"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "@/hooks/use-theme";
import { useFavorites } from "@/hooks/use-favorites";
import { Heart, Logo, Moon, Plus, Sun, X } from "./icons";

const LINKS = [
  { href: "/", label: "استكشف" },
  { href: "/?view=favorites", label: "المفضلة", fav: true },
  { href: "/admin", label: "الأدمن" },
];

export default function SiteHeader() {
  const { theme, toggle } = useTheme();
  const { favs } = useFavorites();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const active = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href.split("?")[0]) && href !== "/");

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "border-b border-line/80 bg-bg/85 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2.5" aria-label="خروجة — الصفحة الرئيسية">
          <span className="relative grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-spice to-saffron text-spiceink shadow-[0_10px_24px_-12px_var(--spice)] transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
            <Logo width={24} height={24} />
          </span>
          <span className="leading-none">
            <span className="block font-display text-[1.35rem] font-semibold tracking-tight">خروجة</span>
            <span className="block text-[0.6rem] font-semibold tracking-[0.28em] text-muted">KHROUGA</span>
          </span>
        </Link>

        <nav className="ms-auto hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`relative rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                active(l.href) && !l.fav ? "bg-surface2 text-ink" : "text-muted hover:text-ink"
              }`}
            >
              {l.label}
              {l.fav && favs.length > 0 && (
                <span className="absolute -top-0.5 -left-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-spice px-1 text-[0.65rem] font-bold text-spiceink">
                  {favs.length}
                </span>
              )}
            </Link>
          ))}
          <Link
            href="/admin?new=1"
            className="ms-2 inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-bold text-bg transition-transform hover:scale-[1.03] active:scale-95"
          >
            <Plus width={18} height={18} /> أضف مكان
          </Link>
        </nav>

        <div className="ms-auto flex items-center gap-2 md:ms-0">
          <Link
            href="/?view=favorites"
            className="relative grid h-11 w-11 place-items-center rounded-2xl border border-line bg-surface text-inksoft transition-colors hover:border-spice hover:text-spice"
            aria-label={`المفضلة (${favs.length})`}
          >
            <Heart width={20} height={20} fill={favs.length ? "currentColor" : "none"} />
            {favs.length > 0 && (
              <span className="absolute -top-1 -left-1 grid h-5 min-w-5 place-items-center rounded-full bg-spice px-1 text-[0.65rem] font-bold text-spiceink">
                {favs.length}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={toggle}
            className="grid h-11 w-11 place-items-center rounded-2xl border border-line bg-surface text-inksoft transition-all hover:border-saffron hover:text-saffron active:scale-95"
            aria-label={theme === "dark" ? "الوضع النهاري" : "الوضع الليلي"}
          >
            <span className="relative block h-5 w-5">
              <Sun
                width={20}
                height={20}
                className={`absolute inset-0 transition-all duration-500 ${theme === "dark" ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-50 opacity-0"}`}
              />
              <Moon
                width={20}
                height={20}
                className={`absolute inset-0 transition-all duration-500 ${theme === "dark" ? "rotate-90 scale-50 opacity-0" : "rotate-0 scale-100 opacity-100"}`}
              />
            </span>
          </button>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="grid h-11 w-11 place-items-center rounded-2xl border border-line bg-surface text-inksoft md:hidden"
            aria-label="القائمة"
            aria-expanded={open}
          >
            {open ? <X width={20} height={20} /> : <span className="space-y-1.5"><i className="block h-0.5 w-5 bg-current" /><i className="block h-0.5 w-5 bg-current" /><i className="block h-0.5 w-3 bg-current" /></span>}
          </button>
        </div>
      </div>

      {open && (
        <nav className="pop-in border-t border-line bg-surface px-4 py-3 md:hidden">
          {[...LINKS, { href: "/admin?new=1", label: "أضف مكان" }].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="flex min-h-12 items-center justify-between rounded-2xl px-3 py-3 text-base font-semibold text-inksoft hover:bg-surface2"
            >
              {l.label}
              {"fav" in l && favs.length ? <span className="rounded-full bg-spice px-2 py-0.5 text-xs text-spiceink">{favs.length}</span> : null}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
