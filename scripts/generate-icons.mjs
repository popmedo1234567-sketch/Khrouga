/**
 * توليد أيقونات الـ PWA من public/icon-src.png
 * التشغيل: node scripts/generate-icons.mjs   (يحتاج sharp: npm i -D sharp)
 * الأيقونات متولدة ومرفوعة بالفعل في public/ — السكريبت ده للتعديل المستقبلي.
 */
import sharp from "sharp";

const SRC = "public/icon-src.png";
const BG = { r: 255, g: 106, b: 69, alpha: 1 };

const tasks = [
  ["public/icon-192.png", 192],
  ["public/icon-512.png", 512],
  ["public/apple-touch-icon.png", 180],
];

for (const [out, size] of tasks) {
  await sharp(SRC).resize(size, size, { fit: "cover" }).png().toFile(out);
  console.log("✓", out);
}

// نسخة maskable: العلامة جوه المنطقة الآمنة (72%) مع خلفية صلبة
const inner = await sharp(SRC).resize(368, 368, { fit: "cover" }).png().toBuffer();
await sharp({ create: { width: 512, height: 512, channels: 4, background: BG } })
  .composite([{ input: inner, gravity: "center" }])
  .png()
  .toFile("public/icon-maskable-512.png");
console.log("✓ public/icon-maskable-512.png");
