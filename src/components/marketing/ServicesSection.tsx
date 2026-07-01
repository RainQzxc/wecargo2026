import Link from "next/link";

function MiniTimeline() {
  const steps = ["Эрээн", "Бүртгэл", "Ачилт", "Зам", "УБ"];

  return (
    <div className="rounded-[22px] bg-white p-5 shadow-[0_18px_45px_rgba(17,17,17,0.10)]">
      <div className="mb-5 flex items-center justify-between">
        <p className="text-xs font-semibold text-[#6e6e73]">
          CB4821067753MN
        </p>
        <span className="rounded-full bg-[#06bbb4]/10 px-2.5 py-1 text-[10px] font-semibold text-[#06bbb4]">
          Замд
        </span>
      </div>
      <div className="flex items-center gap-2">
        {steps.map((step, index) => (
          <div key={step} className="min-w-0 flex-1 text-center">
            <div
              className={`mx-auto mb-2 grid h-8 w-8 place-items-center rounded-full text-xs font-semibold ${
                index < 4 ? "bg-[#1d1d1f] text-white" : "bg-[#f2f2f2] text-[#999999]"
              }`}
            >
              {index + 1}
            </div>
            <p className="truncate text-[10px] font-bold text-[#6e6e73]">
              {step}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function LinkOrderPlanner() {
  const rows = [
    ["09:30", "Барааны линк хүлээн авсан", "Шинэ"],
    ["10:15", "Үнэ, өнгө, хэмжээ баталгаажсан", "OK"],
    ["12:40", "Захиалга үүссэн", "Track"],
  ];

  return (
    <div className="rounded-[22px] border border-white/12 bg-[#071414] p-5 text-white shadow-[0_18px_55px_rgba(7,20,20,0.35)]">
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm font-semibold">Smart link order</p>
        <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] font-bold text-white/55">
          realtime
        </span>
      </div>
      <div className="space-y-2">
        {rows.map(([time, title, status]) => (
          <div
            key={title}
            className="grid grid-cols-[48px_1fr_auto] items-center gap-3 rounded-xl border border-white/10 bg-white/6 px-3 py-2.5"
          >
            <p className="text-[10px] font-semibold text-white/45">{time}</p>
            <p className="truncate text-xs font-semibold">{title}</p>
            <p className="rounded-full bg-[#06bbb4] px-2 py-1 text-[9px] font-semibold text-[#061212]">
              {status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PhoneCards() {
  return (
    <div className="absolute -bottom-10 right-6 w-[250px] rounded-[28px] border-[8px] border-[#1d1d1f] bg-white p-4 shadow-[0_24px_70px_rgba(17,17,17,0.24)]">
      <div className="mx-auto mb-4 h-4 w-20 rounded-full bg-[#1d1d1f]" />
      <div className="mb-4 rounded-2xl bg-[#f7f7f7] p-3">
        <p className="text-xs font-semibold text-[#1d1d1f]">Өнөөдрийн ачаа</p>
        <p className="mt-1 text-[10px] font-semibold text-[#6e6e73]">
          3 ачаа шинэчлэгдсэн
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {["Замд", "Ирсэн", "Төлбөр", "Хадгалалт"].map((item, index) => (
          <div
            key={item}
            className={`rounded-xl p-3 ${
              index === 0
                ? "bg-[#06bbb4]/20"
                : index === 1
                  ? "bg-[#fe0000]/10"
                  : "bg-[#f2f2f2]"
            }`}
          >
            <p className="text-[11px] font-semibold text-[#1d1d1f]">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ServicesSection() {
  return (
    <section id="services" className="relative overflow-hidden bg-white py-20 sm:py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(6,187,180,0.08),transparent_28%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 grid gap-6 lg:grid-cols-[0.9fr_1fr] lg:items-end">
          <div>
            <span className="mb-4 inline-flex rounded-full bg-[#f2f2f2] px-3 py-1.5 text-xs font-semibold text-[#6e6e73]">
              WECARGO систем
            </span>
            <h2 className="text-4xl font-semibold leading-[1.02] tracking-[-0.05em] text-[#1d1d1f] sm:text-5xl">
              Нэг layout дотор бүх явц тодорхой.
            </h2>
          </div>
          <p className="max-w-xl text-base font-semibold leading-7 text-[#6e6e73] lg:justify-self-end">
            Ачаа хянах, линк захиалга өгөх, үнэ тооцох, бизнесийн ачаагаа
            удирдах бүх гол үйлдлийг нэг системд төвлөрүүлсэн.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <article className="rounded-[26px] bg-[#f1f1f1] p-6 shadow-sm lg:min-h-[330px]">
            <h3 className="text-lg font-semibold text-[#1d1d1f]">Ачааны явц нэг харахад</h3>
            <p className="mt-2 max-w-sm text-sm font-semibold leading-6 text-[#6e6e73]">
              Track code эсвэл утасны дугаараар явц, төлөв, сүүлийн шинэчлэлтийг шалгана.
            </p>
            <div className="mt-8">
              <MiniTimeline />
            </div>
          </article>

          <article className="rounded-[26px] bg-[radial-gradient(circle_at_70%_20%,rgba(6,187,180,0.22),transparent_32%),#0b1815] p-6 text-white shadow-sm lg:min-h-[330px]">
            <h3 className="text-lg font-semibold">Линк захиалга төлөвлөгөөтэй</h3>
            <p className="mt-2 max-w-sm text-sm font-semibold leading-6 text-white/65">
              Барааны линк, хэмжээ, өнгө, тоо ширхэгийг илгээж захиалгаа хурдан үүсгэнэ.
            </p>
            <div className="mt-7">
              <LinkOrderPlanner />
            </div>
          </article>

          <article className="relative min-h-[360px] overflow-hidden rounded-[26px] bg-[#101515] p-6 text-white shadow-sm lg:col-span-2">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_16%,rgba(6,187,180,0.26),transparent_26%),linear-gradient(90deg,rgba(255,255,255,0.04),transparent)]" />
            <div className="relative max-w-md">
              <h3 className="text-2xl font-semibold tracking-[-0.04em]">
                Гар утсанд бүрэн тохирсон хэрэглэгчийн систем
              </h3>
              <p className="mt-3 text-sm font-semibold leading-6 text-white/65">
                Ачааны жагсаалт, төлбөр, ирсэн төлөв, хадгалалт, хүргэлтийн
                мэдээлэл бүгд нэг дор.
              </p>
              <Link
                href="/login"
                className="mt-7 inline-flex min-h-12 items-center rounded-full bg-white px-6 text-sm font-semibold text-[#1d1d1f] transition-colors hover:bg-[#06bbb4] hover:text-white"
              >
                Систем рүү нэвтрэх
              </Link>
            </div>
            <PhoneCards />
          </article>

          <article className="rounded-[26px] bg-[#171717] p-6 text-white shadow-sm">
            <h3 className="text-lg font-semibold">Үнэ урьдчилан ойлгомжтой</h3>
            <p className="mt-2 text-sm font-semibold leading-6 text-white/60">
              Жин, хэмжээ, төрөл, чиглэлээс хамаарч тооцоолно. Онцлог ачаанд тусгай нөхцөлтэй.
            </p>
            <div className="mt-7 grid grid-cols-3 gap-2">
              {["Жин", "Овор", "Төрөл"].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/6 p-4">
                  <p className="text-sm font-semibold">{item}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[26px] bg-[#1d1d1f] p-6 text-white shadow-sm">
            <h3 className="text-lg font-semibold">Бизнесийн ачаанд тохиромжтой</h3>
            <p className="mt-2 text-sm font-semibold leading-6 text-white/60">
              Онлайн дэлгүүр, reseller, байгууллагын тогтмол ачаанд хамтын ажиллагааны нөхцөл.
            </p>
            <Link
              href="/cooperation"
              className="mt-7 inline-flex min-h-12 items-center rounded-full bg-[#06bbb4] px-6 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-[#1d1d1f]"
            >
              Хамтран ажиллах
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}
