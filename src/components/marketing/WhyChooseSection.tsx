const benefits = [
  {
    title: "Ачаагаа өөрөө хянана",
    desc: "Track code эсвэл утасны дугаараар хэдийд ч шалгана.",
  },
  {
    title: "Төлөв ойлгомжтой харагдана",
    desc: "6 шатлалт явц, тус бүрийн мэдэгдэлтэй.",
  },
  {
    title: "Үнэ тариф тодорхой",
    desc: "Жин, овор, чиглэлээр урьдчилан тооцоолно.",
  },
  {
    title: "Захиалга өгөхөд амар",
    desc: "Линкээ илгээгээд хэдхэн алхамд захиална.",
  },
  {
    title: "Холбогдоход хялбар",
    desc: "Асуух зүйл гарвал шууд холбогдоно.",
  },
];

export default function WhyChooseSection() {
  return (
    <section className="relative overflow-hidden bg-[#f7f7f7] py-20 sm:py-24 md:py-32 lg:py-40">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_16%,rgba(6,187,180,0.10),transparent_36%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          {/* Left */}
          <div className="lg:sticky lg:top-28">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-[#06bbb4] shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[#06bbb4]" />
              Яагаад WeCargo
            </span>
            <h2 className="text-4xl font-black leading-[1.02] tracking-[-0.05em] text-[#111111] sm:text-5xl">
              Карго илүү ойлгомжтой,
              <br />
              илүү <span className="text-[#06bbb4]">амар</span> байх ёстой.
            </h2>
            <p className="mt-4 max-w-md text-base leading-7 text-[#666666] sm:text-lg">
              Ачаа хаана яваа, хэзээ ирэх, хэдэн төгрөг болох нь тодорхой байх
              ёстой.
            </p>

            <div className="mt-8 inline-flex items-center gap-4 rounded-[22px] border border-[#e5e5e5] bg-white p-5 shadow-[0_18px_45px_rgba(17,17,17,0.06)]">
              <p className="text-5xl font-black tracking-[-0.05em] text-[#111111]">
                2014
              </p>
              <p className="max-w-[140px] text-sm font-semibold leading-5 text-[#666666]">
                оноос хойш Эрээн–УБ чиглэлд тогтмол.
              </p>
            </div>
          </div>

          {/* Right: benefit cards */}
          <div className="grid gap-3 sm:grid-cols-2">
            {benefits.map((b, i) => (
              <div
                key={b.title}
                className={`group rounded-[22px] border border-[#e5e5e5] bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#06bbb4]/40 hover:shadow-[0_18px_45px_rgba(17,17,17,0.08)] ${
                  i === 0 ? "sm:col-span-2" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#06bbb4]/10 text-[#06bbb4] transition-colors duration-300 group-hover:bg-[#06bbb4] group-hover:text-white">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-black tracking-[-0.02em] text-[#111111]">
                      {b.title}
                    </h3>
                    <p className="mt-1 text-sm font-medium leading-6 text-[#666666]">
                      {b.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
