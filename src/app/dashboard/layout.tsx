import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { EmailVerifyBanner } from "@/components/EmailVerifyBanner";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  const isAdmin = (session.user as { role?: string }).role === "admin";
  const emailVerified = (session.user as { emailVerified?: boolean }).emailVerified;

  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: {
      tools: {
        where: { active: true },
        orderBy: { order: "asc" },
      },
    },
  });

  return (
    <div className="min-h-screen bg-[#FAFAF9] flex flex-col">
      {!emailVerified && <EmailVerifyBanner />}
      <div className="flex flex-1 min-h-0">
        <aside className="w-72 flex flex-col bg-white/80 backdrop-blur-xl border-r border-white/40 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
          <div className="p-4 border-b border-stone-200/50">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Image src="/yazu.svg" alt="yazu" width={120} height={34} className="h-8 w-auto" />
            </Link>
          </div>
          <nav className="flex-1 overflow-y-auto p-3">
            {categories.map((cat) => (
              <div key={cat.id} className="mb-4">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-wider px-2 mb-2">
                  {cat.name}
                </p>
                <ul className="space-y-0.5">
                  {cat.tools.map((tool) => (
                    <li key={tool.id}>
                      <Link
                        href={`/dashboard/tools/${tool.id}`}
                        className="block rounded-xl px-3 py-2.5 text-sm text-stone-600 hover:bg-white/50 hover:shadow-sm hover:text-brand-600 transition-all"
                      >
                        {tool.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
          <div className="p-3 border-t border-stone-200/50 space-y-1">
            {isAdmin && (
              <Link
                href="/admin"
                className="block rounded-xl px-3 py-2.5 text-sm font-medium text-brand-600 hover:bg-brand-50 transition-colors"
              >
                Admin panel
              </Link>
            )}
            <Link
              href="/dashboard/brands"
              className="block rounded-xl px-3 py-2.5 text-sm text-stone-600 hover:bg-white/50 hover:text-stone-800 transition-colors"
            >
              Markalarım
            </Link>
            <Link
              href="/profile"
              className="block rounded-xl px-3 py-2.5 text-sm text-stone-600 hover:bg-white/50 hover:text-stone-800 transition-colors"
            >
              Profil & Fatura
            </Link>
            <Link
              href="/"
              className="block rounded-xl px-3 py-2.5 text-sm text-stone-600 hover:bg-white/50 hover:text-stone-800 transition-colors"
            >
              Ana sayfa
            </Link>
          </div>
        </aside>
        <main className="flex-1 min-h-0 overflow-y-auto p-6 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
