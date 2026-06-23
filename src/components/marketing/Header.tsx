"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "/#services", label: "Үйлчилгээ" },
  { href: "/pricing", label: "Тариф" },
  { href: "/link-order", label: "Линк захиалга" },
  { href: "/contact", label: "Холбоо барих" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#e5e5e5] bg-white/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between sm:h-16">
          <Link
            href="/"
            className="flex min-h-11 items-center gap-1.5 rounded-lg pr-2 focus:outline-none focus:ring-2 focus:ring-[#06bbb4]/30"
          >
            <span className="text-lg font-black tracking-[-0.02em] text-[#111111]">
              WE<span className="text-[#06bbb4]">CARGO</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-1 py-2 text-sm font-semibold text-[#333333] transition-colors hover:text-[#06bbb4] focus:outline-none focus:ring-2 focus:ring-[#06bbb4]/25"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              href="/auth/login"
              className="rounded-xl bg-[#06bbb4] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#049c96] focus:outline-none focus:ring-2 focus:ring-[#06bbb4]/30 focus:ring-offset-2"
            >
              Нэвтрэх
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl text-[#111111] transition-colors hover:bg-[#f2f2f2] focus:outline-none focus:ring-2 focus:ring-[#06bbb4]/25 lg:hidden"
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
                <span className="text-xl font-black tracking-[-0.02em] text-[#111111]">
                  WE<span className="text-[#06bbb4]">CARGO</span>
                </span>
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
                    className="min-h-11 text-[15px] font-black uppercase tracking-[0.02em] text-[#111111] transition-colors hover:text-[#06bbb4] focus:outline-none focus:ring-2 focus:ring-[#06bbb4]/25"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-9 border-t border-[#e5e5e5] pt-6">
                <Link
                  href="/auth/login"
                  onClick={() => setOpen(false)}
                  className="flex min-h-12 w-full items-center justify-center rounded-xl bg-[#06bbb4] px-4 py-3 text-sm font-black uppercase tracking-[0.03em] text-white shadow-sm transition-colors hover:bg-[#049c96] focus:outline-none focus:ring-2 focus:ring-[#06bbb4]/30 focus:ring-offset-2"
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
