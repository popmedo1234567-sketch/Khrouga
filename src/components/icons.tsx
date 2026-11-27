import type { FC, SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const S = (p: P) => ({
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  width: 22,
  height: 22,
  "aria-hidden": true,
  ...p,
});

/** علامة "خروجة": باب مقوّس (زي بيوت القاهرة القديمة) مع شرارة جواه */
export const Logo = (p: P) => (
  <svg {...S(p)} strokeWidth={1.5}>
    <path d="M5.5 21V9.8A6.5 6.5 0 0 1 12 3.3a6.5 6.5 0 0 1 6.5 6.5V21" />
    <path d="M3.6 21h16.8" />
    <path d="M12 8.6c.9 2 2 3.1 4 4-2 .9-3.1 2-4 4-.9-2-2-3.1-4-4 2-.9 3.1-2 4-4Z" />
  </svg>
);

export const Pin = (p: P) => (
  <svg {...S(p)}>
    <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
    <path d="m9.6 10.4 1.8 1.8 3.4-3.9" />
  </svg>
);

export const WhatsApp = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={22} height={22} aria-hidden {...p}>
    <path d="M12.04 2C6.6 2 2.2 6.4 2.2 11.84c0 1.74.46 3.44 1.32 4.94L2 22l5.36-1.4a9.86 9.86 0 0 0 4.68 1.2c5.44 0 9.84-4.4 9.84-9.84S17.48 2 12.04 2Zm0 17.98c-1.5 0-2.96-.4-4.24-1.16l-.3-.18-3.18.84.84-3.1-.2-.32a8.1 8.1 0 0 1-1.24-4.34c0-4.5 3.66-8.14 8.16-8.14s8.14 3.66 8.14 8.16-3.64 8.24-8.14 8.24Zm4.48-6.1c-.24-.12-1.44-.72-1.66-.8-.22-.08-.38-.12-.54.12s-.62.8-.76.96c-.14.16-.28.18-.52.06a6.6 6.6 0 0 1-1.96-1.2 7.4 7.4 0 0 1-1.36-1.68c-.14-.24-.02-.38.1-.5.12-.12.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.46-.4-.4-.54-.4h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.68 2.68 4.1 3.66 2.42.98 2.42.66 2.86.62.44-.04 1.44-.58 1.64-1.16.2-.58.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28Z" />
  </svg>
);

export const Reel = (p: P) => (
  <svg {...S(p)}>
    <rect x="3" y="3.5" width="18" height="17" rx="4" />
    <path d="M3 8.5h18M8 3.5 6.4 8.5M14 3.5l-1.6 5" />
    <path d="m10.8 12.4 4 2.6-4 2.6v-5.2Z" fill="currentColor" stroke="none" />
  </svg>
);

export const Heart = (p: P) => (
  <svg {...S(p)}>
    <path d="M12 20s-7.2-4.4-7.2-9.4A4.2 4.2 0 0 1 12 8.2a4.2 4.2 0 0 1 7.2 2.4c0 5-7.2 9.4-7.2 9.4Z" />
  </svg>
);

export const Dice = (p: P) => (
  <svg {...S(p)}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
    <circle cx="8.6" cy="8.6" r="1.3" fill="currentColor" stroke="none" />
    <circle cx="15.4" cy="15.4" r="1.3" fill="currentColor" stroke="none" />
    <circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" />
  </svg>
);

export const Sun = (p: P) => (
  <svg {...S(p)}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.4 5.4l1.6 1.6M17 17l1.6 1.6M18.6 5.4 17 7M7 17l-1.6 1.6" />
  </svg>
);

export const Moon = (p: P) => (
  <svg {...S(p)}>
    <path d="M20 14.2A8.2 8.2 0 0 1 9.8 4 8.4 8.4 0 1 0 20 14.2Z" />
    <path d="m16.4 3.6.5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5-1.5-.5 1.5-.5.5-1.5Z" />
  </svg>
);

export const Search = (p: P) => (
  <svg {...S(p)}>
    <circle cx="11" cy="11" r="6.4" />
    <path d="m16 16 4.4 4.4" />
  </svg>
);

export const Coin = (p: P) => (
  <svg {...S(p)}>
    <ellipse cx="12" cy="6.6" rx="7.4" ry="3.2" />
    <path d="M4.6 6.6v10.8c0 1.8 3.3 3.2 7.4 3.2s7.4-1.4 7.4-3.2V6.6" />
    <path d="M4.6 12c0 1.8 3.3 3.2 7.4 3.2s7.4-1.4 7.4-3.2" />
  </svg>
);

export const Clock = (p: P) => (
  <svg {...S(p)}>
    <circle cx="12" cy="12" r="8.4" />
    <path d="M12 7.6V12l3 1.8" />
  </svg>
);

export const Star = (p: P) => (
  <svg {...S(p)} strokeWidth={1.4}>
    <path d="m12 4 2.3 4.9 5.2.7-3.8 3.7 1 5.3-4.7-2.6-4.7 2.6 1-5.3L4.5 9.6l5.2-.7L12 4Z" />
  </svg>
);

export const Plus = (p: P) => (
  <svg {...S(p)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const Trash = (p: P) => (
  <svg {...S(p)}>
    <path d="M4.5 6.6h15M9.4 6.6V4.8h5.2v1.8M6.6 6.6l.9 12.1a1.6 1.6 0 0 0 1.6 1.5h5.8a1.6 1.6 0 0 0 1.6-1.5l.9-12.1" />
    <path d="M10.4 10.4v6.2M13.6 10.4v6.2" />
  </svg>
);

export const Pencil = (p: P) => (
  <svg {...S(p)}>
    <path d="M4.5 19.5h4l10-10a2.1 2.1 0 0 0-3-3l-10 10v3Z" />
    <path d="m14.5 5.5 4 4" />
  </svg>
);

export const Upload = (p: P) => (
  <svg {...S(p)}>
    <path d="M12 16V4.8m0 0L8.2 8.6M12 4.8l3.8 3.8" />
    <path d="M4.5 15v3.2A2.3 2.3 0 0 0 6.8 20.5h10.4a2.3 2.3 0 0 0 2.3-2.3V15" />
  </svg>
);

export const Logout = (p: P) => (
  <svg {...S(p)}>
    <path d="M14.5 4.5h-7A2.5 2.5 0 0 0 5 7v10a2.5 2.5 0 0 0 2.5 2.5h7" />
    <path d="M17.5 12H10m7.5 0-3-3m3 3-3 3" />
  </svg>
);

export const Check = (p: P) => (
  <svg {...S(p)}>
    <path d="m5 12.6 4.4 4.4L19 6.8" />
  </svg>
);

export const X = (p: P) => (
  <svg {...S(p)}>
    <path d="M6.4 6.4 17.6 17.6M17.6 6.4 6.4 17.6" />
  </svg>
);

export const Share = (p: P) => (
  <svg {...S(p)}>
    <circle cx="6.4" cy="12" r="2.6" />
    <circle cx="17.6" cy="6.4" r="2.6" />
    <circle cx="17.6" cy="17.6" r="2.6" />
    <path d="m8.8 10.8 6.4-3.2M8.8 13.2l6.4 3.2" />
  </svg>
);

export const Back = (p: P) => (
  <svg {...S(p)}>
    <path d="M9 5.5 15.5 12 9 18.5" />
  </svg>
);

export const Chevron = (p: P) => (
  <svg {...S(p)}>
    <path d="m6.5 9.5 5.5 5.5 5.5-5.5" />
  </svg>
);

export const Filter = (p: P) => (
  <svg {...S(p)}>
    <path d="M4 6.5h16M7 12h10M10 17.5h4" />
  </svg>
);

export const Users = (p: P) => (
  <svg {...S(p)}>
    <circle cx="9.4" cy="8.4" r="3.2" />
    <path d="M3.8 19.4c.4-3 2.8-4.8 5.6-4.8s5.2 1.8 5.6 4.8" />
    <path d="M16.2 6.2a3.2 3.2 0 0 1 0 6M18 14.9c2 .5 3.2 2.1 3.4 4.5" />
  </svg>
);

export const Home = (p: P) => (
  <svg {...S(p)}>
    <path d="M4.4 10.6 12 4.4l7.6 6.2V19a1.6 1.6 0 0 1-1.6 1.6H6A1.6 1.6 0 0 1 4.4 19v-8.4Z" />
    <path d="M9.8 20.6v-6h4.4v6" />
  </svg>
);

export const Leaf = (p: P) => (
  <svg {...S(p)}>
    <path d="M5 19c-1.6-6 2-13 14-14 1 8-3.4 14-10 14H5Z" />
    <path d="M9 15c1.6-2.8 4-5 7-6.4" />
  </svg>
);

export const Spark = (p: P) => (
  <svg {...S(p)}>
    <path d="M12 3.4c1 3.6 2.6 5.2 6.2 6.2-3.6 1-5.2 2.6-6.2 6.2-1-3.6-2.6-5.2-6.2-6.2 3.6-1 5.2-2.6 6.2-6.2Z" />
    <path d="m17.8 15.4.7 2.3 2.3.7-2.3.7-.7 2.3-.7-2.3-2.3-.7 2.3-.7.7-2.3Z" />
  </svg>
);

export const Book = (p: P) => (
  <svg {...S(p)}>
    <path d="M4.6 5.2A1.6 1.6 0 0 1 6.2 3.6H18v16.8H6.2a1.6 1.6 0 0 1-1.6-1.6V5.2Z" />
    <path d="M8 7.6h6.4M8 11h6.4M4.6 17.4h13.4" />
  </svg>
);

export const Compass = (p: P) => (
  <svg {...S(p)}>
    <circle cx="12" cy="12" r="8.6" />
    <path d="m14.8 9.2-1.4 4.2-4.2 1.4 1.4-4.2 4.2-1.4Z" />
  </svg>
);

export const Menu = (p: P) => (
  <svg {...S(p)}>
    <path d="M7 3.6v7.2a2.4 2.4 0 0 0 4.8 0V3.6M9.4 10.8v9.6" />
    <path d="M17.4 20.4c1.6-1 2.2-2.6 2.2-6 0-3.6-1-5.4-2.2-5.4s-2.2 1.8-2.2 5.4c0 3.4.6 5 2.2 6Z" />
  </svg>
);

export const Wallet = (p: P) => (
  <svg {...S(p)}>
    <path d="M3.8 7.6A2.2 2.2 0 0 1 6 5.4h11.2a2 2 0 0 1 2 2v1.4" />
    <rect x="3.8" y="7.6" width="16.4" height="11.6" rx="2.4" />
    <circle cx="16" cy="13.4" r="1.3" fill="currentColor" stroke="none" />
  </svg>
);

export const Shield = (p: P) => (
  <svg {...S(p)}>
    <path d="M12 3.4 19 6v5.6c0 4.2-2.8 7.4-7 9-4.2-1.6-7-4.8-7-9V6l7-2.6Z" />
    <path d="m9.2 12 2 2 3.6-3.8" />
  </svg>
);

/** أيقونة الجو حسب اسم المزاج */
export function MoodIcon({ icon, ...rest }: { icon: string } & P) {
  const map: Record<string, FC<P>> = {
    heart: Heart, users: Users, home: Home, leaf: Leaf, spark: Spark,
    book: Book, moon: Moon, sun: Sun, compass: Compass,
  };
  const C = map[icon] ?? Spark;
  return <C {...rest} />;
}
