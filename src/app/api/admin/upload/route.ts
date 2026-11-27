import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth";
import { hasSupabaseStorage, storeImage, supabaseConfig } from "@/lib/storage";
import { slugify } from "@/lib/constants";

export const dynamic = "force-dynamic";

/**
 * POST /api/admin/upload — { dataUrl, name }
 * بيرفع على Supabase Storage لو متظبط، وإلا بيرجع الصورة كـ data URL تُخزَّن في نفس العمود.
 */
export async function POST(req: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "لازم تسجل دخول الأدمن الأول" }, { status: 401 });
  }
  const body = (await req.json().catch(() => ({}))) as { dataUrl?: string; name?: string };
  if (!body.dataUrl?.startsWith("data:image/")) {
    return NextResponse.json({ error: "محتاج صورة صالحة" }, { status: 400 });
  }
  try {
    const url = await storeImage(body.dataUrl, slugify(body.name ?? "place", "place"));
    return NextResponse.json({ url, provider: hasSupabaseStorage() ? "supabase" : "database" });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

/** GET /api/admin/upload — حالة التخزين الحالية */
export async function GET() {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { bucket } = supabaseConfig();
  return NextResponse.json({ provider: hasSupabaseStorage() ? "supabase" : "database", bucket });
}
