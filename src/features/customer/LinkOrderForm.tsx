"use client";

import { useActionState } from "react";
import { createLinkOrder, type LinkOrderState } from "./actions";

const initial: LinkOrderState = {};
const field =
  "w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm text-ink placeholder:text-ink-3/50 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand";
const label = "text-xs font-semibold text-ink-3";

export function LinkOrderForm() {
  const [state, action, pending] = useActionState(createLinkOrder, initial);

  return (
    <form action={action} className="grid gap-4">
      <div className="grid gap-1.5">
        <label htmlFor="productUrl" className={label}>Барааны линк (URL) *</label>
        <input id="productUrl" name="productUrl" type="url" required placeholder="https://detail.tmall.com/..." className={field} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-1.5">
          <label htmlFor="storeName" className={label}>Дэлгүүр</label>
          <input id="storeName" name="storeName" placeholder="Taobao, Tmall…" className={field} />
        </div>
        <div className="grid gap-1.5">
          <label htmlFor="quantity" className={label}>Тоо ширхэг</label>
          <input id="quantity" name="quantity" type="number" min={1} defaultValue={1} className={field} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-1.5">
          <label htmlFor="color" className={label}>Өнгө</label>
          <input id="color" name="color" placeholder="Хар, цагаан…" className={field} />
        </div>
        <div className="grid gap-1.5">
          <label htmlFor="size" className={label}>Хэмжээ</label>
          <input id="size" name="size" placeholder="M, L, 42…" className={field} />
        </div>
      </div>

      <div className="grid gap-1.5">
        <label htmlFor="priority" className={label}>Яаралтай эсэх</label>
        <select id="priority" name="priority" defaultValue="REGULAR" className={field}>
          <option value="REGULAR">Энгийн</option>
          <option value="URGENT">Яаралтай</option>
        </select>
      </div>

      <div className="grid gap-1.5">
        <label htmlFor="notes" className={label}>Нэмэлт тэмдэглэл</label>
        <textarea id="notes" name="notes" rows={3} placeholder="Загвар, тусгай хүсэлт…" className={field} />
      </div>

      {state?.error ? (
        <p className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{state.error}</p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand/90 disabled:opacity-50"
      >
        {pending ? "Илгээж байна…" : "Захиалга илгээх"}
      </button>
    </form>
  );
}
