import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { HomeSections } from "@/components/HomeSections";

const DEFAULT_HERO = {
  title: "Smart mind for your business",
  subtitle:
    "AI ile markanızın sesine uygun metinler üretin. Copywriting ve içerik araçlarıyla daha hızlı, tutarlı ve etkili çıktılar alın.",
  ctaPrimaryText: "Ücretsiz Başla",
  ctaPrimaryUrl: "/register",
  ctaSecondaryText: "Planları İncele",
  ctaSecondaryUrl: "#plans",
};

const DEFAULT_PRICING_HEADING = {
  title: "Üyelik paketleri",
  subtitle: "İhtiyacınıza uygun planı seçin, hemen başlayın.",
};

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const [sections, plans] = await Promise.all([
    prisma.homeSection.findMany({
      where: { page: "home" },
      orderBy: { order: "asc" },
    }),
    prisma.plan.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
    }),
  ]);

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

      <HomeSections
        sections={sections}
        plans={plans}
        session={!!session}
        defaultHero={DEFAULT_HERO}
        defaultPricingHeading={DEFAULT_PRICING_HEADING}
      />

      <footer className="py-8 px-6 border-t border-[var(--border)] text-center text-sm text-muted">
        © {new Date().getFullYear()} Yazu. Tüm hakları saklıdır.
      </footer>
    </div>
  );
}
