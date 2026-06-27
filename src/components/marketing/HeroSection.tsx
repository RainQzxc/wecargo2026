"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
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

/* ─── Parallax background layer ───────────────────────────────────────────── */
function BgLayer({ yPct }: { yPct: MotionValue<string> }) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ y: yPct }}
    >
      {/* Teal glow top-left */}
      <div className="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-[#06bbb4]/18 blur-[110px]" />
      {/* Secondary glow bottom-right */}
      <div className="absolute -bottom-32 right-[-80px] h-[420px] w-[420px] rounded-full bg-[#06bbb4]/10 blur-[90px]" />
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.038]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(6,187,180,.85) 1px,transparent 1px)," +
            "linear-gradient(90deg,rgba(6,187,180,.85) 1px,transparent 1px)",
          backgroundSize: "64px 64px",
        }}
        aria-hidden="true"
      />
      {/* Radial vignette (darkens edges so grid doesn't feel harsh) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_70%_at_50%_50%,transparent_30%,#060e0e_85%)]" />
    </motion.div>
  );
}

/* ─── Mid floating-shapes layer ───────────────────────────────────────────── */
function MidLayer({ yPct }: { yPct: MotionValue<string> }) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ y: yPct }}
      aria-hidden="true"
    >
      <div className="absolute right-[10%] top-[7%] h-28 w-28 rotate-[20deg] rounded-3xl border border-[#06bbb4]/18" />
      <div className="absolute bottom-[16%] left-[7%] h-40 w-40 rounded-full border border-[#06bbb4]/10" />
      <div className="absolute left-[48%] top-[24%] h-3 w-3 rounded-full bg-[#06bbb4]/45" />
      <div className="absolute bottom-[32%] right-[28%] h-2 w-2 rounded-full bg-[#06bbb4]/28" />
      <div className="absolute left-[20%] top-1/2 h-px w-20 bg-gradient-to-r from-transparent via-[#06bbb4]/35 to-transparent" />
      <div className="absolute right-[15%] top-1/2 h-16 w-px bg-gradient-to-b from-transparent via-[#06bbb4]/25 to-transparent" />
    </motion.div>
  );
}

/* ─── Dark live-tracking card ──────────────────────────────────────────────── */
const trackingSteps = [
  { label: "Агуулахад хүлээн авсан", done: true },
  { label: "Тээвэрлэгдэж байна", done: true, active: true },
  { label: "Салбарт ирсэн", done: false },
  { label: "Олгоход бэлэн", done: false },
];

function DarkTrackingCard({
  reduced,
}: {
  reduced: boolean | null | undefined;
}) {
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 32, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.95, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full max-w-[420px] rounded-[26px] border border-white/10 bg-white/[0.055] p-6 shadow-[0_40px_100px_rgba(0,0,0,0.55)] backdrop-blur-xl xl:max-w-[460px] xl:p-7"
    >
      {/* Card inner glow */}
      <div className="pointer-events-none absolute -inset-px rounded-[26px] bg-gradient-to-br from-[#06bbb4]/22 via-transparent to-transparent" />

      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#06bbb4] opacity-40" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#06bbb4]" />
          </span>
          <span className="text-[10px] font-black tracking-[0.22em] text-white/65">
            LIVE TRACKING
          </span>
        </div>
        <span className="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-[10px] font-bold text-white/45">
          Шинэчлэгдэж байна
        </span>
      </div>

      {/* Track code */}
      <div className="mb-5 rounded-[18px] border border-white/8 bg-white/5 p-4">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40">
          трак код
        </p>
        <p className="font-mono text-base font-black tracking-wider text-white">
          DPK364813798571
        </p>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="mb-2.5 flex items-center justify-between text-xs font-black text-white/55">
          <span>Эрээн</span>
          <span>Улаанбаатар</span>
        </div>
        <div className="relative h-2 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-[#06bbb4]"
            initial={{ width: "28%" }}
            animate={{ width: "58%" }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.55 }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="mb-5 space-y-3.5">
        {trackingSteps.map((step) => (
          <div key={step.label} className="flex items-center gap-3">
            <div
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                step.active
                  ? "bg-[#06bbb4] shadow-[0_0_0_6px_rgba(6,187,180,0.18)]"
                  : step.done
                    ? "bg-[#06bbb4]/22"
                    : "border border-white/15 bg-white/5"
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
              className={`text-sm leading-none ${
                step.active
                  ? "font-black text-white"
                  : step.done
                    ? "font-semibold text-white/60"
                    : "text-white/30"
              }`}
            >
              {step.label}
            </span>
            {step.active && (
              <span className="ml-auto rounded-full bg-[#06bbb4]/15 px-2.5 py-0.5 text-[10px] font-black text-[#06bbb4]">
                Одоо
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Status note */}
      <div className="rounded-[16px] border border-white/8 bg-white/5 p-4">
        <p className="text-sm font-black text-white">
          Таны ачаа Улаанбаатар руу замд явж байна.
        </p>
        <p className="mt-1 text-[11px] text-white/40">
          Сүүлд шинэчлэгдсэн: Өнөөдөр 09:15
        </p>
      </div>
    </motion.div>
  );
}

/* ─── Main hero ────────────────────────────────────────────────────────────── */
export default function HeroSection({ content = DEFAULT_HERO }: { content?: HeroContent }) {
  const heroRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  /* parallax speeds: bg slowest, mid medium, content fastest (still slower than scroll) */
  const bgY = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["0%", "38%"]);
  const midY = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["0%", "20%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["0%", "12%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.72], [1, 0]);

  return (
    <section
      ref={heroRef}
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-[#060e0e] lg:min-h-screen"
    >
      {/* Layer 1 – background glows + grid */}
      <BgLayer yPct={bgY} />

      {/* Layer 2 – floating geometric accents */}
      <MidLayer yPct={midY} />

      {/* Layer 3 – content */}
      <motion.div
        className="relative z-10 mx-auto w-full max-w-[1440px] px-5 pb-16 pt-24 sm:px-8 sm:pt-28 lg:px-16 lg:py-28"
        style={{ y: contentY, opacity: reduced ? undefined : contentOpacity }}
      >
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] xl:gap-20">
          {/* ── Left column ─────────────────────────────── */}
          <div>
            {/* Badge */}
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#06bbb4]/25 bg-[#06bbb4]/8 px-4 py-2"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#06bbb4]" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#06bbb4]">
                {content.badge}
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={reduced ? false : { opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="mb-5 text-[2.55rem] font-black leading-[0.95] tracking-[-0.04em] text-white sm:text-6xl lg:text-[4.8rem] xl:text-[5.6rem]"
            >
              {content.titleLine1}
              <br />
              <span className="text-[#06bbb4]">{content.titleHighlight}</span>
              <br />
              {content.titleLine3}
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={reduced ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
              className="mb-7 max-w-md text-base leading-relaxed text-white/52 sm:text-lg"
            >
              {content.description}
            </motion.p>

            {/* Tracking search – white card on dark bg (readable + high contrast) */}
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="mb-5 max-w-xl rounded-[22px] border border-white/15 bg-white p-3 shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
            >
              <TrackingSearch />
            </motion.div>

            {/* Secondary CTA */}
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-wrap gap-3"
            >
              <Link
                href="/link-order"
                className="inline-flex min-h-[48px] items-center rounded-xl border border-white/15 bg-white/8 px-6 text-sm font-black text-white transition-all hover:border-[#06bbb4]/50 hover:bg-[#06bbb4]/12 hover:text-[#06bbb4] focus:outline-none focus:ring-2 focus:ring-[#06bbb4]/30"
              >
                {content.ctaPrimary}
              </Link>
              <Link
                href="/cooperation"
                className="inline-flex min-h-[48px] items-center rounded-xl border border-white/10 bg-transparent px-6 text-sm font-black text-white/50 transition-all hover:border-white/25 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/15"
              >
                {content.ctaSecondary}
              </Link>
            </motion.div>
          </div>

          {/* ── Right column – dark tracking card (desktop only) ── */}
          <div className="hidden lg:flex lg:justify-end">
            <DarkTrackingCard reduced={reduced} />
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2"
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.8 }}
        style={{ opacity: reduced ? undefined : contentOpacity }}
        aria-hidden="true"
      >
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-white/28">
            Scroll
          </span>
          <div className="flex h-8 w-5 items-start justify-center rounded-full border border-white/15 p-1">
            <motion.div
              className="h-1.5 w-1 rounded-full bg-[#06bbb4]"
              animate={reduced ? {} : { y: [0, 9, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>
      </motion.div>

      {/* Gradient fade: dark hero → #f7f7f7 TrustBar */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[#060e0e]/60"
        aria-hidden="true"
      />
    </section>
  );
}
