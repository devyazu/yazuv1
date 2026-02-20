import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

export default async function AdminMainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/admin/login");
  if ((session.user as { role?: string }).role !== "admin") {
    redirect("/admin/login?error=not_admin");
  }

  const nav = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/users", label: "Kullanıcılar" },
    { href: "/admin/plans", label: "Planlar" },
    { href: "/admin/categories", label: "Kategoriler" },
    { href: "/admin/tools", label: "Araçlar" },
    { href: "/admin/stats", label: "İstatistikler" },
  ];

  return (
    <div className="min-h-screen bg-surface flex">
      <aside className="w-56 border-r border-[var(--border)] bg-surface-elevated flex flex-col">
        <div className="p-4 border-b border-[var(--border)]">
          <Link href="/admin" className="font-semibold text-foreground">
            Yazu Admin
          </Link>
        </div>
        <nav className="p-3 space-y-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-lg px-3 py-2 text-sm text-muted hover:bg-black/5 hover:text-foreground transition"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-[var(--border)]">
          <Link
            href="/dashboard"
            className="block rounded-lg px-3 py-2 text-sm text-muted hover:text-foreground transition"
          >
            ← Ön yüze dön
          </Link>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
