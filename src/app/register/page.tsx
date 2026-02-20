"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
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
    <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 mb-8">
          <Image src="/yazu.svg" alt="yazu" width={140} height={39} className="h-9 w-auto" priority />
        </Link>
        <div className="bg-white/90 backdrop-blur-xl border border-stone-200/50 rounded-2xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
          <h1 className="text-xl font-bold text-stone-800 mb-6 tracking-tight">Hesap oluştur</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1">
                Ad (isteğe bağlı)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-stone-200 px-4 py-3 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
                placeholder="Adınız"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1">
                E-posta
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-stone-200 px-4 py-3 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
                placeholder="ornek@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1">
                Şifre (en az 8 karakter)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full rounded-xl border border-stone-200 px-4 py-3 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
              />
            </div>
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 transition-all"
            >
              {loading ? "Oluşturuluyor..." : "Kayıt ol"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-stone-600">
            Zaten hesabınız var mı?{" "}
            <Link href="/login" className="text-brand-600 hover:text-brand-700 font-medium">
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
