import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { prisma } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature");
  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: "Missing signature or secret" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Invalid signature" },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const subId = session.subscription as string;
    let userId: string | undefined;
    let planId: string | undefined;
    if (session.metadata?.userId) userId = session.metadata.userId;
    if (session.metadata?.planId) planId = session.metadata.planId;
    if ((!userId || !planId) && subId) {
      const sub = await stripe.subscriptions.retrieve(subId);
      userId = sub.metadata?.userId;
      planId = sub.metadata?.planId;
    }
    if (userId && planId) {
      await prisma.user.update({
        where: { id: userId },
        data: { planId },
      });
    }
  }

  if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    const planId = (sub.metadata as { planId?: string })?.planId;
    if (planId && sub.status !== "active") {
      const starter = await prisma.plan.findFirst({ where: { slug: "starter" } });
      if (starter) {
        const customerId = sub.customer as string;
        await prisma.user.updateMany({
          where: { stripeCustomerId: customerId },
          data: { planId: starter.id },
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}
