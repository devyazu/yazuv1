import { prisma } from "@/lib/db";

export default async function AdminStatsPage() {
  const [totalOutputs, outputsByTool, recentOutputs] = await Promise.all([
    prisma.output.count(),
    prisma.output.groupBy({
      by: ["toolId"],
      _count: true,
    }),
    prisma.output.findMany({
      take: 50,
      orderBy: { createdAt: "desc" },
      include: { tool: true, user: { select: { email: true } } },
    }),
  ]);

  const toolIds = outputsByTool.map((o) => o.toolId);
  const tools = toolIds.length
    ? await prisma.tool.findMany({
        where: { id: { in: toolIds } },
        select: { id: true, name: true },
      })
    : [];
  const toolNames = Object.fromEntries(tools.map((t) => [t.id, t.name]));

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-foreground mb-6">İstatistikler</h1>
      <div className="grid gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-[var(--border)] bg-surface-card p-6">
          <p className="text-muted text-sm">Toplam çıktı</p>
          <p className="text-2xl font-semibold text-foreground mt-1">{totalOutputs}</p>
        </div>
      </div>
      <h2 className="text-lg font-medium text-foreground mb-3">Araç bazında kullanım</h2>
      <div className="rounded-xl border border-[var(--border)] overflow-hidden mb-8">
        <table className="w-full text-left">
          <thead className="bg-surface-elevated text-muted text-sm">
            <tr>
              <th className="px-4 py-3 font-medium">Araç</th>
              <th className="px-4 py-3 font-medium">Çıktı sayısı</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {outputsByTool.map((o) => (
              <tr key={o.toolId} className="text-foreground">
                <td className="px-4 py-3">{toolNames[o.toolId] ?? o.toolId}</td>
                <td className="px-4 py-3">{o._count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2 className="text-lg font-medium text-foreground mb-3">Son çıktılar</h2>
      <div className="rounded-xl border border-[var(--border)] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-surface-elevated text-muted text-sm">
            <tr>
              <th className="px-4 py-3 font-medium">Kullanıcı</th>
              <th className="px-4 py-3 font-medium">Araç</th>
              <th className="px-4 py-3 font-medium">Tarih</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {recentOutputs.map((o) => (
              <tr key={o.id} className="text-foreground">
                <td className="px-4 py-3">{o.user.email}</td>
                <td className="px-4 py-3">{o.tool.name}</td>
                <td className="px-4 py-3 text-muted text-sm">
                  {new Date(o.createdAt).toLocaleString("tr-TR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
