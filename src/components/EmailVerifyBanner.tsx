"use client";

import { useState } from "react";

export function EmailVerifyBanner() {
  const [loading, setLoading] = useState(false);
  const [linkSent, setLinkSent] = useState(false);
  const [verifyUrl, setVerifyUrl] = useState<string | null>(null);

  async function handleSendLink() {
    setLoading(true);
    setLinkSent(false);
    setVerifyUrl(null);
    try {
      const res = await fetch("/api/auth/send-verification", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.verifyUrl) {
        setLinkSent(true);
        setVerifyUrl(data.verifyUrl);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex flex-wrap items-center justify-between gap-2">
      <p className="text-amber-800 text-sm">
        E-posta adresinizi henüz doğrulamadınız. Hesap güvenliği için lütfen doğrulama yapın.
      </p>
      <div className="flex items-center gap-2">
        {verifyUrl && (
          <a
            href={verifyUrl}
            className="text-sm font-medium text-amber-800 underline hover:no-underline"
          >
            E-postayı doğrula (test linki)
          </a>
        )}
        <button
          type="button"
          onClick={handleSendLink}
          disabled={loading}
          className="rounded-lg bg-amber-200 text-amber-900 px-3 py-1.5 text-sm font-medium hover:bg-amber-300 disabled:opacity-50"
        >
          {loading ? "Gönderiliyor..." : linkSent ? "Link tekrar gönder" : "Doğrulama linki al"}
        </button>
      </div>
    </div>
  );
}
