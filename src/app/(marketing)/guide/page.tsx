import Link from "next/link";

const STEPS = [
  { step:"01", color:"#06bbb4", title:"Бүртгүүл",    desc:"WECARGO дээр хаяг үүсгэнэ. Хятад агуулахын хаягаа авна." },
  { step:"02", color:"#06bbb4", title:"Захиал",       desc:"Хятадын онлайн дэлгүүрт WECARGO-н хаяг руу захиалаарай." },
  { step:"03", color:"#06bbb4", title:"Хүлээн авна",  desc:"Бараа агуулахад ирмэгц трак код ирнэ. Системд хянана уу." },
  { step:"04", color:"#fe0000", title:"Тээвэрлэнэ",  desc:"Бараа бүлэглэгдэж, Улаанбаатар руу ачигдана. 3–7 хоногт ирнэ." },
  { step:"05", color:"#fe0000", title:"Аваарай",      desc:"Улаанбаатарын агуулахаас өөрөө авах эсвэл курьерт хүргүүлнэ." },
];

const TIPS = [
  { title:"Зөв хаяг ашиглаарай",  desc:"Манай хятад агуулахын хаягийг захиалгадаа нэмэхдээ бүртгэлийн нэрийг зөв бичнэ үү." },
  { title:"Трак кодоо хадгал",     desc:"Хятад дэлгүүрийн илгээсэн трак кодыг хадгалаарай — бараагаа хянахад хэрэгтэй." },
  { title:"Хориотой бараа",         desc:"Хуурамч, аюулгүйн байдлын стандартад нийцэхгүй, хориотой бараа бүү захилаарай." },
  { title:"Жин ба хэмжээ",          desc:"Том, хэмжээ ихтэй бараа тариф нэмэгдэж болно. Урьдчилан тооцоолуурт шалгаарай." },
];

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <section className="relative overflow-hidden border-b border-[#e5e5e5] bg-white px-4 py-24 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(6,187,180,0.12),transparent_34%)]" />
        <div className="relative mx-auto max-w-7xl">
          <span className="mb-5 inline-flex rounded-full bg-[#06bbb4]/10 px-3.5 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-[#06bbb4]">Хэрхэн ашиглах вэ</span>
          <h1 className="text-5xl font-black tracking-[-0.055em] text-[#111111] sm:text-6xl">
            5 алхамаар<br />Хятадаас Монгол руу.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#666666]">
            WECARGO ашиглаж эхлэх нь маш хялбар. Доорх алхмуудыг дагаж, анхны захиалгаа хийгээрэй.
          </p>
          <div className="mt-8">
            <Link href="/login" className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#06bbb4] px-6 text-sm font-black text-white transition-colors hover:bg-[#06bbb4]/90">
              Бүртгэл үүсгэх
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-10 text-3xl font-black tracking-[-0.04em] text-[#111111]">Алхам алхмаар</h2>
          <div className="space-y-4">
            {STEPS.map((s) => (
              <div key={s.step} className="flex items-start gap-5 rounded-[24px] border border-[#e5e5e5] bg-white p-6">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl font-black text-lg text-white" style={{ background: s.color }}>
                  {s.step}
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-[-0.03em] text-[#111111]">{s.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-[#666666]">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-8 text-3xl font-black tracking-[-0.04em] text-[#111111]">Мэргэжилтний зөвлөмж</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {TIPS.map((t) => (
              <div key={t.title} className="rounded-2xl border border-[#e5e5e5] bg-white p-6">
                <div className="mb-2 flex items-center gap-2">
                  <div className="size-2 rounded-full bg-[#06bbb4]" />
                  <h3 className="font-black text-[#111111]">{t.title}</h3>
                </div>
                <p className="text-sm leading-6 text-[#666666]">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
