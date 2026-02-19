"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name: name || undefined }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Kayıt başarısız.");
      return;
    }
    router.push("/login?registered=1");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-block text-2xl font-semibold text-white mb-8">
          Yazu
        </Link>
        <div className="bg-surface-elevated border border-[var(--border)] rounded-2xl p-8">
          <h1 className="text-xl font-semibold text-white mb-6">Hesap oluştur</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">
                Ad (isteğe bağlı)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg bg-surface border border-[var(--border)] px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Adınız"
              />
            </div>
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
                placeholder="ornek@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">
                Şifre (en az 8 karakter)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full rounded-lg bg-surface border border-[var(--border)] px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            {error && (
              <p className="text-sm text-red-400">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary py-3 font-medium text-white hover:bg-primary-600 disabled:opacity-50 transition"
            >
              {loading ? "Oluşturuluyor..." : "Kayıt ol"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-zinc-400">
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
