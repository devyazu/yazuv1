import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: { interval?: "monthly" | "yearly"; planSlug?: string };
  try {
    body = await req.json();
  } catch {
    body = {};
  }
  const interval = body.interval === "yearly" ? "yearly" : "monthly";
  const planSlug = ["starter", "growth", "scale"].includes(body.planSlug ?? "")
    ? body.planSlug
    : "growth";

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { plan: true },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const plan = await prisma.plan.findFirst({
    where: { slug: planSlug, active: true },
  });
  if (!plan) {
    return NextResponse.json(
      { error: "Plan bulunamadı. Stripe’da fiyatları oluşturun." },
      { status: 400 }
    );
  }

  const priceId =
    interval === "yearly" ? plan.stripePriceIdYearly : plan.stripePriceIdMonthly;
  if (!priceId) {
    return NextResponse.json(
      { error: `Bu plan için ${interval} fiyat ID’si tanımlı değil.` },
      { status: 400 }
    );
  }

  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name ?? undefined,
    });
    customerId = customer.id;
    await prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId: customerId },
    });
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXTAUTH_URL}/profile?success=1`,
    cancel_url: `${process.env.NEXTAUTH_URL}/profile?cancel=1`,
    subscription_data: {
      metadata: { userId: user.id, planId: plan.id },
    },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
