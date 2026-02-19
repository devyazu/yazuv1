import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function DashboardPage() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: {
      tools: { where: { active: true }, orderBy: { order: "asc" } },
    },
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-white mb-2">Dashboard</h1>
      <p className="text-zinc-400 mb-8">
        Soldan bir kategori ve araç seçin veya aşağıdaki kartlardan birine tıklayın.
      </p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) =>
          cat.tools.map((tool) => (
            <Link
              key={tool.id}
              href={`/dashboard/tools/${tool.id}`}
              className="block rounded-xl border border-[var(--border)] bg-surface-card p-6 hover:border-primary/50 transition"
            >
              <span className="text-xs font-medium text-primary uppercase tracking-wider">
                {cat.name}
              </span>
              <h2 className="mt-2 text-lg font-medium text-white">{tool.name}</h2>
              <p className="mt-1 text-sm text-zinc-400 line-clamp-2">
                {tool.description}
              </p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
