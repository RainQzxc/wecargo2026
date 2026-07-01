"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Next.js redacts the real message in production, so `error.message` is
  // never shown to the user here — only the digest is a safe, stable reference.
  useEffect(() => {
    console.error("[dashboard-error]", error.digest, error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
      <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-4">
        <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
          />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-ink mb-2">Энэ хэсгийг ачаалж чадсангүй</h2>
      <p className="text-ink-3 text-sm mb-1 max-w-sm leading-6">
        Мэдээлэл татахад алдаа гарлаа. Ихэвчлэн сүлжээ тогтворгүй үед тохиолддог тул
        дахин оролдоно уу. Дахин давтагдвал системийн админд алдааны кодыг мэдэгдээрэй.
      </p>
      {error.digest && (
        <div className="mt-3 mb-1 rounded-lg bg-neutral-100 px-3 py-2 text-left">
          <p className="text-[10px] font-semibold text-ink-3 uppercase tracking-wide">
            Алдааны код
          </p>
          <p className="mt-0.5 font-mono text-xs text-ink-2 break-all">{error.digest}</p>
        </div>
      )}
      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={reset}
          className="px-5 py-2 bg-brand text-white rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
        >
          Дахин оролдох
        </button>
        <Link
          href="/dashboard"
          className="px-5 py-2 border border-neutral-200 text-ink rounded-lg font-medium text-sm hover:bg-neutral-100 transition-colors"
        >
          Самбар руу буцах
        </Link>
      </div>
    </div>
  );
}
