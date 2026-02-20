import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function ChoosePlanPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { planId: true },
  });
  if (user?.planId) redirect("/dashboard");

  const plans = await prisma.plan.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold text-foreground mb-2">Plan seçin</h1>
      <p className="text-muted mb-8">
        İhtiyacınıza uygun planı seçerek devam edin. Ücretsiz planla hemen araçları kullanmaya
        başlayabilirsiniz.
      </p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <Link
            key={plan.id}
            href={`/dashboard/checkout?plan=${plan.slug}`}
            className="block rounded-2xl border border-[var(--border)] bg-surface-card p-6 shadow-sm hover:border-primary/50 transition"
          >
            <h2 className="text-xl font-semibold text-foreground">{plan.name}</h2>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              <li>• {plan.allowedToolTiers.join(", ")} araç erişimi</li>
              <li>• {plan.teamMembersLimit} takım üyesi</li>
              <li>• {plan.brandsLimit} marka</li>
            </ul>
            <span className="mt-6 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition">
              {plan.slug === "starter" ? "Ücretsiz başla" : "Seç"}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
