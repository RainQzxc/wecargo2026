import Link from "next/link";

const cols = [
  {
    heading: "Үйлчилгээ",
    links: [
      { href: "/track", label: "Ачаа хянах" },
      { href: "/#services", label: "Эрээн карго" },
      { href: "/link-order", label: "Линк захиалга" },
      { href: "/pricing", label: "Тариф" },
    ],
  },
  {
    heading: "Компани",
    links: [
      { href: "/cooperation", label: "Хамтран ажиллах" },
      { href: "/guide", label: "Заавар" },
      { href: "/contact", label: "Холбоо барих" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#1d1d1f] border-t border-[#e5e5e5]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand column */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="text-white font-bold text-xl tracking-tight">
                WE<span className="text-[#06bbb4]">CARGO</span>
              </span>
            </Link>
            <p className="text-white/55 text-sm leading-relaxed max-w-sm">
              2014 оноос хойш Эрээн–Улаанбаатар чиглэлд тээвэр, логистикийн
              үйлчилгээ үзүүлж ирсэн туршлагатай хамт олон.
            </p>
            <div className="mt-6 space-y-2 text-sm text-white/55">
              <p>
                <span className="text-white/35">Утас:</span>{" "}
                <a href="tel:88104640" className="hover:text-white transition-colors">
                  8810 4640
                </a>
              </p>
              <p>
                <span className="text-white/35">Эрээн утас:</span>{" "}
                <a href="tel:15148615407" className="hover:text-white transition-colors">
                  15148615407
                </a>
              </p>
              <p>
                <span className="text-white/35">Имэйл:</span>{" "}
                <a
                  href="mailto:info@wecargo.mn"
                  className="hover:text-white transition-colors"
                >
                  info@wecargo.mn
                </a>
              </p>
              <p>
                <span className="text-white/35">Хаяг:</span> Улаанбаатар, Монгол
              </p>
            </div>
          </div>

          {/* Link columns */}
          {cols.map((col) => (
            <div key={col.heading}>
              <h4 className="text-white text-sm font-semibold mb-4">
                {col.heading}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/55 hover:text-[#06bbb4] text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/35 text-xs">
            © {new Date().getFullYear()} WECARGO. Бүх эрх хуулиар хамгаалагдсан.
          </p>
          <p className="text-white/25 text-xs">
            Эрээн–Улаанбаатар карго үйлчилгээ
          </p>
        </div>
      </div>
    </footer>
  );
}
