"use client";

import { useActionState } from "react";
import { setDeliveryStatus, type DeliveryActionState } from "./actions";

const initial: DeliveryActionState = {};

export function DeliveryStatusControls({
  deliveryId,
  status,
}: {
  deliveryId: string;
  status: string;
}) {
  const [state, action, pending] = useActionState(setDeliveryStatus, initial);

  const isAssigned = status === "ASSIGNED";
  const isOut = status === "OUT_FOR_DELIVERY";
  const terminal = !isAssigned && !isOut;

  if (terminal) {
    return (
      <p className="text-sm text-ink-3">
        Энэ хүргэлт дууссан тул өөрчлөх боломжгүй.
      </p>
    );
  }

  return (
    <form action={action} className="grid gap-3">
      <input type="hidden" name="deliveryId" value={deliveryId} />

      {isOut && (
        <textarea
          name="reason"
          rows={2}
          placeholder="Амжилтгүй болсон бол шалтгаан…"
          className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm text-ink placeholder:text-ink-3/50 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
        />
      )}

      <div className="flex flex-wrap gap-3">
        {isAssigned && (
          <button
            type="submit"
            name="status"
            value="OUT_FOR_DELIVERY"
            disabled={pending}
            className="inline-flex items-center rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90 transition-colors disabled:opacity-50"
          >
            {pending ? "..." : "Хүргэлт эхлэх"}
          </button>
        )}
        {isOut && (
          <>
            <button
              type="submit"
              name="status"
              value="DELIVERED"
              disabled={pending}
              className="inline-flex items-center rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {pending ? "..." : "Хүргэсэн"}
            </button>
            <button
              type="submit"
              name="status"
              value="FAILED"
              disabled={pending}
              className="inline-flex items-center rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 transition-colors disabled:opacity-50"
            >
              Амжилтгүй
            </button>
          </>
        )}
      </div>

      {state?.error ? (
        <p className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{state.error}</p>
      ) : null}
    </form>
  );
}
