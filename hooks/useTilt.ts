"use client";

import { useRef } from "react";
import { useMotionValue, useSpring, useTransform } from "framer-motion";

/**
 * 3D tilt-on-hover. Tracks cursor position over the element and maps it to
 * rotateX / rotateY springs for a glassy parallax card effect.
 */
export function useTilt(max = 12) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), {
    stiffness: 150,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), {
    stiffness: 150,
    damping: 18,
  });

  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  };

  const onMouseLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return { ref, rotateX, rotateY, px, py, onMouseMove, onMouseLeave };
}
