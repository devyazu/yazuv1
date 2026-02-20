import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { CheckoutClient } from "./CheckoutClient";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const { plan: planSlug } = await searchParams;
  if (!planSlug) redirect("/dashboard/choose-plan");

  const plan = await prisma.plan.findFirst({
    where: { slug: planSlug, active: true },
  });
  if (!plan) redirect("/dashboard/choose-plan");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { planId: true },
  });
  if (user?.planId) redirect("/dashboard");

  return (
    <div className="p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold text-foreground mb-2">Plan: {plan.name}</h1>
      <p className="text-muted mb-6">
        {plan.allowedToolTiers.join(", ")} araç · {plan.teamMembersLimit} takım üyesi ·{" "}
        {plan.brandsLimit} marka
      </p>
      <CheckoutClient
        planSlug={plan.slug}
        planName={plan.name}
        hasStripeMonthly={!!plan.stripePriceIdMonthly}
        hasStripeYearly={!!plan.stripePriceIdYearly}
        monthlyCents={plan.monthlyAmountCents ?? undefined}
        yearlyCents={plan.yearlyAmountCents ?? undefined}
      />
    </div>
  );
}
