import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
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
    <div className="min-h-screen bg-surface flex flex-col">
      {!emailVerified && <EmailVerifyBanner />}
      <div className="flex flex-1 min-h-0">
      <aside className="w-64 border-r border-[var(--border)] flex flex-col bg-surface-elevated">
        <div className="p-4 border-b border-[var(--border)]">
          <Link href="/dashboard" className="text-lg font-semibold text-foreground">
            Yazu
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto p-3">
          {categories.map((cat) => (
            <div key={cat.id} className="mb-4">
              <p className="text-xs font-medium text-muted uppercase tracking-wider px-2 mb-2">
                {cat.name}
              </p>
              <ul className="space-y-0.5">
                {cat.tools.map((tool) => (
                  <li key={tool.id}>
                    <Link
                      href={`/dashboard/tools/${tool.id}`}
                      className="block rounded-lg px-3 py-2 text-sm text-muted hover:bg-black/5 hover:text-foreground transition"
                    >
                      {tool.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <div className="p-3 border-t border-[var(--border)] space-y-1">
          {isAdmin && (
            <Link
              href="/admin"
              className="block rounded-lg px-3 py-2 text-sm text-primary hover:opacity-80 transition"
            >
              Admin panel
            </Link>
          )}
          <Link
            href="/dashboard/brands"
            className="block rounded-lg px-3 py-2 text-sm text-muted hover:text-foreground transition"
          >
            Markalarım
          </Link>
          <Link
            href="/profile"
            className="block rounded-lg px-3 py-2 text-sm text-muted hover:text-foreground transition"
          >
            Profil & Fatura
          </Link>
          <Link
            href="/"
            className="block rounded-lg px-3 py-2 text-sm text-muted hover:text-foreground transition"
          >
            Ana sayfa
          </Link>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
