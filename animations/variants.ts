import type { Variants } from "framer-motion";

/** Reusable scroll-reveal variants. Pair with whileInView + viewport once. */

// NOTE: we intentionally animate only opacity + transform (compositor-friendly).
// Animating `filter: blur()` per frame caused scroll jank, so it was removed.
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 48 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -64 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

export const fadeRight: Variants = {
  hidden: { opacity: 0, x: 64 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

export const zoomIn: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

export const blurIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 1, ease: "easeOut" },
  },
};

/** Parent that staggers its direct children. */
export const stagger = (delayChildren = 0, staggerChildren = 0.12): Variants => ({
  hidden: {},
  visible: {
    transition: { delayChildren, staggerChildren },
  },
});

export const VIEWPORT = { once: true, amount: 0.3 } as const;
