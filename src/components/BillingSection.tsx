"use client";

import { useState } from "react";

type Plan = {
  id: string;
  name: string;
  slug: string;
  stripePriceIdMonthly: string | null;
  stripePriceIdYearly: string | null;
};

export function BillingSection({
  currentPlanSlug,
  planName,
  hasStripeCustomer,
  upgradePlans,
}: {
  currentPlanSlug?: string | null;
  planName?: string | null;
  hasStripeCustomer: boolean;
  upgradePlans: Plan[];
}) {
  const [loading, setLoading] = useState(false);

  async function handleManageBilling() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert("Fatura merkezine yönlendirilemedi. Lütfen önce bir plan satın alın.");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpgrade(planSlug: string, interval: "monthly" | "yearly") {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planSlug, interval }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert(data.error || "Ödeme sayfası açılamadı.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-xl border border-[var(--border)] bg-surface-card p-6 shadow-sm">
      <h2 className="text-lg font-medium text-foreground mb-4">Fatura & Ödeme</h2>
      <p className="text-sm text-muted mb-4">
        Planınız: <span className="text-foreground">{planName ?? "Starter"}</span>. Kart bilgileri
        Stripe üzerinde güvende tutulur; recurring ödemeler otomatik alınır.
      </p>
      <div className="space-y-3">
        {upgradePlans.map((plan) => {
          const isCurrent = plan.slug === currentPlanSlug;
          const hasMonthly = !!plan.stripePriceIdMonthly;
          const hasYearly = !!plan.stripePriceIdYearly;
          if (!hasMonthly && !hasYearly) return null;
          return (
            <div
              key={plan.id}
              className="flex items-center justify-between rounded-lg border border-[var(--border)] p-3"
            >
              <span className="font-medium text-foreground">{plan.name}</span>
              <div className="flex gap-2">
                {hasMonthly && (
                  <button
                    type="button"
                    onClick={() => handleUpgrade(plan.slug, "monthly")}
                    disabled={loading || isCurrent}
                    className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
                  >
                    Aylık
                  </button>
                )}
                {hasYearly && (
                  <button
                    type="button"
                    onClick={() => handleUpgrade(plan.slug, "yearly")}
                    disabled={loading || isCurrent}
                    className="rounded-lg border border-primary text-primary px-3 py-1.5 text-sm font-medium hover:bg-primary/10 disabled:opacity-50"
                  >
                    Yıllık
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {hasStripeCustomer && (
        <button
          type="button"
          onClick={handleManageBilling}
          disabled={loading}
          className="mt-4 rounded-lg border border-[var(--border)] text-muted px-4 py-2 text-sm hover:bg-black/5 disabled:opacity-50"
        >
          Fatura merkezi (kart, faturalar)
        </button>
      )}
    </section>
  );
}
