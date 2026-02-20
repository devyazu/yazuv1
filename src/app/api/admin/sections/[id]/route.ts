import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

function isAdmin(session: { user?: { role?: string } } | null) {
  return session?.user && (session.user as { role?: string }).role === "admin";
}

const updateSchema = z.object({
  type: z.enum(["hero", "pricing_heading", "custom_block", "plans"]).optional(),
  order: z.number().int().min(0).optional(),
  data: z.record(z.unknown()).optional(),
});

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });

  const { id } = await params;
  const body = await _req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz veri" }, { status: 400 });
  }

  const section = await prisma.homeSection.update({
    where: { id },
    data: {
      ...(parsed.data.type != null && { type: parsed.data.type }),
      ...(parsed.data.order != null && { order: parsed.data.order }),
      ...(parsed.data.data != null && { data: parsed.data.data as object }),
    },
  });
  return NextResponse.json(section);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });

  const { id } = await params;
  await prisma.homeSection.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
