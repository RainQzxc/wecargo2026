"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}

/**
 * The single, page-wide entrance motion: a quiet fade-and-rise on first view,
 * ~400ms, used identically everywhere. No scroll parallax — one calm, inevitable
 * move rather than continuous performance. Honors prefers-reduced-motion.
 */
export default function MotionReveal({ children, delay = 0, y = 16, className = "" }: Props) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
