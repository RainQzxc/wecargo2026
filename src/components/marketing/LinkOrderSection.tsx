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
            <div className="inline-flex items-center gap-2 bg-[#06bbb4]/10 text-[#06bbb4] text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
              Линк захиалга
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#111111] tracking-tight mb-4">
              Линкээ илгээгээд захиалгаа{" "}
              <span className="text-[#06bbb4]">хялбар хийлгэ.</span>
            </h2>
            <p className="text-[#666666] text-lg leading-relaxed mb-8">
              Барааны линкээ илгээхэд захиалгын мэдээлэл шалгагдаж, худалдан
              авалтаас тээвэрлэлт хүртэлх явц хялбар болно.
            </p>
            <Link
              href="/link-order"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#fe0000] hover:bg-[#fe0000]/90 text-white font-semibold rounded-xl transition-colors text-sm"
            >
              Линк захиалга өгөх
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>

          {/* Right: steps */}
          <div className="space-y-5">
            {steps.map((step) => (
              <div
                key={step.num}
                className="flex gap-5 p-5 rounded-2xl bg-white border border-[#e5e5e5] hover:border-[#06bbb4]/40 hover:shadow-md transition-all"
              >
                <div className="text-2xl font-bold text-[#06bbb4] shrink-0 leading-none pt-0.5">
                  {step.num}
                </div>
                <div>
                  <h3 className="font-semibold text-[#111111] mb-1">
                    {step.title}
                  </h3>
                  <p className="text-[#666666] text-sm leading-relaxed">
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
