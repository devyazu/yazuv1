import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function SiteHeader() {
  const session = await getServerSession(authOptions);

  return (
    <header className="sticky top-0 z-40 h-16 bg-white/80 backdrop-blur-xl border-b border-white/40 shadow-soft flex items-center justify-between px-6">
      <Link href="/" className="flex items-center gap-2.5">
        <Image src="/yazu.svg" alt="yazu" width={120} height={34} className="h-8 w-auto" priority />
      </Link>
      <nav className="flex items-center gap-4">
        {session ? (
          <>
            <Link
              href="/dashboard"
              className="text-sm font-medium text-stone-600 hover:text-brand-600 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/profile"
              className="text-sm font-medium text-stone-600 hover:text-brand-600 transition-colors"
            >
              Profil
            </Link>
            <Link
              href="/api/auth/signout"
              className="text-sm font-medium text-stone-600 hover:text-brand-600 transition-colors"
            >
              Çıkış
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="text-sm font-medium text-stone-600 hover:text-brand-600 transition-colors"
            >
              Giriş
            </Link>
            <Link
              href="/register"
              className="rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold px-4 py-2.5 text-sm shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
            >
              Kayıt Ol
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
