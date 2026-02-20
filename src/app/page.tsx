import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { HomeSections } from "@/components/HomeSections";
import { CanvasLayout } from "@/components/CanvasLayout";
import { SiteHeader } from "@/components/SiteHeader";

const DEFAULT_HERO = {
  title: "What will you create today?",
  subtitle:
    "100+ AI araç ile markanızın sesine uygun metinler, satış performansı ve içerik üretin. Copywriting, pazarlama ve çoklu marka yönetimi tek yerde.",
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
    <CanvasLayout>
      <SiteHeader />

      <HomeSections
        sections={sections}
        plans={plans}
        session={!!session}
        defaultHero={DEFAULT_HERO}
        defaultPricingHeading={DEFAULT_PRICING_HEADING}
      />

      <footer className="py-8 px-6 border-t border-stone-200/50 text-center text-sm text-stone-500">
        © {new Date().getFullYear()} yazu. Tüm hakları saklıdır.
      </footer>
    </CanvasLayout>
  );
}
