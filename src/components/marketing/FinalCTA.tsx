import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="relative flex min-h-[70svh] items-center overflow-hidden border-t border-[#e5e5e5] bg-[#f7f7f7] py-20 lg:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(6,187,180,0.12),transparent_45%),linear-gradient(180deg,#ffffff_0%,#f7f7f7_100%)]" />
      <div className="relative mx-auto w-full max-w-[1440px] px-5 sm:px-6 lg:px-16">
        <div className="mx-auto max-w-4xl overflow-hidden rounded-[28px] border border-[#e5e5e5] bg-white shadow-[0_24px_80px_rgba(17,17,17,0.08)]">
          <div className="grid gap-0 lg:grid-cols-[1fr_auto]">
            <div className="p-6 text-center sm:p-8 lg:p-10 lg:text-left">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#06bbb4]/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-[#06bbb4]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#06bbb4]" />
                Дараагийн алхам
              </div>
              <h2 className="text-4xl font-black tracking-[-0.04em] text-[#111111] sm:text-5xl">
                Ачаагаа биднээр даатгамаар байна уу?
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#666666] sm:text-lg lg:mx-0">
                Барааныхаа линкийг хэрхэн зөв илгээх, мэдээллээ яаж бөглөх,
                захиалга үүссэний дараа юу болохыг нэг дороос хараарай.
              </p>
              <div className="mt-8 flex justify-center lg:justify-start">
                <Link
                  href="/guide"
                  className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl bg-[#fe0000] px-7 py-3 text-sm font-black text-white transition-colors hover:bg-[#fe0000]/90 focus:outline-none focus:ring-2 focus:ring-[#fe0000]/30 focus:ring-offset-2"
                >
                  Линк холбох заавар
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                    />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="relative hidden min-h-full w-64 overflow-hidden border-l border-[#e5e5e5] bg-[#111111] p-6 lg:block">
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#06bbb4]/25 blur-3xl" />
              <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-[#fe0000]/20 blur-3xl" />
              <div className="relative flex h-full flex-col justify-between">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-white/45">
                    Link order
                  </p>
                  <p className="mt-3 text-2xl font-black leading-tight tracking-[-0.04em] text-white">
                    4 алхмаар захиалга үүсгэнэ.
                  </p>
                </div>
                <div className="space-y-2 text-sm font-semibold text-white/65">
                  <p>01. Линкээ илгээнэ</p>
                  <p>02. Мэдээллээ батална</p>
                  <p>03. Захиалга үүснэ</p>
                  <p>04. Ачаагаа хянана</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
