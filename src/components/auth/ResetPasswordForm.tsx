"use client";

import Link from "next/link";
import { useActionState } from "react";
import { resetPassword, type ResetPasswordState } from "@/features/auth/actions";
import { ROUTES } from "@/constants/routes";

const initialState: ResetPasswordState = {};

const inputClass =
  "min-h-11 w-full rounded-lg border border-[#d0d5dd] bg-white px-4 text-base text-[#101828] placeholder:text-[#98a2b3] transition-colors hover:border-[#aebccc] focus:border-[#06bbb4] focus:outline-none focus:ring-4 focus:ring-[#06bbb4]/15";
const labelClass = "text-sm font-bold text-[#101828]";

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState(resetPassword, initialState);

  if (state?.success) {
    return (
      <div className="grid gap-4">
        <p className="rounded-lg border border-[#057a55]/25 bg-[#057a55]/10 px-4 py-4 text-sm font-semibold text-[#101828]">
          Нууц үг амжилттай шинэчлэгдлээ.
        </p>
        <Link
          href={ROUTES.login}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-[#057a55] px-5 text-sm font-black text-white transition-colors hover:bg-[#046846] focus:outline-none focus:ring-4 focus:ring-[#057a55]/25"
        >
          Нэвтрэх
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="grid gap-4">
      <input type="hidden" name="token" value={token} />

      <div className="grid gap-2">
        <label htmlFor="password" className={labelClass}>Шинэ нууц үг</label>
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
        {pending ? "Хадгалж байна..." : "Нууц үг шинэчлэх"}
      </button>
    </form>
  );
}
