import Link from "next/link";
import { getActiveFaqs } from "@/features/content/dal";

const PLANS = [
  {
    name: "Стандарт",
    tag: "Хувь хүн",
    priceLabel: "Кг/₮-аар тооцно",
    color: "#06bbb4",
    desc: "Хэрэглэгч болгонд тохирсон ил тод, тогтмол тарифтай хэвийн ачааны тээвэр.",
    features: [
      "Хятадаас Монгол хүртэл тогтмол тариф",
      "Онлайн трак код хянах",
      "Агуулахад хадгалах (7 хоног үнэгүй)",
      "И-мэйл мэдэгдэл",
      "Курьерт хүргэлт нэмэлт төлбөртэй",
    ],
  },
  {
    name: "Бизнес",
    tag: "Байгууллага",
    priceLabel: "Тохиролцсоноор",
    color: "#fe0000",
    desc: "Тогтмол ачааны хэмжээтэй бизнесүүдэд зориулсан уян хатан нөхцөл, хяналт.",
    features: [
      "Тохиролцсон үнийн нөхцөл",
      "Хэмжилт, жинлэлт агуулахад",
      "Гэрээт тээвэр, тайлан",
      "Тусгайлсан удирдлагын панел",
      "Дэмжлэгийн шугам тэргүүлэх",
    ],
    highlight: true,
  },
  {
    name: "Хадгалалт",
    tag: "Агуулах",
    priceLabel: "Хоногийн нөхцөлтэй",
    color: "#111111",
    desc: "Урт хугацаанд хадгалах шаардлагатай ачаанд зориулсан уян хатан агуулахын үйлчилгээ.",
    features: [
      "7 хоногийн дараа хоногоор тооцно",
      "Найдвартай, хуурай агуулах",
      "Ачаагаа хэдийд ч авах боломжтой",
      "Жин, хэмжилтийн тайлан",
      "Хамтын тэвшинд нэгтгэх боломж",
    ],
  },
];

const FAQS = [
  {
    q: "Тариф хэрхэн тооцогддог вэ?",
    a: "Ачааны жин (кг) эсвэл эзлэхүүн (м³) хоёрын аль том нь тарифын суурь болно. Тодорхой тариф авахыг хүсвэл тооцоолуур ашиглаарай.",
  },
  {
    q: "Хүргэлтийн үйлчилгээ байдаг уу?",
    a: "Тийм. Улаанбаатарын хаяг руу курьерээр хүргэх боломжтой. Нэмэлт хүргэлтийн тариф хаяг, цагаас хамааран тооцогдоно.",
  },
  {
    q: "Хэдэн хоногт Монголд ирдэг вэ?",
    a: "Хятад агуулахаас 3–7 ажлын өдрийн дотор Улаанбаатарын агуулахад ирнэ. Улирал, ачааны хэмжээнээс хамааран хугацаа өөрчлөгдөж болно.",
  },
  {
    q: "Хориотой бараа байдаг уу?",
    a: "Тийм. Хуурамч, аюултай, тусгай зөвшөөрөл шаардах бараа тээвэрлэх боломжгүй. Дэлгэрэнгүй мэдээллийг манай менежертэй холбогдож лавлаарай.",
  },
];

export default async function PricingPage() {
  // Admin-managed FAQs take precedence; fall back to the built-in list when none
  // are configured (or the DB is unreachable). See src/features/content/dal.ts.
  const dbFaqs = await getActiveFaqs();
  const faqs = dbFaqs.length > 0 ? dbFaqs.map((f) => ({ q: f.question, a: f.answer })) : FAQS;
  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[#e5e5e5] bg-white px-4 py-24 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(6,187,180,0.12),transparent_36%),radial-gradient(circle_at_80%_70%,rgba(254,0,0,0.07),transparent_34%)]" />
        <div className="relative mx-auto max-w-7xl text-center">
          <span className="mb-5 inline-flex rounded-full bg-[#06bbb4]/10 px-3.5 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-[#06bbb4]">Тариф</span>
          <h1 className="text-5xl font-black tracking-[-0.055em] text-[#111111] sm:text-6xl">Ил тод тариф,<br />Нуугдмал төлбөргүй.</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#666666]">
            Кг тутам тогтмол тариф. Хэмжилт, хадгалалт, хүргэлтийн нөхцөлийг тодорхой мэдэж авна уу.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 md:grid-cols-3">
            {PLANS.map((plan) => (
              <article key={plan.name} className={`relative rounded-[28px] border bg-white p-7 shadow-sm ${plan.highlight ? "border-[#fe0000] ring-1 ring-[#fe0000]/20" : "border-[#e5e5e5]"}`}>
                {plan.highlight && (
                  <span className="absolute -top-3 left-6 rounded-full bg-[#fe0000] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white">Хамгийн их сонголт</span>
                )}
                <div className="mb-4">
                  <span className="text-xs font-black uppercase tracking-widest" style={{ color: plan.color }}>{plan.tag}</span>
                  <h2 className="mt-1 text-3xl font-black tracking-[-0.04em] text-[#111111]">{plan.name}</h2>
                  <p className="mt-1 text-sm font-bold text-[#666666]">{plan.priceLabel}</p>
                </div>
                <p className="mb-5 text-sm leading-6 text-[#444444]">{plan.desc}</p>
                <ul className="space-y-2.5 text-sm">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <svg className="mt-0.5 size-4 shrink-0" style={{ color: plan.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-[#333333]">{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-7">
                  <Link href="/contact" className="flex min-h-11 items-center justify-center rounded-xl text-sm font-black transition-colors"
                    style={{ background: plan.color, color: "#fff" }}>
                    Холбоо барих
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-3xl font-black tracking-[-0.04em] text-[#111111]">Нийтлэг асуулт</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-2xl border border-[#e5e5e5] bg-white p-6">
                <h3 className="text-base font-black text-[#111111]">{faq.q}</h3>
                <p className="mt-2 text-sm leading-6 text-[#666666]">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
