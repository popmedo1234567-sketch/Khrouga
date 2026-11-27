"use client";
import { useEffect } from "react";

/**
 * مراقب عام للظهور التدريجي: أي عنصر عليه .reveal بيتفعّل لما يدخل الشاشة.
 * MutationObserver بيضمن إن العناصر الجديدة (بعد الفلترة أو التنقل) بتتلحق برضه.
 */
export default function RevealObserver() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -5% 0px" },
    );

    let queued = false;
    const scan = () => {
      document.querySelectorAll<HTMLElement>(".reveal:not(.is-in)").forEach((el) => io.observe(el));
    };
    const queue = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        scan();
      });
    };

    scan();
    const mo = new MutationObserver(queue);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
