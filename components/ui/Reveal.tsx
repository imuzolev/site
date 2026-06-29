"use client";

import { motion, type Variants } from "framer-motion";
import { VIEWPORT } from "@/animations/variants";

const EASE = [0.22, 1, 0.36, 1] as const;

type Direction = "up" | "left" | "right" | "zoom";

// The hidden (off-screen) pose per entrance direction. `visible` always lands
// at the neutral pose below, so each block resolves to the same final layout.
const HIDDEN: Record<Direction, Variants["hidden"]> = {
  up: { opacity: 0, y: 64 },
  left: { opacity: 0, x: -80 },
  right: { opacity: 0, x: 80 },
  zoom: { opacity: 0, scale: 0.9 },
};

type Props = {
  children: React.ReactNode;
  /** How the block enters: `up` rises, `left`/`right` slide, `zoom` scales from centre. */
  from?: Direction;
  /** Hold the entrance back a beat (seconds). */
  delay?: number;
  className?: string;
};

/**
 * Reveals a whole block as it scrolls into view — once. Pick a different `from`
 * per section so adjacent blocks enter distinctly. Inner elements keep their own
 * staggered reveals.
 */
export function Reveal({ children, from = "up", delay = 0, className }: Props) {
  const variants: Variants = {
    hidden: HIDDEN[from],
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: { duration: 0.8, ease: EASE, delay },
    },
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      className={className}
    >
      {children}
    </motion.div>
  );
}
