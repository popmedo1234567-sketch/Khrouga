import { NextResponse } from "next/server";
import { db } from "@/db";
import { places } from "@/db/schema";
import { eq } from "drizzle-orm";
import { isAdminRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** DELETE /api/admin/places/:id */
export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "لازم تسجل دخول الأدمن الأول" }, { status: 401 });
  }
  const id = Number((await ctx.params).id);
  if (!id) return NextResponse.json({ error: "id مش صالح" }, { status: 400 });

  const deleted = await db.delete(places).where(eq(places.id, id)).returning({ id: places.id });
  if (!deleted.length) return NextResponse.json({ error: "المكان مش موجود" }, { status: 404 });
  return NextResponse.json({ ok: true, id });
}
