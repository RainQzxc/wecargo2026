"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "motion/react";

type IconName = "box" | "tag" | "truck" | "road" | "sort" | "home";

const panels: {
  no: string;
  place: string;
  title: string;
  detail: string;
  icon: IconName;
  last?: boolean;
}[] = [
  {
    no: "01",
    place: "Эрээн",
    title: "Бараа агуулахад ирнэ",
    detail: "Захиалга манай Эрээний агуулахад хүлээн авагдана.",
    icon: "box",
  },
  {
    no: "02",
    place: "Бүртгэл",
    title: "Track code-оор бүртгэгдэнэ",
    detail: "Бараа бүрт трак код оноож системд бүртгэнэ.",
    icon: "tag",
  },
  {
    no: "03",
    place: "Ачилт",
    title: "Машинд ачигдаж замдаа гарна",
    detail: "Ачаа бүлэглэгдэн тээврийн машинд ачигдана.",
    icon: "truck",
  },
  {
    no: "04",
    place: "Зам",
    title: "Эрээн → Улаанбаатар",
    detail: "3–7 хоногт хил дамжин Улаанбаатар хүрнэ.",
    icon: "road",
  },
  {
    no: "05",
    place: "Улаанбаатар",
    title: "Хотод ирж ангилагдана",
    detail: "УБ агуулахад ангилагдаж олгоход бэлэн болно.",
    icon: "sort",
  },
  {
    no: "06",
    place: "Хүлээн авалт",
    title: "Та ачаагаа авна",
    detail: "Өөрөө авах эсвэл хүргэлтээр гэрт хүлээн авна.",
    icon: "home",
    last: true,
  },
];

function StepIcon({ name, className = "h-5 w-5" }: { name: IconName; className?: string }) {
  const common = {
    className,
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (name) {
    case "box":
      return (
        <svg {...common}>
          <path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5v-9Z" />
          <path d="m3.5 7.5 8.5 4.5 8.5-4.5M12 12v9" />
        </svg>
      );
    case "tag":
      return (
        <svg {...common}>
          <path d="M4 7v5l8.5 8.5 7-7L11 5H6a2 2 0 0 0-2 2Z" />
          <circle cx="8" cy="9" r="1.2" fill="currentColor" stroke="none" />
        </svg>
      );
    case "truck":
      return (
        <svg {...common}>
          <path d="M3 6.5h10v9H3v-9ZM13 9.5h4l3 3v3h-7v-6Z" />
          <circle cx="7" cy="18" r="1.6" />
          <circle cx="17" cy="18" r="1.6" />
        </svg>
      );
    case "road":
      return (
        <svg {...common}>
          <path d="M5 20 9 4M19 20 15 4M12 6v2M12 11v2M12 16v2" />
        </svg>
      );
    case "sort":
      return (
        <svg {...common}>
          <path d="M4 6h16M4 12h10M4 18h6" />
        </svg>
      );
    case "home":
      return (
        <svg {...common}>
          <path d="M4 10.5 12 4l8 6.5M6 9.5V20h12V9.5" />
          <path d="m9.5 14.5 1.8 1.8 3.2-3.4" />
        </svg>
      );
  }
}

function JourneyBackdrop() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-80"
        style={{ backgroundImage: "url('/journey-bg.svg')" }}
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(247,247,247,0.88)_0%,rgba(247,247,247,0.68)_42%,rgba(247,247,247,0.9)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white to-transparent" />
    </>
  );
}

function Heading() {
  return (
    <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
      <span className="inline-flex items-center gap-2 rounded-full border border-[#06bbb4]/15 bg-white/85 px-3.5 py-1.5 text-xs font-semibold text-[#04766f] shadow-sm backdrop-blur mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-[#06bbb4]" />
        Таны ачааны аялал
      </span>
      <h2 className="text-3xl md:text-5xl font-semibold text-[#1d1d1f] tracking-tight leading-tight">
        Эрээнээс гэрийн босго хүртэл
        <br className="hidden sm:block" />
        <span className="text-[#06bbb4]"> алхам бүр тодорхой.</span>
      </h2>
    </div>
  );
}

function Card({ p }: { p: (typeof panels)[number] }) {
  const accent = p.last ? "#fe0000" : "#06bbb4";
  return (
    <div className="relative h-full rounded-3xl border border-[#e5e5e5] bg-white p-8 shadow-[0_18px_50px_rgba(17,17,17,0.08)] lg:p-9 flex flex-col min-h-[300px] lg:min-h-[360px]">
      <div className="flex items-center justify-between">
        <span
          className="grid size-12 place-items-center rounded-2xl text-white"
          style={{ backgroundColor: accent }}
        >
          <StepIcon name={p.icon} className="h-6 w-6" />
        </span>
        <span
          className="text-5xl font-semibold leading-none"
          style={{ color: `${accent}1f` }}
        >
          {p.no}
        </span>
      </div>
      <span
        className="mt-8 inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold"
        style={{ color: accent, backgroundColor: `${accent}14` }}
      >
        {p.place}
      </span>
      <h3 className="text-2xl lg:text-[28px] font-semibold text-[#1d1d1f] tracking-tight mt-3">
        {p.title}
      </h3>
      <p className="mt-3 text-[15px] leading-7 text-[#6e6e73]">{p.detail}</p>
    </div>
  );
}

/* Mobile: connected vertical timeline */
function MobileTimeline() {
  return (
    <div className="relative isolate overflow-hidden bg-[#f7f7f7] py-20 sm:py-24 lg:hidden">
      <JourneyBackdrop />
      <Heading />
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 mt-10">
        {/* connecting progress line */}
        <div className="absolute left-[31px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-[#06bbb4] via-[#06bbb4]/40 to-[#fe0000]" />
        <div className="space-y-5">
          {panels.map((p) => {
            const accent = p.last ? "#fe0000" : "#06bbb4";
            return (
              <motion.div
                key={p.no}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4 }}
                className="relative flex gap-5 items-start"
              >
                <div
                  className="relative z-10 grid w-16 h-16 shrink-0 place-items-center rounded-2xl text-white shadow-[0_10px_24px_rgba(6,187,180,0.28)]"
                  style={{ backgroundColor: accent }}
                >
                  <StepIcon name={p.icon} className="h-7 w-7" />
                  <span className="absolute -top-1.5 -right-1.5 grid size-6 place-items-center rounded-full bg-white text-[11px] font-semibold" style={{ color: accent }}>
                    {p.no}
                  </span>
                </div>
                <div className="flex-1 rounded-2xl border border-[#e5e5e5] bg-white p-5 shadow-[0_10px_30px_rgba(17,17,17,0.06)]">
                  <span className="text-xs font-semibold" style={{ color: accent }}>
                    {p.place}
                  </span>
                  <h3 className="text-lg font-semibold text-[#1d1d1f] mt-1 leading-snug">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#6e6e73]">{p.detail}</p>
                </div>
              </motion.div>
            );
          })}
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
      <div className="relative isolate hidden overflow-hidden bg-[#f7f7f7] py-40 lg:block">
        <JourneyBackdrop />
        <Heading />
        <div className="relative z-10 max-w-7xl mx-auto px-8 mt-12 grid grid-cols-3 gap-6">
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
      className="relative isolate hidden overflow-hidden bg-[#f7f7f7] lg:block"
      style={{ height: "180vh" }}
    >
      <JourneyBackdrop />
      <div className="sticky top-0 z-10 h-screen flex flex-col justify-center overflow-hidden pt-[120px] pb-16">
        <div className="mb-12">
          <Heading />
        </div>

        <motion.div
          ref={trackRef}
          style={{ x }}
          className="relative z-10 flex gap-6 px-8 will-change-transform"
        >
          {panels.map((p) => (
            <div key={p.no} className="shrink-0 w-[40vw] max-w-[460px]">
              <Card p={p} />
            </div>
          ))}
        </motion.div>

        <div className="relative z-10 max-w-7xl mx-auto w-full px-8 mt-12">
          <div className="h-0.5 bg-[#1d1d1f]/10 rounded-full overflow-hidden max-w-xs">
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
