"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function CheckoutClient({
  planSlug,
  planName,
}: {
  planSlug: string;
  planName: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-surface-card p-6 shadow-sm">
      {isStarter ? (
        <>
          <p className="text-muted text-sm mb-4">
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
      ) : (
        <>
          <p className="text-muted text-sm mb-4">
            <strong className="text-foreground">{planName}</strong> için ödeme ekranı yakında
            Stripe ile aktif olacak. Şimdilik bu planı ücretsiz denemek isterseniz aşağıdaki
            butonu kullanabilirsiniz.
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
