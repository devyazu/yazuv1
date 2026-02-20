"use client";

import { useRouter } from "next/navigation";

export function UserRoleSelect({
  userId,
  currentRole,
}: {
  userId: string;
  currentRole: string;
}) {
  const router = useRouter();

  async function changeRole(role: "user" | "admin") {
    const res = await fetch(`/api/admin/users/${userId}/role`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    if (res.ok) router.refresh();
  }

  return (
    <select
      value={currentRole}
      onChange={(e) => changeRole(e.target.value as "user" | "admin")}
      className="rounded-lg bg-surface border border-[var(--border)] px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
    >
      <option value="user">user</option>
      <option value="admin">admin</option>
    </select>
  );
}
