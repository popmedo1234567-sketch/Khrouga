import { NextResponse } from "next/server";
import { ADMIN_COOKIE, adminConfigured, adminCookieOptions, adminPassword, makeToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** POST /api/admin/login — { password } → كوكي جلسة */
export async function POST(req: Request) {
  if (!adminConfigured()) {
    return NextResponse.json({ error: "اضبط ADMIN_PASSWORD و ADMIN_SESSION_SECRET في إعدادات السيرفر" }, { status: 503 });
  }
  const { password } = (await req.json().catch(() => ({}))) as { password?: string };
  if (!password || password !== adminPassword()) {
    return NextResponse.json({ error: "كلمة السر غلط" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, makeToken(), adminCookieOptions);
  return res;
}
