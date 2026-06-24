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
      initial={shouldReduceMotion ? false : { opacity: 0, y: 22 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full max-w-[440px] rounded-[22px] border border-[#e5e5e5] bg-white p-5 shadow-[0_30px_90px_rgba(17,17,17,0.10)] sm:p-6 lg:max-w-[500px] lg:p-7"
    >
      <div className="absolute -inset-px -z-10 rounded-[23px] bg-[#06bbb4]/10 blur-2xl" />

      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#06bbb4] opacity-30" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#06bbb4]" />
          </span>
          <span className="text-xs font-black tracking-[0.2em] text-[#111111]">
            WECARGO
          </span>
        </div>
        <span className="rounded-full border border-[#e5e5e5] bg-[#f7f7f7] px-3 py-1 text-xs font-bold text-[#666666]">
          Хянах
        </span>
      </div>

      <div className="mb-6 rounded-[18px] border border-[#e5e5e5] bg-[#f7f7f7] p-4">
        <p className="mb-1 text-xs font-semibold text-[#666666]">трак код</p>
        <p className="font-mono text-base font-black tracking-wide text-[#111111]">
          DPK364813798571
        </p>
      </div>

      <div className="mb-7">
        <div className="mb-3 flex items-center justify-between text-sm">
          <span className="font-black text-[#111111]">Эрээн</span>
          <span className="font-black text-[#111111]">Улаанбаатар</span>
        </div>
        <div className="relative h-3 overflow-hidden rounded-full bg-[#e5e5e5]">
          <motion.div
            className="h-full rounded-full bg-[#06bbb4]"
            initial={shouldReduceMotion ? false : { width: "28%" }}
            animate={{ width: "58%" }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          />
        </div>
      </div>

      <div className="mb-6 space-y-3.5">
        {trackingSteps.map((step, index) => (
          <div key={step.label} className="flex items-center gap-3">
            <div
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                step.active
                  ? "bg-[#06bbb4] shadow-[0_0_0_6px_rgba(6,187,180,0.12)]"
                  : step.done
                    ? "bg-[#06bbb4]/20 text-[#06bbb4]"
                    : "border border-[#e5e5e5] bg-white text-[#666666]"
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
                  ? "font-black text-[#111111]"
                  : step.done
                    ? "font-semibold text-[#333333]"
                    : "text-[#666666]"
              }`}
            >
              {step.label}
            </span>
            {step.active && (
              <span className="ml-auto rounded-full bg-[#06bbb4]/10 px-2.5 py-1 text-xs font-black text-[#06bbb4]">
                Одоо
              </span>
            )}
            {index < trackingSteps.length - 1 && (
              <span className="sr-only">Дараагийн төлөв</span>
            )}
          </div>
        ))}
      </div>

      <div className="rounded-[18px] border border-[#e5e5e5] bg-white p-4 shadow-sm">
        <p className="text-sm font-black leading-6 text-[#111111]">
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
    <section className="relative isolate flex min-h-[100svh] overflow-hidden border-b border-[#e5e5e5] bg-white lg:min-h-screen">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_82%_12%,rgba(6,187,180,0.13),transparent_34%),linear-gradient(180deg,#ffffff_0%,#f7f7f7_100%)]" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-px bg-[#e5e5e5]" />

      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 content-start gap-8 px-5 pb-10 pt-6 sm:px-6 sm:pb-14 sm:pt-8 lg:grid-cols-[1.05fr_0.95fr] lg:content-center lg:items-center lg:gap-16 lg:px-16 lg:py-20">
        <div className="max-w-3xl">
          <div className="max-w-2xl rounded-[24px] border border-[#e5e5e5] bg-white/95 p-3 shadow-[0_24px_70px_rgba(17,17,17,0.08)] sm:p-4 lg:mt-0">
            <TrackingSearch />
          </div>

          <div className="mb-4 mt-7 inline-flex items-center gap-2 rounded-full border border-[#e5e5e5] bg-white px-3.5 py-2 shadow-sm lg:mb-5 lg:mt-8">
            <span className="h-2 w-2 rounded-full bg-[#06bbb4]" />
            <span className="text-xs font-black uppercase tracking-[0.14em] text-[#06bbb4]">
              Монголын ухаалаг карго
            </span>
          </div>

          <h1 className="max-w-3xl text-[2.1rem] font-black leading-[1.03] tracking-[-0.035em] text-[#111111] sm:text-5xl lg:text-[5.25rem] lg:leading-[0.98]">
            Эрээнээс Улаанбаатар хүртэл ачаагаа тодорхой хяна.
          </h1>

          <p className="mt-4 max-w-2xl text-[16px] leading-7 text-[#333333] sm:text-xl lg:mt-6 lg:text-2xl lg:leading-8">
            WECARGO нь таны захиалгыг агуулахад хүлээн авахаас эхлээд салбарт
            олгоход бэлэн болох хүртэл нэг цонхоор харуулна.
          </p>

          <div className="mt-5 grid gap-3 sm:flex">
            <Link
              href="/link-order"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#e5e5e5] bg-white px-6 py-3 text-sm font-black text-[#111111] transition-colors hover:border-[#06bbb4] hover:text-[#06bbb4] focus:outline-none focus:ring-2 focus:ring-[#06bbb4]/25 focus:ring-offset-2"
            >
              Линк захиалга өгөх
            </Link>
          </div>
        </div>

        <div className="hidden justify-center lg:flex lg:justify-end">
          <TrackingCard />
        </div>
      </div>
    </section>
  );
}
