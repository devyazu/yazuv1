import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { tools: true } } },
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-foreground mb-6">Kategoriler</h1>
      <div className="space-y-4">
        {categories.map((c) => (
          <div
            key={c.id}
            className="rounded-xl border border-[var(--border)] bg-surface-card p-4 flex items-center justify-between"
          >
            <div>
              <p className="font-medium text-foreground">{c.name}</p>
              <p className="text-sm text-muted">/{c.slug} — {c._count.tools} araç</p>
            </div>
            <Link
              href={`/admin/tools?category=${c.id}`}
              className="text-sm text-primary hover:underline"
            >
              Araçları gör
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
