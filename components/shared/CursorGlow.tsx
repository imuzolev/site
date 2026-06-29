"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Custom cursor: a dot that tracks the pointer instantly and a glowing ring
 * that trails behind. Positions are written straight to the DOM via transforms
 * (no React re-renders, no springs) so it never lags behind the real cursor,
 * and the expensive hover hit-test is throttled to once per frame.
 */
export function CursorGlow() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    setEnabled(true);

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let target: Element | null = null;
    let hovering = false;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      target = e.target as Element;
      // Dot follows the pointer immediately (composited transform only).
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }
    };

    const tick = () => {
      // Ring eases toward the cursor.
      ringX += (mouseX - ringX) * 0.22;
      ringY += (mouseY - ringY) * 0.22;

      // Hover hit-test runs once per frame, not per mousemove event.
      const next = !!target?.closest("a, button, [data-cursor='hover']");
      if (next !== hovering) {
        hovering = next;
        ringRef.current?.classList.toggle("cursor-active", hovering);
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${
          hovering ? 1.9 : 1
        })`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[100] h-2 w-2 rounded-full bg-cyan [will-change:transform]"
      />
      <div
        ref={ringRef}
        className="cursor-ring pointer-events-none fixed left-0 top-0 z-[100] h-[34px] w-[34px] rounded-full border border-cyan/60 [transition:background-color_.2s,border-color_.2s] [will-change:transform]"
        style={{ boxShadow: "0 0 24px rgba(0,209,255,0.45)" }}
      />
    </>
  );
}
