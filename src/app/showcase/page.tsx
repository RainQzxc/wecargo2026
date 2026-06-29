import type { Metadata } from "next";
import Link from "next/link";
import { Instrument_Serif, Inter } from "next/font/google";
import styles from "./showcase.module.css";

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-wc-serif",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-wc-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "WECARGO — Premium freight, total clarity",
  robots: { index: false }, // showcase/test page
};

const TEAL = "#06bbb4";
const RED = "#fe0000";
const SERIF = "font-[family-name:var(--font-wc-serif)]";

/* ── tiny sharp primitives ─────────────────────────────────────────── */
function Sq({ color = TEAL, size = 8 }: { color?: string; size?: number }) {
  return <span style={{ width: size, height: size, background: color }} className="inline-block" />;
}

function Icon({ name }: { name: "container" | "truck" | "link" | "pin" }) {
  const p = {
    className: "h-7 w-7",
    fill: "none",
    viewBox: "0 0 32 32",
    stroke: "currentColor",
    strokeWidth: 1.6,
    "aria-hidden": true,
  } as const;
  if (name === "container")
    return (
      <svg {...p}>
        <path d="M3 8h26v16H3zM8 8v16M14 8v16M20 8v16M26 8v16" />
      </svg>
    );
  if (name === "truck")
    return (
      <svg {...p}>
        <path d="M3 9h17v13H3zM20 13h6l3 4v5h-9zM9 26a2 2 0 1 0 0-0.1M24 26a2 2 0 1 0 0-0.1" />
      </svg>
    );
  if (name === "link")
    return (
      <svg {...p}>
        <path d="M13 19l6-6M11 21l-3 3a4 4 0 0 1-6-6l3-3M21 11l3-3a4 4 0 0 0-6-6l-3 3" />
      </svg>
    );
  return (
    <svg {...p}>
      <path d="M16 3C10 3 6 7 6 13c0 7 10 16 10 16s10-9 10-16c0-6-4-10-10-10zM16 9v8M12 13h8" />
    </svg>
  );
}

const services = [
  { n: "01", icon: "container", t: "Бүрэн ачаа", d: "Эрээнээс Улаанбаатар хүртэл бүлэг ачаа, тогтмол хуваарьтай тээвэр.", en: "Full freight" },
  { n: "02", icon: "truck", t: "Хүргэлт", d: "Улаанбаатар доторх хаалганаас хаалга хүргэлт, бодит хяналт.", en: "Last-mile delivery" },
  { n: "03", icon: "link", t: "Линк захиалга", d: "Хятад дэлгүүрийн линкээр захиалж, нэг дороос төлбөрөө хянана.", en: "Link order" },
  { n: "04", icon: "pin", t: "Бодит хяналт", d: "Трак кодоор агуулахаас гэр хүртэл алхам бүрийг 24/7 хянана.", en: "Live tracking" },
] as const;

const stats = [
  ["2014", "оноос хойш", "Since"],
  ["24/7", "хяналт", "Tracking"],
  ["3–7", "хоног", "Transit days"],
  ["100K+", "ачаа", "Parcels moved"],
] as const;

const ticker = [
  "AIR FREIGHT",
  "LAND FREIGHT",
  "LINK ORDER",
  "REAL-TIME TRACKING",
  "CUSTOMS",
  "WAREHOUSING",
  "DOOR-TO-DOOR",
  "EREEN ↔ ULAANBAATAR",
];

export default function ShowcasePage() {
  return (
    <div
      className={`${serif.variable} ${inter.variable} min-h-screen bg-white font-[family-name:var(--font-wc-inter)] text-[#0a0a0a] antialiased`}
    >
      {/* ════ HERO (dark) ════ */}
      <section className="relative overflow-hidden bg-[#0a0a0a] text-white">
        {/* hairline grid backdrop */}
        <div
          aria-hidden
          className={`pointer-events-none absolute -inset-24 opacity-[0.07] ${styles.gridPan}`}
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        {/* nav */}
        <nav className="relative z-10 mx-auto flex max-w-[1280px] items-center justify-between border-b border-white/10 px-6 py-5 sm:px-10">
          <span className={`${SERIF} text-3xl tracking-tight`}>
            WECARGO<sup className="text-xs align-super text-[#06bbb4]">®</sup>
          </span>
          <div className="hidden items-center gap-9 text-sm text-white/55 md:flex">
            <span className="text-white">Freight</span>
            <span>Tracking</span>
            <span>Network</span>
            <span>Contact</span>
          </div>
          <Link
            href="/track"
            className="bg-[#06bbb4] px-5 py-2.5 text-sm font-medium text-[#0a0a0a] transition-colors hover:bg-white"
          >
            Track shipment
          </Link>
        </nav>

        {/* hero grid */}
        <div className="relative z-10 mx-auto grid max-w-[1280px] grid-cols-1 gap-12 px-6 pb-20 pt-16 sm:px-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8 lg:pb-28 lg:pt-24">
          {/* left */}
          <div>
            <div className={`mb-7 flex items-center gap-3 text-xs tracking-[0.18em] text-white/55 ${styles.rise}`}>
              <Sq color={TEAL} />
              ЭРЭЭН <span className="text-white/30">↔</span> УЛААНБААТАР
              <span className="font-mono text-white/35">· EST. 2014</span>
            </div>

            <h1 className={`${SERIF} ${styles.rise} ${styles.d1} text-[3.4rem] leading-[0.92] tracking-[-0.02em] sm:text-[5rem] lg:text-[6.2rem]`}>
              Move every box
              <br />
              with <span className="italic text-[#06bbb4]">total clarity</span>
              <span className="text-[#fe0000]">.</span>
            </h1>

            <p className={`${styles.rise} ${styles.d2} mt-8 max-w-md text-lg leading-relaxed text-white/55`}>
              Premium freight across the China–Mongolia corridor. Track every parcel
              from warehouse intake to your doorstep — one window, zero guesswork.
            </p>

            <div className={`${styles.rise} ${styles.d3} mt-10 flex flex-wrap gap-3`}>
              <Link
                href="/track"
                className="bg-[#06bbb4] px-8 py-4 text-sm font-medium text-[#0a0a0a] transition-colors hover:bg-white"
              >
                Track a shipment
              </Link>
              <Link
                href="/pricing"
                className="border border-white/20 px-8 py-4 text-sm font-medium text-white transition-colors hover:border-white hover:bg-white hover:text-[#0a0a0a]"
              >
                Get a quote
              </Link>
            </div>
          </div>

          {/* right — container stack motif */}
          <div className={`${styles.rise} ${styles.d2} flex items-end`}>
            <div className="w-full border border-white/12">
              <div className="flex items-center justify-between border-b border-white/12 px-4 py-3 font-mono text-[11px] text-white/45">
                <span>MANIFEST · WC-2026</span>
                <span className="text-[#06bbb4]">● LIVE</span>
              </div>
              {[
                { code: "WC-4421-EU", w: "92%", cap: TEAL, label: "IN TRANSIT" },
                { code: "WC-4422-EU", w: "76%", cap: "#ffffff", label: "LOADED" },
                { code: "WC-4423-EU", w: "84%", cap: TEAL, label: "AT EREEN" },
                { code: "WC-4424-UB", w: "64%", cap: RED, label: "ARRIVED" },
              ].map((row) => (
                <div key={row.code} className="flex items-center gap-3 border-b border-white/10 px-4 py-4 last:border-b-0">
                  <span style={{ background: row.cap, width: 10, height: 28 }} className="block shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="h-7 border border-white/12 bg-white/[0.04]" style={{ width: row.w }} />
                  </div>
                  <span className="hidden font-mono text-[11px] text-white/45 sm:block">{row.code}</span>
                  <span
                    className="font-mono text-[10px]"
                    style={{ color: row.cap === "#ffffff" ? "rgba(255,255,255,0.55)" : row.cap }}
                  >
                    {row.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════ TICKER ════ */}
      <div className={`${styles.marquee} border-y border-[#0a0a0a] bg-[#0a0a0a] text-white`}>
        <div className={`${styles.marqueeTrack} py-3`}>
          {[0, 1].map((dup) => (
            <div key={dup} className="flex items-center" aria-hidden={dup === 1}>
              {ticker.map((t, i) => (
                <span key={`${dup}-${t}`} className="flex items-center font-mono text-xs tracking-[0.2em] text-white/70">
                  <span className="px-6">{t}</span>
                  <Sq color={i % 2 === 0 ? TEAL : RED} size={6} />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ════ STATS ════ */}
      <section className="mx-auto max-w-[1280px] px-6 sm:px-10">
        <div className="grid grid-cols-2 border-l border-t border-[#0a0a0a]/10 lg:grid-cols-4">
          {stats.map(([v, mn, en]) => (
            <div key={en} className="border-b border-r border-[#0a0a0a]/10 p-8 lg:p-10">
              <div className={`${SERIF} text-5xl tracking-tight lg:text-6xl`}>{v}</div>
              <div className="mt-3 text-sm text-[#0a0a0a]">{mn}</div>
              <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#6f6f6f]">{en}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ════ SERVICES (bento grid, sharp) ════ */}
      <section className="mx-auto max-w-[1280px] px-6 py-24 sm:px-10 lg:py-32">
        <div className="mb-12 flex items-end justify-between gap-6 border-b border-[#0a0a0a]/10 pb-8">
          <h2 className={`${SERIF} max-w-2xl text-4xl leading-[1.0] tracking-tight sm:text-6xl`}>
            One corridor. <span className="text-[#06bbb4]">Every service.</span>
          </h2>
          <span className="hidden font-mono text-xs uppercase tracking-[0.16em] text-[#6f6f6f] md:block">
            04 — Capabilities
          </span>
        </div>

        <div className="grid grid-cols-1 border-l border-t border-[#0a0a0a]/10 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <div
              key={s.n}
              className="group relative border-b border-r border-[#0a0a0a]/10 p-8 transition-colors hover:bg-[#0a0a0a] hover:text-white"
            >
              <div className="flex items-center justify-between">
                <span className="text-[#06bbb4] group-hover:text-[#06bbb4]">
                  <Icon name={s.icon} />
                </span>
                <span className="font-mono text-xs text-[#6f6f6f] group-hover:text-white/40">{s.n}</span>
              </div>
              <h3 className={`${SERIF} mt-10 text-2xl tracking-tight`}>{s.t}</h3>
              <p className="mt-3 text-sm leading-6 text-[#6f6f6f] group-hover:text-white/55">{s.d}</p>
              <div className="mt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-[#0a0a0a] group-hover:text-[#06bbb4]">
                {s.en} →
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════ ROUTE BAND (dark) ════ */}
      <section className="bg-[#0a0a0a] text-white">
        <div className="mx-auto max-w-[1280px] px-6 py-24 sm:px-10 lg:py-28">
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-white/45">The route</span>
          <div className="mt-10 flex items-center gap-4">
            <div className="text-left">
              <div className={`${SERIF} text-3xl sm:text-4xl`}>Эрээн</div>
              <div className="font-mono text-[11px] text-white/40">CN · ORIGIN</div>
            </div>
            <div className="relative h-px flex-1 bg-white/15">
              <span className="absolute left-0 top-1/2 -translate-y-1/2" style={{ width: 10, height: 10, background: TEAL }} />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0a0a0a] px-3 font-mono text-[11px] tracking-[0.2em] text-white/55">
                3–7 DAYS
              </span>
              <span className="absolute right-0 top-1/2 -translate-y-1/2" style={{ width: 10, height: 10, background: RED }} />
            </div>
            <div className="text-right">
              <div className={`${SERIF} text-3xl sm:text-4xl`}>Улаанбаатар</div>
              <div className="font-mono text-[11px] text-white/40">MN · DESTINATION</div>
            </div>
          </div>
        </div>
      </section>

      {/* ════ CTA ════ */}
      <section className="mx-auto max-w-[1280px] px-6 py-28 sm:px-10 lg:py-40">
        <div className="flex flex-col items-start gap-10 border-t border-[#0a0a0a] pt-12 lg:flex-row lg:items-end lg:justify-between">
          <h2 className={`${SERIF} max-w-3xl text-5xl leading-[0.96] tracking-tight sm:text-7xl lg:text-8xl`}>
            Ship with <span className="italic text-[#06bbb4]">certainty</span>
            <span className="text-[#fe0000]">.</span>
          </h2>
          <Link
            href="/track"
            className="shrink-0 bg-[#fe0000] px-10 py-5 text-sm font-medium text-white transition-colors hover:bg-[#0a0a0a]"
          >
            Start tracking →
          </Link>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-[#0a0a0a]/10 pt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-[#6f6f6f]">
          <span>WECARGO® — EST. 2014</span>
          <span>ЭРЭЭН ↔ УЛААНБААТАР</span>
          <span>info@wecargo.mn</span>
        </div>
      </section>
    </div>
  );
}
