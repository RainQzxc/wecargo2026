"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Next.js redacts the real message in production, so `error.message` is
  // never shown to the user here — it can be blank, internal, or in English.
  // Only the digest (a stable reference code) is safe and useful to surface.
  useEffect(() => {
    console.error("[app-error]", error.digest, error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-ink mb-2">Хуудас ачаалахад алдаа гарлаа</h1>
        <p className="text-ink-3 mb-6 text-sm leading-6">
          Уучлаарай, түр зуурын алдаа гарлаа. Энэ нь ихэвчлэн сүлжээний асуудал эсвэл
          серверийн ачааллаас шалтгаална. Доорх товчоор дахин оролдоно уу.
        </p>
        {error.digest && (
          <div className="mb-5 rounded-lg bg-neutral-100 px-3 py-2.5 text-left">
            <p className="text-[11px] font-semibold text-ink-3 uppercase tracking-wide">
              Алдааны код (дэмжлэгт хандахдаа дурдана уу)
            </p>
            <p className="mt-0.5 font-mono text-xs text-ink-2 break-all">{error.digest}</p>
          </div>
        )}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="px-5 py-2.5 bg-brand text-white rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
          >
            Дахин оролдох
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 border border-neutral-200 text-ink rounded-lg font-medium text-sm hover:bg-neutral-100 transition-colors"
          >
            Нүүр хуудас
          </Link>
        </div>
      </div>
    </div>
  );
}
