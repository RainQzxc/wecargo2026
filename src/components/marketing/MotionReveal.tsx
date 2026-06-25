"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  /** How many % the element drifts up as it scrolls through the viewport (parallax depth) */
  parallaxDepth?: number;
}

/**
 * Wraps children with:
 *  1. A scroll-triggered entrance animation (fade + slide up, fires once)
 *  2. An ongoing subtle parallax Y offset as the section scrolls through the viewport
 *
 * The two effects live on separate motion.divs so they don't conflict.
 */
export default function MotionReveal({
  children,
  delay = 0,
  y = 28,
  className = "",
  parallaxDepth = 6,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  /* Drift upward slightly as the section scrolls from below-viewport to above-viewport */
  const driftY = useTransform(
    scrollYProgress,
    [0, 1],
    [`${parallaxDepth / 2}%`, `-${parallaxDepth / 2}%`],
  );

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    /* Outer div: ongoing parallax drift */
    <motion.div ref={ref} style={{ y: driftY }}>
      {/* Inner div: one-time entrance animation */}
      <motion.div
        className={className}
        initial={{ opacity: 0, y }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-70px" }}
        transition={{ duration: 0.72, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
