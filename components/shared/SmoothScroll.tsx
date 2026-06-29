"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { registerLenis } from "@/lib/scroll";

gsap.registerPlugin(ScrollTrigger);

/**
 * Lenis smooth-scroll provider, wired into the GSAP ticker so ScrollTrigger
 * animations stay in sync with the smoothed scroll position.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const lenis = new Lenis({
      // Frame-rate independent interpolation. Lower lerp = smoother/heavier
      // glide; 0.08 is silky without feeling disconnected from the input.
      lerp: 0.08,
      smoothWheel: true,
      wheelMultiplier: 1,
      // Smooth momentum on trackpads/touch too.
      syncTouch: true,
      syncTouchLerp: 0.08,
    });

    // Expose the instance so nav links / buttons can scroll to sections.
    registerLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      registerLenis(null);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
