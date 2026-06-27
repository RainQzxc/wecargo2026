const routeStats = [
  ["Эрээн хот", "агуулах"],
  ["Улаанбаатар", "хүлээн авалт"],
  ["2 чиглэл", "тогтмол тээвэр"],
];

export default function RouteMotionSection() {
  return (
    <section className="bg-white py-24 sm:py-28 md:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#06bbb4]" />
            <span className="text-sm font-medium text-[#06bbb4]">Хоёр улсын хооронд</span>
          </div>
          <h2 className="text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-[#1d1d1f] sm:text-5xl">
            Эрээнээс Улаанбаатар руу тасралтгүй хөдөлгөөн.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#6e6e73]">
            Ачаа Эрээн хотын агуулахаас бүртгэгдээд Улаанбаатар хүртэл замын явцаа
            тодорхой харуулна.
          </p>
        </div>

        <div className="overflow-hidden rounded-[28px] border border-[#e5e5e5] bg-[#f5f5f7]">
          {/* Static route */}
          <div className="relative px-6 py-14 sm:px-12 sm:py-20">
            <svg
              className="mx-auto h-[180px] w-full max-w-[820px]"
              viewBox="0 0 820 200"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M70 150C260 60 560 60 750 150"
                stroke="#d2d2d7"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="2 8"
              />
              <circle cx="70" cy="150" r="7" fill="#1d1d1f" />
              <circle cx="750" cy="150" r="7" fill="#06bbb4" />
            </svg>

            <div className="pointer-events-none absolute inset-x-6 top-10 flex justify-between sm:inset-x-12">
              <div>
                <p className="text-xs font-medium text-[#6e6e73]">China</p>
                <p className="text-lg font-semibold text-[#1d1d1f]">Эрээн хот</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-[#06bbb4]">Mongolia</p>
                <p className="text-lg font-semibold text-[#1d1d1f]">Улаанбаатар</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-px border-t border-[#e5e5e5] bg-[#e5e5e5]">
            {routeStats.map(([value, label]) => (
              <div key={value} className="bg-white px-4 py-6 text-center">
                <p className="text-xl font-semibold tracking-[-0.02em] text-[#1d1d1f] sm:text-2xl">
                  {value}
                </p>
                <p className="mt-1 text-sm font-medium text-[#6e6e73]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
