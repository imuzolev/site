"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Cinematic loader: an animated counter climbs to 100 while a scanning line
 * sweeps, then the whole panel wipes upward to reveal the page.
 */
export function Preloader() {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const duration = 2200;
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      setCount(Math.round(eased * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => setDone(true), 350);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Lock scroll while loading.
  useEffect(() => {
    document.documentElement.style.overflow = done ? "" : "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [done]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-ink-950"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="bg-tech-grid absolute inset-0 opacity-30" />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative flex flex-col items-center gap-6"
          >
            <span className="font-display text-xs uppercase tracking-ultra text-cyan">
              CORTEXIS
            </span>

            <div className="relative">
              <span className="font-display text-7xl font-semibold text-white sm:text-8xl">
                {count}
              </span>
              <span className="absolute -right-7 top-2 text-xl text-cyan">%</span>
            </div>

            <div className="relative h-px w-56 overflow-hidden bg-white/10">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan to-violet"
                style={{ width: `${count}%` }}
              />
            </div>

            <span className="text-[11px] uppercase tracking-[0.4em] text-white/40">
              Initializing flight systems
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
