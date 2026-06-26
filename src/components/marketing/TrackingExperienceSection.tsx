"use client";

import { useRef, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "motion/react";

const STAGES = [
  { label: "Эрээнд хүлээн авсан", sub: "Агуулахын ажилтан бүртгэнэ" },
  { label: "Трак кодоор бүртгэгдсэн", sub: "Систем рүү орж мэдэгдэл явна" },
  { label: "Машинд ачигдсан", sub: "УБ чиглэлийн тээврийн хэрэгсэл" },
  { label: "Замд явж байна", sub: "Монголын хилийг гатлаж байна" },
  { label: "УБ-д ирсэн", sub: "Төв агуулахад ирж ангилагдна" },
  { label: "Гарт хүргэгдсэн", sub: "Таны гарт 🎉", last: true },
] as const;

const SECTION_TESTIMONIALS = [
  {
    initials: "ЭЖ",
    name: "Б. Энхжин",
    role: "Онлайн худалдаа эрхлэгч",
    quote:
      "Эрээнээс ирж байгаа ачаагаа алхам бүрээр нь шалгадаг болсон. Хэзээ авах нь тодорхой.",
  },
  {
    initials: "Н",
    name: "С. Номин",
    role: "Жижиг бизнес",
    quote: "Утасдаж лавлах зүйл багассан. Ачааны төлөв ойлгомжтой харагддаг.",
  },
];

/* ── Phone screen UI ──────────────────────────────────────── */
function PhoneScreen({ active }: { active: number }) {
  const pct = Math.round(((active + 1) / STAGES.length) * 100);
  return (
    <div className="flex h-full flex-col bg-[#060e0e]" style={{ paddingTop: 30 }}>
      {/* status bar */}
      <div className="flex items-center justify-between px-5 pb-2 pt-1">
        <span className="text-[9px] font-bold text-white/35">9:41</span>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 rounded-full bg-[#06bbb4] animate-ping opacity-50" />
            <span className="relative h-2 w-2 rounded-full bg-[#06bbb4]" />
          </span>
          <span className="text-[9px] font-bold text-white/35">WeCargo</span>
        </div>
      </div>

      {/* track code card */}
      <div className="mx-3 mb-2 rounded-2xl border border-white/8 bg-white/[0.055] p-4">
        <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.18em] text-white/35">
          трак код
        </p>
        <p className="font-mono text-[13px] font-black text-white">
          DPK364813798571
        </p>
        <div className="mt-3">
          <div className="mb-1.5 flex items-center justify-between text-[9px] font-black text-white/40">
            <span>Эрээн</span>
            <span>{pct}%</span>
            <span>Улаанбаатар</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-[#06bbb4]"
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {/* stages */}
      <div className="flex-1 overflow-hidden px-3 pb-2">
        {STAGES.map((s, i) => {
          const done = i < active;
          const isActive = i === active;
          return (
            <div key={i} className="relative flex gap-3 py-[6px]">
              {i < STAGES.length - 1 && (
                <div
                  className="absolute left-[9px] top-7 h-[calc(100%-6px)] w-px transition-colors duration-700"
                  style={{
                    background: done
                      ? "rgba(6,187,180,0.5)"
                      : "rgba(255,255,255,0.07)",
                  }}
                />
              )}
              <div
                className={`relative z-10 mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full transition-all duration-500 ${
                  isActive
                    ? "bg-[#06bbb4] shadow-[0_0_0_5px_rgba(6,187,180,0.18)] scale-110"
                    : done
                      ? "bg-[#06bbb4]/30"
                      : "border border-white/12 bg-transparent"
                }`}
              >
                {done ? (
                  <svg
                    className="h-2.5 w-2.5 text-[#06bbb4]"
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
                ) : (
                  <span
                    className={`text-[7px] font-black ${isActive ? "text-white" : "text-white/20"}`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className={`text-[11px] font-black leading-tight transition-colors duration-500 ${
                    isActive
                      ? "text-white"
                      : done
                        ? "text-white/45"
                        : "text-white/18"
                  }`}
                >
                  {s.label}
                </p>
                {isActive && (
                  <p className="mt-0.5 text-[9px] font-medium text-[#06bbb4]/80">
                    {s.sub}
                  </p>
                )}
              </div>
              {isActive && (
                <span className="mt-0.5 shrink-0 self-start rounded-full bg-[#06bbb4]/15 px-2 py-0.5 text-[8px] font-black text-[#06bbb4]">
                  Одоо
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── iOS 14-style iPhone frame ────────────────────────────── */
function IPhoneShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto" style={{ width: 296, height: 592 }}>
      {/* ambient glow */}
      <div className="pointer-events-none absolute -inset-14 rounded-full bg-[#06bbb4]/6 blur-3xl" />
      {/* floor shadow */}
      <div className="pointer-events-none absolute -bottom-5 left-1/2 h-7 w-52 -translate-x-1/2 rounded-full bg-black/18 blur-xl" />

      {/* outer shell — bordeColor */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 44,
          background:
            "linear-gradient(145deg, #2a3040 0%, #152839 50%, #1c2535 100%)",
          border: "1px solid rgba(255,255,255,0.16)",
          boxShadow:
            "inset 0 0 0 1px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.18), 0 50px 100px rgba(0,0,0,0.65)",
        }}
      >
        {/* Left: silent switch */}
        <div
          style={{
            position: "absolute",
            left: -5,
            top: 92,
            width: 4,
            height: 22,
            borderRadius: "3px 0 0 3px",
            background: "#1a2433",
            boxShadow: "-1px 0 0 rgba(255,255,255,0.12)",
          }}
        />
        {/* Left: vol up */}
        <div
          style={{
            position: "absolute",
            left: -5,
            top: 138,
            width: 4,
            height: 40,
            borderRadius: "3px 0 0 3px",
            background: "#1a2433",
            boxShadow: "-1px 0 0 rgba(255,255,255,0.12)",
          }}
        />
        {/* Left: vol down */}
        <div
          style={{
            position: "absolute",
            left: -5,
            top: 192,
            width: 4,
            height: 40,
            borderRadius: "3px 0 0 3px",
            background: "#1a2433",
            boxShadow: "-1px 0 0 rgba(255,255,255,0.12)",
          }}
        />
        {/* Right: power */}
        <div
          style={{
            position: "absolute",
            right: -5,
            top: 148,
            width: 4,
            height: 62,
            borderRadius: "0 3px 3px 0",
            background: "#1a2433",
            boxShadow: "1px 0 0 rgba(255,255,255,0.12)",
          }}
        />

        {/* inner black bezel — bordeNegro */}
        <div
          style={{
            position: "absolute",
            top: 6,
            left: 6,
            right: 6,
            bottom: 6,
            borderRadius: 39,
            background: "#000",
            overflow: "hidden",
          }}
        >
          {/* notch */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: 130,
              height: 27,
              background: "#000",
              zIndex: 20,
              borderBottomLeftRadius: 16,
              borderBottomRightRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {/* bocina — speaker grill */}
            <div
              style={{
                width: 52,
                height: 5,
                borderRadius: 3,
                background: "#1c1c1e",
                border: "0.5px solid rgba(255,255,255,0.07)",
              }}
            />
            {/* camara */}
            <div
              style={{
                width: 9,
                height: 9,
                borderRadius: "50%",
                background: "#1c1c1e",
                border: "1px solid rgba(255,255,255,0.06)",
                boxShadow:
                  "inset 0 0 0 2px #080808, 0 0 0 1px rgba(6,187,180,0.2)",
              }}
            />
          </div>

          {/* screen */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 39,
              overflow: "hidden",
              background: "#060e0e",
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Text column ──────────────────────────────────────────── */
function TextContent() {
  return (
    <div className="max-w-lg">
      <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#06bbb4]/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-[#06bbb4]">
        <span className="h-1.5 w-1.5 rounded-full bg-[#06bbb4]" />
        Хэрэглэгчийн систем
      </span>
      <p className="mt-1 text-2xl font-black leading-snug tracking-[-0.035em] text-[#111111] sm:text-3xl">
        дугаар, ирсэн ачаа, төлбөрөө нэг дор харахад маш амар болсон.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:mt-8 sm:grid-cols-2">
        {SECTION_TESTIMONIALS.map((t) => (
          <div
            key={t.name}
            className="rounded-2xl border border-[#e5e5e5] bg-[#fafafa] p-4"
          >
            <p className="text-sm leading-relaxed text-[#444444]">{t.quote}</p>
            <div className="mt-3 flex items-center gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#06bbb4] text-[10px] font-black text-white">
                {t.initials}
              </div>
              <div>
                <p className="text-xs font-black text-[#111111]">{t.name}</p>
                <p className="text-[10px] text-[#888888]">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main section ─────────────────────────────────────────── */
export default function TrackingExperienceSection() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const stageMV = useTransform(
    scrollYProgress,
    [0.08, 0.88],
    [0, STAGES.length - 1],
  );

  useEffect(() => {
    if (reduced) return;
    return stageMV.on("change", (v) => {
      setActive(Math.round(Math.max(0, Math.min(STAGES.length - 1, v))));
    });
  }, [stageMV, reduced]);

  const phoneOpacity = useTransform(
    scrollYProgress,
    [0, 0.07, 0.93, 1],
    [0, 1, 1, 0],
  );
  const phoneY = useTransform(scrollYProgress, [0, 0.1], ["56px", "0px"]);
  const textOpacity = useTransform(
    scrollYProgress,
    [0, 0.06, 0.94, 1],
    [0, 1, 1, 0],
  );
  const textY = useTransform(scrollYProgress, [0, 0.09], ["36px", "0px"]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-white"
      style={{ height: reduced ? "auto" : "280vh" }}
    >
      <div
        className={
          reduced
            ? "py-24"
            : "sticky top-0 flex min-h-screen items-center overflow-hidden"
        }
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_65%_55%_at_68%_52%,rgba(6,187,180,0.07),transparent_58%)]" />

        <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:px-16 lg:py-0">
          {/* left – text */}
          <motion.div
            style={reduced ? {} : { opacity: textOpacity, y: textY }}
          >
            <TextContent />
          </motion.div>

          {/* right – phone */}
          <motion.div
            style={reduced ? {} : { opacity: phoneOpacity, y: phoneY }}
            className="flex justify-center lg:justify-end"
          >
            <div style={{ perspective: "1100px" }}>
              <motion.div
                style={{ rotateX: 2, rotateY: -8, transformStyle: "preserve-3d" }}
                animate={reduced ? {} : { y: [0, -10, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <IPhoneShell>
                  <PhoneScreen active={reduced ? 2 : active} />
                </IPhoneShell>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
