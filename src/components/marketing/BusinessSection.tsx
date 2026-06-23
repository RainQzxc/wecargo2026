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
    <section className="bg-[#06bbb4] py-20 sm:py-24 md:py-32 lg:py-36">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left */}
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
              Бөөн ачаа, онлайн дэлгүүр, reseller-д тохиромжтой.
            </h2>
            <p className="text-white/80 text-lg leading-relaxed mb-8">
              Танай бизнесийн төрөлд тохирсон уян хатан хамтын ажиллагааны нөхцөл
              сонгоорой.
            </p>
            <Link
              href="/cooperation"
              className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3.5 bg-white text-[#06bbb4] hover:bg-white/90 font-semibold rounded-xl transition-colors text-sm"
            >
              Хамтран ажиллах
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>

          {/* Right: interactive selector */}
          <div>
            <div className="flex flex-wrap gap-2 mb-5">
              {tabs.map((t, i) => (
                <button
                  key={t.key}
                  onClick={() => setActive(i)}
                  className={`min-h-[44px] px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    i === active
                      ? "bg-white text-[#06bbb4]"
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
                transition={{ duration: 0.3 }}
                className="bg-white rounded-3xl p-7 lg:p-8 shadow-lg"
              >
                <p className="text-[#333333] text-base font-medium mb-5">
                  {tab.desc}
                </p>
                <ul className="space-y-3">
                  {tab.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-[#06bbb4]/10 flex items-center justify-center shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-[#06bbb4]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      </span>
                      <span className="text-[#333333] text-sm">{pt}</span>
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
