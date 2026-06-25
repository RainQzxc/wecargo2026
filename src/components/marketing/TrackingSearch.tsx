"use client";

import { useState, useEffect } from "react";
import { useActionState } from "react";
import { trackParcel, type TrackResult } from "@/features/tracking/actions";

type SearchType = "trackcode" | "phone";

interface Props {
  className?: string;
  onResult?: (result: TrackResult | null, pending: boolean) => void;
}

export default function TrackingSearch({ className = "", onResult }: Props) {
  const [type, setType] = useState<SearchType>("trackcode");
  const [state, formAction, pending] = useActionState(trackParcel, null);

  // Lift the result + pending state to the parent (the hero live-tracking card).
  useEffect(() => {
    onResult?.(state, pending);
  }, [state, pending, onResult]);

  return (
    <form action={formAction} className={className}>
      <input type="hidden" name="type" value={type} />

      <div
        className="grid grid-cols-2 gap-1 rounded-2xl border border-[#e5e5e5] bg-[#f2f2f2] p-1"
        aria-label="Хайх төрөл"
      >
        <button
          type="button"
          onClick={() => setType("trackcode")}
          className={`min-h-11 rounded-xl px-3 text-sm font-black transition-colors focus:outline-none focus:ring-2 focus:ring-[#06bbb4]/30 focus:ring-offset-2 ${
            type === "trackcode"
              ? "bg-white text-[#111111] shadow-sm"
              : "text-[#666666] hover:text-[#111111]"
          }`}
        >
          Трак кодоор
        </button>
        <button
          type="button"
          onClick={() => setType("phone")}
          className={`min-h-11 rounded-xl px-3 text-sm font-black transition-colors focus:outline-none focus:ring-2 focus:ring-[#06bbb4]/30 focus:ring-offset-2 ${
            type === "phone"
              ? "bg-white text-[#111111] shadow-sm"
              : "text-[#666666] hover:text-[#111111]"
          }`}
        >
          Утасны дугаараар
        </button>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto]">
        <label
          className="text-sm font-black text-[#333333] sm:col-span-2"
          htmlFor="tracking-query"
        >
          {type === "trackcode" ? "Трак код" : "Утасны дугаар"}
        </label>
        <input
          id="tracking-query"
          name="q"
          type="text"
          placeholder={
            type === "trackcode" ? "Жишээ: DPK364813798571" : "Жишээ: 99110000"
          }
          className="min-h-13 w-full rounded-xl border border-[#e5e5e5] bg-white px-4 text-base font-semibold text-[#111111] placeholder:text-[#666666] transition-colors focus:border-[#06bbb4] focus:outline-none focus:ring-2 focus:ring-[#06bbb4]/20"
        />
        <button
          type="submit"
          disabled={pending}
          className="min-h-13 rounded-xl bg-[#06bbb4] px-7 text-sm font-black text-white transition-colors hover:bg-[#06bbb4]/90 focus:outline-none focus:ring-2 focus:ring-[#06bbb4]/30 focus:ring-offset-2 disabled:opacity-60"
        >
          {pending ? "Хайж байна…" : "Шалгах"}
        </button>
      </div>

      <p className="mt-2.5 text-sm leading-6 text-[#666666]">
        {state?.searched && !state.found ? (
          <span className="font-bold text-[#fe0000]">
            “{state.query}” кодтой бараа олдсонгүй.
          </span>
        ) : (
          "Ачааны байршил, төлөв, сүүлийн шинэчлэлтийг 24/7 шалгана."
        )}
      </p>
    </form>
  );
}
