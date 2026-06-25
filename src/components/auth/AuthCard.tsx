import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";

/**
 * Shared centered card shell for the standalone auth pages (register, forgot /
 * reset password). Matches the customer-portal light aesthetic.
 */
export function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <main className="grid min-h-[100svh] place-items-center bg-[#f7fbfa] px-5 py-10 text-[#081f1f]">
      <div className="w-full max-w-[440px]">
        <Link
          href="/"
          className="mb-8 flex items-center justify-center rounded-xl focus:outline-none focus:ring-4 focus:ring-[#06bbb4]/15"
          aria-label="WECARGO нүүр хуудас"
        >
          <Image
            src="/logo wecargo for white bg.png"
            alt="WECARGO"
            width={160}
            height={48}
            className="h-9 w-auto object-contain"
            priority
          />
        </Link>

        <div className="rounded-[24px] border border-[#dfe8e7] bg-white px-6 py-8 shadow-[0_24px_80px_rgba(8,31,31,0.08)] sm:px-8">
          <h1 className="text-2xl font-black tracking-[-0.03em] text-[#061a2f]">{title}</h1>
          {subtitle ? <p className="mt-2 text-sm leading-6 text-[#667085]">{subtitle}</p> : null}

          <div className="mt-6">{children}</div>

          {footer ? <div className="mt-6 text-center text-sm">{footer}</div> : null}
        </div>
      </div>
    </main>
  );
}
