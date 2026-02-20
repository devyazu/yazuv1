import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function AdminToolsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: categoryId } = await searchParams;
  const tools = await prisma.tool.findMany({
    where: categoryId ? { categoryId } : undefined,
    orderBy: [{ category: { order: "asc" } }, { order: "asc" }],
    include: { category: true },
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-white mb-6">Araçlar</h1>
      <div className="rounded-xl border border-[var(--border)] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-surface-elevated text-zinc-400 text-sm">
            <tr>
              <th className="px-4 py-3 font-medium">Kategori</th>
              <th className="px-4 py-3 font-medium">Araç</th>
              <th className="px-4 py-3 font-medium">Tier</th>
              <th className="px-4 py-3 font-medium">Aktif</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {tools.map((t) => (
              <tr key={t.id} className="text-white">
                <td className="px-4 py-3">{t.category.name}</td>
                <td className="px-4 py-3 font-medium">{t.name}</td>
                <td className="px-4 py-3 text-zinc-300">{t.tier}</td>
                <td className="px-4 py-3">{t.active ? "Evet" : "Hayır"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-sm text-zinc-500">
        Araç prompt'larını ve tier'ını veritabanında (Tool.systemPrompt, Tool.tier) veya Prisma
        Studio ile düzenleyebilirsiniz. İleride admin'e prompt editörü eklenebilir.
      </p>
    </div>
  );
}
