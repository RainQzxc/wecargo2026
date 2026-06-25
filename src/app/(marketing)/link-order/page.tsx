import Link from "next/link";

const HOW_IT_WORKS = [
  { n:"01", title:"Бараагаа хайна",  desc:"Хятадын онлайн дэлгүүрүүдэд хайж, URL болон дэлгэрэнгүй мэдээллийг хуулж авна." },
  { n:"02", title:"Захиалга илгээнэ", desc:"Манай системд URL, тоо ширхэг, хэмжээ зэргийг оруулж захиалга илгээнэ." },
  { n:"03", title:"Биднийг ажлуулаарай", desc:"WECARGO менежер шалгаж, бараагаа худалдаж аваад тээвэрлэнэ." },
  { n:"04", title:"Монголд хүлээнэ", desc:"3–7 ажлын өдрийн дотор агуулахад ирнэ. Трак код илгээж мэдэгдэнэ." },
];

const BENEFITS = [
  "Хятад хэл мэдэхгүй байсан ч гэсэн захиалах боломжтой",
  "Манай баг бараагийн жинхэнэ чанарыг шалгана",
  "Нэг дор олон дэлгүүрийн бараа нэгтгэн захиалах боломж",
  "Тодорхой үнийн тооцоолол, нуугдмал хураамжгүй",
  "Системд реал-цагийн хянах боломж",
];

export default function LinkOrderPage() {
  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[#e5e5e5] bg-white px-4 py-24 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(6,187,180,0.13),transparent_36%),radial-gradient(circle_at_80%_72%,rgba(254,0,0,0.07),transparent_34%)]" />
        <div className="relative mx-auto max-w-7xl">
          <span className="mb-5 inline-flex rounded-full bg-[#06bbb4]/10 px-3.5 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-[#06bbb4]">Линк захиалга</span>
          <h1 className="text-5xl font-black tracking-[-0.055em] text-[#111111] sm:text-6xl">
            URL нэг шигт хуулаад,<br />бид үлдсэнийг хийнэ.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#666666]">
            Хятад дэлгүүрийн линкийг биднийг илгээж өгвөл тухайн бараагаа захиалж, Монголд хүртэл хүргэнэ.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/login" className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#fe0000] px-6 text-sm font-black text-white transition-colors hover:bg-[#fe0000]/90">
              Захиалга илгээх
            </Link>
            <Link href="/guide" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#e5e5e5] bg-white px-6 text-sm font-black text-[#111111] transition-colors hover:border-[#06bbb4] hover:text-[#06bbb4]">
              Дэлгэрэнгүй
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-10 text-3xl font-black tracking-[-0.04em] text-[#111111]">Хэрхэн ажилладаг вэ?</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS.map((s) => (
              <div key={s.n} className="rounded-[24px] border border-[#e5e5e5] bg-white p-6">
                <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-[#06bbb4] font-black text-sm text-white">{s.n}</div>
                <h3 className="font-black text-[#111111]">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#666666]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <h2 className="mb-8 text-3xl font-black tracking-[-0.04em] text-[#111111]">Яагаад WECARGO?</h2>
            <ul className="space-y-4">
              {BENEFITS.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <div className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#06bbb4]">
                    <svg className="size-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm leading-6 text-[#333333]">{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[28px] border border-[#e5e5e5] bg-white p-8">
            <h2 className="mb-2 text-2xl font-black tracking-[-0.04em] text-[#111111]">Захиалга илгээхэд бэлэн үү?</h2>
            <p className="mb-6 text-sm leading-6 text-[#666666]">Бүртгэл үүсгэж, линк захиалгын маягтыг бөглөнө үү.</p>
            <Link href="/login" className="flex min-h-12 items-center justify-center rounded-xl bg-[#fe0000] text-sm font-black text-white transition-colors hover:bg-[#fe0000]/90">
              Захиалга эхлүүлэх
            </Link>
            <p className="mt-4 text-center text-xs text-[#aaa]">Бүртгэлтэй бол нэвтэрнэ үү</p>
          </div>
        </div>
      </section>
    </div>
  );
}
