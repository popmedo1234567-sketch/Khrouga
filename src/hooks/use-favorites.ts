"use client";
import { useCallback, useEffect, useState } from "react";

const KEY = "khrouga:favs:v1";
const EVENT = "khrouga:favs";

const read = (): string[] => {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
};

/** المفضلة محفوظة محليًا في المتصفح — من غير تسجيل دخول */
export function useFavorites() {
  const [favs, setFavs] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setFavs(read());
    setReady(true);
    const sync = () => setFavs(read());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const toggle = useCallback((slug: string) => {
    setFavs((prev) => {
      const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [slug, ...prev];
      localStorage.setItem(KEY, JSON.stringify(next));
      window.dispatchEvent(new CustomEvent(EVENT, { detail: next }));
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    localStorage.removeItem(KEY);
    window.dispatchEvent(new CustomEvent(EVENT));
    setFavs([]);
  }, []);

  return { favs, ready, toggle, clear, isFav: (slug: string) => favs.includes(slug) };
}
