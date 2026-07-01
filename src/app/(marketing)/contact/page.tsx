const CONTACTS = [
  { icon: "phone", label: "Утас", value: "+976 9999-0000", sub: "Ажлын өдөр 09:00–18:00" },
  { icon: "mail",  label: "И-мэйл", value: "info@cargoo.mn", sub: "24 цагийн дотор хариулна" },
  { icon: "map",   label: "Хаяг", value: "Улаанбаатар, Монгол", sub: "Агуулах болон оффис" },
];

function Icon({ name }: { name: string }) {
  const paths: Record<string, string> = {
    phone: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
    mail:  "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    map:   "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",
  };
  return (
    <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={paths[name]} />
    </svg>
  );
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <section className="relative overflow-hidden border-b border-[#e5e5e5] bg-white px-4 py-24 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,rgba(6,187,180,0.12),transparent_34%),radial-gradient(circle_at_85%_65%,rgba(254,0,0,0.07),transparent_34%)]" />
        <div className="relative mx-auto max-w-7xl">
          <span className="mb-5 inline-flex rounded-full bg-[#06bbb4]/10 px-3.5 py-1.5 text-xs font-semibold text-[#06bbb4]">Холбоо барих</span>
          <h1 className="text-5xl font-semibold tracking-[-0.03em] text-[#1d1d1f] sm:text-6xl">
            Асуулт байна уу?<br />Биднийг олоорой.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#6e6e73]">
            Ачаа, тариф, хамтын ажиллагаа болон бусад асуудлаар холбогдоорой.
          </p>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="space-y-5">
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#1d1d1f]">Холбогдох мэдээлэл</h2>
            {CONTACTS.map((c) => (
              <div key={c.label} className="flex items-start gap-4 rounded-2xl border border-[#e5e5e5] bg-white p-5">
                <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#06bbb4]/10 text-[#06bbb4]">
                  <Icon name={c.icon} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#06bbb4]">{c.label}</p>
                  <p className="mt-0.5 font-semibold text-[#1d1d1f]">{c.value}</p>
                  <p className="text-xs text-[#6e6e73]">{c.sub}</p>
                </div>
              </div>
            ))}
            <div className="rounded-2xl border border-[#e5e5e5] bg-white p-5">
              <h3 className="font-semibold text-[#1d1d1f]">Ажлын цаг</h3>
              <div className="mt-3 space-y-1.5 text-sm text-[#6e6e73]">
                {[["Даваа – Баасан","09:00–18:00"],["Бямба","10:00–15:00"],["Ням","Амарна"]].map(([day,time]) => (
                  <div key={day} className="flex justify-between">
                    <span>{day}</span>
                    <span className="font-semibold">{time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-[#e5e5e5] bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-semibold tracking-[-0.03em] text-[#1d1d1f]">Мессеж илгээх</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[["Таны нэр","name","Нэр оруулна уу"],["Утас / И-мэйл","contact","Холбоо барих"]].map(([lbl,id,ph]) => (
                  <div key={id}>
                    <label htmlFor={id} className="mb-1.5 block text-xs font-semibold text-[#6e6e73]">{lbl}</label>
                    <input id={id} name={id} type="text" placeholder={ph} className="w-full rounded-xl border border-[#e5e5e5] bg-[#fafafa] px-4 py-2.5 text-sm text-[#1d1d1f] placeholder-[#aaa] outline-none focus:border-[#06bbb4] focus:ring-2 focus:ring-[#06bbb4]/20" />
                  </div>
                ))}
              </div>
              <div>
                <label htmlFor="subject" className="mb-1.5 block text-xs font-semibold text-[#6e6e73]">Сэдэв</label>
                <input id="subject" name="subject" type="text" placeholder="Асуудлын сэдэв" className="w-full rounded-xl border border-[#e5e5e5] bg-[#fafafa] px-4 py-2.5 text-sm text-[#1d1d1f] placeholder-[#aaa] outline-none focus:border-[#06bbb4] focus:ring-2 focus:ring-[#06bbb4]/20" />
              </div>
              <div>
                <label htmlFor="message" className="mb-1.5 block text-xs font-semibold text-[#6e6e73]">Мессеж</label>
                <textarea id="message" name="message" rows={4} placeholder="Асуулт, санал, хүсэлтээ бичнэ үү…" className="w-full resize-none rounded-xl border border-[#e5e5e5] bg-[#fafafa] px-4 py-2.5 text-sm text-[#1d1d1f] placeholder-[#aaa] outline-none focus:border-[#06bbb4] focus:ring-2 focus:ring-[#06bbb4]/20" />
              </div>
              <button type="button" className="flex min-h-12 w-full items-center justify-center rounded-xl bg-[#06bbb4] text-sm font-semibold text-white transition-colors hover:bg-[#06bbb4]/90">
                Илгээх
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
