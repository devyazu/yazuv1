import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const plans = await prisma.plan.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <header className="border-b border-[var(--border)] bg-surface-elevated px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-semibold text-foreground">
          Yazu
        </Link>
        <nav className="flex items-center gap-4">
          {session ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm text-muted hover:text-primary transition"
              >
                Dashboard
              </Link>
              <Link
                href="/profile"
                className="text-sm text-muted hover:text-primary transition"
              >
                Profil
              </Link>
              <Link
                href="/api/auth/signout"
                className="text-sm text-muted hover:text-primary transition"
              >
                Çıkış
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-muted hover:text-primary transition"
              >
                Giriş
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition"
              >
                Kayıt Ol
              </Link>
            </>
          )}
        </nav>
      </header>

      {/* Hero */}
      <section className="py-20 px-6 text-center max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight mb-6">
          Smart mind for your business
        </h1>
        <p className="text-lg text-muted mb-10 max-w-2xl mx-auto">
          AI ile markanızın sesine uygun metinler üretin. Copywriting ve içerik araçlarıyla
          daha hızlı, tutarlı ve etkili çıktılar alın.
        </p>
        {!session && (
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="rounded-xl bg-primary px-8 py-4 text-lg font-medium text-primary-foreground hover:opacity-90 transition shadow-sm"
            >
              Ücretsiz Başla
            </Link>
            <Link
              href="#plans"
              className="rounded-xl border-2 border-[var(--border)] px-8 py-4 text-lg font-medium text-foreground hover:border-primary hover:text-primary transition"
            >
              Planları İncele
            </Link>
          </div>
        )}
        {session && (
          <Link
            href="/dashboard"
            className="inline-block rounded-xl bg-primary px-8 py-4 text-lg font-medium text-primary-foreground hover:opacity-90 transition shadow-sm"
          >
            Araçlara Git
          </Link>
        )}
      </section>

      {/* Plans */}
      <section id="plans" className="py-16 px-6 border-t border-[var(--border)] bg-surface-elevated">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-4">
            Üyelik paketleri
          </h2>
          <p className="text-muted text-center mb-12 max-w-xl mx-auto">
            İhtiyacınıza uygun planı seçin, hemen başlayın.
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="rounded-2xl border border-[var(--border)] bg-surface-card p-6 shadow-sm flex flex-col"
              >
                <h3 className="text-xl font-semibold text-foreground">{plan.name}</h3>
                <ul className="mt-4 space-y-2 text-sm text-muted flex-1">
                  <li>• {plan.allowedToolTiers.join(", ")} araç erişimi</li>
                  <li>• {plan.teamMembersLimit} takım üyesi</li>
                  <li>• {plan.brandsLimit} marka</li>
                </ul>
                {!session ? (
                  <Link
                    href={`/register?plan=${plan.slug}`}
                    className="mt-6 block w-full rounded-lg bg-primary py-3 text-center font-medium text-primary-foreground hover:opacity-90 transition"
                  >
                    {plan.slug === "starter" ? "Ücretsiz Başla" : "Bu planı seç"}
                  </Link>
                ) : (
                  <Link
                    href="/dashboard/choose-plan"
                    className="mt-6 block w-full rounded-lg border border-[var(--border)] py-3 text-center font-medium text-foreground hover:bg-black/5 transition"
                  >
                    Plan değiştir
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-8 px-6 border-t border-[var(--border)] text-center text-sm text-muted">
        © {new Date().getFullYear()} Yazu. Tüm hakları saklıdır.
      </footer>
    </div>
  );
}
