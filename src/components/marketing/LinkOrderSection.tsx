import Link from "next/link";

const steps = [
  {
    num: "01",
    title: "Линкээ илгээнэ",
    desc: "Сонгосон барааны линк, тоо ширхэг, өнгө, хэмжээний мэдээллийг илгээнэ.",
  },
  {
    num: "02",
    title: "Мэдээллээ баталгаажуулна",
    desc: "Захиалгын дэлгэрэнгүй болон үнийн тооцоо баталгаажна.",
  },
  {
    num: "03",
    title: "Захиалга хийгдэнэ",
    desc: "Захиалга баталгаажиж, track code холбогдоно.",
  },
  {
    num: "04",
    title: "Бараагаа хүлээн авна",
    desc: "Бараа ирэхэд мэдэгдэл хүрч, салбараас авах эсвэл хаягаар хүргүүлнэ.",
  },
];

export default function LinkOrderSection() {
  return (
    <section className="bg-white py-20 sm:py-24 md:py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: copy */}
          <div>
            <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#06bbb4]/10 px-3.5 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-[#06bbb4]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#06bbb4]" />
              Линк захиалга
            </span>
            <h2 className="mb-4 text-4xl font-black leading-[1.02] tracking-[-0.05em] text-[#111111] sm:text-5xl">
              Линкээ илгээгээд захиалгаа{" "}
              <span className="text-[#06bbb4]">хялбар хийлгэ.</span>
            </h2>
            <p className="mb-8 max-w-md text-base leading-7 text-[#666666] sm:text-lg">
              Барааны линкээ илгээхэд захиалгын мэдээлэл шалгагдаж, худалдан
              авалтаас тээвэрлэлт хүртэлх явц хялбар болно.
            </p>
            <Link
              href="/link-order"
              className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#fe0000] px-7 text-sm font-black text-white transition-colors hover:bg-[#fe0000]/90 focus:outline-none focus:ring-2 focus:ring-[#fe0000]/30 focus:ring-offset-2"
            >
              Линк захиалга өгөх
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>

          {/* Right: steps */}
          <div className="space-y-3">
            {steps.map((step) => (
              <div
                key={step.num}
                className="group flex gap-5 rounded-[22px] border border-[#e5e5e5] bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#06bbb4]/40 hover:shadow-[0_18px_45px_rgba(17,17,17,0.08)]"
              >
                <div className="shrink-0 pt-0.5 text-2xl font-black leading-none tracking-[-0.04em] text-[#06bbb4]/40 transition-colors duration-300 group-hover:text-[#06bbb4]">
                  {step.num}
                </div>
                <div>
                  <h3 className="mb-1 text-base font-black tracking-[-0.02em] text-[#111111]">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#666666]">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
