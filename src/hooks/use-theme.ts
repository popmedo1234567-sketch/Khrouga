"use client";
import { useEffect, useState } from "react";

const KEY = "khrouga:theme";
export type Theme = "light" | "dark";

/** الوضع الليلي/النهاري — محفوظ محليًا مع احترام تفضيل النظام */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const stored = localStorage.getItem(KEY) as Theme | null;
    const initial = stored ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    apply(initial);
    setTheme(initial);
  }, []);

  const apply = (t: Theme) => {
    document.documentElement.classList.toggle("dark", t === "dark");
    document.documentElement.style.colorScheme = t;
    localStorage.setItem(KEY, t);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", t === "dark" ? "#120f18" : "#f6f0e6");
  };

  const toggle = () => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      apply(next);
      return next;
    });
  };

  return { theme, toggle };
}
