"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "motion/react";

const LAYOUT_TRANSITION = { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const };
import { ROUTES } from "@/constants/routes";

const navLinks = [
  { href: "/#services", label: "Үйлчилгээ" },
  { href: "/pricing", label: "Тариф" },
  { href: "/link-order", label: "Линк захиалга" },
  { href: "/contact", label: "Холбоо барих" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  // Header stays fixed and visible — it never disappears. On scroll-down it
  // COLLAPSES: the row drops `justify-between` and the three pills cluster
  // centered (lg:w-fit + justify-center). Back at the top it EXPANDS to
  // justify-between. motion `layout` animates the reflow smoothly because
  // justify-content / width are not CSS-transitionable.
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  return (
    <header className="sticky top-0 z-50 px-2 py-2 sm:px-4">
      <div className="mx-auto max-w-[1440px]">
        <motion.div
          layout
          transition={LAYOUT_TRANSITION}
          className={`flex items-center justify-between gap-3 ${
            scrolled
              ? "lg:mx-auto lg:w-fit lg:justify-center lg:gap-3"
              : "lg:w-full lg:justify-between lg:gap-8"
          }`}
        >
          <motion.div layout transition={LAYOUT_TRANSITION}>
          <Link
            href="/"
            className="flex min-h-12 items-center rounded-[22px] border border-[#e5e5e5] bg-white/92 px-3 shadow-[0_12px_34px_rgba(17,17,17,0.08)] backdrop-blur transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#06bbb4]/30 lg:px-4"
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
          </motion.div>

          <motion.nav
            layout
            transition={LAYOUT_TRANSITION}
            className={`hidden min-h-12 items-center rounded-[22px] border border-[#e5e5e5] bg-white/92 shadow-[0_12px_34px_rgba(17,17,17,0.08)] backdrop-blur transition-[gap,padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:flex ${
              scrolled ? "gap-6 px-5" : "gap-10 px-7"
            }`}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-1 py-2 text-sm font-bold text-[#333333] transition-colors hover:text-[#06bbb4] focus:outline-none focus:ring-2 focus:ring-[#06bbb4]/25"
              >
                {link.label}
              </Link>
            ))}
          </motion.nav>

          <motion.div
            layout
            transition={LAYOUT_TRANSITION}
            className="hidden min-h-12 items-center rounded-2xl border border-[#e5e5e5] bg-white/92 p-1.5 shadow-[0_12px_34px_rgba(17,17,17,0.08)] backdrop-blur lg:flex"
          >
            <Link
              href={ROUTES.login}
              className="inline-flex h-10 items-center rounded-xl bg-[#f2f2f2] px-5 text-sm font-bold text-[#111111] transition-colors hover:bg-[#06bbb4] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#06bbb4]/30 focus:ring-offset-2"
            >
              Нэвтрэх
            </Link>
          </motion.div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-2xl border border-[#e5e5e5] bg-white/92 text-[#111111] shadow-[0_12px_34px_rgba(17,17,17,0.08)] backdrop-blur transition-colors hover:bg-[#f2f2f2] focus:outline-none focus:ring-2 focus:ring-[#06bbb4]/25 lg:hidden"
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
        </motion.div>
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
                    className="min-h-11 text-[15px] font-black uppercase tracking-[0.02em] text-[#111111] transition-colors hover:text-[#06bbb4] focus:outline-none focus:ring-2 focus:ring-[#06bbb4]/25"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-9 border-t border-[#e5e5e5] pt-6">
                <Link
                  href={ROUTES.login}
                  onClick={() => setOpen(false)}
                  className="flex min-h-12 w-full items-center justify-center rounded-xl bg-[#06bbb4] px-4 py-3 text-sm font-black uppercase tracking-[0.03em] text-white shadow-sm transition-colors hover:bg-[#06bbb4]/90 focus:outline-none focus:ring-2 focus:ring-[#06bbb4]/30 focus:ring-offset-2"
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
