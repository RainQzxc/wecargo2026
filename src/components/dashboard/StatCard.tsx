type CardColor = "default" | "brand" | "warning" | "danger" | "success";

const colorMap: Record<CardColor, { accent: string; glow: string }> = {
  default: { accent: "bg-neutral-300", glow: "from-neutral-100" },
  brand:   { accent: "bg-brand",       glow: "from-brand/10" },
  warning: { accent: "bg-amber-400",   glow: "from-amber-100/70" },
  danger:  { accent: "bg-red-500",     glow: "from-red-100/70" },
  success: { accent: "bg-green-500",   glow: "from-green-100/70" },
};

export function StatCard({
  label,
  value,
  hint,
  color = "default",
}: {
  label: string;
  value: string | number;
  hint?: string;
  color?: CardColor;
}) {
  const c = colorMap[color];
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-5 transition-shadow hover:shadow-[0_12px_40px_rgba(17,17,17,0.07)]">
      {/* soft corner glow */}
      <div
        className={`pointer-events-none absolute -right-8 -top-8 size-24 rounded-full bg-gradient-to-br to-transparent opacity-70 ${c.glow}`}
      />
      {/* left accent bar */}
      <span className={`absolute left-0 top-0 h-full w-1 ${c.accent}`} />

      <p className="relative mb-1.5 text-[11px] font-semibold uppercase tracking-widest text-ink-3">
        {label}
      </p>
      <p className="relative text-3xl font-black leading-none text-ink">
        {typeof value === "number" ? value.toLocaleString("mn-MN") : value}
      </p>
      {hint && <p className="relative mt-1.5 text-xs text-ink-3">{hint}</p>}
    </div>
  );
}
