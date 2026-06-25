"use client";

import { useActionState } from "react";
import { register, type RegisterState } from "@/features/auth/actions";

const initialState: RegisterState = {};

const inputClass =
  "min-h-11 w-full rounded-lg border border-[#d0d5dd] bg-white px-4 text-base text-[#101828] placeholder:text-[#98a2b3] transition-colors hover:border-[#aebccc] focus:border-[#06bbb4] focus:outline-none focus:ring-4 focus:ring-[#06bbb4]/15";
const labelClass = "text-sm font-bold text-[#101828]";

export function RegisterForm() {
  const [state, action, pending] = useActionState(register, initialState);

  return (
    <form action={action} className="grid gap-4">
      <div className="grid gap-2">
        <label htmlFor="name" className={labelClass}>Нэр</label>
        <input id="name" name="name" required autoComplete="name" className={inputClass} placeholder="Таны нэр" />
      </div>

      <div className="grid gap-2">
        <label htmlFor="email" className={labelClass}>Имэйл хаяг</label>
        <input id="email" name="email" type="email" required autoComplete="email" className={inputClass} placeholder="you@example.com" />
      </div>

      <div className="grid gap-2">
        <label htmlFor="phone" className={labelClass}>
          Утас <span className="font-normal text-[#98a2b3]">(заавал биш)</span>
        </label>
        <input id="phone" name="phone" type="tel" autoComplete="tel" className={inputClass} placeholder="99112233" />
      </div>

      <div className="grid gap-2">
        <label htmlFor="password" className={labelClass}>Нууц үг</label>
        <input id="password" name="password" type="password" required minLength={6} autoComplete="new-password" className={inputClass} placeholder="••••••••" />
      </div>

      <div className="grid gap-2">
        <label htmlFor="confirm" className={labelClass}>Нууц үг давтах</label>
        <input id="confirm" name="confirm" type="password" required minLength={6} autoComplete="new-password" className={inputClass} placeholder="••••••••" />
      </div>

      {state?.error ? (
        <p className="rounded-lg border border-[#fe0000]/25 bg-[#fe0000]/10 px-4 py-3 text-sm font-semibold text-[#101828]">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 inline-flex min-h-11 w-full cursor-pointer items-center justify-center rounded-lg bg-[#057a55] px-5 text-sm font-black text-white transition-colors hover:bg-[#046846] focus:outline-none focus:ring-4 focus:ring-[#057a55]/25 disabled:cursor-not-allowed disabled:bg-[#98a2b3]"
      >
        {pending ? "Бүртгэж байна..." : "Бүртгүүлэх"}
      </button>
    </form>
  );
}
