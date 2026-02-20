import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const bodySchema = z.object({ planSlug: z.string().min(1) });

/** Plan atama (ödeme olmadan; Stripe öncesi veya ücretsiz plan için). */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: { planSlug: string };
  try {
    body = bodySchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  const plan = await prisma.plan.findFirst({
    where: { slug: body.planSlug, active: true },
  });
  if (!plan) {
    return NextResponse.json({ error: "Plan bulunamadı." }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { planId: plan.id },
  });

  return NextResponse.json({ ok: true, planSlug: plan.slug });
}
