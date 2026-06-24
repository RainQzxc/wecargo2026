import type { ReactNode } from "react";

const locations = [
  {
    city: "Улаанбаатар",
    eyebrow: "Монгол дахь салбар",
    accent: "teal",
    items: [
      {
        label: "Утас",
        value: "8810 4640",
        href: "tel:88104640",
        icon: "phone",
      },
      {
        label: "Имэйл",
        value: "info@cargoo.mn",
        href: "mailto:info@cargoo.mn",
        icon: "mail",
      },
      {
        label: "Хаяг",
        value: "Улаанбаатар, Монгол",
        icon: "pin",
      },
    ],
  },
  {
    city: "Эрээн",
    eyebrow: "БНХАУ дахь агуулах",
    accent: "red",
    items: [
      {
        label: "Утас",
        value: "15148615407",
        href: "tel:15148615407",
        icon: "phone",
      },
      {
        label: "Хаяг",
        value:
          "内蒙古锡林郭勒盟二连浩特市环宇商贸城五号楼125号 业顺额尔敦商贸有限公司",
        icon: "pin",
      },
    ],
  },
];

function ContactIcon({ type }: { type: string }) {
  const common = "h-5 w-5";

  if (type === "mail") {
    return (
      <svg className={common} fill="none" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M4.75 6.75h14.5v10.5H4.75V6.75Z"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
        <path
          d="m5.25 7.25 6.75 5 6.75-5"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      </svg>
    );
  }

  if (type === "pin") {
    return (
      <svg className={common} fill="none" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M18.25 10.5c0 5.25-6.25 9.75-6.25 9.75S5.75 15.75 5.75 10.5a6.25 6.25 0 1 1 12.5 0Z"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
        <path
          d="M14.25 10.5a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
          stroke="currentColor"
          strokeWidth="1.8"
        />
      </svg>
    );
  }

  return (
    <svg className={common} fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M5.5 4.75h3l1.5 4-2 1.25a10.25 10.25 0 0 0 6 6l1.25-2 4 1.5v3a1.75 1.75 0 0 1-1.75 1.75A14.75 14.75 0 0 1 2.75 5.5 1.75 1.75 0 0 1 4.5 3.75h1Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function ValueWrap({
  href,
  children,
}: {
  href?: string;
  children: ReactNode;
}) {
  if (!href) {
    return <p className="text-base font-bold leading-7 text-[#111111]">{children}</p>;
  }

  return (
    <a
      href={href}
      className="text-base font-black leading-7 text-[#111111] transition-colors hover:text-[#06bbb4] focus:outline-none focus:ring-2 focus:ring-[#06bbb4]/25 focus:ring-offset-2"
    >
      {children}
    </a>
  );
}

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden border-y border-[#e5e5e5] bg-[#f7f7f7] py-20 sm:py-24 md:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(6,187,180,0.14),transparent_34%),radial-gradient(circle_at_86%_78%,rgba(254,0,0,0.08),transparent_32%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-3xl lg:mb-14">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#06bbb4]/15 bg-white/85 px-3.5 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-[#06bbb4] shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#06bbb4]" />
            Холбоо барих
          </span>
          <h2 className="text-4xl font-black tracking-[-0.04em] text-[#111111] sm:text-5xl">
            Бидэнтэй холбогдоорой
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#666666] sm:text-lg">
            Улаанбаатар болон Эрээн дэх салбарын утас, имэйл, хаягийн мэдээлэл.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
          {locations.map((location) => (
            <article
              key={location.city}
              className="relative overflow-hidden rounded-[28px] border border-white/80 bg-white/88 p-5 shadow-[0_24px_70px_rgba(17,17,17,0.08)] ring-1 ring-[#e5e5e5]/70 backdrop-blur sm:p-7 lg:p-8"
            >
              <div
                className={`absolute inset-x-0 top-0 h-1 ${
                  location.accent === "red" ? "bg-[#fe0000]" : "bg-[#06bbb4]"
                }`}
              />
              <div className="mb-7 flex items-start justify-between gap-4">
                <div>
                  <p
                    className={`text-xs font-black uppercase tracking-[0.16em] ${
                      location.accent === "red" ? "text-[#fe0000]" : "text-[#06bbb4]"
                    }`}
                  >
                    {location.eyebrow}
                  </p>
                  <h3 className="mt-2 text-3xl font-black tracking-[-0.04em] text-[#111111]">
                    {location.city}
                  </h3>
                </div>
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                    location.accent === "red"
                      ? "bg-[#fe0000]/10 text-[#fe0000]"
                      : "bg-[#06bbb4]/10 text-[#06bbb4]"
                  }`}
                >
                  <ContactIcon type="pin" />
                </div>
              </div>

              <div className="space-y-3">
                {location.items.map((item) => (
                  <div
                    key={`${location.city}-${item.label}`}
                    className="grid gap-3 rounded-2xl border border-[#e5e5e5] bg-white p-4 sm:grid-cols-[44px_1fr] sm:items-start"
                  >
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                        location.accent === "red"
                          ? "bg-[#fe0000]/10 text-[#fe0000]"
                          : "bg-[#06bbb4]/10 text-[#06bbb4]"
                      }`}
                    >
                      <ContactIcon type={item.icon} />
                    </div>
                    <div className="min-w-0">
                      <p className="mb-1 text-xs font-black uppercase tracking-[0.14em] text-[#666666]">
                        {item.label}
                      </p>
                      <div className="break-words [overflow-wrap:anywhere]">
                        <ValueWrap href={item.href}>{item.value}</ValueWrap>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
