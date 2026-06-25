"use client";

import { useActionState } from "react";
import { updateProfile, type ProfileState } from "./actions";

const initial: ProfileState = {};
const field =
  "w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm text-ink placeholder:text-ink-3/50 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand";
const label = "text-xs font-semibold text-ink-3";

export function ProfileForm({
  defaultName,
  defaultPhone,
  email,
}: {
  defaultName: string;
  defaultPhone: string;
  email: string;
}) {
  const [state, action, pending] = useActionState(updateProfile, initial);

  return (
    <form action={action} className="grid gap-4 max-w-md">
      <div className="grid gap-1.5">
        <label htmlFor="name" className={label}>Нэр *</label>
        <input id="name" name="name" required defaultValue={defaultName} className={field} />
      </div>

      <div className="grid gap-1.5">
        <label htmlFor="phone" className={label}>Утас</label>
        <input id="phone" name="phone" type="tel" defaultValue={defaultPhone} placeholder="99112233" className={field} />
      </div>

      <div className="grid gap-1.5">
        <label className={label}>Имэйл</label>
        <input value={email} disabled className={`${field} bg-neutral-50 text-ink-3 cursor-not-allowed`} />
        <p className="text-[11px] text-ink-3">Имэйл өөрчлөхийг хүсвэл админд хандана уу.</p>
      </div>

      {state?.error ? (
        <p className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{state.error}</p>
      ) : null}
      {state?.success ? (
        <p className="rounded-lg bg-green-50 border border-green-200 px-3 py-2 text-sm text-green-700">Хадгалагдлаа.</p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-fit items-center justify-center rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand/90 disabled:opacity-50"
      >
        {pending ? "Хадгалж байна…" : "Хадгалах"}
      </button>
    </form>
  );
}
