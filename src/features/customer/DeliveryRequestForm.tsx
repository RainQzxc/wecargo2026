"use client";

import { useActionState } from "react";
import { requestDelivery, type DeliveryState } from "./actions";

const initial: DeliveryState = {};
const field =
  "w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm text-ink placeholder:text-ink-3/50 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand";
const label = "text-xs font-semibold text-ink-3";

export interface DeliverableParcel {
  id: string;
  publicCode: string;
  trackCodeOriginal: string | null;
}

export function DeliveryRequestForm({ parcels }: { parcels: DeliverableParcel[] }) {
  const [state, action, pending] = useActionState(requestDelivery, initial);

  if (parcels.length === 0) {
    return (
      <p className="text-sm text-ink-3">
        Хүргэлтэд бэлэн бараа алга. Бараа УБ-д ирж, авахад бэлэн болсон үед энд харагдана.
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

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-1.5">
          <label htmlFor="recipientName" className={label}>Хүлээн авагч</label>
          <input id="recipientName" name="recipientName" placeholder="Нэр" className={field} />
        </div>
        <div className="grid gap-1.5">
          <label htmlFor="recipientPhone" className={label}>Утас</label>
          <input id="recipientPhone" name="recipientPhone" type="tel" placeholder="99112233" className={field} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-1.5">
          <label htmlFor="city" className={label}>Хот / Аймаг</label>
          <input id="city" name="city" defaultValue="Улаанбаатар" className={field} />
        </div>
        <div className="grid gap-1.5">
          <label htmlFor="district" className={label}>Дүүрэг</label>
          <input id="district" name="district" placeholder="Сүхбаатар…" className={field} />
        </div>
      </div>

      <div className="grid gap-1.5">
        <label htmlFor="addressDetail" className={label}>Дэлгэрэнгүй хаяг *</label>
        <textarea id="addressDetail" name="addressDetail" rows={2} required placeholder="Хороо, байр, орц, тоот…" className={field} />
      </div>

      <div className="grid gap-1.5">
        <label htmlFor="preferredTime" className={label}>Тохиромжтой цаг</label>
        <input id="preferredTime" name="preferredTime" placeholder="Жишээ: 18:00-20:00" className={field} />
      </div>

      {state?.error ? (
        <p className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{state.error}</p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand/90 disabled:opacity-50"
      >
        {pending ? "Илгээж байна…" : "Хүргэлт хүсэх"}
      </button>
    </form>
  );
}
