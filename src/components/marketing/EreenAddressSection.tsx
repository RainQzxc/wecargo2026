"use client";

import { useState } from "react";
import { EREEN_WAREHOUSE as EREEN } from "@/constants/ereen-warehouse";

async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through to legacy path */
  }
  try {
    const el = document.createElement("textarea");
    el.value = text;
    el.style.position = "fixed";
    el.style.opacity = "0";
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(el);
    return ok;
  } catch {
    return false;
  }
}

function CopyIcon({ done }: { done: boolean }) {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      {done ? (
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      ) : (
        <>
          <rect x="9" y="9" width="11" height="11" rx="2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15V5a2 2 0 0 1 2-2h10" />
        </>
      )}
    </svg>
  );
}

function CopyField({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  const [done, setDone] = useState(false);

  const onCopy = async () => {
    const ok = await copyText(value);
    if (ok) {
      setDone(true);
      window.setTimeout(() => setDone(false), 1800);
    }
  };

  return (
    <div className="flex items-stretch justify-between gap-3 rounded-xl border border-[#e5e5e5] bg-white p-4">
      <div className="min-w-0">
        <p className="text-xs font-medium text-[#6e6e73]">{label}</p>
        <p className={`mt-1 break-words text-[15px] leading-6 text-[#1d1d1f] ${mono ? "font-mono" : ""}`}>
          {value}
        </p>
      </div>
      <button
        type="button"
        onClick={onCopy}
        aria-label={`${label} хуулах`}
        className={`inline-flex h-11 shrink-0 items-center gap-1.5 self-center rounded-lg px-3.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#06bbb4]/30 focus:ring-offset-2 ${
          done ? "bg-[#06bbb4] text-white" : "bg-[#f2f2f2] text-[#1d1d1f] hover:bg-[#e5e5e5]"
        }`}
      >
        <CopyIcon done={done} />
        {done ? "Хуулагдлаа" : "Хуулах"}
      </button>
    </div>
  );
}

export default function EreenAddressSection() {
  const [allDone, setAllDone] = useState(false);

  const onCopyAll = async () => {
    const block = `Хүлээн авагч: ${EREEN.recipientHint}\nХаяг: ${EREEN.addressCn}\nУтас: ${EREEN.phone}`;
    const ok = await copyText(block);
    if (ok) {
      setAllDone(true);
      window.setTimeout(() => setAllDone(false), 1800);
    }
  };

  return (
    <section id="ereen-address" className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#06bbb4]/10 px-3.5 py-1.5 text-xs font-semibold text-[#04766f]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#06bbb4]" />
            Эрээний агуулах
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#1d1d1f] sm:text-4xl">
            Хятадаас захиалахдаа энэ хаягийг ашиглана уу
          </h2>
          <p className="mt-3 text-base leading-7 text-[#6e6e73]">
            Онлайн дэлгүүрт хүргэлтийн хаягаа оруулахдаа доорх хаягийг хуулж тавина уу. Хүлээн
            авагчийн нэр дээр өөрийн WECARGO код / утасны дугаараа заавал бичээрэй.
          </p>
        </div>

        <div className="space-y-3">
          <CopyField label="Хаяг (中文)" value={EREEN.addressCn} />
          <CopyField label="Утас" value={EREEN.phone} mono />
        </div>

        <button
          type="button"
          onClick={onCopyAll}
          className={`mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-6 text-sm font-semibold text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#06bbb4]/30 focus:ring-offset-2 sm:w-auto ${
            allDone ? "bg-[#04766f]" : "bg-[#06bbb4] hover:bg-[#049b96]"
          }`}
        >
          <CopyIcon done={allDone} />
          {allDone ? "Бүх мэдээлэл хуулагдлаа" : "Бүх мэдээллийг хуулах"}
        </button>
      </div>
    </section>
  );
}
