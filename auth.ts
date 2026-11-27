import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/** حماية صفحة الأدمن بكلمة سر + كوكي موقّع (من غير مكتبة خارجية) */
export const ADMIN_COOKIE = "khrouga_admin";
const TTL_SECONDS = 60 * 60 * 24 * 7;

const production = process.env.NODE_ENV === "production";

/** في الإنتاج لازم الاتنين يتحددوا صراحةً؛ التطوير المحلي فقط له قيم افتراضية. */
export const adminConfigured = () =>
  !production || Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET);

const secret = () => process.env.ADMIN_SESSION_SECRET || (production ? "" : "khrouga-dev-secret");
export const adminPassword = () => process.env.ADMIN_PASSWORD || (production ? "" : "khrouga2026");

const sign = (payload: string) => createHmac("sha256", secret()).update(payload).digest("base64url");

export function makeToken() {
  const exp = String(Math.floor(Date.now() / 1000) + TTL_SECONDS);
  return `${exp}.${sign(exp)}`;
}

export function verifyToken(token?: string | null): boolean {
  if (!adminConfigured() || !token) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig) return false;
  if (Number(exp) < Math.floor(Date.now() / 1000)) return false;
  const expected = Buffer.from(sign(exp));
  const actual = Buffer.from(sig);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

/** هل الطلب الحالي من أدمن مسجّل دخول؟ */
export async function isAdminRequest(): Promise<boolean> {
  const jar = await cookies();
  return verifyToken(jar.get(ADMIN_COOKIE)?.value);
}

export const adminCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: TTL_SECONDS,
};
