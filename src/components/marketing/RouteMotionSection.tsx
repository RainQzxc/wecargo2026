const routeStats = [
  ["Эрээн хот", "агуулах"],
  ["Улаанбаатар", "хүлээн авалт"],
  ["2 чиглэл", "тогтмол тээвэр"],
];

export default function RouteMotionSection() {
  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-24 md:py-32">
      <style>{`
        @keyframes cross-route {
          0%   { left: -72px; opacity: 0; }
          10%  { opacity: 1; }
          88%  { opacity: 1; }
          100% { left: calc(100% + 10px); opacity: 0; }
        }
        .route-truck-anim {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          animation: cross-route 5s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .route-truck-anim {
            animation: none;
            left: calc(50% - 34px);
            opacity: 1;
          }
        }
      `}</style>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(6,187,180,0.10),transparent_34%)]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#06bbb4]/10 px-3.5 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-[#06bbb4]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#06bbb4]" />
            Хоёр улсын хооронд
          </span>
          <h2 className="text-4xl font-black tracking-[-0.05em] text-[#111111] sm:text-5xl lg:text-6xl">
            Эрээнээс Улаанбаатар руу тасралтгүй хөдөлгөөн.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#666666] sm:text-lg">
            Ачаа Эрээн хотын агуулахаас бүртгэгдээд Улаанбаатар хүртэл замын
            явцаа тодорхой харуулна.
          </p>
        </div>

        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[36px] bg-[#0d0d0d] shadow-[0_30px_100px_rgba(0,0,0,0.40)]">
          {/* dot pattern */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.055]"
            style={{
              backgroundImage:
                "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
          {/* top glow */}
          <div className="pointer-events-none absolute left-1/2 -top-20 h-64 w-64 -translate-x-1/2 rounded-full bg-[#06bbb4]/8 blur-3xl" />

          {/* route content */}
          <div className="relative grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr]">
            {/* left — Eriin */}
            <div className="px-8 py-10 sm:py-14 sm:pl-12 sm:pr-6">
              <p className="mb-2 text-[10px] font-black uppercase tracking-[0.22em] text-[#fe0000]">
                China · Хятад
              </p>
              <p className="text-3xl font-black text-white sm:text-4xl">
                Эрээн хот
              </p>
              <p className="mt-2 text-sm text-white/35">
                Ачаа хүлээн авах агуулах
              </p>
              <div className="mt-5 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#fe0000]" />
                <span className="text-xs font-black text-white/45">
                  Бүртгэл нээлттэй
                </span>
              </div>
            </div>

            {/* center — animated route rail */}
            <div className="flex flex-col items-center justify-center gap-4 px-6 py-6 sm:py-14">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/25">
                1,200 км · 2 өдөр
              </p>
              {/* rail */}
              <div className="relative h-14 w-56 overflow-hidden sm:w-48 md:w-64">
                {/* dashed line */}
                <div
                  className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-px"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(90deg,rgba(6,187,180,0.28) 0,rgba(6,187,180,0.28) 10px,transparent 10px,transparent 20px)",
                  }}
                />
                {/* truck */}
                <div className="route-truck-anim">
                  <div className="flex h-10 w-[68px] items-center justify-center rounded-2xl bg-[#1a1a1a] shadow-[0_12px_28px_rgba(0,0,0,0.6)]">
                    <svg
                      className="h-7 w-14"
                      fill="none"
                      viewBox="0 0 88 46"
                      aria-hidden="true"
                    >
                      <path
                        d="M7 12.5h47v19H7v-19Zm47 5h17l9 10v4H54v-14Z"
                        fill="white"
                      />
                      <path
                        d="M20 38a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm47 0a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"
                        fill="#06bbb4"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#06bbb4]/12 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#06bbb4]">
                <span className="h-1 w-1 rounded-full bg-[#06bbb4]" />
                2 чиглэл
              </span>
            </div>

            {/* right — Ulaanbaatar */}
            <div className="px-8 py-10 text-left sm:py-14 sm:pl-6 sm:pr-12 sm:text-right">
              <p className="mb-2 text-[10px] font-black uppercase tracking-[0.22em] text-[#06bbb4]">
                Mongolia · Монгол
              </p>
              <p className="text-3xl font-black text-white sm:text-4xl">
                Улаанбаатар
              </p>
              <p className="mt-2 text-sm text-white/35">
                Төв агуулах, хүлээн авалт
              </p>
              <div className="mt-5 flex items-center gap-2 sm:justify-end">
                <span className="h-2 w-2 rounded-full bg-[#06bbb4]" />
                <span className="text-xs font-black text-white/45">
                  Хүргэлт явагдаж байна
                </span>
              </div>
            </div>
          </div>

          {/* stats bar */}
          <div className="grid grid-cols-3 divide-x divide-white/8 border-t border-white/8">
            {routeStats.map(([value, label]) => (
              <div key={value} className="px-4 py-5 text-center">
                <p className="text-xl font-black tracking-[-0.04em] text-white sm:text-2xl">
                  {value}
                </p>
                <p className="mt-1 text-[10px] font-black uppercase tracking-[0.12em] text-white/35">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
