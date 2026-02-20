import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user?.id
    ? await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { planId: true },
      })
    : null;
  if (user && !user.planId) redirect("/dashboard/choose-plan");

  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: {
      tools: { where: { active: true }, orderBy: { order: "asc" } },
    },
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-foreground mb-2">Dashboard</h1>
      <p className="text-muted mb-8">
        Soldan bir kategori ve araç seçin veya aşağıdaki kartlardan birine tıklayın.
      </p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) =>
          cat.tools.map((tool) => (
            <Link
              key={tool.id}
              href={`/dashboard/tools/${tool.id}`}
              className="block rounded-xl border border-[var(--border)] bg-surface-card p-6 hover:border-primary/50 transition shadow-sm"
            >
              <span className="text-xs font-medium text-primary uppercase tracking-wider">
                {cat.name}
              </span>
              <h2 className="mt-2 text-lg font-medium text-foreground">{tool.name}</h2>
              <p className="mt-1 text-sm text-muted line-clamp-2">
                {tool.description}
              </p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
