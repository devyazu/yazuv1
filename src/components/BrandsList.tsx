"use client";

import { useState } from "react";

type Brand = { id: string; name: string; description: string | null };

export function BrandsList({
  brands,
  canAdd,
}: {
  brands: Brand[];
  canAdd: boolean;
}) {
  const [list, setList] = useState(brands);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/brands", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description: description || undefined }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Eklenemedi.");
      return;
    }
    setList((prev) => [data, ...prev]);
    setName("");
    setDescription("");
    setShowForm(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu markayı silmek istediğinize emin misiniz?")) return;
    const res = await fetch(`/api/brands/${id}`, { method: "DELETE" });
    if (res.ok) setList((prev) => prev.filter((b) => b.id !== id));
  }

  return (
    <div className="space-y-4">
      {canAdd && (
        <div className="rounded-xl border border-[var(--border)] bg-surface-card p-6">
          {!showForm ? (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="text-primary hover:underline font-medium"
            >
              + Yeni marka ekle
            </button>
          ) : (
            <form onSubmit={handleCreate} className="space-y-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Marka adı"
                className="w-full rounded-lg bg-surface border border-[var(--border)] px-4 py-2 text-foreground placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Kısa açıklama (isteğe bağlı)"
                rows={2}
                className="w-full rounded-lg bg-surface border border-[var(--border)] px-4 py-2 text-foreground placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
                >
                  {loading ? "Ekleniyor..." : "Ekle"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm text-muted hover:text-foreground"
                >
                  İptal
                </button>
              </div>
            </form>
          )}
        </div>
      )}
      <ul className="space-y-3">
        {list.map((b) => (
          <li
            key={b.id}
            className="rounded-xl border border-[var(--border)] bg-surface-card p-4 flex items-center justify-between"
          >
            <div>
              <p className="font-medium text-foreground">{b.name}</p>
              {b.description && (
                <p className="text-sm text-muted mt-0.5">{b.description}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => handleDelete(b.id)}
              className="text-sm text-red-500 hover:text-red-600"
            >
              Sil
            </button>
          </li>
        ))}
      </ul>
      {list.length === 0 && !showForm && (
        <p className="text-muted">Henüz marka eklenmedi.</p>
      )}
    </div>
  );
}
