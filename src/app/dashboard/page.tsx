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
    <div>
      <h1 className="text-2xl font-bold text-stone-800 tracking-tight mb-2">Dashboard</h1>
      <p className="text-stone-600 mb-8">
        Soldan bir kategori ve araç seçin veya aşağıdaki kartlardan birine tıklayın.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((cat) =>
          cat.tools.map((tool) => (
            <Link
              key={tool.id}
              href={`/dashboard/tools/${tool.id}`}
              className="block rounded-2xl border border-stone-200 bg-white p-6 shadow-soft hover:border-brand-200 hover:shadow-brand hover:-translate-y-0.5 transition-all duration-200"
            >
              <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                {cat.name}
              </span>
              <h2 className="mt-2 text-lg font-semibold text-stone-800">{tool.name}</h2>
              <p className="mt-1 text-sm text-stone-600 line-clamp-2">
                {tool.description}
              </p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
