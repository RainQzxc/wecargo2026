function PhoneMockup() {
  return (
    <div className="relative mx-auto w-[260px]">
      <div className="relative bg-[#111111] rounded-[36px] p-3 shadow-2xl border-4 border-[#111111]">
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-[#333333] rounded-full" />

        <div className="bg-white rounded-[28px] overflow-hidden pt-6 pb-4 px-4 min-h-[500px]">
          <div className="flex items-center justify-between mb-4">
            <span className="font-bold text-[#111111] text-sm">
              WE<span className="text-[#06bbb4]">CARGO</span>
            </span>
            <div className="w-6 h-6 rounded-full bg-[#f2f2f2] flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-[#e5e5e5]" />
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
    <section className="bg-white py-20 sm:py-24 md:py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 bg-[#06bbb4]/10 text-[#06bbb4] text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#06bbb4] animate-pulse" />
            Хэрэглэгчийн систем
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#111111] tracking-tight">
            Ачаагаа хэзээ ч, хаанаас ч{" "}
            <span className="text-[#06bbb4]">хяна.</span>
          </h2>
          <p className="text-[#666666] mt-3 text-lg">
            Гар утсанд бүрэн тохирсон, ойлгомжтой, хэрэглэхэд хялбар систем.
          </p>
        </div>
        <div className="flex justify-center">
          <PhoneMockup />
        </div>
      </div>
    </section>
  );
}
