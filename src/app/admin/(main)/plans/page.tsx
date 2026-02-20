import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function AdminPlansPage() {
  const plans = await prisma.plan.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { users: true } } },
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-foreground mb-6">Planlar</h1>
      <p className="text-muted mb-6">
        Plan adı, fiyat (Stripe'da ayarlanır), izin verilen tool tier'ları, takım ve marka limitleri
        aşağıda listelenir. Fiyatları Stripe Dashboard'dan güncelleyin; burada sadece limitler ve
        tier listesi yönetilir.
      </p>
      <div className="rounded-xl border border-[var(--border)] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-surface-elevated text-muted text-sm">
            <tr>
              <th className="px-4 py-3 font-medium">Plan</th>
              <th className="px-4 py-3 font-medium">Tool tier'ları</th>
              <th className="px-4 py-3 font-medium">Takım limiti</th>
              <th className="px-4 py-3 font-medium">Marka limiti</th>
              <th className="px-4 py-3 font-medium">Kullanıcı sayısı</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {plans.map((p) => (
              <tr key={p.id} className="text-foreground">
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3 text-muted">
                  {p.allowedToolTiers.join(", ") || "—"}
                </td>
                <td className="px-4 py-3">{p.teamMembersLimit}</td>
                <td className="px-4 py-3">{p.brandsLimit}</td>
                <td className="px-4 py-3">{p._count.users}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
