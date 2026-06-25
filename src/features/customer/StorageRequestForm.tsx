"use client";

import { useActionState } from "react";
import { requestStorage, type StorageState } from "./actions";
import type { DeliverableParcel } from "./DeliveryRequestForm";

const initial: StorageState = {};
const field =
  "w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm text-ink placeholder:text-ink-3/50 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand";
const label = "text-xs font-semibold text-ink-3";

export function StorageRequestForm({ parcels }: { parcels: DeliverableParcel[] }) {
  const [state, action, pending] = useActionState(requestStorage, initial);

  if (parcels.length === 0) {
    return (
      <p className="text-sm text-ink-3">
        Хадгалалтад өгөх боломжтой бараа алга.
      </p>
    );
  }

  return (
    <form action={action} className="grid gap-4">
      <div className="grid gap-1.5">
        <label htmlFor="parcelId" className={label}>Бараа *</label>
        <select id="parcelId" name="parcelId" required className={field} defaultValue="">
          <option value="" disabled>Бараа сонгох…</option>
          {parcels.map((p) => (
            <option key={p.id} value={p.id}>
              {p.publicCode.slice(-8).toUpperCase()}
              {p.trackCodeOriginal ? ` · ${p.trackCodeOriginal}` : ""}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-1.5">
        <label htmlFor="days" className={label}>Хоног (ойролцоогоор)</label>
        <input id="days" name="days" type="number" min={1} placeholder="7" className={field} />
      </div>

      <div className="grid gap-1.5">
        <label htmlFor="notes" className={label}>Тэмдэглэл</label>
        <textarea id="notes" name="notes" rows={2} placeholder="Нэмэлт мэдээлэл…" className={field} />
      </div>

      {state?.error ? (
        <p className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{state.error}</p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand/90 disabled:opacity-50"
      >
        {pending ? "Илгээж байна…" : "Хадгалалт хүсэх"}
      </button>
    </form>
  );
}
