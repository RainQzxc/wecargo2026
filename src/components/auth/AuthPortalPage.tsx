import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";
import { TestimonialsCarousel } from "@/components/auth/TestimonialsCarousel";

type PortalVariant = "customer" | "admin" | "super-admin" | "courier";

interface AuthPortalPageProps {
  variant: PortalVariant;
  eyebrow: string;
  title: string;
  description: string;
  badge: string;
  stats: [string, string][];
  showRegister?: boolean;
}

const variantStyles: Record<
  PortalVariant,
  {
    main: string;
    panel: string;
    formWrap: string;
    accentText: string;
    button: string;
    focus: string;
    logoTile: string;
  }
> = {
  customer: {
    main: "bg-[#f5f5f7] text-[#1d1d1f]",
    panel: "hidden",
    formWrap: "flex w-full max-w-[426px] flex-col",
    accentText: "text-[#06bbb4]",
    button: "bg-[#06bbb4] hover:bg-[#049b96] focus:ring-[#06bbb4]/25",
    focus: "focus:ring-[#06bbb4]/15",
    logoTile: "border-[#e5e5e5] bg-white text-[#1d1d1f]",
  },
  admin: {
    main: "bg-[#f5f5f7] text-[#1d1d1f]",
    panel:
      "relative hidden overflow-hidden rounded-[28px] bg-[#0c1413] p-8 text-white shadow-[0_20px_60px_rgba(7,20,20,0.14)] lg:flex lg:flex-col lg:justify-between",
    formWrap:
      "flex w-full max-w-[426px] flex-1 flex-col rounded-[28px] bg-white px-0 py-0 lg:mx-0",
    accentText: "text-[#06bbb4]",
    button: "bg-[#06bbb4] hover:bg-[#049b96] focus:ring-[#06bbb4]/25",
    focus: "focus:ring-[#06bbb4]/15",
    logoTile: "border-[#e5e5e5] bg-white text-[#1d1d1f]",
  },
  "super-admin": {
    main: "bg-[#f5f5f7] text-[#1d1d1f]",
    panel:
      "relative hidden overflow-hidden rounded-[28px] bg-[#1d1d1f] p-8 text-white shadow-[0_20px_60px_rgba(0,0,0,0.18)] lg:flex lg:flex-col lg:justify-between",
    formWrap:
      "flex w-full max-w-[426px] flex-1 flex-col rounded-[28px] bg-white px-0 py-0 lg:mx-0",
    accentText: "text-[#06bbb4]",
    button: "bg-[#06bbb4] hover:bg-[#049b96] focus:ring-[#06bbb4]/25",
    focus: "focus:ring-[#06bbb4]/15",
    logoTile: "border-[#e5e5e5] bg-white text-[#1d1d1f]",
  },
  courier: {
    main: "bg-[#f5f5f7] text-[#1d1d1f]",
    panel:
      "relative hidden overflow-hidden rounded-[28px] bg-[#0c1413] p-8 text-white shadow-[0_20px_60px_rgba(7,20,20,0.14)] lg:flex lg:flex-col lg:justify-between",
    formWrap:
      "flex w-full max-w-[426px] flex-1 flex-col rounded-[28px] bg-white px-0 py-0 lg:mx-0",
    accentText: "text-[#06bbb4]",
    button: "bg-[#06bbb4] hover:bg-[#049b96] focus:ring-[#06bbb4]/25",
    focus: "focus:ring-[#06bbb4]/15",
    logoTile: "border-[#e5e5e5] bg-white text-[#1d1d1f]",
  },
};

function WecargoMark({
  accentText,
  focus,
  logoTile,
  dark = false,
}: {
  accentText: string;
  focus: string;
  logoTile: string;
  dark?: boolean;
}) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-3 rounded-xl focus:outline-none focus:ring-4 ${focus}`}
      aria-label="WECARGO нүүр хуудас"
    >
      <span
        className={`grid size-11 place-items-center rounded-2xl border ${logoTile}`}
      >
        <svg viewBox="0 0 40 40" aria-hidden="true" className="size-7" fill="none">
          <path
            d="M20 4 34 12v16L20 36 6 28V12L20 4Z"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <path
            d="M20 20v16M6 12l14 8 14-8M13 8l14 8"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M28 28h7v7h-7z"
            fill="currentColor"
            className={accentText}
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="leading-none">
        <span
          className={`block text-3xl font-semibold tracking-[-0.04em] ${
            dark ? "text-white" : "text-[#1d1d1f]"
          }`}
        >
          WE<span className={accentText}>CARGO</span>
        </span>
        <span
          className={`mt-1.5 block text-[11px] font-medium ${
            dark ? "text-white/45" : "text-[#6e6e73]"
          }`}
        >
          Logistics Group
        </span>
      </span>
    </Link>
  );
}

function PortalForm({
  styles,
  eyebrow,
  description,
  showRegister,
  compact = false,
}: {
  styles: (typeof variantStyles)[PortalVariant];
  eyebrow: string;
  description: string;
  showRegister: boolean;
  compact?: boolean;
}) {
  return (
    <div className={styles.formWrap}>
      <div>
        <WecargoMark
          accentText={styles.accentText}
          focus={styles.focus}
          logoTile={styles.logoTile}
        />
      </div>

      <div className={compact ? "mt-20" : "mt-16 sm:mt-20"}>
        <p className={`mb-3 text-sm font-medium ${styles.accentText}`}>{eyebrow}</p>
        <h2 className="text-[30px] font-semibold tracking-[-0.03em] text-[#1d1d1f]">
          Тавтай морил
        </h2>
        <p className="mt-3 text-sm leading-6 text-[#6e6e73]">{description}</p>
      </div>

      <div className="mt-8">
        <LoginForm
          accentTextClass={styles.accentText}
          focusRingClass={styles.focus}
          submitClassName={styles.button}
        />
      </div>

      {showRegister ? (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-center text-sm">
          <span className="text-[#6e6e73]">Бүртгэл байхгүй юу?</span>
          <Link
            href="/auth/register"
            className={`inline-flex min-h-11 items-center font-semibold transition-colors hover:opacity-80 focus:outline-none focus:ring-4 ${styles.accentText} ${styles.focus}`}
          >
            Бүртгүүлэх
          </Link>
        </div>
      ) : null}
    </div>
  );
}

export function AuthPortalPage({
  variant,
  eyebrow,
  title,
  description,
  badge,
  stats,
  showRegister = false,
}: AuthPortalPageProps) {
  const styles = variantStyles[variant];
  const isCustomer = variant === "customer";

  if (isCustomer) {
    return (
      <main className={`min-h-[100svh] overflow-hidden px-5 py-6 sm:px-8 ${styles.main}`}>
        <div className="mx-auto grid min-h-[calc(100svh-48px)] w-full max-w-[1280px] overflow-hidden rounded-[32px] border border-[#e5e5e5] bg-white shadow-[0_20px_70px_rgba(0,0,0,0.06)] lg:grid-cols-[minmax(420px,0.86fr)_1.14fr]">
          <section className="flex items-center justify-center border-b border-[#e5e5e5] px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-14">
            <PortalForm
              styles={styles}
              eyebrow={eyebrow}
              description={description}
              showRegister={showRegister}
              compact
            />
          </section>
          <section className="bg-[#f5f5f7] p-4 sm:p-6">
            <TestimonialsCarousel />
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className={`min-h-[100svh] overflow-hidden px-6 py-10 sm:px-8 ${styles.main}`}>
      <div className="mx-auto grid min-h-[calc(100svh-80px)] w-full max-w-6xl items-stretch gap-8 lg:grid-cols-[1fr_480px]">
        <section className={styles.panel}>
          <div className="relative">
            <WecargoMark
              accentText={styles.accentText}
              focus={styles.focus}
              logoTile={styles.logoTile}
              dark
            />
            <div className="mt-20 max-w-xl">
              <p className="text-sm font-medium text-white/55">{badge}</p>
              <h1 className="mt-5 text-5xl font-semibold leading-[1.02] tracking-[-0.03em]">
                {title}
              </h1>
              <p className="mt-5 max-w-lg text-base leading-7 text-white/65">
                {description}
              </p>
            </div>
          </div>
          <div className="relative grid grid-cols-3 gap-3">
            {stats.map(([value, label]) => (
              <div
                key={value}
                className="rounded-2xl border border-white/10 bg-white/[0.06] p-4"
              >
                <p className="text-xl font-semibold">{value}</p>
                <p className="mt-1 text-xs font-medium text-white/55">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center justify-center rounded-[28px] bg-white px-5 py-8 shadow-[0_20px_60px_rgba(7,20,20,0.06)] sm:px-8 lg:px-10">
          <PortalForm
            styles={styles}
            eyebrow={eyebrow}
            description={description}
            showRegister={showRegister}
          />
        </section>
      </div>
    </main>
  );
}
