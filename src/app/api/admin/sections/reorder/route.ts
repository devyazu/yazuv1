import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

function isAdmin(session: { user?: { role?: string } } | null) {
  return session?.user && (session.user as { role?: string }).role === "admin";
}

const bodySchema = z.object({
  ids: z.array(z.string().min(1)),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });

  const body = bodySchema.safeParse(await req.json());
  if (!body.success) return NextResponse.json({ error: "Geçersiz veri" }, { status: 400 });

  await Promise.all(
    body.data.ids.map((id, index) =>
      prisma.homeSection.update({
        where: { id },
        data: { order: index },
      })
    )
  );
  return NextResponse.json({ ok: true });
}
