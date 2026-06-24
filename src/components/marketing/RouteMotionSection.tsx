const routeStats = [
  ["Эрээн хот", "агуулах"],
  ["Улаанбаатар", "хүлээн авалт"],
  ["2 чиглэл", "тогтмол тээвэр"],
];

function Truck({ className }: { className: string }) {
  return (
    <div
      className={`absolute left-0 top-0 grid h-14 w-24 place-items-center rounded-[18px] bg-[#111111] text-white shadow-[0_18px_50px_rgba(17,17,17,0.24)] ${className}`}
      aria-hidden="true"
    >
      <svg className="h-9 w-16" fill="none" viewBox="0 0 88 46">
        <path
          d="M7 12.5h47v19H7v-19Zm47 5h17l9 10v4H54v-14Z"
          fill="white"
        />
        <path d="M20 38a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm47 0a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z" fill="#06bbb4" />
        <path d="M13 18h31" stroke="#111111" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export default function RouteMotionSection() {
  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(6,187,180,0.12),transparent_34%)]" />
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

        <div className="relative mx-auto min-h-[560px] max-w-5xl overflow-hidden rounded-[36px] border border-[#e5e5e5] bg-[#f7f7f7] shadow-[0_30px_100px_rgba(17,17,17,0.10)]">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,#ffffff_0%,rgba(255,255,255,0)_42%)]" />
          <div className="float-globe absolute left-1/2 top-[44%] h-[520px] w-[840px] -translate-x-1/2 overflow-hidden rounded-t-[100%] bg-[radial-gradient(circle_at_50%_30%,#48c7e7_0%,#1d73c5_42%,#0d3c7a_72%)] shadow-[inset_0_24px_80px_rgba(255,255,255,0.5),0_26px_80px_rgba(29,115,197,0.22)]">
            <div className="absolute left-28 top-20 h-28 w-64 rounded-[55%] bg-[#7eca76]/85 blur-sm" />
            <div className="absolute right-24 top-28 h-24 w-56 rounded-[55%] bg-[#dbc66c]/85 blur-sm" />
            <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-white via-white/88 to-transparent" />
          </div>

          <svg
            className="absolute left-1/2 top-28 h-[360px] w-[900px] -translate-x-1/2"
            viewBox="0 0 960 520"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M120 390C350 250 610 245 830 360"
              stroke="#111111"
              strokeOpacity="0.14"
              strokeWidth="18"
              strokeLinecap="round"
            />
            <path
              className="route-dash"
              d="M120 390C350 250 610 245 830 360"
              stroke="#06bbb4"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray="18 18"
            />
          </svg>

          <Truck className="truck-east" />
          <Truck className="truck-west bg-[#fe0000]" />

          <div className="absolute left-10 top-[54%] rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-lg backdrop-blur">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#fe0000]">
              China
            </p>
            <p className="text-xl font-black text-[#111111]">Эрээн хот</p>
          </div>
          <div className="absolute right-10 top-[44%] rounded-2xl border border-white/70 bg-white/90 px-4 py-3 text-right shadow-lg backdrop-blur">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#06bbb4]">
              Mongolia
            </p>
            <p className="text-xl font-black text-[#111111]">Улаанбаатар</p>
          </div>

          <div className="absolute inset-x-0 bottom-0 grid grid-cols-3 gap-px border-t border-[#e5e5e5] bg-[#e5e5e5]">
            {routeStats.map(([value, label]) => (
              <div key={value} className="bg-white/92 px-4 py-5 text-center backdrop-blur">
                <p className="text-xl font-black tracking-[-0.04em] text-[#111111] sm:text-3xl">
                  {value}
                </p>
                <p className="mt-1 text-xs font-black uppercase tracking-[0.12em] text-[#666666]">
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
