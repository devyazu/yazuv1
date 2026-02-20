"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function formatPrice(cents: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
  }).format(cents / 100);
}

export function CheckoutClient({
  planSlug,
  planName,
  hasStripeMonthly,
  hasStripeYearly,
  monthlyCents,
  yearlyCents,
}: {
  planSlug: string;
  planName: string;
  hasStripeMonthly: boolean;
  hasStripeYearly: boolean;
  monthlyCents?: number;
  yearlyCents?: number;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleStripeCheckout(interval: "monthly" | "yearly") {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planSlug, interval }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      alert(data.error || "Ödeme sayfası açılamadı.");
    } finally {
      setLoading(false);
    }
  }

  async function handleActivateFree() {
    setLoading(true);
    try {
      const res = await fetch("/api/user/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planSlug }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Plan atanamadı.");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  const isStarter = planSlug === "starter";
  const hasStripe = hasStripeMonthly || hasStripeYearly;

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-surface-card p-6 shadow-sm space-y-4">
      {isStarter ? (
        <>
          <p className="text-muted text-sm">
            Ücretsiz planla hemen başlayın. Ödeme gerekmez.
          </p>
          <button
            type="button"
            onClick={handleActivateFree}
            disabled={loading}
            className="w-full rounded-lg bg-primary py-3 font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50 transition"
          >
            {loading ? "Aktifleştiriliyor..." : "Ücretsiz başla"}
          </button>
        </>
      ) : hasStripe ? (
        <>
          <p className="text-muted text-sm">
            <strong className="text-foreground">{planName}</strong> için ödemeyi tamamlayın.
            Abonelik Stripe ile güvenli ödeme alır.
          </p>
          <div className="flex flex-col gap-2">
            {hasStripeMonthly && (
              <button
                type="button"
                onClick={() => handleStripeCheckout("monthly")}
                disabled={loading}
                className="w-full rounded-lg bg-primary py-3 font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50 transition"
              >
                {loading ? "Yönlendiriliyor..." : monthlyCents != null ? `Aylık ${formatPrice(monthlyCents)} ile başla` : "Aylık ödeme"}
              </button>
            )}
            {hasStripeYearly && (
              <button
                type="button"
                onClick={() => handleStripeCheckout("yearly")}
                disabled={loading}
                className="w-full rounded-lg border-2 border-primary py-3 font-medium text-primary hover:opacity-90 disabled:opacity-50 transition"
              >
                {yearlyCents != null ? `Yıllık ${formatPrice(yearlyCents)} (2 ay ücretsiz)` : "Yıllık ödeme"}
              </button>
            )}
          </div>
        </>
      ) : (
        <>
          <p className="text-muted text-sm">
            <strong className="text-foreground">{planName}</strong> için Stripe fiyatları henüz
            tanımlanmadı. Admin panelden plana fiyat ekleyebilir veya geçici olarak ücretsiz başlayabilirsiniz.
          </p>
          <button
            type="button"
            onClick={handleActivateFree}
            disabled={loading}
            className="w-full rounded-lg bg-primary py-3 font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50 transition"
          >
            {loading ? "İşleniyor..." : "Geçici olarak bu planla başla"}
          </button>
        </>
      )}

      <p className="mt-4 text-center">
        <Link href="/dashboard/choose-plan" className="text-sm text-muted hover:text-primary">
          ← Başka plan seç
        </Link>
      </p>
    </div>
  );
}
