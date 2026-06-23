const items = [
  {
    value: "2014",
    label: "оноос хойш",
  },
  {
    value: "24/7",
    label: "ил тод хяналт",
  },
  {
    value: "Эрээн–УБ",
    label: "тогтмол тээвэр",
  },
];

export default function TrustBar() {
  return (
    <section className="border-b border-[#e5e5e5] bg-white">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 overflow-hidden rounded-2xl border border-[#e5e5e5] bg-[#fafafa]">
          {items.map((item, index) => (
            <div
              key={item.value}
              className={`px-3 py-4 text-center ${
                index > 0 ? "border-l border-[#e5e5e5]" : ""
              }`}
            >
              <p className="text-sm font-black tracking-[-0.01em] text-[#111111] sm:text-base">
                {item.value}
              </p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#666666] sm:text-xs">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
