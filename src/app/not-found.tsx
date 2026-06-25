import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Хуудас олдсонгүй",
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="max-w-md w-full text-center">
        <p className="text-6xl font-black tracking-[-0.05em] text-brand">404</p>
        <h1 className="mt-4 text-2xl font-bold text-ink">Хуудас олдсонгүй</h1>
        <p className="mt-2 mb-6 text-sm text-ink-3">
          Таны хайсан хуудас байхгүй эсвэл зөөгдсөн байна.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="px-5 py-2.5 bg-brand text-white rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
          >
            Нүүр хуудас
          </Link>
          <Link
            href="/track"
            className="px-5 py-2.5 border border-neutral-200 text-ink rounded-lg font-medium text-sm hover:bg-neutral-100 transition-colors"
          >
            Ачаа хайх
          </Link>
        </div>
      </div>
    </div>
  );
}
