const items = [
  {
    value: "2014",
    label: "оноос хойш",
    tone: "teal",
  },
  {
    value: "24/7",
    label: "ил тод хяналт",
    tone: "red",
  },
  {
    value: "Эрээн–УБ",
    label: "тогтмол тээвэр",
    tone: "dark",
  },
];

function StatIcon({ tone }: { tone: string }) {
  const common = "h-4 w-4";

  if (tone === "red") {
    return (
      <svg className={common} fill="none" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 3.75v8.5l5 2.75"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
        <path
          d="M20.25 12a8.25 8.25 0 1 1-16.5 0 8.25 8.25 0 0 1 16.5 0Z"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    );
  }

  if (tone === "dark") {
    return (
      <svg className={common} fill="none" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M4 8.25h10.5v7.5H4v-7.5Z"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="2"
        />
        <path
          d="M14.5 10.25H18l2 2.25v3.25h-5.5v-5.5Z"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="2"
        />
        <path
          d="M7.25 18.25a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5Zm10.5 0a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  return (
    <svg className={common} fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M7 5.75h10M7 12h10M7 18.25h7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
      <path
        d="M4.5 5.75h.01M4.5 12h.01M4.5 18.25h.01"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="3"
      />
    </svg>
  );
}

export default function TrustBar() {
  return (
    <section className="border-b border-[#e5e5e5] bg-[#f7f7f7]">
      <div className="mx-auto max-w-[1440px] px-5 py-6 sm:px-6 lg:px-16">
        <div className="relative overflow-hidden rounded-[28px] border border-white bg-white/85 p-2 shadow-[0_24px_70px_rgba(17,17,17,0.08)] ring-1 ring-[#e5e5e5]/70 backdrop-blur">
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#06bbb4]/70 to-transparent" />
          <div className="pointer-events-none absolute -left-10 top-1/2 h-24 w-24 -translate-y-1/2 rounded-full bg-[#06bbb4]/10 blur-2xl" />
          <div className="pointer-events-none absolute -right-10 top-1/2 h-24 w-24 -translate-y-1/2 rounded-full bg-[#fe0000]/10 blur-2xl" />

          <div className="grid gap-2 sm:grid-cols-3">
            {items.map((item, index) => (
              <div
                key={item.value}
                className={`relative overflow-hidden rounded-[22px] border border-[#e5e5e5] bg-white px-4 py-4 transition-colors duration-200 hover:border-[#06bbb4]/35 sm:px-5 sm:py-5 ${
                  index === 1 ? "sm:bg-[#111111] sm:text-white" : ""
                }`}
              >
                <div
                  className={`absolute inset-x-0 top-0 h-0.5 ${
                    item.tone === "red"
                      ? "bg-[#fe0000]"
                      : item.tone === "dark"
                        ? "bg-[#111111]"
                        : "bg-[#06bbb4]"
                    }`}
                />
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
                      index === 1
                        ? "bg-[#fe0000]/10 text-[#fe0000] sm:bg-white/10 sm:text-white"
                        : item.tone === "dark"
                          ? "bg-[#111111]/5 text-[#111111]"
                          : "bg-[#06bbb4]/10 text-[#06bbb4]"
                    }`}
                  >
                    <StatIcon tone={item.tone} />
                  </span>
                  <div className="min-w-0">
                    <p
                      className={`text-xl font-black leading-none tracking-[-0.04em] sm:text-2xl ${
                        index === 1
                          ? "text-[#111111] sm:text-white"
                          : "text-[#111111]"
                      }`}
                    >
                      {item.value}
                    </p>
                    <p
                      className={`mt-1 text-[11px] font-black uppercase tracking-[0.12em] ${
                        index === 1
                          ? "text-[#666666] sm:text-white/65"
                          : "text-[#666666]"
                      }`}
                    >
                      {item.label}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
