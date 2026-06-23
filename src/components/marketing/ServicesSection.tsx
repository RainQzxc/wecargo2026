import Link from "next/link";

const services = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
    title: "Эрээн–Улаанбаатар карго",
    desc: "БНХАУ-аас Монгол Улс руу бүх төрлийн ачааг найдвартай, шуурхай тээвэрлэнэ.",
    href: "/#services",
    cta: "Дэлгэрэнгүй харах",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z" />
      </svg>
    ),
    title: "Ухаалаг хяналт",
    desc: "трак код эсвэл утасны дугаараараа ачааныхаа явцыг цаг алдалгүй онлайнаар шалгаарай.",
    href: "/track",
    cta: "Шууд шалгах",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
      </svg>
    ),
    title: "Линк захиалга",
    desc: "Та барааныхаа линкийг илгээхэд л хангалттай. Бид худалдан авалтыг таны өмнөөс хийнэ.",
    href: "/link-order",
    cta: "Захиалга өгөх",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
    title: "Хүргэлт & Хадгалалт",
    desc: "Ирсэн ачаагаа хаягаар хүргүүлэх эсвэл манай дулаан агуулахад түр хадгалуулах боломжтой.",
    href: "/guide",
    cta: "Сонголтууд харах",
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="bg-white py-20 sm:py-24 md:py-32 lg:py-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 bg-[#06bbb4]/10 text-[#06bbb4] text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#06bbb4]" />
            Бидний үйлчилгээ
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#111111] tracking-tight">
            Танд хэрэгтэй карго үйлчилгээ{" "}
            <span className="text-[#06bbb4]">нэг дор</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((s) => (
            <div
              key={s.title}
              className="bg-white rounded-2xl p-6 border border-[#e5e5e5] hover:border-[#06bbb4]/40 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
            >
              <div className="w-11 h-11 rounded-xl bg-[#06bbb4]/10 text-[#06bbb4] flex items-center justify-center mb-4">
                {s.icon}
              </div>
              <h3 className="font-semibold text-[#111111] mb-2">{s.title}</h3>
              <p className="text-[#666666] text-sm leading-relaxed flex-1 mb-5">
                {s.desc}
              </p>
              <Link
                href={s.href}
                className="text-[#06bbb4] hover:text-[#06bbb4]/80 text-sm font-semibold flex items-center gap-1.5 group"
              >
                {s.cta}
                <svg
                  className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
