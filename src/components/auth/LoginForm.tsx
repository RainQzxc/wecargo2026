"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/features/auth/actions";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, action, pending] = useActionState(login, initialState);

  return (
    <form action={action} className="grid gap-4">
      <div className="grid gap-2">
        <label
          htmlFor="identifier"
          className="text-sm font-black text-[#111111]"
        >
          Имэйл эсвэл утас
        </label>
        <input
          id="identifier"
          name="identifier"
          autoComplete="username"
          required
          className="min-h-12 rounded-xl border border-[#e5e5e5] bg-white px-4 text-base font-semibold text-[#111111] transition-colors placeholder:text-[#666666] focus:border-[#06bbb4] focus:outline-none focus:ring-2 focus:ring-[#06bbb4]/20"
          placeholder="name@example.com"
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="password" className="text-sm font-black text-[#111111]">
          Нууц үг
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="min-h-12 rounded-xl border border-[#e5e5e5] bg-white px-4 text-base font-semibold text-[#111111] transition-colors placeholder:text-[#666666] focus:border-[#06bbb4] focus:outline-none focus:ring-2 focus:ring-[#06bbb4]/20"
          placeholder="••••••••"
        />
      </div>

      {state?.error ? (
        <p className="rounded-xl border border-[#fe0000]/20 bg-[#fe0000]/10 px-4 py-3 text-sm font-semibold text-[#111111]">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 min-h-12 rounded-xl bg-[#06bbb4] px-5 text-sm font-black text-white transition-colors hover:bg-[#06bbb4]/90 focus:outline-none focus:ring-2 focus:ring-[#06bbb4]/30 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#666666]"
      >
        {pending ? "Нэвтэрч байна..." : "Нэвтрэх"}
      </button>
    </form>
  );
}
