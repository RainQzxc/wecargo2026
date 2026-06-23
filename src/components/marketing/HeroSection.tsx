"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import TrackingSearch from "./TrackingSearch";

const trackingSteps = [
  { label: "Агуулахад хүлээн авсан", done: true },
  { label: "Тээвэрлэгдэж байна", done: true, active: true },
  { label: "Салбарт ирсэн", done: false },
  { label: "Олгоход бэлэн", done: false },
];

function TrackingCard() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-[390px] rounded-[20px] border border-[#e5e5e5] bg-white p-4 shadow-[0_24px_70px_rgba(17,17,17,0.08)] sm:p-5"
    >
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#06bbb4] opacity-30" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#06bbb4]" />
          </span>
          <span className="text-xs font-bold tracking-[0.18em] text-[#111111]">
            WECARGO
          </span>
        </div>
        <span className="rounded-full border border-[#e5e5e5] px-3 py-1 text-xs font-semibold text-[#666666]">
          Хянах
        </span>
      </div>

      <div className="mb-5 rounded-2xl bg-[#f7f7f7] p-4">
        <p className="mb-1 text-xs font-medium text-[#666666]">трак код</p>
        <p className="font-mono text-[15px] font-semibold tracking-wide text-[#111111]">
          DPK364813798571
        </p>
      </div>

      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-semibold text-[#111111]">Эрээн</span>
          <span className="font-semibold text-[#111111]">Улаанбаатар</span>
        </div>
        <div className="relative h-2 overflow-hidden rounded-full bg-[#e5e5e5]">
          <motion.div
            className="h-full rounded-full bg-[#06bbb4]"
            initial={shouldReduceMotion ? false : { width: "28%" }}
            animate={shouldReduceMotion ? { width: "58%" } : { width: "58%" }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.15 }}
          />
        </div>
      </div>

      <div className="mb-5 space-y-3">
        {trackingSteps.map((step, index) => (
          <div key={step.label} className="flex items-center gap-3">
            <div
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                step.active
                  ? "bg-[#06bbb4] shadow-[0_0_0_5px_rgba(6,187,180,0.12)]"
                  : step.done
                    ? "bg-[#06bbb4]/20 text-[#06bbb4]"
                    : "border border-[#d8d8d8] bg-white text-[#999999]"
              }`}
            >
              {step.done ? (
                <svg
                  className={`h-3 w-3 ${step.active ? "text-white" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
              )}
            </div>
            <span
              className={`text-sm ${
                step.active
                  ? "font-semibold text-[#111111]"
                  : step.done
                    ? "text-[#333333]"
                    : "text-[#777777]"
              }`}
            >
              {step.label}
            </span>
            {step.active && (
              <span className="ml-auto rounded-full bg-[#06bbb4]/10 px-2.5 py-1 text-xs font-bold text-[#047f7a]">
                Одоо
              </span>
            )}
            {index < trackingSteps.length - 1 && (
              <span className="sr-only">Дараагийн төлөв</span>
            )}
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-[#e5e5e5] bg-white p-4">
        <p className="text-sm font-semibold leading-6 text-[#111111]">
          Таны ачаа Улаанбаатар руу замд явж байна.
        </p>
        <p className="mt-1 text-xs leading-5 text-[#666666]">
          Сүүлд шинэчлэгдсэн: Өнөөдөр 09:15.
        </p>
      </div>
    </motion.div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-[#f2f2f2] bg-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_12%,rgba(6,187,180,0.13),transparent_34%),linear-gradient(180deg,#ffffff_0%,#f7fafa_100%)]" />
      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 gap-9 px-4 pb-12 pt-8 sm:px-6 sm:pb-16 sm:pt-12 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-14 lg:px-8 lg:py-20">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#06bbb4]/20 bg-white px-3.5 py-2 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[#06bbb4]" />
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#047f7a]">
              Монголын ухаалаг карго
            </span>
          </div>

          <h1 className="max-w-2xl text-[2.45rem] font-bold leading-[1.04] tracking-[-0.02em] text-[#111111] sm:text-5xl lg:text-6xl">
            Эрээнээс Улаанбаатар хүртэл ачаагаа тодорхой хяна.
          </h1>

          <p className="mt-5 max-w-xl text-base leading-7 text-[#555555] sm:text-lg">
            WECARGO нь таны захиалгыг агуулахад хүлээн авахаас эхлээд
            салбарт олгоход бэлэн болох хүртэл нэг цонхоор харуулна.
          </p>

          <div className="mt-7 max-w-xl">
            <TrackingSearch />
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/track"
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#fe0000] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#d90000] focus:outline-none focus:ring-2 focus:ring-[#fe0000]/30 focus:ring-offset-2"
            >
              Ачаа хянах
            </Link>
            <Link
              href="/link-order"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#d8d8d8] bg-white px-6 py-3 text-sm font-bold text-[#111111] transition-colors hover:border-[#06bbb4] hover:text-[#047f7a] focus:outline-none focus:ring-2 focus:ring-[#06bbb4]/25 focus:ring-offset-2"
            >
              Линк захиалга өгөх
            </Link>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <TrackingCard />
        </div>
      </div>
    </section>
  );
}
