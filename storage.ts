/**
 * رفع الصور:
 * - لو متظبط Supabase Storage → بيرفع على البكت ويرجع الرابط العام.
 * - لو مش متظبط (وضع مجاني/محلي) → بيخزّن الصورة كـ data URL مضغوطة في نفس العمود.
 */
const MAX_BYTES = 3 * 1024 * 1024;

export const supabaseConfig = () => ({
  url: process.env.SUPABASE_URL?.replace(/\/$/, "") ?? "",
  key: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  bucket: process.env.SUPABASE_STORAGE_BUCKET ?? "places",
});

export const hasSupabaseStorage = () => {
  const { url, key } = supabaseConfig();
  return Boolean(url && key);
};

export function parseDataUrl(dataUrl: string) {
  const match = /^data:(image\/[a-z+]+);base64,(.+)$/i.exec(dataUrl);
  if (!match) throw new Error("ملف الصورة مش صالح");
  const buffer = Buffer.from(match[2], "base64");
  if (buffer.byteLength > MAX_BYTES) throw new Error("الصورة أكبر من ٣ ميجا");
  return { contentType: match[1], buffer };
}

/** بيرجع الرابط النهائي اللي يتخزن في places.image_url */
export async function storeImage(dataUrl: string, slug: string): Promise<string> {
  const { url, key, bucket } = supabaseConfig();
  if (!hasSupabaseStorage()) return dataUrl;

  const { contentType, buffer } = parseDataUrl(dataUrl);
  const ext = contentType.includes("png") ? "png" : contentType.includes("webp") ? "webp" : "jpg";
  const path = `places/${slug}-${Date.now()}.${ext}`;

  const res = await fetch(`${url}/storage/v1/object/${bucket}/${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": contentType,
      "x-upsert": "true",
    },
    body: new Uint8Array(buffer),
  });
  if (!res.ok) throw new Error(`Supabase Storage فشل: ${res.status}`);
  return `${url}/storage/v1/object/public/${bucket}/${path}`;
}
