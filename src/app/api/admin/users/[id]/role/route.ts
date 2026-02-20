import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const bodySchema = z.object({ role: z.enum(["user", "admin"]) });

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || (session.user as { role?: string }).role !== "admin") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
  }
  const { id } = await params;
  let body: { role: "user" | "admin" };
  try {
    body = bodySchema.parse(await _req.json());
  } catch {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }
  await prisma.user.update({
    where: { id },
    data: { role: body.role },
  });
  return NextResponse.json({ ok: true });
}
