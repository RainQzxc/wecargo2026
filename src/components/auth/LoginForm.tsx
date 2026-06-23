"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/features/auth/actions";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, action, pending] = useActionState(login, initialState);

  return (
    <form action={action} style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 320 }}>
      <label>
        Имэйл эсвэл утас
        <input name="identifier" autoComplete="username" required />
      </label>
      <label>
        Нууц үг
        <input name="password" type="password" autoComplete="current-password" required />
      </label>
      {state?.error ? <p style={{ color: "crimson" }}>{state.error}</p> : null}
      <button type="submit" disabled={pending}>
        {pending ? "Нэвтэрч байна…" : "Нэвтрэх"}
      </button>
    </form>
  );
}
