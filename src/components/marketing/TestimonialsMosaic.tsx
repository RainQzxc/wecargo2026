import Link from "next/link";

const testimonials = [
  {
    quote: "Захиалгын дугаар, ирсэн ачаа, төлбөрөө нэг дор харахад маш амар болсон.",
    name: "Б. Энхжин",
    role: "Онлайн худалдаа эрхлэгч",
    initials: "ЭЖ",
  },
  {
    quote:
      "Эрээнээс ирж байгаа ачаагаа алхам бүрээр нь шалгадаг болсон. Хэзээ авах нь тодорхой байдаг нь хамгийн хэрэгтэй.",
    name: "Г. Мөнх-Оргил",
    role: "Тогтмол үйлчлүүлэгч",
    initials: "МО",
  },
  {
    quote: "Link order өгөөд явцыг нь dashboard дээрээсээ харах нь цаг их хэмнэдэг.",
    name: "С. Номин",
    role: "Жижиг бизнес",
    initials: "Н",
  },
  {
    quote: "Утасдаж лавлах зүйл багассан. Ачааны төлөв ойлгомжтой харагддаг.",
    name: "Д. Тэмүүлэн",
    role: "Хувиараа бизнес эрхлэгч",
    initials: "Т",
  },
  {
    quote: "Тогтмол ачаатай үед аль шатанд явааг харах нь багийн ажлыг хөнгөвчилсөн.",
    name: "А. Сарангэрэл",
    role: "Дэлгүүрийн менежер",
    initials: "С",
  },
  {
    quote: "Ачаа ирэхэд мэдэгдэлтэй, авахад бэлэн эсэх нь тодорхой байдаг.",
    name: "М. Хүслэн",
    role: "Үйлчлүүлэгч",
    initials: "Х",
  },
];

export default function TestimonialsMosaic() {
  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-3xl">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#06bbb4]/10 px-3.5 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-[#06bbb4]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#06bbb4]" />
            Сэтгэгдэл
          </span>
          <h2 className="text-4xl font-black tracking-[-0.05em] text-[#111111] sm:text-5xl">
            Хэрэглэгчид WECARGO-г ингэж ашиглаж байна.
          </h2>
        </div>

        <div className="relative">
          <div className="grid gap-5 md:grid-cols-3">
            {testimonials.map((item, index) => (
              <article
                key={item.name}
                className={`rounded-[22px] bg-[#ececec] p-6 shadow-sm ${
                  index === 1 ? "md:translate-y-6" : ""
                } ${index >= 3 ? "opacity-[0.72]" : ""}`}
              >
                <p className="min-h-[96px] text-lg font-bold leading-7 tracking-[-0.02em] text-[#4a4a4a]">
                  {item.quote}
                </p>
                <div className="mt-8 flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#06bbb4] text-sm font-black text-white">
                      {item.initials}
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-black text-[#111111]">
                        {item.name}
                      </h3>
                      <p className="truncate text-sm font-semibold text-[#555555]">
                        {item.role}
                      </p>
                    </div>
                  </div>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-2xl font-black text-[#111111]">
                    ×
                  </span>
                </div>
              </article>
            ))}
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-white via-white/88 to-transparent" />
          <div className="absolute inset-x-0 bottom-9 flex justify-center">
            <Link
              href="/contact"
              className="pointer-events-auto inline-flex min-h-14 items-center justify-center rounded-full bg-[#111111] px-8 text-sm font-black text-white shadow-[0_16px_34px_rgba(17,17,17,0.28)] transition-colors hover:bg-[#06bbb4] focus:outline-none focus:ring-2 focus:ring-[#06bbb4]/30 focus:ring-offset-2"
            >
              Бидэнтэй холбогдох
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
