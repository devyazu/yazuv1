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
    <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-soft space-y-4">
      {isStarter ? (
        <>
          <p className="text-stone-600 text-sm">
            Ücretsiz planla hemen başlayın. Ödeme gerekmez.
          </p>
          <button
            type="button"
            onClick={handleActivateFree}
            disabled={loading}
            className="w-full rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 transition-all"
          >
            {loading ? "Aktifleştiriliyor..." : "Ücretsiz başla"}
          </button>
        </>
      ) : hasStripe ? (
        <>
          <p className="text-stone-600 text-sm">
            <strong className="text-stone-800">{planName}</strong> için ödemeyi tamamlayın.
            Abonelik Stripe ile güvenli ödeme alır.
          </p>
          <div className="flex flex-col gap-2">
            {hasStripeMonthly && (
              <button
                type="button"
                onClick={() => handleStripeCheckout("monthly")}
                disabled={loading}
                className="w-full rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 transition-all"
              >
                {loading ? "Yönlendiriliyor..." : monthlyCents != null ? `Aylık ${formatPrice(monthlyCents)} ile başla` : "Aylık ödeme"}
              </button>
            )}
            {hasStripeYearly && (
              <button
                type="button"
                onClick={() => handleStripeCheckout("yearly")}
                disabled={loading}
                className="w-full rounded-xl border-2 border-brand-500 py-3 font-bold text-brand-700 hover:bg-brand-50 disabled:opacity-50 transition-all"
              >
                {yearlyCents != null ? `Yıllık ${formatPrice(yearlyCents)} (2 ay ücretsiz)` : "Yıllık ödeme"}
              </button>
            )}
          </div>
        </>
      ) : (
        <>
          <p className="text-stone-600 text-sm">
            <strong className="text-stone-800">{planName}</strong> için Stripe fiyatları henüz
            tanımlanmadı. Admin panelden plana fiyat ekleyebilir veya geçici olarak ücretsiz başlayabilirsiniz.
          </p>
          <button
            type="button"
            onClick={handleActivateFree}
            disabled={loading}
            className="w-full rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 shadow-lg hover:shadow-xl disabled:opacity-50 transition-all"
          >
            {loading ? "İşleniyor..." : "Geçici olarak bu planla başla"}
          </button>
        </>
      )}

      <p className="mt-4 text-center">
        <Link href="/dashboard/choose-plan" className="text-sm text-stone-600 hover:text-brand-600 font-medium">
          ← Başka plan seç
        </Link>
      </p>
    </div>
  );
}
