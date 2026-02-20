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

  const heroSection = (
    <section className="relative py-24 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-600 to-brand-500 z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.15)_0%,transparent_50%)] z-0" />
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-6">
          {heroData.title}
        </h1>
        <p className="text-lg text-white/90 mb-10 max-w-2xl mx-auto">
          {heroData.subtitle}
        </p>
        {!session && (
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={heroData.ctaPrimaryUrl || "/register"}
              className="rounded-xl bg-white text-brand-700 font-bold px-8 py-4 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
            >
              {heroData.ctaPrimaryText}
            </Link>
            <Link
              href={heroData.ctaSecondaryUrl || "#plans"}
              className="rounded-xl border-2 border-white/80 text-white font-bold px-8 py-4 hover:bg-white/10 transition-all"
            >
              {heroData.ctaSecondaryText}
            </Link>
          </div>
        )}
        {session && (
          <Link
            href="/dashboard"
            className="inline-block rounded-xl bg-white text-brand-700 font-bold px-8 py-4 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
          >
            Araçlara Git
          </Link>
        )}
      </div>
    </section>
  );

  const plansGrid = (
    <div className="grid gap-6 md:grid-cols-3">
      {plans.map((plan) => (
        <div
          key={plan.id}
          className="rounded-2xl border border-stone-200 bg-white p-6 shadow-soft hover:border-brand-200 hover:shadow-brand transition-all duration-200 flex flex-col"
        >
          <h3 className="text-xl font-semibold text-stone-800">{plan.name}</h3>
          <ul className="mt-4 space-y-2 text-sm text-stone-600 flex-1">
            <li>• {plan.allowedToolTiers.join(", ")} araç erişimi</li>
            <li>• {plan.teamMembersLimit} takım üyesi</li>
            <li>• {plan.brandsLimit} marka</li>
          </ul>
          {!session ? (
            <Link
              href={`/register?plan=${plan.slug}`}
              className="mt-6 block w-full rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 text-center shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
            >
              {plan.slug === "starter" ? "Ücretsiz Başla" : "Bu planı seç"}
            </Link>
          ) : (
            <Link
              href="/dashboard/choose-plan"
              className="mt-6 block w-full rounded-xl border border-stone-200 bg-white text-stone-800 font-medium py-3 text-center hover:bg-stone-50 hover:border-brand-300 transition-all"
            >
              Plan değiştir
            </Link>
          )}
        </div>
      ))}
    </div>
  );

  if (sections.length === 0) {
    return (
      <>
        {heroSection}
        <section id="plans" className="py-16 px-6 border-t border-stone-200/50 bg-white/60 backdrop-blur-md">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-stone-800 text-center mb-4 tracking-tight">
              {pricingData.title}
            </h2>
            <p className="text-stone-600 text-center mb-12 max-w-xl mx-auto">
              {pricingData.subtitle}
            </p>
            {plansGrid}
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
            <section key={section.id} className="relative py-24 px-6 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-600 to-brand-500 z-0" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.15)_0%,transparent_50%)] z-0" />
              <div className="relative z-10 max-w-4xl mx-auto text-center">
                <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-6">
                  {d.title || heroData.title}
                </h1>
                <p className="text-lg text-white/90 mb-10 max-w-2xl mx-auto">
                  {d.subtitle || heroData.subtitle}
                </p>
                {!session && (
                  <div className="flex flex-wrap justify-center gap-4">
                    <Link
                      href={d.ctaPrimaryUrl || heroData.ctaPrimaryUrl || "/register"}
                      className="rounded-xl bg-white text-brand-700 font-bold px-8 py-4 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
                    >
                      {d.ctaPrimaryText || heroData.ctaPrimaryText}
                    </Link>
                    <Link
                      href={d.ctaSecondaryUrl || heroData.ctaSecondaryUrl || "#plans"}
                      className="rounded-xl border-2 border-white/80 text-white font-bold px-8 py-4 hover:bg-white/10 transition-all"
                    >
                      {d.ctaSecondaryText || heroData.ctaSecondaryText}
                    </Link>
                  </div>
                )}
                {session && (
                  <Link
                    href="/dashboard"
                    className="inline-block rounded-xl bg-white text-brand-700 font-bold px-8 py-4 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
                  >
                    Araçlara Git
                  </Link>
                )}
              </div>
            </section>
          );
        }

        if (section.type === "pricing_heading") {
          const d = getSectionData(section);
          return (
            <section
              key={section.id}
              id="plans"
              className="py-16 px-6 border-t border-stone-200/50 bg-white/60 backdrop-blur-md"
            >
              <div className="max-w-5xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-stone-800 text-center mb-4 tracking-tight">
                  {d.title || pricingData.title}
                </h2>
                <p className="text-stone-600 text-center mb-12 max-w-xl mx-auto">
                  {d.subtitle || pricingData.subtitle}
                </p>
                {plansGrid}
              </div>
            </section>
          );
        }

        if (section.type === "custom_block") {
          const d = getSectionData(section);
          return (
            <section
              key={section.id}
              className="py-12 px-6 border-t border-stone-200/50 bg-white/60 backdrop-blur-md"
            >
              <div className="max-w-3xl mx-auto text-center">
                {d.title && (
                  <h2 className="text-2xl font-bold text-stone-800 mb-3 tracking-tight">
                    {d.title}
                  </h2>
                )}
                {d.body && (
                  <p className="text-stone-600 whitespace-pre-wrap">{d.body}</p>
                )}
                {d.imageUrl && (
                  <img
                    src={d.imageUrl}
                    alt=""
                    className="mt-4 rounded-2xl max-w-full h-auto mx-auto shadow-soft"
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
              className="py-16 px-6 border-t border-stone-200/50 bg-white/60 backdrop-blur-md"
            >
              <div className="max-w-5xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-stone-800 text-center mb-4 tracking-tight">
                  {pricingData.title}
                </h2>
                <p className="text-stone-600 text-center mb-12 max-w-xl mx-auto">
                  {pricingData.subtitle}
                </p>
                {plansGrid}
              </div>
            </section>
          );
        }

        return null;
      })}
    </>
  );
}
