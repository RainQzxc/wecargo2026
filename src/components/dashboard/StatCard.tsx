type CardColor = "default" | "brand" | "warning" | "danger" | "success";

const colorMap: Record<CardColor, { border: string; value: string; bg: string }> = {
  default: { border: "border-neutral-200", value: "text-ink", bg: "bg-white" },
  brand:   { border: "border-brand/30",    value: "text-brand",  bg: "bg-white" },
  warning: { border: "border-amber-200",   value: "text-amber-600", bg: "bg-white" },
  danger:  { border: "border-red-200",     value: "text-red-600",   bg: "bg-white" },
  success: { border: "border-green-200",   value: "text-green-600", bg: "bg-white" },
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
    <div className={`rounded-xl border p-5 ${c.border} ${c.bg}`}>
      <p className="text-[11px] font-semibold text-ink-3 uppercase tracking-widest mb-1.5">
        {label}
      </p>
      <p className={`text-3xl font-black leading-none ${c.value}`}>
        {typeof value === "number" ? value.toLocaleString("mn-MN") : value}
      </p>
      {hint && <p className="text-xs text-ink-3 mt-1.5">{hint}</p>}
    </div>
  );
}
