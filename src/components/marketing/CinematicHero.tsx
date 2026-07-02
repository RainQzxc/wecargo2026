"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import TrackingSearch from "./TrackingSearch";
import CargoBox3D from "./CargoBox3D";
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

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

/** Split a phrase into words that rise in with a stagger. */
function Words({ text, className = "" }: { text: string; className?: string }) {
  return (
    <>
      {text.split(" ").map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className={`inline-block ${className}`}
            variants={{
              hidden: { y: "0.9em", opacity: 0 },
              show: { y: 0, opacity: 1, transition: { duration: 0.7, ease: EASE } },
            }}
          >
            {word}
            {" "}
          </motion.span>
        </span>
      ))}
    </>
  );
}

export default function CinematicHero({ content = DEFAULT_HERO }: { content?: HeroContent }) {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  /* ── Pointer parallax (spring-damped; harmless on touch — no move events) ── */
  const px = useMotionValue(0); // -0.5 … 0.5
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 60, damping: 18 });
  const sy = useSpring(py, { stiffness: 60, damping: 18 });

  const gridX = useTransform(sx, (v) => v * -18);
  const gridY = useTransform(sy, (v) => v * -12);
  const glowX = useTransform(sx, (v) => v * 36);
  const glowY = useTransform(sy, (v) => v * 26);
  const boxRotY = useTransform(sx, (v) => -18 + v * 34);
  const boxRotX = useTransform(sy, (v) => 12 + v * -22);

  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (reduced) return;
    const r = sectionRef.current?.getBoundingClientRect();
    if (!r) return;
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };

  /* ── Scroll exit: content drifts up + fades as the journey act takes over ── */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const exitY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const exitOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section
      ref={sectionRef}
      onPointerMove={onPointerMove}
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-[#060e0e] lg:min-h-screen"
    >
      {/* Depth layer 1 — drifting hairline grid */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-10 opacity-[0.05]"
        style={{
          x: reduced ? 0 : gridX,
          y: reduced ? 0 : gridY,
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />
      {/* Depth layer 2 — atmospheric teal glow following the pointer */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 h-[46rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#06bbb4]/[0.07] blur-[100px]"
        style={{ x: reduced ? 0 : glowX, y: reduced ? 0 : glowY }}
      />

      <motion.div
        className="relative z-10 mx-auto w-full max-w-[1280px] px-5 pb-16 pt-28 sm:px-8 sm:pt-32 lg:px-16 lg:py-32"
        style={reduced ? undefined : { y: exitY, opacity: exitOpacity }}
      >
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] xl:gap-20">
          {/* Left — copy */}
          <motion.div
            initial={reduced ? "show" : "hidden"}
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.055, delayChildren: 0.15 } } }}
          >
            <motion.div
              className="mb-6 flex items-center gap-2"
              variants={{
                hidden: { opacity: 0, y: 14 },
                show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
              }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#06bbb4]" />
              <span className="text-sm font-medium text-[#06bbb4]">{content.badge}</span>
            </motion.div>

            <h1 className="mb-6 text-[2.6rem] font-semibold leading-[1.02] tracking-[-0.03em] text-white sm:text-6xl lg:text-[4.6rem] xl:text-[5.2rem]">
              <Words text={content.titleLine1} />
              <br />
              <Words text={content.titleHighlight} className="text-[#06bbb4]" />
              <br />
              <Words text={content.titleLine3} />
            </h1>

            <motion.p
              className="mb-8 max-w-md text-lg leading-relaxed text-white/55"
              variants={{
                hidden: { opacity: 0, y: 16 },
                show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
              }}
            >
              {content.description}
            </motion.p>

            <motion.div
              className="mb-5 max-w-xl rounded-[22px] bg-white p-3 shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
              variants={{
                hidden: { opacity: 0, y: 18 },
                show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
              }}
            >
              <TrackingSearch />
            </motion.div>

            <motion.div
              className="flex flex-wrap gap-3"
              variants={{
                hidden: { opacity: 0, y: 14 },
                show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
              }}
            >
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
          </motion.div>

          {/* Right — the parcel itself, alive under the pointer */}
          <motion.div
            className="hidden items-center justify-center lg:flex"
            initial={reduced ? false : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.35, ease: EASE }}
          >
            <div className="relative">
              <CargoBox3D
                rotateX={reduced ? 14 : boxRotX}
                rotateY={reduced ? -22 : boxRotY}
                size={250}
              />
              {/* Ground shadow */}
              <div
                aria-hidden
                className="absolute left-1/2 top-full mt-10 h-8 w-56 -translate-x-1/2 rounded-full bg-black/50 blur-2xl"
              />
              <p className="mt-16 text-center font-mono text-[11px] tracking-[0.2em] text-white/30">
                НЭГ ХАЙРЦАГНЫ АЯЛАЛ ↓
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
