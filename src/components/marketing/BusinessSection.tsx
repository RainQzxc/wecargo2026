"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";

const tabs = [
  {
    key: "shop",
    label: "Онлайн дэлгүүр",
    desc: "Онлайн худалдаа эрхлэгчдэд тогтмол, найдвартай ачаа тээвэр.",
    points: [
      "Тогтмол ачааны хуваарь",
      "Бараа бүрийн тодорхой төлөв",
      "Хэрэглэгчдэдээ хурдан хүргэх",
    ],
  },
  {
    key: "reseller",
    label: "Reseller",
    desc: "Дахин худалдаалагчдад зориулсан уян хатан нөхцөл.",
    points: [
      "Олон захиалга нэг дор",
      "Ачааны бөөний тариф",
      "Цаг хэмнэх бүртгэл",
    ],
  },
  {
    key: "org",
    label: "Байгууллага",
    desc: "Байгууллагын тогтмол ачаанд тохирсон хамтын ажиллагаа.",
    points: [
      "Гэрээт хамтын ажиллагаа",
      "Ачааны нэгдсэн тайлан",
      "Тусгай үнийн нөхцөл",
    ],
  },
];

export default function BusinessSection() {
  const [active, setActive] = useState(0);
  const tab = tabs[active];

  return (
    <section className="relative overflow-hidden bg-[#06bbb4] py-20 sm:py-24 md:py-32 lg:py-36">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(255,255,255,0.16),transparent_38%),radial-gradient(circle_at_10%_90%,rgba(7,20,20,0.18),transparent_40%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left */}
          <div>
            <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-white backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
              Бизнест зориулсан
            </span>
            <h2 className="mb-4 text-4xl font-black leading-[1.02] tracking-[-0.05em] text-white sm:text-5xl">
              Бөөн ачаа, онлайн дэлгүүр, reseller-д тохиромжтой.
            </h2>
            <p className="mb-8 max-w-md text-base leading-7 text-white/80 sm:text-lg">
              Танай бизнесийн төрөлд тохирсон уян хатан хамтын ажиллагааны нөхцөл
              сонгоорой.
            </p>
            <Link
              href="/cooperation"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-7 text-sm font-black text-[#06bbb4] shadow-[0_14px_34px_rgba(7,20,20,0.18)] transition-colors hover:bg-[#071414] hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-[#06bbb4]"
            >
              Хамтран ажиллах
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>

          {/* Right: interactive selector */}
          <div>
            <div className="mb-4 flex flex-wrap gap-2">
              {tabs.map((t, i) => (
                <button
                  key={t.key}
                  onClick={() => setActive(i)}
                  className={`min-h-[44px] rounded-xl px-4 py-2 text-sm font-black transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 ${
                    i === active
                      ? "bg-[#071414] text-white"
                      : "bg-white/15 text-white hover:bg-white/25"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={tab.key}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-[28px] bg-white p-7 shadow-[0_24px_70px_rgba(7,20,20,0.22)] lg:p-8"
              >
                <p className="mb-6 text-lg font-black tracking-[-0.02em] text-[#111111]">
                  {tab.desc}
                </p>
                <ul className="space-y-3">
                  {tab.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#06bbb4]/10">
                        <svg className="h-3.5 w-3.5 text-[#06bbb4]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      </span>
                      <span className="text-sm font-medium text-[#333333]">{pt}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
