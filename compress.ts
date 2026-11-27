"use client";

/** تصغير الصورة في المتصفح قبل رفعها (توفير في التخزين والباندويث) */
export async function compressImage(file: File, maxSize = 1400, quality = 0.78): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("مقدرناش نقرأ الملف"));
    reader.readAsDataURL(file);
  });

  // لو الصورة صغيرة أصلًا ابعته زي ما هو
  if (dataUrl.length < 180_000) return dataUrl;

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error("ملف مش صورة صالحة"));
    el.src = dataUrl;
  });

  const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) return dataUrl;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", quality);
}
