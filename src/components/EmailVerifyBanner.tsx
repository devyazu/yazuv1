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
      if (res.ok) {
        setLinkSent(true);
        if (data.verifyUrl) setVerifyUrl(data.verifyUrl);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-brand-50 border-b border-brand-200 px-6 py-3 flex flex-wrap items-center justify-between gap-2">
      <p className="text-stone-800 text-sm">
        E-posta adresinizi henüz doğrulamadınız. Hesap güvenliği için lütfen doğrulama yapın.
      </p>
      <div className="flex items-center gap-3">
        {linkSent && !verifyUrl && (
          <span className="text-sm text-stone-700">
            E-postanıza doğrulama linki gönderildi. Gelen kutusunu ve spam klasörünü kontrol edin.
          </span>
        )}
        {verifyUrl && (
          <span className="text-sm text-stone-600">
            E-posta ulaşmadıysa{" "}
            <a
              href={verifyUrl}
              className="font-medium text-brand-600 underline hover:no-underline"
            >
              buradan doğrulayın
            </a>
          </span>
        )}
        <button
          type="button"
          onClick={handleSendLink}
          disabled={loading}
          className="rounded-xl bg-brand-100 hover:bg-brand-200 text-brand-800 px-4 py-2 text-sm font-medium disabled:opacity-50 transition-colors"
        >
          {loading ? "Gönderiliyor..." : linkSent ? "Link tekrar gönder" : "Doğrulama linki gönder"}
        </button>
      </div>
    </div>
  );
}
