import Link from "next/link";

const options = [
  ["Онлайн дэлгүүр", "Тогтмол захиалга, олон хэрэглэгчтэй худалдаанд тохиромжтой."],
  ["Reseller", "Олон бараа нэг дор удирдах, бөөний ачаанд уян хатан нөхцөл."],
  ["Байгууллага", "Гэрээт тээвэр, тайлан, тусгай үнийн нөхцөлтэй хамтын ажиллагаа."],
];

export default function CooperationPage() {
  return (
    <main className="min-h-screen bg-[#f7f7f7]">
      <section className="relative overflow-hidden border-b border-[#e5e5e5] bg-white px-4 py-24 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(6,187,180,0.14),transparent_34%),radial-gradient(circle_at_84%_78%,rgba(254,0,0,0.08),transparent_32%)]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <span className="mb-5 inline-flex rounded-full bg-[#06bbb4]/10 px-3.5 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-[#06bbb4]">
              Хамтран ажиллах
            </span>
            <h1 className="text-5xl font-black tracking-[-0.055em] text-[#111111] sm:text-6xl">
              Бизнесийн ачаагаа WECARGO-той тогтмол удирдаарай.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#666666]">
              Онлайн дэлгүүр, reseller, байгууллагын тогтмол ачаанд тохирсон
              нөхцөл, тайлан, хяналтын шийдэл санал болгоно.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#fe0000] px-6 text-sm font-black text-white transition-colors hover:bg-[#fe0000]/90"
              >
                Холбоо барих
              </Link>
              <Link
                href="/"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#e5e5e5] bg-white px-6 text-sm font-black text-[#111111] transition-colors hover:border-[#06bbb4] hover:text-[#06bbb4]"
              >
                Нүүр хуудас
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
          {options.map(([title, desc]) => (
            <article
              key={title}
              className="rounded-[28px] border border-[#e5e5e5] bg-white p-6 shadow-sm"
            >
              <h2 className="text-2xl font-black tracking-[-0.04em] text-[#111111]">
                {title}
              </h2>
              <p className="mt-3 text-sm font-semibold leading-6 text-[#666666]">
                {desc}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
