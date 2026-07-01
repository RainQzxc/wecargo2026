import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-ink mb-2">Эхлээд нэвтэрнэ үү</h1>
        <p className="text-ink-3 mb-6 text-sm leading-6">
          Энэ хуудсыг харахын тулд өөрийн бүртгэлээр нэвтрэх шаардлагатай.
        </p>
        <Link
          href={ROUTES.login}
          className="inline-block px-5 py-2.5 bg-brand text-white rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
        >
          Нэвтрэх хуудас руу очих
        </Link>
      </div>
    </div>
  );
}
