import Link from "next/link";

export default function PricingTeaser() {
  return (
    <section className="bg-white py-20 sm:py-24 md:py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="relative overflow-hidden bg-[#f7f7f7] border border-[#e5e5e5] rounded-3xl p-8 lg:p-12">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#111111] tracking-tight mb-3">
                  Үнэ ойлгомжтой, урьдчилан тооцоолох боломжтой.
                </h2>
                <p className="text-[#333333] leading-relaxed mb-4">
                  Ачааны жин, хэмжээ, төрөл, чиглэлээс хамаарч үнэ бодогдоно.
                </p>
                <p className="text-[#666666] text-sm">
                  Яаралтай болон онцлог ачааны үнэ тухайн ачааны жин, овор,
                  төрлөөс хамаарч тооцогдоно.
                </p>
              </div>
              <div className="shrink-0">
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3.5 bg-[#fe0000] hover:bg-[#fe0000]/90 text-white font-semibold rounded-xl transition-colors text-sm whitespace-nowrap"
                >
                  Тариф харах
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
