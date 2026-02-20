import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const [userCount, planCount, categoryCount, toolCount, outputCount] =
    await Promise.all([
      prisma.user.count(),
      prisma.plan.count(),
      prisma.category.count(),
      prisma.tool.count(),
      prisma.output.count(),
    ]);

  const cards = [
    { label: "Kullanıcılar", value: userCount, href: "/admin/users" },
    { label: "Planlar", value: planCount, href: "/admin/plans" },
    { label: "Kategoriler", value: categoryCount, href: "/admin/categories" },
    { label: "Araçlar", value: toolCount, href: "/admin/tools" },
    { label: "Toplam çıktı", value: outputCount, href: "/admin/stats" },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-white mb-6">Admin Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="rounded-xl border border-[var(--border)] bg-surface-card p-6 hover:border-primary/50 transition"
          >
            <p className="text-zinc-400 text-sm">{c.label}</p>
            <p className="text-2xl font-semibold text-white mt-1">{c.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
