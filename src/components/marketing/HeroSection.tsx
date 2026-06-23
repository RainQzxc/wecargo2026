"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import TrackingSearch from "./TrackingSearch";

const slides = [
  {
    badge: "12 жилийн туршлага",
    title: ["Захиалсан бараагаа", "санаа зоволтгүй", "хүлээн ав."],
    accent: "санаа зоволтгүй",
    sub: "Эрээнээс Улаанбаатар хүртэл таны ачааг хурдан, хямд, найдвартай тээвэрлэнэ.",
    bg: "radial-gradient(110% 110% at 85% 10%, rgba(6,187,180,0.12) 0%, transparent 55%)",
  },
  {
    badge: "Шуурхай тээвэр",
    title: ["Эрээнээс Улаанбаатар —", "хурд, чанарын", "баталгаа."],
    accent: "хурд, чанарын",
    sub: "Ачаа агуулахад буухаас эхлээд таны гарт очих хүртэлх алхам бүрийг онлайнаар хянана.",
    bg: "radial-gradient(110% 110% at 15% 0%, rgba(6,187,180,0.12) 0%, transparent 55%)",
  },
  {
    badge: "Ил тод хяналт",
    title: ["Бараа тань хаана явааг", "цаг алдалгүй", "тодорхой хараарай."],
    accent: "цаг алдалгүй",
    sub: "трак код эсвэл утасны дугаараа оруулан ачааныхаа төлөвийг шууд шалгаарай.",
    bg: "radial-gradient(110% 110% at 70% 90%, rgba(6,187,180,0.12) 0%, transparent 55%)",
  },
];

function TrackingCard() {
  const steps = [
    { label: "Агуулахад хүлээн авсан", done: true },
    { label: "Тээвэрлэгдэж байна", done: true, active: true },
    { label: "Салбарт ирсэн", done: false },
    { label: "Олгоход бэлэн", done: false },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white border border-[#e5e5e5] rounded-3xl p-6 w-full max-w-sm mx-auto lg:mx-0 shadow-xl shadow-black/[0.06]"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#06bbb4] animate-pulse" />
          <span className="text-[#666666] text-xs font-semibold uppercase tracking-wider">
            WECARGO
          </span>
        </div>
        <span className="text-[#999999] text-xs">Хянах</span>
      </div>

      <div className="mb-5">
        <p className="text-[#666666] text-xs mb-1">трак код</p>
        <p className="text-[#111111] font-mono text-sm font-medium">
          DPK364813798571
        </p>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="text-center">
          <div className="w-2.5 h-2.5 rounded-full bg-[#06bbb4] mx-auto mb-1" />
          <span className="text-[#333333] text-xs font-medium">Эрээн</span>
        </div>
        <div className="flex-1 relative">
          <div className="h-px bg-[#e5e5e5] w-full" />
          <motion.div
            className="h-px bg-[#06bbb4] absolute top-0 left-0"
            initial={{ width: "0%" }}
            animate={{ width: "50%" }}
            transition={{ duration: 1.4, delay: 0.6, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-1/2 -translate-y-1/2"
            initial={{ left: "0%" }}
            animate={{ left: "50%" }}
            transition={{ duration: 1.4, delay: 0.6, ease: "easeInOut" }}
          >
            <div className="w-3 h-3 -translate-x-1/2 rounded-full bg-[#06bbb4] border-2 border-white shadow-md" />
          </motion.div>
        </div>
        <div className="text-center">
          <div className="w-2.5 h-2.5 rounded-full bg-[#e5e5e5] mx-auto mb-1" />
          <span className="text-[#999999] text-xs">Улаанбаатар</span>
        </div>
      </div>

      <div className="space-y-2.5 mb-5">
        {steps.map((step, i) => (
          <motion.div
            key={step.label}
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 + i * 0.12 }}
          >
            <div
              className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                step.active
                  ? "bg-[#06bbb4]"
                  : step.done
                  ? "bg-[#06bbb4]/30"
                  : "bg-white border border-[#e5e5e5]"
              }`}
            >
              {(step.done || step.active) && (
                <svg
                  className="w-2.5 h-2.5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
            <span
              className={`text-sm ${
                step.active
                  ? "text-[#111111] font-medium"
                  : step.done
                  ? "text-[#666666]"
                  : "text-[#999999]"
              }`}
            >
              {step.label}
            </span>
            {step.active && (
              <span className="ml-auto text-xs bg-[#fe0000] text-white px-2 py-0.5 rounded-full font-semibold">
                Одоо
              </span>
            )}
          </motion.div>
        ))}
      </div>

      <div className="border-t border-[#e5e5e5] pt-4">
        <p className="text-[#333333] text-sm">
          Таны ачаа Улаанбаатар руу замд явж байна.
        </p>
        <p className="text-[#999999] text-xs mt-1">
          Сүүлд шинэчлэгдсэн: Өнөөдөр 09:15
        </p>
      </div>
    </motion.div>
  );
}

export default function HeroSection() {
  const [index, setIndex] = useState(0);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % slides.length);
  }, []);

  useEffect(() => {
    const t = setInterval(next, 5500);
    return () => clearInterval(t);
  }, [next]);

  const slide = slides[index];

  return (
    <section className="relative bg-white overflow-hidden border-b border-[#f2f2f2] min-h-[92vh] lg:min-h-screen flex items-center">
      <AnimatePresence mode="sync">
        <motion.div
          key={index}
          className="absolute inset-0"
          style={{ backgroundImage: slide.bg }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
        />
      </AnimatePresence>

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="inline-flex items-center gap-2 bg-[#06bbb4]/10 rounded-full px-3.5 py-1.5 mb-6">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#06bbb4]" />
                  <span className="text-[#06bbb4] text-xs font-semibold">
                    {slide.badge}
                  </span>
                </div>

                <h1 className="text-[2.4rem] sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#111111] leading-[1.04] tracking-tight mb-5">
                  {slide.title.map((line, i) => (
                    <span key={i} className="block">
                      {line === slide.accent ? (
                        <span className="text-[#06bbb4]">{line}</span>
                      ) : (
                        line
                      )}
                    </span>
                  ))}
                </h1>

                <p className="text-[#666666] text-lg leading-relaxed mb-8 max-w-md min-h-[3.5rem]">
                  {slide.sub}
                </p>
              </motion.div>
            </AnimatePresence>

            <TrackingSearch />

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Link
                href="/track"
                className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3.5 bg-[#fe0000] hover:bg-[#fe0000]/90 text-white font-semibold rounded-xl transition-colors text-sm"
              >
                Ачаа хянах
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link
                href="/link-order"
                className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3.5 bg-white hover:bg-[#06bbb4]/5 text-[#06bbb4] border border-[#06bbb4] font-semibold rounded-xl transition-colors text-sm"
              >
                Линк захиалга өгөх
              </Link>
            </div>

            <div className="flex items-center gap-2 mt-7">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  aria-label={`Слайд ${i + 1}`}
                  className="group py-2"
                >
                  <span
                    className={`block h-1 rounded-full transition-all duration-500 ${
                      i === index
                        ? "w-8 bg-[#06bbb4]"
                        : "w-4 bg-[#e5e5e5] group-hover:bg-[#cccccc]"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <TrackingCard />
          </div>
        </div>
      </div>
    </section>
  );
}
