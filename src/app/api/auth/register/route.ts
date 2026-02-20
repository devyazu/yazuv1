import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/db";

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name } = bodySchema.parse(body);
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Bu e-posta adresi zaten kayıtlı." },
        { status: 400 }
      );
    }
    const passwordHash = await hash(password, 12);
    const freePlan = await prisma.plan.findFirst({
      where: { slug: "starter" },
    });
    const user = await prisma.user.create({
      data: {
        email,
        name: name ?? null,
        passwordHash,
        planId: freePlan?.id ?? null,
      },
    });
    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
    });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json(
        { error: e.errors.map((x) => x.message).join(", ") },
        { status: 400 }
      );
    }
    console.error("Register error:", e);
    const message = e instanceof Error ? e.message : "Kayıt sırasında bir hata oluştu.";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
