import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <header className="border-b border-[var(--border)] px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-semibold text-white">
          Yazu
        </Link>
        <nav className="flex items-center gap-4">
          {session ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm text-zinc-400 hover:text-primary transition"
              >
                Dashboard
              </Link>
              <Link
                href="/profile"
                className="text-sm text-zinc-400 hover:text-primary transition"
              >
                Profil
              </Link>
              <Link
                href="/api/auth/signout"
                className="text-sm text-zinc-400 hover:text-primary transition"
              >
                Çıkış
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-zinc-400 hover:text-primary transition"
              >
                Giriş
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-600 transition"
              >
                Kayıt Ol
              </Link>
            </>
          )}
        </nav>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          AI ile metin tabanlı çıktılar üretin
        </h1>
        <p className="text-zinc-400 max-w-xl mb-8">
          Yazu, markanızın sesine uygun copywriting ve içerik araçları sunar.
          Kategorilerden bir aracı seçin, girdiyi verin, çıktıyı alın.
        </p>
        {!session && (
          <Link
            href="/register"
            className="rounded-xl bg-primary px-8 py-4 text-lg font-medium text-white hover:bg-primary-600 transition"
          >
            Ücretsiz Başla
          </Link>
        )}
        {session && (
          <Link
            href="/dashboard"
            className="rounded-xl bg-primary px-8 py-4 text-lg font-medium text-white hover:bg-primary-600 transition"
          >
            Araçlara Git
          </Link>
        )}
      </main>
    </div>
  );
}
