import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export default function Forbidden() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-ink mb-2">Танд энэ хэсэгт хандах эрх байхгүй</h1>
        <p className="text-ink-3 mb-6 text-sm leading-6">
          Та нэвтэрсэн байгаа ч энэ хуудсыг харах зөвшөөрөл (эрх) танд олгогдоогүй байна.
          Хэрэв энэ буруу гэж бодож байвал системийн админтай холбогдоно уу.
        </p>
        <Link
          href={ROUTES.dashboard.root}
          className="inline-block px-5 py-2.5 bg-brand text-white rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
        >
          Самбар руу буцах
        </Link>
      </div>
    </div>
  );
}
