"use client";

import { ReactNode } from "react";

/** Sayfa arka planı: canvas.bg + dekoratif blur orb'lar (tasarım sistemine uygun) */
export function CanvasLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FAFAF9] relative">
      {/* Dekoratif blur orb'lar - fixed, pointer-events-none */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-40 -right-40 w-[400px] h-[400px] rounded-full bg-brand-200/30 blur-[100px] mix-blend-multiply"
          aria-hidden
        />
        <div
          className="absolute top-1/2 -left-32 w-[320px] h-[320px] rounded-full bg-blue-100/40 blur-[80px] mix-blend-multiply"
          aria-hidden
        />
        <div
          className="absolute bottom-20 right-1/4 w-[280px] h-[280px] rounded-full bg-orange-100/40 blur-[90px] mix-blend-multiply animate-orb-pulse"
          aria-hidden
        />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
