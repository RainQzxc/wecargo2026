import Link from "next/link";

const factors = [
  ["Жин", "кг болон бодит жингээр"],
  ["Хэмжээ", "овортой ачаанд тусгай тооцоо"],
  ["Төрөл", "энгийн, эмзэг, онцлог ачаа"],
  ["Чиглэл", "Эрээн–Улаанбаатар"],
];

export default function PricingTeaser() {
  return (
    <section
      id="pricing"
      className="relative overflow-hidden border-y border-[#e5e5e5] bg-[#f7f7f7] py-20 sm:py-24 md:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(6,187,180,0.14),transparent_34%),radial-gradient(circle_at_86%_82%,rgba(254,0,0,0.08),transparent_32%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-[#06bbb4] shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[#06bbb4]" />
              Тариф
            </span>
            <h2 className="text-4xl font-semibold tracking-[-0.05em] text-[#1d1d1f] sm:text-5xl">
              Үнэ ойлгомжтой, урьдчилан тооцоолох боломжтой.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-[#333333] sm:text-lg">
              Ачааны жин, хэмжээ, төрөл, чиглэлээс хамаарч үнэ бодогдоно.
            </p>
          </div>

          <div className="rounded-[28px] border border-white bg-white/88 p-3 shadow-[0_24px_70px_rgba(17,17,17,0.08)] ring-1 ring-[#e5e5e5]/70 backdrop-blur">
            <div className="grid gap-3 sm:grid-cols-2">
              {factors.map(([title, desc]) => (
                <div
                  key={title}
                  className="rounded-[22px] border border-[#e5e5e5] bg-white p-5"
                >
                  <p className="text-2xl font-semibold tracking-[-0.04em] text-[#1d1d1f]">
                    {title}
                  </p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-[#6e6e73]">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-[22px] bg-[#1d1d1f] p-5 text-white sm:flex sm:items-center sm:justify-between sm:gap-6">
              <p className="text-sm font-semibold leading-6 text-white/70">
                Яаралтай болон онцлог ачааны үнэ тухайн ачааны жин, овор,
                төрлөөс хамаарч тооцогдоно.
              </p>
              <Link
                href="/pricing"
                className="mt-5 inline-flex min-h-12 items-center justify-center rounded-xl bg-[#fe0000] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#fe0000]/90 focus:outline-none focus:ring-2 focus:ring-[#fe0000]/30 sm:mt-0 sm:shrink-0"
              >
                Тариф харах
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
