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
    motif: string;
  }
> = {
  customer: {
    main: "bg-[#f7fbfa] text-[#081f1f]",
    panel: "hidden",
    formWrap: "flex w-full max-w-[426px] flex-col",
    accentText: "text-[#049b96]",
    button: "bg-[#057a55] hover:bg-[#046846] focus:ring-[#057a55]/25",
    focus: "focus:ring-[#06bbb4]/15",
    logoTile: "border-[#d9e3e2] bg-white text-[#081f1f]",
    motif: "",
  },
  admin: {
    main: "bg-[#eef8f7] text-[#071414]",
    panel:
      "relative hidden overflow-hidden rounded-[28px] bg-[#071414] p-8 text-white shadow-[0_28px_90px_rgba(7,20,20,0.18)] lg:flex lg:flex-col lg:justify-between",
    formWrap:
      "flex w-full max-w-[426px] flex-1 flex-col rounded-[28px] bg-white/92 px-0 py-0 lg:mx-0",
    accentText: "text-[#06bbb4]",
    button: "bg-[#06bbb4] hover:bg-[#049b96] focus:ring-[#06bbb4]/25",
    focus: "focus:ring-[#06bbb4]/15",
    logoTile: "border-[#06bbb4]/25 bg-white text-[#071414]",
    motif: "bg-[radial-gradient(circle_at_20%_15%,rgba(6,187,180,0.35),transparent_34%),radial-gradient(circle_at_90%_80%,rgba(254,0,0,0.2),transparent_30%)]",
  },
  "super-admin": {
    main: "bg-[#07090f] text-white",
    panel:
      "relative hidden overflow-hidden rounded-[28px] border border-white/10 bg-[#0d111c] p-8 text-white shadow-[0_28px_90px_rgba(0,0,0,0.35)] lg:flex lg:flex-col lg:justify-between",
    formWrap:
      "flex w-full max-w-[426px] flex-1 flex-col rounded-[28px] border border-white/10 bg-white px-0 py-0 lg:mx-0",
    accentText: "text-[#fe4d4d]",
    button: "bg-[#fe0000] hover:bg-[#d90000] focus:ring-[#fe0000]/25",
    focus: "focus:ring-[#fe0000]/15",
    logoTile: "border-[#fe0000]/30 bg-white text-[#081f1f]",
    motif: "bg-[radial-gradient(circle_at_25%_20%,rgba(254,0,0,0.28),transparent_34%),radial-gradient(circle_at_82%_74%,rgba(6,187,180,0.2),transparent_32%)]",
  },
  courier: {
    main: "bg-[#f2fbff] text-[#071827]",
    panel:
      "relative hidden overflow-hidden rounded-[28px] bg-[#0b65c2] p-8 text-white shadow-[0_28px_90px_rgba(11,101,194,0.18)] lg:flex lg:flex-col lg:justify-between",
    formWrap:
      "flex w-full max-w-[426px] flex-1 flex-col rounded-[28px] bg-white px-0 py-0 lg:mx-0",
    accentText: "text-[#0b65c2]",
    button: "bg-[#0b65c2] hover:bg-[#0955a4] focus:ring-[#0b65c2]/25",
    focus: "focus:ring-[#0b65c2]/15",
    logoTile: "border-[#0b65c2]/20 bg-white text-[#071827]",
    motif: "bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.25),transparent_34%),radial-gradient(circle_at_84%_82%,rgba(6,187,180,0.35),transparent_32%)]",
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
        className={`grid size-11 place-items-center rounded-2xl border shadow-[0_10px_30px_rgba(8,31,31,0.08)] ${logoTile}`}
      >
        <svg
          viewBox="0 0 40 40"
          aria-hidden="true"
          className="size-7"
          fill="none"
        >
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
          className={`block text-3xl font-black tracking-[-0.06em] ${
            dark ? "text-white" : "text-[#081f1f]"
          }`}
        >
          WE<span className={accentText}>CARGO</span>
        </span>
        <span
          className={`mt-1 block text-[9px] font-black uppercase tracking-[0.28em] ${
            dark ? "text-white/45" : "text-[#667574]"
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
        <h2 className="text-[30px] font-black tracking-[-0.04em] text-[#061a2f]">
          Тавтай морил
        </h2>
        <p className="mt-3 text-sm leading-6 text-[#667085]">{description}</p>
        <p
          className={`mt-5 text-xs font-black uppercase tracking-[0.18em] ${styles.accentText}`}
        >
          {eyebrow}
        </p>
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
          <span className="text-[#7b8494]">Бүртгэл байхгүй юу?</span>
          <Link
            href="/auth/register"
            className={`inline-flex min-h-11 items-center font-black transition-colors hover:opacity-80 focus:outline-none focus:ring-4 ${styles.accentText} ${styles.focus}`}
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
        <div className="mx-auto grid min-h-[calc(100svh-48px)] w-full max-w-[1280px] overflow-hidden rounded-[32px] border border-[#dfe8e7] bg-white shadow-[0_28px_100px_rgba(8,31,31,0.08)] lg:grid-cols-[minmax(420px,0.86fr)_1.14fr]">
          <section className="flex items-center justify-center border-b border-[#e5eeee] px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-14">
            <PortalForm
              styles={styles}
              eyebrow={eyebrow}
              description={description}
              showRegister={showRegister}
              compact
            />
          </section>
          <section className="bg-[#f4f8f7] p-4 sm:p-6">
            <TestimonialsCarousel />
          </section>
        </div>
      </main>
    );
  }

  return (
    <main
      className={`min-h-[100svh] overflow-hidden px-6 py-10 sm:px-8 ${styles.main}`}
    >
      <div className="mx-auto grid min-h-[calc(100svh-80px)] w-full max-w-6xl items-stretch gap-8 lg:grid-cols-[1fr_480px]">
        <section className={styles.panel}>
          <div className={`absolute inset-0 ${styles.motif}`} />
          <div className="relative">
            <WecargoMark
              accentText={styles.accentText}
              focus={styles.focus}
              logoTile={styles.logoTile}
              dark
            />
            <div className="mt-20 max-w-xl">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-white/60">
                {badge}
              </p>
              <h1 className="mt-5 text-5xl font-black leading-[0.98] tracking-[-0.055em]">
                {title}
              </h1>
              <p className="mt-5 max-w-lg text-base leading-7 text-white/72">
                {description}
              </p>
            </div>
          </div>
          <div className="relative grid grid-cols-3 gap-3">
            {stats.map(([value, label]) => (
              <div
                key={value}
                className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur"
              >
                <p className="text-xl font-black">{value}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.1em] text-white/58">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center justify-center rounded-[28px] bg-white px-5 py-8 shadow-[0_24px_80px_rgba(7,20,20,0.08)] sm:px-8 lg:px-10">
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
