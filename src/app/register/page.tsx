"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const planSlug = searchParams.get("plan") ?? undefined;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        name: name || undefined,
        plan: planSlug || undefined,
      }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Kayıt başarısız.");
      return;
    }
    router.push(data.redirect || "/login?registered=1");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-block text-2xl font-semibold text-foreground mb-8">
          Yazu
        </Link>
        <div className="bg-surface-elevated border border-[var(--border)] rounded-2xl p-8 shadow-sm">
          <h1 className="text-xl font-semibold text-foreground mb-6">Hesap oluştur</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted mb-1">
                Ad (isteğe bağlı)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg bg-surface border border-[var(--border)] px-4 py-3 text-foreground placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Adınız"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">
                E-posta
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg bg-surface border border-[var(--border)] px-4 py-3 text-foreground placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="ornek@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">
                Şifre (en az 8 karakter)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full rounded-lg bg-surface border border-[var(--border)] px-4 py-3 text-foreground placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary py-3 font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50 transition"
            >
              {loading ? "Oluşturuluyor..." : "Kayıt ol"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-muted">
            Zaten hesabınız var mı?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Giriş yapın
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-surface flex items-center justify-center text-muted">
          Yükleniyor...
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
