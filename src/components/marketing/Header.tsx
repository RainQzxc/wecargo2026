"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "/track", label: "Ачаа хянах" },
  { href: "/#services", label: "Үйлчилгээ" },
  { href: "/pricing", label: "Тариф" },
  { href: "/link-order", label: "Линк захиалга" },
  { href: "/cooperation", label: "Хамтран ажиллах" },
  { href: "/contact", label: "Холбоо барих" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#e5e5e5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 shrink-0">
            <span className="text-[#111111] font-bold text-lg tracking-tight">
              WE<span className="text-[#06bbb4]">CARGO</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[#333333] hover:text-[#06bbb4] text-sm font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <Link
              href="/auth/login"
              className="text-[#333333] hover:text-[#06bbb4] text-sm font-medium transition-colors px-2 py-1"
            >
              Нэвтрэх
            </Link>
            <Link
              href="/track"
              className="px-4 py-2 bg-[#fe0000] hover:bg-[#fe0000]/90 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Ачаа шалгах
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden text-[#111111] p-2 rounded-lg hover:bg-[#f2f2f2] transition-colors"
            aria-label="Цэс нээх"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {open ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="lg:hidden border-t border-[#e5e5e5] py-4">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="px-2 py-2.5 text-[#333333] hover:text-[#06bbb4] text-sm font-medium transition-colors rounded-lg hover:bg-[#f2f2f2]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-4 pt-4 border-t border-[#e5e5e5] flex flex-col gap-2">
              <Link
                href="/auth/login"
                className="px-2 py-2.5 text-[#333333] text-sm font-medium"
              >
                Нэвтрэх
              </Link>
              <Link
                href="/track"
                className="px-4 py-2.5 bg-[#fe0000] text-white text-sm font-semibold rounded-lg text-center"
              >
                Ачаа шалгах
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
