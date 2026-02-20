import { prisma } from "@/lib/db";
import { UserRoleSelect } from "./UserRoleSelect";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { plan: true },
    take: 200,
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-white mb-6">Kullanıcılar</h1>
      <div className="rounded-xl border border-[var(--border)] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-surface-elevated text-zinc-400 text-sm">
            <tr>
              <th className="px-4 py-3 font-medium">E-posta</th>
              <th className="px-4 py-3 font-medium">Ad</th>
              <th className="px-4 py-3 font-medium">Plan</th>
              <th className="px-4 py-3 font-medium">Rol</th>
              <th className="px-4 py-3 font-medium">Kayıt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {users.map((u) => (
              <tr key={u.id} className="text-white">
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3">{u.name ?? "—"}</td>
                <td className="px-4 py-3">{u.plan?.name ?? "—"}</td>
                <td className="px-4 py-3">
                  <UserRoleSelect userId={u.id} currentRole={u.role} />
                </td>
                <td className="px-4 py-3 text-zinc-400 text-sm">
                  {new Date(u.createdAt).toLocaleDateString("tr-TR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
