import type { Metadata } from "next";
import { isAdminRequest } from "@/lib/auth";
import { loadCatalog } from "@/lib/loader";
import AdminLogin from "@/components/admin-login";
import AdminPanel from "@/components/admin-panel";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "لوحة التحكم", robots: { index: false, follow: false } };

/** صفحة الأدمن: محمية بكلمة سر من البيئة ADMIN_PASSWORD */
export default async function AdminPage({ searchParams }: { searchParams: Promise<{ new?: string }> }) {
  const authed = await isAdminRequest();
  if (!authed) return <AdminLogin />;

  const { places, areas } = await loadCatalog();
  const sp = await searchParams;
  const allowDemo = process.env.NODE_ENV !== "production" || process.env.ENABLE_DEMO_SEED === "true";
  return <AdminPanel places={places} areas={areas} openNew={sp.new === "1"} allowDemo={allowDemo} />;
}
