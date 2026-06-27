"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import TrackingSearch from "./TrackingSearch";
import { SITE_CONTENT_DEFAULTS } from "@/features/content/site-content";

export interface HeroContent {
  badge: string;
  titleLine1: string;
  titleHighlight: string;
  titleLine3: string;
  description: string;
  ctaPrimary: string;
  ctaSecondary: string;
}

const DEFAULT_HERO: HeroContent = {
  badge: SITE_CONTENT_DEFAULTS["home.hero.badge"],
  titleLine1: SITE_CONTENT_DEFAULTS["home.hero.titleLine1"],
  titleHighlight: SITE_CONTENT_DEFAULTS["home.hero.titleHighlight"],
  titleLine3: SITE_CONTENT_DEFAULTS["home.hero.titleLine3"],
  description: SITE_CONTENT_DEFAULTS["home.hero.description"],
  ctaPrimary: SITE_CONTENT_DEFAULTS["home.hero.ctaPrimary"],
  ctaSecondary: SITE_CONTENT_DEFAULTS["home.hero.ctaSecondary"],
};

/* ─── Real product: live-tracking card ─────────────────────────────────────── */
const trackingSteps = [
  { label: "Агуулахад хүлээн авсан", done: true },
  { label: "Тээвэрлэгдэж байна", done: true, active: true },
  { label: "Салбарт ирсэн", done: false },
  { label: "Олгоход бэлэн", done: false },
];

function TrackingCard() {
  return (
    <div className="relative w-full max-w-[420px] rounded-[26px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl xl:max-w-[460px] xl:p-7">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#06bbb4] opacity-40" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#06bbb4]" />
          </span>
          <span className="text-xs font-medium tracking-wide text-white/55">Идэвхтэй хяналт</span>
        </div>
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-white/45">
          Шинэчлэгдэж байна
        </span>
      </div>

      <div className="mb-5 rounded-[18px] border border-white/8 bg-white/[0.03] p-4">
        <p className="mb-1 text-xs font-medium text-white/40">Трак код</p>
        <p className="font-mono text-base font-semibold tracking-wider text-white">
          DPK364813798571
        </p>
      </div>

      <div className="mb-6">
        <div className="mb-2.5 flex items-center justify-between text-sm font-medium text-white/55">
          <span>Эрээн</span>
          <span>Улаанбаатар</span>
        </div>
        <div className="relative h-1.5 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-[58%] rounded-full bg-[#06bbb4]" />
        </div>
      </div>

      <div className="space-y-3.5">
        {trackingSteps.map((step) => (
          <div key={step.label} className="flex items-center gap-3">
            <div
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                step.active ? "bg-[#06bbb4]" : step.done ? "bg-[#06bbb4]/22" : "border border-white/15"
              }`}
            >
              {step.done ? (
                <svg
                  className={`h-2.5 w-2.5 ${step.active ? "text-white" : "text-[#06bbb4]"}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <span className="h-1 w-1 rounded-full bg-white/30" />
              )}
            </div>
            <span
              className={`text-sm ${
                step.active
                  ? "font-medium text-white"
                  : step.done
                    ? "text-white/60"
                    : "text-white/30"
              }`}
            >
              {step.label}
            </span>
            {step.active && (
              <span className="ml-auto text-xs font-medium text-[#06bbb4]">Одоо</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main hero ────────────────────────────────────────────────────────────── */
export default function HeroSection({ content = DEFAULT_HERO }: { content?: HeroContent }) {
  const reduced = useReducedMotion();
  const enter = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: {
            duration: 0.5,
            delay,
            ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
          },
        };

  return (
    <section className="relative flex min-h-[100svh] items-center bg-[#060e0e] lg:min-h-screen">
      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-5 pb-16 pt-28 sm:px-8 sm:pt-32 lg:px-16 lg:py-32">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] xl:gap-20">
          {/* Left column */}
          <div>
            <motion.div {...enter(0)} className="mb-6 inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#06bbb4]" />
              <span className="text-sm font-medium text-[#06bbb4]">{content.badge}</span>
            </motion.div>

            <motion.h1
              {...enter(0.06)}
              className="mb-6 text-[2.6rem] font-semibold leading-[1.02] tracking-[-0.03em] text-white sm:text-6xl lg:text-[4.6rem] xl:text-[5.2rem]"
            >
              {content.titleLine1}
              <br />
              <span className="text-[#06bbb4]">{content.titleHighlight}</span>
              <br />
              {content.titleLine3}
            </motion.h1>

            <motion.p
              {...enter(0.12)}
              className="mb-8 max-w-md text-lg leading-relaxed text-white/55"
            >
              {content.description}
            </motion.p>

            <motion.div
              {...enter(0.18)}
              className="mb-5 max-w-xl rounded-[22px] bg-white p-3 shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
            >
              <TrackingSearch />
            </motion.div>

            <motion.div {...enter(0.24)} className="flex flex-wrap gap-3">
              <Link
                href="/link-order"
                className="inline-flex min-h-12 items-center rounded-full border border-white/15 px-6 text-sm font-medium text-white transition-colors hover:border-[#06bbb4]/60 hover:text-[#06bbb4] focus:outline-none focus:ring-2 focus:ring-[#06bbb4]/30"
              >
                {content.ctaPrimary}
              </Link>
              <Link
                href="/cooperation"
                className="inline-flex min-h-12 items-center rounded-full px-6 text-sm font-medium text-white/55 transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-white/15"
              >
                {content.ctaSecondary}
              </Link>
            </motion.div>
          </div>

          {/* Right column — real product UI */}
          <motion.div {...enter(0.2)} className="hidden lg:flex lg:justify-end">
            <TrackingCard />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
