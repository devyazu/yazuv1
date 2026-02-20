"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const notAdmin = searchParams.get("error") === "not_admin";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/admin",
    });
    setLoading(false);
    if (res?.error) {
      setError("E-posta veya şifre hatalı.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link
          href="/admin"
          className="inline-block text-2xl font-semibold text-white mb-8"
        >
          Yazu Admin
        </Link>
        <div className="bg-surface-elevated border border-[var(--border)] rounded-2xl p-8">
          <h1 className="text-xl font-semibold text-white mb-6">Admin girişi</h1>
          {notAdmin && (
            <p className="text-amber-400 text-sm mb-4">
              Bu hesap admin değil. Lütfen admin hesabıyla giriş yapın.
            </p>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">
                E-posta
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg bg-surface border border-[var(--border)] px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="admin@yazu.digital"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">
                Şifre
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-lg bg-surface border border-[var(--border)] px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary py-3 font-medium text-white hover:bg-primary-600 disabled:opacity-50 transition"
            >
              {loading ? "Giriş yapılıyor..." : "Giriş yap"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-zinc-400">
            <Link href="/" className="text-primary hover:underline">
              Ana siteye dön
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-surface flex items-center justify-center text-zinc-400">
          Yükleniyor...
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
