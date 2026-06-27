const benefits = [
  "Ачаагаа өөрөө хянана",
  "Төлөв ойлгомжтой харагдана",
  "Үнэ тариф тодорхой",
  "Захиалга өгөхөд амар",
  "Асуух зүйл гарвал холбогдоход хялбар",
];

export default function WhyChooseSection() {
  return (
    <section className="bg-[#f7f7f7] py-20 sm:py-24 md:py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left */}
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1d1d1f] tracking-tight mb-4">
              Карго илүү ойлгомжтой,
              <br />
              илүү <span className="text-[#06bbb4]">амар</span> байх ёстой.
            </h2>
            <p className="text-[#6e6e73] text-lg leading-relaxed">
              Ачаа хаана яваа, хэзээ ирэх, хэдэн төгрөг болох нь тодорхой байх
              ёстой.
            </p>
          </div>

          {/* Right: checklist */}
          <div className="space-y-3.5">
            {benefits.map((b) => (
              <div
                key={b}
                className="flex items-start gap-3.5 bg-white border border-[#e5e5e5] rounded-2xl p-4"
              >
                <div className="w-6 h-6 rounded-full bg-[#06bbb4] flex items-center justify-center shrink-0 mt-0.5">
                  <svg
                    className="w-3.5 h-3.5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                </div>
                <span className="text-[#333333] font-medium">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
