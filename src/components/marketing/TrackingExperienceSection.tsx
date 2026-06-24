function PhoneMockup() {
  return (
    <div className="relative mx-auto w-[270px] sm:w-[300px]">
      <div className="absolute -bottom-10 -left-20 h-72 w-36 rotate-[-18deg] rounded-[60px] bg-[#c99473]/35 blur-[1px]" />
      <div className="absolute -bottom-8 -right-20 h-72 w-36 rotate-[18deg] rounded-[60px] bg-[#c99473]/30 blur-[1px]" />
      <div className="absolute -bottom-14 left-1/2 h-28 w-72 -translate-x-1/2 rounded-[50%] bg-[#c99473]/25 blur-xl" />

      <div className="relative bg-[#111111] rounded-[40px] p-3 shadow-[0_28px_90px_rgba(17,17,17,0.28)] border-4 border-[#111111]">
        <div className="absolute top-3 left-1/2 z-10 h-6 w-28 -translate-x-1/2 rounded-full bg-[#050505]" />

        <div className="bg-white rounded-[28px] overflow-hidden pt-6 pb-4 px-4 min-h-[500px]">
          <div className="-mx-4 -mt-6 mb-5 rounded-b-[24px] bg-[#101515] px-4 pb-5 pt-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold text-white/50">Өнөөдөр</p>
                <p className="text-sm font-black">WECARGO tracking</p>
              </div>
              <div className="grid h-8 w-8 place-items-center rounded-full bg-white/10">
                <div className="h-2.5 w-2.5 rounded-full bg-[#06bbb4]" />
              </div>
            </div>
            <div className="mt-5 grid grid-cols-5 gap-2 text-center text-[10px] text-white/45">
              {["Эрээн", "Бүрт", "Ачилт", "Зам", "УБ"].map((item, index) => (
                <div key={item}>
                  <div
                    className={`mx-auto mb-1 grid h-6 w-6 place-items-center rounded-full text-[10px] font-black ${
                      index < 4 ? "bg-[#06bbb4] text-[#071414]" : "bg-white/10 text-white/35"
                    }`}
                  >
                    {index + 1}
                  </div>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#f7f7f7] border border-[#e5e5e5] rounded-xl p-3 mb-4">
            <p className="text-[#666666] text-xs mb-0.5">трак код</p>
            <p className="text-[#111111] font-mono text-xs font-semibold">
              YT7547233338116
            </p>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-[#06bbb4] animate-pulse" />
            <span className="text-[#06bbb4] text-xs font-semibold">
              Тээвэрлэгдэж байна
            </span>
          </div>

          <div className="space-y-3 mb-4">
            {[
              { label: "Эрээнд хүлээн авсан", done: true },
              { label: "Замд яваа", done: true, active: true },
              { label: "Улаанбаатарт ирсэн", done: false },
            ].map((step) => (
              <div key={step.label} className="flex items-center gap-2.5">
                <div
                  className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 ${
                    step.active
                      ? "bg-[#06bbb4]"
                      : step.done
                      ? "bg-[#06bbb4]/30"
                      : "border border-[#e5e5e5] bg-white"
                  }`}
                >
                  {(step.done || step.active) && (
                    <svg
                      className="w-2 h-2 text-white"
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
                  className={`text-xs ${
                    step.active
                      ? "text-[#111111] font-semibold"
                      : step.done
                      ? "text-[#666666]"
                      : "text-[#999999]"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>

          <div className="bg-[#06bbb4]/10 rounded-xl p-3 mb-3">
            <p className="text-[#111111] text-xs font-medium leading-snug">
              Таны ачаа Улаанбаатар хотод ирсэн байна.
            </p>
            <p className="text-[#666666] text-xs mt-1">
              Төв агуулахад ангилалт хийгдэж байна.
            </p>
          </div>

          <p className="text-[#999999] text-xs">Шинэчлэгдсэн: Өнөөдөр 14:30</p>
          <p className="text-[#333333] text-xs mt-0.5 font-medium">
            Төлөв: Олгоход бэлэн болж байна
          </p>
        </div>
      </div>
    </div>
  );
}

export default function TrackingExperienceSection() {
  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_30%,rgba(6,187,180,0.08),transparent_28%),radial-gradient(circle_at_82%_25%,rgba(6,187,180,0.08),transparent_24%)]" />
      <div className="pointer-events-none absolute -left-24 top-24 h-28 w-[520px] rounded-full bg-[#edf5f5] blur-2xl" />
      <div className="pointer-events-none absolute -right-24 top-28 h-28 w-[520px] rounded-full bg-[#edf5f5] blur-2xl" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-[radial-gradient(ellipse_at_center,#ffffff_0%,rgba(255,255,255,0.92)_44%,rgba(255,255,255,0)_70%)]" />
      <div className="pointer-events-none absolute -bottom-10 left-0 h-40 w-1/2 rounded-full bg-white blur-2xl" />
      <div className="pointer-events-none absolute -bottom-10 right-0 h-40 w-1/2 rounded-full bg-white blur-2xl" />

      <div className="relative mx-auto grid min-h-[680px] max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_auto_1fr] lg:px-8">
        <div className="text-center lg:pb-16 lg:text-left">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#06bbb4]/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-[#06bbb4]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#06bbb4]" />
            Хэрэглэгчийн систем
          </span>
          <h2 className="text-4xl font-black leading-[1.02] tracking-[-0.05em] text-[#111111] sm:text-5xl">
            Ачаагаа хэзээ ч, хаанаас ч хяна.
          </h2>
          <p className="mt-4 text-base leading-7 text-[#666666] sm:text-lg">
            Гар утсанд бүрэн тохирсон, ойлгомжтой, хэрэглэхэд хялбар систем.
          </p>
          <a
            href="/track"
            className="mt-7 inline-flex min-h-12 items-center rounded-full bg-[#111111] px-7 text-sm font-black text-white shadow-[0_14px_34px_rgba(17,17,17,0.24)] transition-colors hover:bg-[#06bbb4] focus:outline-none focus:ring-2 focus:ring-[#06bbb4]/30 focus:ring-offset-2"
          >
            Track code-оор шалгах
          </a>
          <a
            href="/guide"
            className="mx-auto mt-3 flex min-h-12 w-fit items-center rounded-full bg-[#f0f0f0] px-7 text-sm font-black text-[#111111] transition-colors hover:bg-[#e5e5e5] focus:outline-none focus:ring-2 focus:ring-[#06bbb4]/30 lg:mx-0"
          >
            Заавар харах
          </a>
        </div>

        <div className="relative order-first flex justify-center lg:order-none">
          <div className="absolute bottom-4 left-1/2 h-32 w-[520px] -translate-x-1/2 rounded-full bg-white blur-2xl" />
          <PhoneMockup />
        </div>

        <div className="text-center lg:pb-16 lg:text-left">
          <h3 className="text-4xl font-black leading-[1.02] tracking-[-0.05em] text-[#111111]">
            QR болон track code-оор төлөвөө шууд хараарай
          </h3>
          <div className="mx-auto mt-7 w-full max-w-[220px] rounded-[28px] border-[10px] border-white bg-[#f5f5f5] p-4 shadow-[0_20px_60px_rgba(17,17,17,0.12)] lg:mx-0">
            <div className="grid grid-cols-5 gap-1">
              {Array.from({ length: 25 }).map((_, index) => (
                <span
                  key={index}
                  className={`aspect-square rounded-sm ${
                    [0, 1, 5, 6, 18, 19, 23, 24, 12].includes(index)
                      ? "bg-[#111111]"
                      : index % 3 === 0
                        ? "bg-[#06bbb4]"
                        : "bg-[#d9d9d9]"
                  }`}
                />
              ))}
            </div>
          </div>
          <p className="mt-4 text-sm font-semibold leading-6 text-[#666666]">
            Ачааны байршил, төлөв, сүүлийн шинэчлэлтийг гар утаснаасаа хянана.
          </p>
        </div>
      </div>
    </section>
  );
}
