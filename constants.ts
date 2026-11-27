/** ثوابت الفلترة والأنواع المشتركة بين السيرفر والكلاينت */

export type MenuItem = { name: string; price: number; note?: string };

export type Place = {
  id: number;
  slug: string;
  name: string;
  area: string;
  address: string;
  type: string;
  moods: string[];
  tags: string[];
  avgPrice: number;
  menuItems: MenuItem[];
  imageUrl: string | null;
  gallery: string[];
  reelUrl: string | null;
  whatsapp: string | null;
  mapsUrl: string | null;
  rating: number;
  hours: string | null;
  notes: string | null;
  featured: boolean;
  updatedAt: string;
};

export const MOODS = [
  { id: "رومانسي", icon: "heart", hint: "ديت وقعدة هادية" },
  { id: "شلة", icon: "users", hint: "لمة الأصحاب" },
  { id: "عائلي", icon: "home", hint: "مناسب للعيلة والأطفال" },
  { id: "هادي", icon: "leaf", hint: "موسيقى واطية وتركيز" },
  { id: "دوشة", icon: "spark", hint: "حيوية وزحمة لذيذة" },
  { id: "شغل ومذاكرة", icon: "book", hint: "واي فاي وترابيزات" },
  { id: "سهرة", icon: "moon", hint: "لحد متأخر" },
  { id: "صباحي", icon: "sun", hint: "فطار وبدري" },
  { id: "مغامرة", icon: "compass", hint: "حاجة جديدة تجربها" },
] as const;

export const TYPES = [
  { id: "كافيه", emoji: "☕" },
  { id: "مطعم", emoji: "🍽️" },
  { id: "أكل سريع", emoji: "🍔" },
  { id: "حلويات", emoji: "🍰" },
  { id: "روف توب", emoji: "🌆" },
  { id: "قعدة", emoji: "🫖" },
  { id: "ترفيه", emoji: "🎳" },
  { id: "أوت دور", emoji: "⛵" },
  { id: "فطار", emoji: "🍳" },
] as const;

export const TAG_PRESETS = [
  "يفتح بدري",
  "يفتح ٢٤ ساعة",
  "فيه ركن أطفال",
  "موسيقى لايف",
  "واي فاي سريع",
  "باركينج سهل",
  "فيو نيل",
  "حجز مسبق",
  "دليفري",
  "شاشة مباراة",
  "خارجي / تراس",
];

export const BUDGET = { min: 50, max: 800, step: 10 };

export const SORTS = [
  { id: "smart", label: "الأنسب ليك" },
  { id: "price-asc", label: "الأقل سعرًا" },
  { id: "price-desc", label: "الأعلى سعرًا" },
  { id: "rating", label: "الأعلى تقييمًا" },
  { id: "new", label: "الأحدث تحديثًا" },
] as const;

export type SortId = (typeof SORTS)[number]["id"];

export type Filters = {
  q: string;
  area: string; // "" = الكل
  budget: number;
  moods: string[];
  types: string[];
  sort: SortId;
};

export const DEFAULT_FILTERS: Filters = {
  q: "",
  area: "",
  budget: BUDGET.max,
  moods: [],
  types: [],
  sort: "smart",
};

/** تحويل الاسم العربي إلى slug لاتيني بسيط وآمن في الرابط */
export function slugify(input: string, fallback = "place"): string {
  const arabicMap: Record<string, string> = {
    "ا": "a", "أ": "a", "إ": "i", "آ": "aa", "ب": "b", "ت": "t", "ث": "th", "ج": "g",
    "ح": "h", "خ": "kh", "د": "d", "ذ": "z", "ر": "r", "ز": "z", "س": "s", "ش": "sh",
    "ص": "s", "ض": "d", "ط": "t", "ظ": "z", "ع": "a", "غ": "gh", "ف": "f", "ق": "q",
    "ك": "k", "ل": "l", "م": "m", "ن": "n", "ه": "h", "ة": "h", "و": "w", "ي": "y",
    "ى": "a", "ء": "", "ؤ": "o", "ئ": "e",
  };
  const latin = input
    .split("")
    .map((c) => arabicMap[c] ?? c)
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return latin || fallback;
}

export const EGP = (n: number) => `${n.toLocaleString("en-EG")} ج`;

/** أرقام عربية لعرض الأسعار بشكل مصري */
export const toArabicDigits = (v: string | number) =>
  String(v).replace(/[0-9]/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)]);
