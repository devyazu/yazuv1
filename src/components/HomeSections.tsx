import Link from "next/link";

type Section = {
  id: string;
  type: string;
  order: number;
  data: unknown;
};

type Plan = {
  id: string;
  name: string;
  slug: string;
  allowedToolTiers: string[];
  teamMembersLimit: number;
  brandsLimit: number;
};

const DEFAULT_HERO = {
  title: "Smart mind for your business",
  subtitle:
    "AI ile markanızın sesine uygun metinler üretin. Copywriting ve içerik araçlarıyla daha hızlı, tutarlı ve etkili çıktılar alın.",
  ctaPrimaryText: "Ücretsiz Başla",
  ctaPrimaryUrl: "/register",
  ctaSecondaryText: "Planları İncele",
  ctaSecondaryUrl: "#plans",
};

const DEFAULT_PRICING = {
  title: "Üyelik paketleri",
  subtitle: "İhtiyacınıza uygun planı seçin, hemen başlayın.",
};

export function HomeSections({
  sections,
  plans,
  session,
  defaultHero,
  defaultPricingHeading,
}: {
  sections: Section[];
  plans: Plan[];
  session: boolean;
  defaultHero: Record<string, string>;
  defaultPricingHeading: Record<string, string>;
}) {
  const heroData = defaultHero;
  const pricingData = defaultPricingHeading;

  const getSectionData = (s: Section) => (s.data as Record<string, string>) ?? {};

  if (sections.length === 0) {
    return (
      <>
        <section className="py-20 px-6 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight mb-6">
            {heroData.title}
          </h1>
          <p className="text-lg text-muted mb-10 max-w-2xl mx-auto">{heroData.subtitle}</p>
          {!session && (
            <div className="flex flex-wrap justify-center gap-4">
              <Link href={heroData.ctaPrimaryUrl || "/register"} className="rounded-xl bg-primary px-8 py-4 text-lg font-medium text-primary-foreground hover:opacity-90 transition shadow-sm">
                {heroData.ctaPrimaryText}
              </Link>
              <Link href={heroData.ctaSecondaryUrl || "#plans"} className="rounded-xl border-2 border-[var(--border)] px-8 py-4 text-lg font-medium text-foreground hover:border-primary hover:text-primary transition">
                {heroData.ctaSecondaryText}
              </Link>
            </div>
          )}
          {session && (
            <Link href="/dashboard" className="inline-block rounded-xl bg-primary px-8 py-4 text-lg font-medium text-primary-foreground hover:opacity-90 transition shadow-sm">
              Araçlara Git
            </Link>
          )}
        </section>
        <section id="plans" className="py-16 px-6 border-t border-[var(--border)] bg-surface-elevated">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-4">{pricingData.title}</h2>
            <p className="text-muted text-center mb-12 max-w-xl mx-auto">{pricingData.subtitle}</p>
            <div className="grid gap-6 md:grid-cols-3">
              {plans.map((plan) => (
                <div key={plan.id} className="rounded-2xl border border-[var(--border)] bg-surface-card p-6 shadow-sm flex flex-col">
                  <h3 className="text-xl font-semibold text-foreground">{plan.name}</h3>
                  <ul className="mt-4 space-y-2 text-sm text-muted flex-1">
                    <li>• {plan.allowedToolTiers.join(", ")} araç erişimi</li>
                    <li>• {plan.teamMembersLimit} takım üyesi</li>
                    <li>• {plan.brandsLimit} marka</li>
                  </ul>
                  {!session ? (
                    <Link href={`/register?plan=${plan.slug}`} className="mt-6 block w-full rounded-lg bg-primary py-3 text-center font-medium text-primary-foreground hover:opacity-90 transition">
                      {plan.slug === "starter" ? "Ücretsiz Başla" : "Bu planı seç"}
                    </Link>
                  ) : (
                    <Link href="/dashboard/choose-plan" className="mt-6 block w-full rounded-lg border border-[var(--border)] py-3 text-center font-medium text-foreground hover:bg-black/5 transition">
                      Plan değiştir
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      {sections.map((section) => {
        if (section.type === "hero") {
          const d = getSectionData(section);
          return (
            <section key={section.id} className="py-20 px-6 text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight mb-6">
                {d.title || heroData.title}
              </h1>
              <p className="text-lg text-muted mb-10 max-w-2xl mx-auto">
                {d.subtitle || heroData.subtitle}
              </p>
              {!session && (
                <div className="flex flex-wrap justify-center gap-4">
                  <Link
                    href={d.ctaPrimaryUrl || heroData.ctaPrimaryUrl || "/register"}
                    className="rounded-xl bg-primary px-8 py-4 text-lg font-medium text-primary-foreground hover:opacity-90 transition shadow-sm"
                  >
                    {d.ctaPrimaryText || heroData.ctaPrimaryText}
                  </Link>
                  <Link
                    href={d.ctaSecondaryUrl || heroData.ctaSecondaryUrl || "#plans"}
                    className="rounded-xl border-2 border-[var(--border)] px-8 py-4 text-lg font-medium text-foreground hover:border-primary hover:text-primary transition"
                  >
                    {d.ctaSecondaryText || heroData.ctaSecondaryText}
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
          );
        }

        if (section.type === "pricing_heading") {
          const d = getSectionData(section);
          return (
            <section
              key={section.id}
              id="plans"
              className="py-16 px-6 border-t border-[var(--border)] bg-surface-elevated"
            >
              <div className="max-w-5xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-4">
                  {d.title || pricingData.title}
                </h2>
                <p className="text-muted text-center mb-12 max-w-xl mx-auto">
                  {d.subtitle || pricingData.subtitle}
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
          );
        }

        if (section.type === "custom_block") {
          const d = getSectionData(section);
          return (
            <section
              key={section.id}
              className="py-12 px-6 border-t border-[var(--border)] bg-surface-elevated"
            >
              <div className="max-w-3xl mx-auto text-center">
                {d.title && (
                  <h2 className="text-2xl font-bold text-foreground mb-3">{d.title}</h2>
                )}
                {d.body && (
                  <p className="text-muted whitespace-pre-wrap">{d.body}</p>
                )}
                {d.imageUrl && (
                  <img
                    src={d.imageUrl}
                    alt=""
                    className="mt-4 rounded-xl max-w-full h-auto mx-auto"
                  />
                )}
              </div>
            </section>
          );
        }

        if (section.type === "plans") {
          return (
            <section
              key={section.id}
              id="plans"
              className="py-16 px-6 border-t border-[var(--border)] bg-surface-elevated"
            >
              <div className="max-w-5xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-4">
                  {pricingData.title}
                </h2>
                <p className="text-muted text-center mb-12 max-w-xl mx-auto">
                  {pricingData.subtitle}
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
          );
        }

        return null;
      })}
    </>
  );
}
