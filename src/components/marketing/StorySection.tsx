"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "motion/react";

const panels = [
  { no: "01", place: "Эрээн", title: "Бараа агуулахад ирнэ" },
  { no: "02", place: "Бүртгэл", title: "Track code-оор бүртгэгдэнэ" },
  { no: "03", place: "Ачилт", title: "Машинд ачигдаж замдаа гарна" },
  { no: "04", place: "Зам", title: "Эрээн → Улаанбаатар" },
  { no: "05", place: "Улаанбаатар", title: "Хотод ирж ангилагдана" },
  { no: "06", place: "Хүлээн авалт", title: "Та ачаагаа авна", last: true },
];

function Heading() {
  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
      <span className="inline-flex items-center gap-2 bg-[#06bbb4]/10 text-[#06bbb4] text-xs font-semibold px-3.5 py-1.5 rounded-full uppercase tracking-wider mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-[#06bbb4]" />
        Таны ачааны аялал
      </span>
      <h2 className="text-3xl md:text-5xl font-bold text-[#111111] tracking-tight leading-tight">
        Эрээнээс гэрийн босго хүртэл
        <br className="hidden sm:block" />
        <span className="text-[#06bbb4]"> алхам бүр тодорхой.</span>
      </h2>
    </div>
  );
}

function Card({
  p,
}: {
  p: (typeof panels)[number];
}) {
  return (
    <div className="relative h-full rounded-3xl bg-white border border-[#e5e5e5] shadow-sm p-8 lg:p-10 flex flex-col justify-between min-h-[260px] lg:min-h-[400px]">
      <div className="flex items-start justify-between">
        <span
          className={`text-6xl lg:text-7xl font-bold leading-none ${
            p.last ? "text-[#fe0000]/15" : "text-[#06bbb4]/15"
          }`}
        >
          {p.no}
        </span>
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider ${
            p.last
              ? "text-[#fe0000] bg-[#fe0000]/10"
              : "text-[#06bbb4] bg-[#06bbb4]/10"
          }`}
        >
          {p.place}
        </span>
      </div>
      <h3 className="text-2xl lg:text-3xl font-bold text-[#111111] tracking-tight mt-8">
        {p.title}
      </h3>
    </div>
  );
}

/* Mobile: simple vertical timeline */
function MobileTimeline() {
  return (
    <div className="lg:hidden bg-[#f7f7f7] py-20 sm:py-24">
      <Heading />
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 mt-10 relative">
        <div className="absolute left-[27px] top-4 bottom-4 w-px bg-[#e5e5e5]" />
        <div className="space-y-4">
          {panels.map((p) => (
            <motion.div
              key={p.no}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4 }}
              className="relative flex gap-5 items-start"
            >
              <div
                className={`relative z-10 w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center text-white font-bold ${
                  p.last ? "bg-[#fe0000]" : "bg-[#06bbb4]"
                }`}
              >
                {p.no}
              </div>
              <div className="flex-1 bg-white border border-[#e5e5e5] rounded-2xl p-5">
                <span
                  className={`text-xs font-semibold uppercase tracking-wider ${
                    p.last ? "text-[#fe0000]" : "text-[#06bbb4]"
                  }`}
                >
                  {p.place}
                </span>
                <h3 className="text-lg font-bold text-[#111111] mt-1">
                  {p.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Desktop: sticky horizontal scroll */
function DesktopJourney() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [maxX, setMaxX] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    const measure = () => {
      if (!trackRef.current) return;
      const distance = trackRef.current.scrollWidth - window.innerWidth + 48;
      setMaxX(Math.max(distance, 0));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], [0, -maxX]);
  const progressW = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  if (reduced) {
    return (
      <div className="hidden lg:block bg-[#f7f7f7] py-40">
        <Heading />
        <div className="max-w-7xl mx-auto px-8 mt-12 grid grid-cols-3 gap-6">
          {panels.map((p) => (
            <Card key={p.no} p={p} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={sectionRef}
      className="hidden lg:block relative bg-[#f7f7f7]"
      style={{ height: "180vh" }}
    >
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden pt-[120px] pb-16">
        <div className="mb-12">
          <Heading />
        </div>

        <motion.div
          ref={trackRef}
          style={{ x }}
          className="flex gap-6 px-8 will-change-transform"
        >
          {panels.map((p) => (
            <div key={p.no} className="shrink-0 w-[40vw] max-w-[520px]">
              <Card p={p} />
            </div>
          ))}
        </motion.div>

        <div className="max-w-7xl mx-auto w-full px-8 mt-12">
          <div className="h-0.5 bg-[#e5e5e5] rounded-full overflow-hidden max-w-xs">
            <motion.div
              className="h-full bg-[#06bbb4] rounded-full"
              style={{ width: progressW }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StorySection() {
  return (
    <section aria-label="Таны ачааны аялал">
      <MobileTimeline />
      <DesktopJourney />
    </section>
  );
}
