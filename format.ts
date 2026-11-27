import type { MenuItem, Place } from "./constants";

/** "آخر تحديث من كام يوم؟" باللهجة المصرية */
export function updatedLabel(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days <= 0) return "اتحدّث النهاردة";
  if (days === 1) return "اتحدّث إمبارح";
  if (days < 7) return `اتحدّث من ${days} أيام`;
  if (days < 14) return "اتحدّث من أسبوع";
  if (days < 30) return `اتحدّث من ${Math.floor(days / 7)} أسابيع`;
  return `اتحدّث من ${Math.floor(days / 30)} شهر`;
}

/** هل السعر "قديم" ومحتاج مراجعة؟ (أكتر من أسبوعين) */
export const isStale = (iso: string) => Date.now() - new Date(iso).getTime() > 14 * 86_400_000;

export const money = (n: number) => `${Math.round(n).toLocaleString("en-US")}`;

/** نطاق سعر تقريبي عشان المستخدم يفهم مستوى المكان بسرعة */
export function priceLevel(avgPrice: number) {
  if (avgPrice <= 100) return { label: "اقتصادي", symbol: "$" };
  if (avgPrice <= 250) return { label: "متوسط", symbol: "$$" };
  if (avgPrice <= 450) return { label: "فوق المتوسط", symbol: "$$$" };
  return { label: "فاخر", symbol: "$$$$" };
}

export function waLink(number: string, message: string) {
  return `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}

/** رسالة الحجز الجاهزة على واتساب */
export function bookingMessage(place: Place, picked: MenuItem[] = [], people = 2, when = "النهاردة") {
  const lines = [
    `السلام عليكم 👋 لقيتكم على تطبيق "خروجة"`,
    `عايز أحجز في ${place.name} – ${place.area}`,
    `العدد: ${people} أفراد · الموعد: ${when}`,
  ];
  if (picked.length) {
    const total = picked.reduce((s, i) => s + i.price, 0);
    lines.push("", "الطلب المبدئي:", ...picked.map((i) => `• ${i.name} — ${money(i.price)} ج`), `الإجمالي المتوقع: ${money(total)} ج`);
  }
  lines.push("", "ممكن تأكيد الحجز والأسعار الحالية؟");
  return lines.join("\n");
}
