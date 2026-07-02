"use client";

import { motion, type MotionValue } from "motion/react";

/**
 * A branded WECARGO parcel rendered as a real CSS 3D cuboid (preserve-3d).
 * Rotation is driven externally via MotionValues so the parent can tie it to
 * scroll progress (JourneyCinema) or pointer position (CinematicHero).
 *
 * Faces follow the "premium white box" language: white card faces, a teal tape
 * band, mono track-code label, red fragile mark — all within the brand palette.
 */

function Tape() {
  return (
    <div className="pointer-events-none absolute inset-y-0 left-1/2 w-[22%] -translate-x-1/2 bg-[#06bbb4]/90" />
  );
}

function FaceShell({
  children,
  transform,
  size,
}: {
  children?: React.ReactNode;
  transform: string;
  size: number;
}) {
  return (
    <div
      className="absolute overflow-hidden border border-black/8 bg-white"
      style={{
        width: size,
        height: size,
        transform,
        backfaceVisibility: "hidden",
        boxShadow: "inset 0 0 34px rgba(17,17,17,0.06)",
      }}
    >
      {children}
    </div>
  );
}

export default function CargoBox3D({
  rotateX,
  rotateY,
  size = 220,
  className = "",
}: {
  rotateX: MotionValue<number> | number;
  rotateY: MotionValue<number> | number;
  size?: number;
  className?: string;
}) {
  const half = size / 2;

  return (
    <div className={className} style={{ perspective: 1100, width: size, height: size }}>
      <motion.div
        className="relative h-full w-full"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      >
        {/* Front — wordmark + track label */}
        <FaceShell size={size} transform={`translateZ(${half}px)`}>
          <Tape />
          <div className="relative flex h-full flex-col items-center justify-center gap-3">
            <p className="text-[0.14em] font-semibold tracking-tight text-[#1d1d1f]" style={{ fontSize: size * 0.11 }}>
              WE<span className="text-[#06bbb4]">CARGO</span>
            </p>
            <p className="rounded-sm bg-[#1d1d1f] px-2 py-1 font-mono text-white" style={{ fontSize: size * 0.045 }}>
              DPK364813798571
            </p>
          </div>
        </FaceShell>

        {/* Back — route direction */}
        <FaceShell size={size} transform={`rotateY(180deg) translateZ(${half}px)`}>
          <Tape />
          <div className="relative flex h-full flex-col items-center justify-center gap-2 text-[#1d1d1f]">
            <p className="font-semibold" style={{ fontSize: size * 0.07 }}>
              Эрээн → УБ
            </p>
            <p className="font-mono text-[#6e6e73]" style={{ fontSize: size * 0.042 }}>
              ROUTE ER-UB · 2026
            </p>
          </div>
        </FaceShell>

        {/* Right — fragile */}
        <FaceShell size={size} transform={`rotateY(90deg) translateZ(${half}px)`}>
          <div className="flex h-full flex-col items-center justify-center gap-2">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fe0000"
              strokeWidth={1.7}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ width: size * 0.22, height: size * 0.22 }}
              aria-hidden
            >
              <path d="M8 3h8l-2.5 5H16l-5.5 8 1.5-6H9L8 3Z" />
              <path d="M7 21h10M12 16v5" />
            </svg>
            <p className="font-semibold text-[#fe0000]" style={{ fontSize: size * 0.05 }}>
              БОЛГООМЖТОЙ
            </p>
          </div>
        </FaceShell>

        {/* Left — barcode stripes */}
        <FaceShell size={size} transform={`rotateY(-90deg) translateZ(${half}px)`}>
          <div className="flex h-full items-center justify-center">
            <div className="flex items-end gap-[6%]" style={{ width: size * 0.5, height: size * 0.3 }}>
              {[3, 1, 2, 1, 3, 2, 1, 3, 1, 2].map((w, i) => (
                <div key={i} className="h-full bg-[#1d1d1f]" style={{ width: `${w * 4}%` }} />
              ))}
            </div>
          </div>
        </FaceShell>

        {/* Top — tape cross */}
        <FaceShell size={size} transform={`rotateX(90deg) translateZ(${half}px)`}>
          <Tape />
          <div className="pointer-events-none absolute inset-x-0 top-1/2 h-[22%] -translate-y-1/2 bg-[#06bbb4]/60" />
        </FaceShell>

        {/* Bottom */}
        <FaceShell size={size} transform={`rotateX(-90deg) translateZ(${half}px)`} />
      </motion.div>
    </div>
  );
}
