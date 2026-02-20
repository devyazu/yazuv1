import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

function isAdmin(session: { user?: { role?: string } } | null) {
  return session?.user && (session.user as { role?: string }).role === "admin";
}

const createSchema = z.object({
  page: z.string().default("home"),
  type: z.enum(["hero", "pricing_heading", "custom_block", "plans"]),
  order: z.number().int().min(0),
  data: z.record(z.unknown()),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });

  const sections = await prisma.homeSection.findMany({
    where: { page: "home" },
    orderBy: { order: "asc" },
  });
  return NextResponse.json(sections);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz veri", details: parsed.error.flatten() }, { status: 400 });
  }

  const section = await prisma.homeSection.create({
    data: {
      page: parsed.data.page,
      type: parsed.data.type,
      order: parsed.data.order,
      data: parsed.data.data as object,
    },
  });
  return NextResponse.json(section);
}
