"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type SearchType = "trackcode" | "phone";

interface Props {
  className?: string;
}

export default function TrackingSearch({ className = "" }: Props) {
  const [type, setType] = useState<SearchType>("trackcode");
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/track?q=${encodeURIComponent(query.trim())}&type=${type}`);
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="flex gap-1 mb-3 bg-[#f2f2f2] p-1 rounded-xl w-fit">
        <button
          type="button"
          onClick={() => setType("trackcode")}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
            type === "trackcode"
              ? "bg-[#06bbb4] text-white shadow-sm"
              : "text-[#666666] hover:text-[#111111]"
          }`}
        >
          трак кодоор
        </button>
        <button
          type="button"
          onClick={() => setType("phone")}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
            type === "phone"
              ? "bg-[#06bbb4] text-white shadow-sm"
              : "text-[#666666] hover:text-[#111111]"
          }`}
        >
          Утасны дугаараар
        </button>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={
            type === "trackcode"
              ? "Жишээ: DPK364813798571"
              : "Жишээ: 99110000"
          }
          className="flex-1 px-4 py-3.5 rounded-xl bg-white border border-[#e5e5e5] text-[#111111] placeholder-[#999999] focus:outline-none focus:border-[#06bbb4] focus:ring-2 focus:ring-[#06bbb4]/20 transition-all text-base min-w-0"
        />
        <button
          type="submit"
          className="px-6 py-3.5 bg-[#06bbb4] hover:bg-[#06bbb4]/90 text-white font-semibold rounded-xl transition-colors shrink-0 text-sm"
        >
          Шалгах
        </button>
      </div>

      <p className="mt-2.5 text-[#666666] text-xs">
        Ачааныхаа байршлыг 24/7 онлайнаар шалгах боломжтой.
      </p>
    </form>
  );
}
