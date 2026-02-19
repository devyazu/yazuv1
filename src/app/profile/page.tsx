import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { BillingSection } from "@/components/BillingSection";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const [user, plans] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      include: { plan: true },
    }),
    prisma.plan.findMany({
      where: { active: true, slug: { not: "starter" } },
      orderBy: { order: "asc" },
    }),
  ]);
  if (!user) redirect("/login");

  const isAdmin = (session.user as { role?: string }).role === "admin";

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-[var(--border)] px-6 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="text-xl font-semibold text-white">
          Yazu
        </Link>
        <Link
          href="/dashboard"
          className="text-sm text-zinc-400 hover:text-primary transition"
        >
          ← Dashboard
        </Link>
      </header>
      <main className="p-8 max-w-2xl">
        <h1 className="text-2xl font-semibold text-white mb-6">Profil & Hesap</h1>

        <section className="rounded-xl border border-[var(--border)] bg-surface-card p-6 mb-6">
          <h2 className="text-lg font-medium text-white mb-4">Hesap bilgileri</h2>
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="text-zinc-400">E-posta</dt>
              <dd className="text-white">{user.email}</dd>
            </div>
            <div>
              <dt className="text-zinc-400">Ad</dt>
              <dd className="text-white">{user.name ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-zinc-400">Mevcut plan</dt>
              <dd className="text-white">{user.plan?.name ?? "Starter"}</dd>
            </div>
          </dl>
          {isAdmin && (
            <Link
              href="/admin"
              className="inline-block mt-4 text-primary hover:underline text-sm"
            >
              Admin paneline git →
            </Link>
          )}
        </section>

        <BillingSection
          currentPlanSlug={user.plan?.slug}
          planName={user.plan?.name}
          hasStripeCustomer={!!user.stripeCustomerId}
          upgradePlans={plans}
        />
      </main>
    </div>
  );
}
