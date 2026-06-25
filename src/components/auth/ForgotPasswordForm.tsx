"use client";

import { useActionState } from "react";
import { requestPasswordReset, type ForgotPasswordState } from "@/features/auth/actions";

const initialState: ForgotPasswordState = {};

const inputClass =
  "min-h-11 w-full rounded-lg border border-[#d0d5dd] bg-white px-4 text-base text-[#101828] placeholder:text-[#98a2b3] transition-colors hover:border-[#aebccc] focus:border-[#06bbb4] focus:outline-none focus:ring-4 focus:ring-[#06bbb4]/15";

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(requestPasswordReset, initialState);

  if (state?.sent) {
    return (
      <p className="rounded-lg border border-[#057a55]/25 bg-[#057a55]/10 px-4 py-4 text-sm font-semibold text-[#101828]">
        Хэрэв энэ имэйл бүртгэлтэй бол нууц үг сэргээх холбоос илгээгдлээ. Имэйлээ шалгана уу.
      </p>
    );
  }

  return (
    <form action={action} className="grid gap-4">
      <div className="grid gap-2">
        <label htmlFor="email" className="text-sm font-bold text-[#101828]">Имэйл хаяг</label>
        <input id="email" name="email" type="email" required autoComplete="email" className={inputClass} placeholder="you@example.com" />
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
        {pending ? "Илгээж байна..." : "Сэргээх холбоос илгээх"}
      </button>
    </form>
  );
}
