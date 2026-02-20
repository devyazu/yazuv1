"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Section = {
  id: string;
  type: string;
  order: number;
  data: Record<string, unknown>;
};

const TYPE_LABELS: Record<string, string> = {
  hero: "Hero (başlık, alt metin, CTA)",
  pricing_heading: "Paketler başlığı",
  custom_block: "Serbest metin / blok",
  plans: "Paket kartları (otomatik)",
};

export function ContentManager() {
  const router = useRouter();
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Section | null>(null);
  const [adding, setAdding] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/sections");
    if (res.ok) {
      const data = await res.json();
      setSections(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleReorder(moveIndex: number, direction: "up" | "down") {
    const newOrder = [...sections];
    const target = direction === "up" ? moveIndex - 1 : moveIndex + 1;
    if (target < 0 || target >= newOrder.length) return;
    [newOrder[moveIndex], newOrder[target]] = [newOrder[target], newOrder[moveIndex]];
    const ids = newOrder.map((s) => s.id);
    const res = await fetch("/api/admin/sections/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });
    if (res.ok) {
      setSections(newOrder.map((s, i) => ({ ...s, order: i })));
      router.refresh();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu bölümü silmek istediğinize emin misiniz?")) return;
    const res = await fetch(`/api/admin/sections/${id}`, { method: "DELETE" });
    if (res.ok) {
      setSections((prev) => prev.filter((s) => s.id !== id));
      setEditing(null);
      router.refresh();
    }
  }

  async function handleSave(section: Section, data: Record<string, unknown>) {
    const res = await fetch(`/api/admin/sections/${section.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data }),
    });
    if (res.ok) {
      setSections((prev) =>
        prev.map((s) => (s.id === section.id ? { ...s, data } : s))
      );
      setEditing(null);
      router.refresh();
    }
  }

  async function handleAdd(type: string, data: Record<string, unknown>) {
    const res = await fetch("/api/admin/sections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        page: "home",
        type,
        order: sections.length,
        data,
      }),
    });
    if (res.ok) {
      const created = await res.json();
      setSections((prev) => [...prev, created]);
      setAdding(false);
      router.refresh();
    }
  }

  if (loading) return <p className="text-muted">Yükleniyor...</p>;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          + Bölüm ekle
        </button>
      </div>

      <ul className="space-y-2">
        {sections.map((section, index) => (
          <li
            key={section.id}
            className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-surface-card p-4"
          >
            <div className="flex flex-col gap-0.5">
              <button
                type="button"
                onClick={() => handleReorder(index, "up")}
                disabled={index === 0}
                className="text-muted hover:text-foreground disabled:opacity-30"
                aria-label="Yukarı"
              >
                ▲
              </button>
              <button
                type="button"
                onClick={() => handleReorder(index, "down")}
                disabled={index === sections.length - 1}
                className="text-muted hover:text-foreground disabled:opacity-30"
                aria-label="Aşağı"
              >
                ▼
              </button>
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-medium text-foreground">
                {TYPE_LABELS[section.type] ?? section.type}
              </span>
              <p className="text-sm text-muted truncate">
                {section.type === "hero" &&
                  (section.data.title as string)?.toString()}
                {section.type === "pricing_heading" &&
                  (section.data.title as string)?.toString()}
                {section.type === "custom_block" &&
                  (section.data.title as string)?.toString()}
                {section.type === "plans" && "Paket listesi"}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEditing(section)}
                className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm text-foreground hover:bg-black/5"
              >
                Düzenle
              </button>
              <button
                type="button"
                onClick={() => handleDelete(section.id)}
                className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
              >
                Sil
              </button>
            </div>
          </li>
        ))}
      </ul>

      {editing && (
        <EditModal
          section={editing}
          onSave={(data) => handleSave(editing, data)}
          onClose={() => setEditing(null)}
        />
      )}

      {adding && (
        <AddModal
          onAdd={handleAdd}
          onClose={() => setAdding(false)}
        />
      )}
    </div>
  );
}

function EditModal({
  section,
  onSave,
  onClose,
}: {
  section: Section;
  onSave: (data: Record<string, unknown>) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Record<string, unknown>>(section.data);

  if (section.type === "hero") {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-surface-elevated rounded-2xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
          <h2 className="text-lg font-semibold text-foreground mb-4">Hero düzenle</h2>
          <div className="space-y-3">
            <label className="block text-sm font-medium text-muted">Başlık</label>
            <input
              value={(form.title as string) ?? ""}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              className="w-full rounded-lg border border-[var(--border)] px-4 py-2 text-foreground"
            />
            <label className="block text-sm font-medium text-muted">Alt metin</label>
            <textarea
              value={(form.subtitle as string) ?? ""}
              onChange={(e) => setForm((p) => ({ ...p, subtitle: e.target.value }))}
              rows={3}
              className="w-full rounded-lg border border-[var(--border)] px-4 py-2 text-foreground"
            />
            <label className="block text-sm font-medium text-muted">Birincil CTA metni</label>
            <input
              value={(form.ctaPrimaryText as string) ?? ""}
              onChange={(e) => setForm((p) => ({ ...p, ctaPrimaryText: e.target.value }))}
              className="w-full rounded-lg border border-[var(--border)] px-4 py-2 text-foreground"
            />
            <label className="block text-sm font-medium text-muted">Birincil CTA link</label>
            <input
              value={(form.ctaPrimaryUrl as string) ?? ""}
              onChange={(e) => setForm((p) => ({ ...p, ctaPrimaryUrl: e.target.value }))}
              className="w-full rounded-lg border border-[var(--border)] px-4 py-2 text-foreground"
            />
            <label className="block text-sm font-medium text-muted">İkincil CTA metni</label>
            <input
              value={(form.ctaSecondaryText as string) ?? ""}
              onChange={(e) => setForm((p) => ({ ...p, ctaSecondaryText: e.target.value }))}
              className="w-full rounded-lg border border-[var(--border)] px-4 py-2 text-foreground"
            />
            <label className="block text-sm font-medium text-muted">İkincil CTA link</label>
            <input
              value={(form.ctaSecondaryUrl as string) ?? ""}
              onChange={(e) => setForm((p) => ({ ...p, ctaSecondaryUrl: e.target.value }))}
              className="w-full rounded-lg border border-[var(--border)] px-4 py-2 text-foreground"
            />
          </div>
          <div className="flex gap-2 mt-6">
            <button
              type="button"
              onClick={() => onSave(form)}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Kaydet
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm text-foreground"
            >
              İptal
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (section.type === "pricing_heading") {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-surface-elevated rounded-2xl shadow-xl max-w-lg w-full p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Paketler başlığı düzenle</h2>
          <div className="space-y-3">
            <label className="block text-sm font-medium text-muted">Başlık</label>
            <input
              value={(form.title as string) ?? ""}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              className="w-full rounded-lg border border-[var(--border)] px-4 py-2 text-foreground"
            />
            <label className="block text-sm font-medium text-muted">Alt metin</label>
            <input
              value={(form.subtitle as string) ?? ""}
              onChange={(e) => setForm((p) => ({ ...p, subtitle: e.target.value }))}
              className="w-full rounded-lg border border-[var(--border)] px-4 py-2 text-foreground"
            />
          </div>
          <div className="flex gap-2 mt-6">
            <button
              type="button"
              onClick={() => onSave(form)}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Kaydet
            </button>
            <button type="button" onClick={onClose} className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm text-foreground">
              İptal
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (section.type === "custom_block") {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-surface-elevated rounded-2xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
          <h2 className="text-lg font-semibold text-foreground mb-4">Blok düzenle</h2>
          <div className="space-y-3">
            <label className="block text-sm font-medium text-muted">Başlık</label>
            <input
              value={(form.title as string) ?? ""}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              className="w-full rounded-lg border border-[var(--border)] px-4 py-2 text-foreground"
            />
            <label className="block text-sm font-medium text-muted">İçerik</label>
            <textarea
              value={(form.body as string) ?? ""}
              onChange={(e) => setForm((p) => ({ ...p, body: e.target.value }))}
              rows={5}
              className="w-full rounded-lg border border-[var(--border)] px-4 py-2 text-foreground"
            />
            <label className="block text-sm font-medium text-muted">Görsel URL (isteğe bağlı)</label>
            <input
              value={(form.imageUrl as string) ?? ""}
              onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))}
              className="w-full rounded-lg border border-[var(--border)] px-4 py-2 text-foreground"
            />
          </div>
          <div className="flex gap-2 mt-6">
            <button
              type="button"
              onClick={() => onSave(form)}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Kaydet
            </button>
            <button type="button" onClick={onClose} className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm text-foreground">
              İptal
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface-elevated rounded-2xl shadow-xl max-w-lg w-full p-6">
        <p className="text-muted">Bu bölüm türü düzenlenemez.</p>
        <button type="button" onClick={onClose} className="mt-4 rounded-lg border border-[var(--border)] px-4 py-2 text-sm text-foreground">
          Kapat
        </button>
      </div>
    </div>
  );
}

function AddModal({
  onAdd,
  onClose,
}: {
  onAdd: (type: string, data: Record<string, unknown>) => void;
  onClose: () => void;
}) {
  const [type, setType] = useState<string>("custom_block");
  const [form, setForm] = useState<Record<string, unknown>>({
    title: "",
    subtitle: "",
    body: "",
    imageUrl: "",
  });

  function handleSubmit() {
    if (type === "hero") {
      onAdd(type, {
        title: form.title || "Smart mind for your business",
        subtitle: form.subtitle || "",
        ctaPrimaryText: "Ücretsiz Başla",
        ctaPrimaryUrl: "/register",
        ctaSecondaryText: "Planları İncele",
        ctaSecondaryUrl: "#plans",
      });
    } else if (type === "pricing_heading") {
      onAdd(type, {
        title: form.title || "Üyelik paketleri",
        subtitle: form.subtitle || "",
      });
    } else if (type === "custom_block") {
      onAdd(type, {
        title: form.title,
        body: form.body,
        imageUrl: form.imageUrl || undefined,
      });
    } else {
      onAdd(type, {});
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface-elevated rounded-2xl shadow-xl max-w-lg w-full p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Yeni bölüm</h2>
        <div className="space-y-3">
          <label className="block text-sm font-medium text-muted">Bölüm türü</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] px-4 py-2 text-foreground"
          >
            <option value="hero">Hero</option>
            <option value="pricing_heading">Paketler başlığı</option>
            <option value="custom_block">Serbest blok</option>
            <option value="plans">Paket kartları</option>
          </select>
          {(type === "hero" || type === "pricing_heading") && (
            <>
              <label className="block text-sm font-medium text-muted">Başlık</label>
              <input
                value={(form.title as string) ?? ""}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                className="w-full rounded-lg border border-[var(--border)] px-4 py-2 text-foreground"
              />
              <label className="block text-sm font-medium text-muted">Alt metin</label>
              <input
                value={(form.subtitle as string) ?? ""}
                onChange={(e) => setForm((p) => ({ ...p, subtitle: e.target.value }))}
                className="w-full rounded-lg border border-[var(--border)] px-4 py-2 text-foreground"
              />
            </>
          )}
          {type === "custom_block" && (
            <>
              <label className="block text-sm font-medium text-muted">Başlık</label>
              <input
                value={(form.title as string) ?? ""}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                className="w-full rounded-lg border border-[var(--border)] px-4 py-2 text-foreground"
              />
              <label className="block text-sm font-medium text-muted">İçerik</label>
              <textarea
                value={(form.body as string) ?? ""}
                onChange={(e) => setForm((p) => ({ ...p, body: e.target.value }))}
                rows={3}
                className="w-full rounded-lg border border-[var(--border)] px-4 py-2 text-foreground"
              />
            </>
          )}
        </div>
        <div className="flex gap-2 mt-6">
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Ekle
          </button>
          <button type="button" onClick={onClose} className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm text-foreground">
            İptal
          </button>
        </div>
      </div>
    </div>
  );
}
