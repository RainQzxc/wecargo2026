"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { login, type LoginState } from "@/features/auth/actions";

const initialState: LoginState = {};

interface LoginFormProps {
  accentTextClass?: string;
  focusRingClass?: string;
  submitClassName?: string;
  tone?: "light" | "dark";
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5">
      <path
        d="M4 6.75h16v10.5H4V6.75Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="m5 8 7 5.25L19 8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function KeyIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5">
      <path
        d="M14.5 9.5a4.5 4.5 0 1 1-8.24 2.52A4.5 4.5 0 0 1 14.5 9.5Zm0 0L21 3m-3.5 3.5L20 9m-5-1 2.5 2.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EyeIcon({ hidden }: { hidden: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5">
      <path
        d="M3.5 12s3-5.5 8.5-5.5 8.5 5.5 8.5 5.5-3 5.5-8.5 5.5S3.5 12 3.5 12Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      {hidden ? (
        <path
          d="M4 20 20 4"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      ) : null}
    </svg>
  );
}

function LoginIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5">
      <path
        d="M10 7V5.75A1.75 1.75 0 0 1 11.75 4h5.5A1.75 1.75 0 0 1 19 5.75v12.5A1.75 1.75 0 0 1 17.25 20h-5.5A1.75 1.75 0 0 1 10 18.25V17"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M4 12h9m0 0-3-3m3 3-3 3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LoginForm({
  accentTextClass = "text-[#06bbb4]",
  focusRingClass = "focus:ring-[#06bbb4]/15",
  submitClassName = "bg-[#06bbb4] hover:bg-[#049b96] focus:ring-[#06bbb4]/25",
  tone = "light",
}: LoginFormProps = {}) {
  const [state, action, pending] = useActionState(login, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const dark = tone === "dark";

  const labelClass = dark ? "text-white" : "text-[#1d1d1f]";
  const iconClass = dark ? "text-[#9ca3af]" : "text-[#6e6e73]";
  const inputClass = dark
    ? "border-[#303030] bg-[#171717] text-white placeholder:text-[#7c7c7c] hover:border-[#454545] focus:border-[#06bbb4] focus:ring-[#06bbb4]/20"
    : "border-[#d2d2d7] bg-white text-[#1d1d1f] placeholder:text-[#98a2b3] hover:border-[#c0c0c6] focus:border-[#06bbb4] focus:ring-[#06bbb4]/15";

  return (
    <form action={action} className="grid gap-5">
      <div className="grid gap-2">
        <label htmlFor="identifier" className={`text-sm font-medium ${labelClass}`}>
          Имэйл хаяг
        </label>
        <div className="relative">
          <span
            className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 ${iconClass}`}
          >
            <MailIcon />
          </span>
          <input
            id="identifier"
            name="identifier"
            autoComplete="username"
            required
            className={`min-h-11 w-full rounded-lg border px-10 text-base transition-colors focus:outline-none focus:ring-4 ${inputClass}`}
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div className="grid gap-2">
        <div className="flex items-center justify-between gap-4">
          <label htmlFor="password" className={`text-sm font-medium ${labelClass}`}>
            Нууц үг
          </label>
          <Link
            href="/auth/forgot-password"
            className={`inline-flex min-h-11 items-center text-sm font-medium transition-colors hover:opacity-80 focus:outline-none focus:ring-4 ${accentTextClass} ${focusRingClass}`}
          >
            Нууц үгээ мартсан уу?
          </Link>
        </div>
        <div className="relative">
          <span
            className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 ${iconClass}`}
          >
            <KeyIcon />
          </span>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            className={`min-h-11 w-full rounded-lg border px-10 text-base transition-colors focus:outline-none focus:ring-4 ${inputClass}`}
            placeholder="••••••••"
          />
          <button
            type="button"
            aria-label={showPassword ? "Нууц үг нуух" : "Нууц үг харах"}
            onClick={() => setShowPassword((value) => !value)}
            className={`absolute right-0 top-1/2 grid size-11 -translate-y-1/2 cursor-pointer place-items-center rounded-lg transition-colors focus:outline-none focus:ring-4 ${focusRingClass} ${
              dark ? "text-[#8b8b8b] hover:text-white" : "text-[#6e6e73] hover:text-[#1d1d1f]"
            }`}
          >
            <EyeIcon hidden={!showPassword} />
          </button>
        </div>
      </div>

      {state?.error ? (
        <p
          className={`rounded-lg border border-[#fe0000]/25 bg-[#fe0000]/10 px-4 py-3 text-sm font-semibold ${
            dark ? "text-white" : "text-[#1d1d1f]"
          }`}
        >
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className={`mt-3 inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold text-white transition-colors focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:bg-[#98a2b3] ${submitClassName}`}
      >
        <LoginIcon />
        {pending ? "Нэвтэрч байна..." : "Нэвтрэх"}
      </button>
    </form>
  );
}
