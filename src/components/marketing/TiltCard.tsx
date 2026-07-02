"use client";

import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";

/**
 * Wraps a card in a subtle pointer-driven 3D tilt with a moving light glare.
 * Spring-damped, capped at a few degrees — premium, not a gimmick. Inert for
 * touch (no pointer-move stream) and for prefers-reduced-motion.
 */
export default function TiltCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 160, damping: 20 });
  const sy = useSpring(py, { stiffness: 160, damping: 20 });

  const rotateX = useTransform(sy, [0, 1], [4.5, -4.5]);
  const rotateY = useTransform(sx, [0, 1], [-5.5, 5.5]);
  const glareX = useTransform(sx, [0, 1], ["18%", "82%"]);
  const glareY = useTransform(sy, [0, 1], ["12%", "88%"]);
  const glare = useTransform(
    [glareX, glareY],
    ([gx, gy]) =>
      `radial-gradient(280px circle at ${gx} ${gy}, rgba(255,255,255,0.14), transparent 65%)`,
  );

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced) return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };

  const onPointerLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div style={{ perspective: 900 }}>
      <motion.div
        ref={ref}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        className={`relative ${className}`}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      >
        {children}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{ background: glare }}
        />
      </motion.div>
    </div>
  );
}
