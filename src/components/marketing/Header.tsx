"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ROUTES } from "@/constants/routes";

const navLinks = [
  { href: "/#services", label: "Үйлчилгээ" },
  { href: "/pricing", label: "Тариф" },
  { href: "/link-order", label: "Линк захиалга" },
  { href: "/contact", label: "Холбоо барих" },
];

function TrackIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4.5 6.75h11v10.5h-11V6.75Zm11 3.5h3l2 2.35v4.65h-5V10.25Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M8 19a1.75 1.75 0 1 0 0-3.5A1.75 1.75 0 0 0 8 19Zm10 0a1.75 1.75 0 1 0 0-3.5A1.75 1.75 0 0 0 18 19Z"
        fill="currentColor"
      />
    </svg>
  );
}

function LoginIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M9.5 7.75V6a2 2 0 0 1 2-2h6.75v16H11.5a2 2 0 0 1-2-2v-1.75"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M4 12h9m0 0-3-3m3 3-3 3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 px-2 py-2 sm:px-4">
      <div className="mx-auto max-w-[1440px] lg:relative">
        <div
          className={`flex items-center justify-between transition-all duration-300 ${
            scrolled
              ? "lg:mx-auto lg:w-fit lg:justify-center lg:gap-1"
              : "lg:w-full lg:justify-between lg:gap-8"
          }`}
        >
          <Link
            href="/"
            className={`flex min-h-12 items-center rounded-2xl border border-[#e5e5e5] bg-white/92 px-3 shadow-[0_1px_2px_rgba(17,17,17,0.05)] backdrop-blur transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#06bbb4]/30 ${
              scrolled ? "lg:rounded-[22px] lg:px-3" : "lg:rounded-[22px] lg:px-4"
            }`}
          >
            <Image
              src="/logo wecargo for white bg.png"
              alt="WECARGO"
              width={156}
              height={48}
              className="h-8 w-auto object-contain sm:h-9"
              priority
            />
          </Link>

          <nav
            className={`hidden min-h-12 items-center rounded-2xl border border-[#e5e5e5] bg-white/92 px-7 shadow-[0_1px_2px_rgba(17,17,17,0.05)] backdrop-blur transition-all duration-300 lg:flex ${
              scrolled
                ? "gap-8 rounded-[22px]"
                : "absolute left-1/2 top-0 -translate-x-1/2 gap-10 rounded-[22px]"
            }`}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-1 py-2 text-sm font-medium text-[#333333] transition-colors hover:text-[#06bbb4] focus:outline-none focus:ring-2 focus:ring-[#06bbb4]/25"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden min-h-12 items-center rounded-2xl border border-[#e5e5e5] bg-white/92 p-1.5 shadow-[0_1px_2px_rgba(17,17,17,0.05)] backdrop-blur lg:flex">
            <Link
              href="/track"
              aria-label="Ачаа хянах"
              className="grid h-10 w-10 place-items-center rounded-xl bg-[#111111] text-white transition-colors hover:bg-[#06bbb4] focus:outline-none focus:ring-2 focus:ring-[#06bbb4]/30 focus:ring-offset-2"
            >
              <TrackIcon />
            </Link>
            <Link
              href={ROUTES.login}
              aria-label="Нэвтрэх"
              className="grid h-10 w-10 place-items-center rounded-xl bg-[#f2f2f2] text-[#111111] transition-colors hover:bg-[#06bbb4] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#06bbb4]/30 focus:ring-offset-2"
            >
              <LoginIcon />
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-2xl border border-[#e5e5e5] bg-white/92 text-[#111111] shadow-[0_1px_2px_rgba(17,17,17,0.05)] backdrop-blur transition-colors hover:bg-[#f2f2f2] focus:outline-none focus:ring-2 focus:ring-[#06bbb4]/25 lg:hidden"
            aria-label="Цэс нээх"
            aria-expanded={open}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 7h16M4 12h16M4 17h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-[60] bg-[#111111]/35 lg:hidden">
          <div className="ml-auto h-dvh w-[90vw] max-w-[390px] bg-white shadow-2xl">
            <div className="flex items-center justify-between px-5 pt-4">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="flex min-h-11 items-center rounded-lg pr-2 focus:outline-none focus:ring-2 focus:ring-[#06bbb4]/30"
              >
                <Image
                  src="/logo wecargo for white bg.png"
                  alt="WECARGO"
                  width={156}
                  height={48}
                  className="h-9 w-auto object-contain"
                />
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl bg-[#f2f2f2] text-[#111111] transition-colors hover:bg-[#e5e5e5] focus:outline-none focus:ring-2 focus:ring-[#06bbb4]/25"
                aria-label="Цэс хаах"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="flex h-[calc(100dvh-68px)] flex-col px-5 pb-6 pt-20">
              <nav className="grid gap-7">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="min-h-11 text-base font-medium text-[#111111] transition-colors hover:text-[#06bbb4] focus:outline-none focus:ring-2 focus:ring-[#06bbb4]/25"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-9 border-t border-[#e5e5e5] pt-6">
                <Link
                  href={ROUTES.login}
                  onClick={() => setOpen(false)}
                  className="flex min-h-12 w-full items-center justify-center rounded-full bg-[#06bbb4] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#06bbb4]/90 focus:outline-none focus:ring-2 focus:ring-[#06bbb4]/30 focus:ring-offset-2"
                >
                  Нэвтрэх
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
