"use client";

import { useState } from "react";

type Brand = { id: string; name: string };

export function ToolRunner({
  toolId,
  toolName,
  inputLabel,
  inputPlaceholder,
  brands,
}: {
  toolId: string;
  toolName: string;
  inputLabel: string;
  inputPlaceholder: string;
  brands: Brand[];
}) {
  const [input, setInput] = useState("");
  const [brandId, setBrandId] = useState<string>("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/tools/${toolId}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: input.trim(),
          brandId: brandId || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Bir hata oluştu.");
        return;
      }
      setResult(data.result);
    } catch {
      setError("İstek gönderilemedi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {brands.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-muted mb-1">
              Marka (isteğe bağlı)
            </label>
            <select
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
              className="w-full rounded-lg bg-surface border border-[var(--border)] px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Marka seçmeyin</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-muted mb-1">
            {inputLabel}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            required
            rows={4}
            placeholder={inputPlaceholder}
            className="w-full rounded-lg bg-surface border border-[var(--border)] px-4 py-3 text-foreground placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50 transition"
        >
          {loading ? "Üretiliyor..." : `${toolName} üret`}
        </button>
      </form>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 text-red-600 p-4 text-sm">
          {error}
        </div>
      )}

      {result && (
        <div className="rounded-xl border border-[var(--border)] bg-surface-card p-6">
          <h3 className="text-sm font-medium text-muted mb-2">Çıktı</h3>
          <div className="text-foreground whitespace-pre-wrap font-sans">{result}</div>
        </div>
      )}
    </div>
  );
}
