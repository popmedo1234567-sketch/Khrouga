import { NextResponse } from "next/server";
import { db } from "@/db";
import { places } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { isAdminRequest } from "@/lib/auth";
import { parsePlace } from "@/lib/validate";
import { toPlace } from "@/lib/queries";

export const dynamic = "force-dynamic";

const unauthorized = () => NextResponse.json({ error: "لازم تسجل دخول الأدمن الأول" }, { status: 401 });

/** GET /api/admin/places — كل الأماكن بالأحدث تعديلًا */
export async function GET() {
  if (!(await isAdminRequest())) return unauthorized();
  const rows = await db.select().from(places).orderBy(desc(places.updatedAt));
  return NextResponse.json({ places: rows.map(toPlace) });
}

/** POST /api/admin/places — إضافة مكان */
export async function POST(req: Request) {
  if (!(await isAdminRequest())) return unauthorized();
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const { data, error } = parsePlace(body);
  if (!data) return NextResponse.json({ error }, { status: 400 });

  try {
    const [row] = await db.insert(places).values(data).returning();
    return NextResponse.json({ place: toPlace(row) }, { status: 201 });
  } catch (e) {
    // تكرار الـ slug → نضيف رقم ونعيد المحاولة مرة واحدة
    if ((e as { code?: string })?.code === "23505") {
      const [row] = await db.insert(places).values({ ...data, slug: `${data.slug}-${Date.now().toString(36)}` }).returning();
      return NextResponse.json({ place: toPlace(row) }, { status: 201 });
    }
    console.error(e);
    return NextResponse.json({ error: "حصل خطأ أثناء الحفظ" }, { status: 500 });
  }
}

/** PUT /api/admin/places — تعديل مكان (id في الجسم) */
export async function PUT(req: Request) {
  if (!(await isAdminRequest())) return unauthorized();
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const id = Number(body.id);
  if (!id) return NextResponse.json({ error: "id مطلوب" }, { status: 400 });

  const { data, error } = parsePlace(body, id);
  if (!data) return NextResponse.json({ error }, { status: 400 });

  const existing = await db.select({ slug: places.slug }).from(places).where(eq(places.id, id)).limit(1);
  if (!existing[0]) return NextResponse.json({ error: "المكان مش موجود" }, { status: 404 });

  // منغيرش الـ slug لو المستخدم مبعتهوش — يحافظ على الروابط القديمة شغالة
  const patch = body.slug ? data : { ...data, slug: existing[0].slug };
  try {
    const [row] = await db.update(places).set(patch).where(eq(places.id, id)).returning();
    return NextResponse.json({ place: toPlace(row) });
  } catch (e) {
    if ((e as { code?: string })?.code === "23505") {
      const [row] = await db.update(places).set({ ...patch, slug: `${patch.slug}-${Date.now().toString(36)}` }).where(eq(places.id, id)).returning();
      return NextResponse.json({ place: toPlace(row) });
    }
    console.error(e);
    return NextResponse.json({ error: "حصل خطأ أثناء الحفظ" }, { status: 500 });
  }
}
