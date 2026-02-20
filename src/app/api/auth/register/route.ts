import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { z } from "zod";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/email";

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).optional(),
  plan: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name, plan: planSlug } = bodySchema.parse(body);
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Bu e-posta adresi zaten kayıtlı." },
        { status: 400 }
      );
    }
    const passwordHash = await hash(password, 12);
    const validPlan = planSlug
      ? await prisma.plan.findFirst({ where: { slug: planSlug, active: true } })
      : null;
    const user = await prisma.user.create({
      data: {
        email,
        name: name ?? null,
        passwordHash,
        planId: null,
      },
    });
    const verificationToken = randomBytes(32).toString("hex");
    await prisma.verificationToken.create({
      data: {
        identifier: user.id,
        token: verificationToken,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });
    const base = process.env.NEXTAUTH_URL || "";
    const verifyUrl = `${base}/api/auth/verify-email?token=${verificationToken}`;
    const emailSent = await sendVerificationEmail(user.email, verifyUrl);
    if (!emailSent) {
      console.warn("SMTP not configured or failed; verification email not sent for", user.email);
    }
    const nextPath = validPlan
      ? `/dashboard/checkout?plan=${validPlan.slug}`
      : "/dashboard/choose-plan";
    const redirectUrl = `/login?registered=1&callbackUrl=${encodeURIComponent(nextPath)}`;
    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      redirect: redirectUrl,
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
