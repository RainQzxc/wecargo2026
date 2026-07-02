"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import CargoBox3D from "./CargoBox3D";

/**
 * The signature act of the landing page: a pinned, scroll-driven film of one
 * parcel travelling Эрээн → Улаанбаатар. Scroll is the timeline — the route
 * draws itself, a glowing marker rides the path, a km counter ticks, the
 * branded 3D box tumbles in space, and an arrival stamp lands at the end.
 *
 * Desktop only; phones get the vertical timeline and `prefers-reduced-motion`
 * gets a static grid.
 */

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];
const ROUTE_KM = 660;
const DRAW_START = 0.08;
const DRAW_END = 0.85;

const steps = [
  { no: "01", place: "Эрээн", title: "Бараа агуулахад ирнэ" },
  { no: "02", place: "Бүртгэл", title: "Track code-оор бүртгэгдэнэ" },
  { no: "03", place: "Ачилт", title: "Машинд ачигдаж замдаа гарна" },
  { no: "04", place: "Зам", title: "Эрээн → Улаанбаатар" },
  { no: "05", place: "Улаанбаатар", title: "Хотод ирж ангилагдана" },
  { no: "06", place: "Хүлээн авалт", title: "Та ачаагаа авна", last: true },
];

const ROUTE_PATH = "M 60 330 C 260 200 480 150 660 200 C 800 240 880 250 940 220";

/* ── Shared heading ────────────────────────────────────────────────────── */
function Heading({ light = false }: { light?: boolean }) {
  return (
    <div>
      <span
        className={`mb-4 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold ${
          light ? "bg-[#06bbb4]/10 text-[#04766f]" : "bg-white/8 text-[#06bbb4]"
        }`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[#06bbb4]" />
        Таны ачааны аялал
      </span>
      <h2
        className={`text-3xl font-semibold leading-tight tracking-[-0.03em] md:text-5xl ${
          light ? "text-[#1d1d1f]" : "text-white"
        }`}
      >
        Эрээнээс гэрийн босго хүртэл
        <br className="hidden sm:block" />
        <span className="text-[#06bbb4]"> алхам бүр тодорхой.</span>
      </h2>
    </div>
  );
}

/* ── Mobile: vertical timeline (light) ─────────────────────────────────── */
function MobileTimeline() {
  return (
    <div className="relative isolate overflow-hidden bg-[#f7f7f7] py-20 sm:py-24 lg:hidden">
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-80"
        style={{ backgroundImage: "url('/journey-bg.svg')" }}
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(247,247,247,0.88)_0%,rgba(247,247,247,0.68)_42%,rgba(247,247,247,0.9)_100%)]" />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6">
        <Heading light />
        <div className="relative mt-10">
          <div className="absolute bottom-4 left-[27px] top-4 w-px bg-[#1d1d1f]/10" />
          <div className="space-y-4">
            {steps.map((p) => (
              <motion.div
                key={p.no}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4 }}
                className="relative flex items-start gap-5"
              >
                <div
                  className={`relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl font-semibold text-white ${
                    p.last ? "bg-[#fe0000]" : "bg-[#06bbb4]"
                  }`}
                >
                  {p.no}
                </div>
                <div className="flex-1 rounded-2xl border border-[#e5e5e5] bg-white/90 p-5 shadow-[0_14px_40px_rgba(17,17,17,0.08)] backdrop-blur-md">
                  <span
                    className={`text-xs font-semibold ${p.last ? "text-[#fe0000]" : "text-[#04766f]"}`}
                  >
                    {p.place}
                  </span>
                  <h3 className="mt-1 text-lg font-semibold text-[#1d1d1f]">{p.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Reduced motion: static grid (dark) ────────────────────────────────── */
function StaticGrid() {
  return (
    <div className="hidden bg-[#0a1211] py-32 lg:block">
      <div className="mx-auto max-w-7xl px-8">
        <Heading />
        <div className="mt-12 grid grid-cols-3 gap-6">
          {steps.map((p) => (
            <div key={p.no} className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
              <div className="flex items-start justify-between">
                <span
                  className={`text-6xl font-semibold leading-none ${
                    p.last ? "text-[#fe0000]/25" : "text-[#06bbb4]/25"
                  }`}
                >
                  {p.no}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    p.last ? "bg-[#fe0000]/10 text-[#fe4d4d]" : "bg-[#06bbb4]/10 text-[#06bbb4]"
                  }`}
                >
                  {p.place}
                </span>
              </div>
              <h3 className="mt-8 text-2xl font-semibold tracking-tight text-white">{p.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Desktop: the pinned film ──────────────────────────────────────────── */
function DesktopCinema() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const pathLenRef = useRef(1);
  const [step, setStep] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  /* Route drawing + marker position */
  const draw = useTransform(scrollYProgress, [DRAW_START, DRAW_END], [0, 1]);
  const markerX = useMotionValue(60);
  const markerY = useMotionValue(330);

  useEffect(() => {
    if (pathRef.current) pathLenRef.current = pathRef.current.getTotalLength();
  }, []);

  useMotionValueEvent(draw, "change", (v) => {
    const path = pathRef.current;
    if (!path) return;
    const pt = path.getPointAtLength(v * pathLenRef.current);
    markerX.set(pt.x);
    markerY.set(pt.y);
  });

  /* Step captions follow the same window as the drawing */
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const t = Math.min(1, Math.max(0, (v - DRAW_START) / (DRAW_END - DRAW_START)));
    setStep(Math.min(steps.length - 1, Math.floor(t * steps.length)));
  });

  const km = useTransform(draw, (v) => Math.round(v * ROUTE_KM));

  /* The parcel tumbles as it travels */
  const boxRotY = useTransform(scrollYProgress, [0, 1], [-30, 320]);
  const boxRotX = useTransform(scrollYProgress, [0, 0.5, 1], [16, 6, 16]);
  const boxX = useTransform(scrollYProgress, [DRAW_START, DRAW_END], ["-16%", "16%"]);

  /* Arrival stamp */
  const stampOpacity = useTransform(scrollYProgress, [0.87, 0.94], [0, 1]);
  const stampScale = useTransform(scrollYProgress, [0.87, 0.94], [1.4, 1]);

  /* Progress rail */
  const rail = useTransform(scrollYProgress, [0.02, 0.95], [0, 1]);

  const active = steps[step];

  return (
    <div ref={containerRef} className="relative hidden lg:block" style={{ height: "380vh" }}>
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden bg-[#0a1211]">
        {/* faint grid backdrop */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.045]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />

        {/* Heading */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-8 pt-24">
          <Heading />
        </div>

        {/* Route + parcel */}
        <div className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-8">
          {/* The parcel, airborne above the route */}
          <motion.div
            className="absolute left-1/2 top-[6%] z-20 -translate-x-1/2"
            style={{ x: boxX }}
          >
            <CargoBox3D rotateX={boxRotX} rotateY={boxRotY} size={170} />
          </motion.div>

          <svg viewBox="0 0 1000 420" fill="none" className="h-full w-full" aria-hidden>
            {/* base path (faint) */}
            <path
              d={ROUTE_PATH}
              stroke="rgba(255,255,255,0.14)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="2 9"
            />
            {/* drawn path */}
            <motion.path
              ref={pathRef}
              d={ROUTE_PATH}
              stroke="#06bbb4"
              strokeWidth="3"
              strokeLinecap="round"
              style={{ pathLength: draw }}
            />
            {/* endpoints */}
            <circle cx="60" cy="330" r="7" fill="#06bbb4" />
            <circle cx="940" cy="220" r="7" fill="#fe0000" />
            {/* travelling marker + glow */}
            <motion.g style={{ x: markerX, y: markerY }}>
              <circle r="16" fill="#06bbb4" opacity="0.18" />
              <circle r="6" fill="#ffffff" />
            </motion.g>
          </svg>

          {/* City labels */}
          <div className="pointer-events-none absolute bottom-[10%] left-8">
            <p className="font-mono text-[11px] tracking-[0.18em] text-white/40">CN · ГАРАЛ</p>
            <p className="text-2xl font-semibold text-white">Эрээн</p>
          </div>
          <div className="pointer-events-none absolute right-8 top-[30%] text-right">
            <p className="font-mono text-[11px] tracking-[0.18em] text-white/40">MN · ОЧИХ ГАЗАР</p>
            <p className="text-2xl font-semibold text-white">Улаанбаатар</p>
          </div>

          {/* Arrival stamp */}
          <motion.div
            className="pointer-events-none absolute right-[4%] top-[16%] rotate-[-8deg]"
            style={{ opacity: stampOpacity, scale: stampScale }}
          >
            <div className="rounded-lg border-[3px] border-[#06bbb4] px-5 py-2">
              <p className="text-xl font-semibold tracking-[0.14em] text-[#06bbb4]">ИРЛЭЭ</p>
            </div>
          </motion.div>
        </div>

        {/* Bottom bar: step caption + km counter */}
        <div className="relative z-10 mx-auto flex w-full max-w-7xl items-end justify-between gap-8 px-8 pb-16">
          <div className="min-h-[92px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.no}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.32, ease: EASE }}
                className="flex items-center gap-5"
              >
                <span
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-semibold text-white ${
                    active.last ? "bg-[#fe0000]" : "bg-[#06bbb4]"
                  }`}
                >
                  {active.no}
                </span>
                <div>
                  <p
                    className={`text-xs font-semibold ${
                      active.last ? "text-[#fe4d4d]" : "text-[#06bbb4]"
                    }`}
                  >
                    {active.place}
                  </p>
                  <p className="mt-1 text-2xl font-semibold tracking-tight text-white">
                    {active.title}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="text-right">
            <p className="font-mono text-[11px] tracking-[0.18em] text-white/40">ТУУЛСАН ЗАМ</p>
            <p className="font-mono text-4xl font-semibold tabular-nums text-white">
              <motion.span>{km}</motion.span>
              <span className="ml-1 text-lg text-white/45">/ {ROUTE_KM} км</span>
            </p>
          </div>
        </div>

        {/* Progress rail */}
        <div className="absolute right-5 top-1/2 z-10 h-40 w-[3px] -translate-y-1/2 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="w-full origin-top rounded-full bg-[#06bbb4]"
            style={{ scaleY: rail, height: "100%" }}
          />
        </div>
      </div>
    </div>
  );
}

export default function JourneyCinema() {
  const reduced = useReducedMotion();
  return (
    <section aria-label="Таны ачааны аялал">
      <MobileTimeline />
      {reduced ? <StaticGrid /> : <DesktopCinema />}
    </section>
  );
}
