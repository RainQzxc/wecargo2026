"use client";

import Link from "next/link";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
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
      <h2 className="text-xl font-bold text-ink mb-2">Алдаа гарлаа</h2>
      <p className="text-ink-3 text-sm mb-1 max-w-sm">
        {error.message || "Хуудас ачаалахад алдаа гарлаа."}
      </p>
      {error.digest && (
        <p className="text-xs text-ink-3 mb-4 font-mono bg-neutral-100 px-2 py-1 rounded">
          {error.digest}
        </p>
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
