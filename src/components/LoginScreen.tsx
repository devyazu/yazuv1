"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

type LoginScreenProps = {
  callbackUrl?: string | null;
  verified?: boolean;
};

export function LoginScreen({ callbackUrl, verified }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const redirectTo = callbackUrl ?? "/dashboard";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("E-posta veya şifre hatalı.");
      return;
    }
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Arka plan: gradient + yumuşak orb */}
      <div className="absolute inset-0 bg-gradient-to-br from-stone-50 via-[#FAFAF9] to-brand-50/40" />
      <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-brand-200/30 blur-3xl animate-orb-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-brand-100/40 blur-3xl animate-orb-pulse" style={{ animationDelay: "-4s" }} />

      <div className="w-full max-w-[420px] relative z-10">
        {/* Logo + kart */}
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/yazu.svg"
            alt="yazu"
            width={160}
            height={45}
            className="h-11 w-auto drop-shadow-sm"
            priority
          />
          <p className="mt-3 text-sm text-stone-500 tracking-tight">
            AI destekli pazarlama ve içerik platformu
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-xl border border-stone-200/60 rounded-3xl p-8 shadow-[0_25px_60px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.02)]">
          {verified && (
            <div className="mb-5 rounded-2xl bg-green-50 border border-green-200/80 px-4 py-3 text-sm text-green-800">
              E-postanız doğrulandı. Giriş yaparak devam edin.
            </div>
          )}
          <h1 className="text-xl font-bold text-stone-800 mb-6 tracking-tight">
            Giriş yap
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1.5">
                E-posta
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-stone-200 px-4 py-3 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-300 transition-shadow"
                placeholder="ornek@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1.5">
                Şifre
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-xl border border-stone-200 px-4 py-3 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-300 transition-shadow"
              />
            </div>
            {error && (
              <p className="text-sm text-red-600 font-medium">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 shadow-lg shadow-brand-200/50 hover:shadow-brand-lg hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:hover:scale-100 transition-all duration-200"
            >
              {loading ? "Giriş yapılıyor..." : "Giriş yap"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-stone-600">
            Hesabınız yok mu?{" "}
            <Link
              href="/register"
              className="text-brand-600 hover:text-brand-700 font-semibold transition-colors"
            >
              Kayıt olun
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-stone-400">
          © {new Date().getFullYear()} yazu
        </p>
      </div>
    </div>
  );
}
