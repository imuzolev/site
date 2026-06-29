"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SmartVideo } from "@/components/ui/SmartVideo";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SHOWCASE } from "@/lib/data";
import { fadeRight, stagger, VIEWPORT } from "@/animations/variants";

export function DroneShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Video gently grows as the block scrolls through.
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.92, 1.04, 1.12]);

  return (
    <section id="showcase" className="relative px-6 py-28 md:py-36">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          align="left"
          eyebrow="Flagship"
          title="Vortex X-1"
          description={SHOWCASE.tagline}
          className="mb-16 max-w-3xl"
        />

        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Video panel. */}
          <div
            ref={ref}
            className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10"
          >
            <motion.div style={{ scale }} className="absolute inset-0">
              <SmartVideo src={SHOWCASE.video} poster={SHOWCASE.poster} seed={1} />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-tr from-ink-950/60 via-transparent to-transparent" />

            {/* Floating HUD tag. */}
            <div className="glass absolute left-5 top-5 rounded-full px-4 py-1.5 text-[11px] uppercase tracking-widest text-cyan">
              ● Live · {SHOWCASE.codename}
            </div>
            <div className="glass absolute bottom-5 right-5 rounded-2xl px-4 py-2 text-right">
              <p className="text-[10px] uppercase tracking-widest text-white/40">Class</p>
              <p className="text-sm font-medium text-white">{SHOWCASE.category} Interceptor</p>
            </div>
          </div>

          {/* Specs. */}
          <motion.ul
            variants={stagger(0.1, 0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            className="flex flex-col"
          >
            {SHOWCASE.specs.map((spec, i) => (
              <motion.li
                key={spec.label}
                variants={fadeRight}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                className={`group relative flex items-baseline justify-between gap-4 border-b border-white/10 py-5 transition-colors duration-300 ${
                  active === i ? "border-cyan/50" : ""
                }`}
              >
                <span
                  className={`absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-full bg-gradient-to-b from-cyan to-violet transition-all duration-300 ${
                    active === i ? "opacity-100" : "opacity-0"
                  }`}
                />
                <span
                  className={`pl-4 text-sm uppercase tracking-widest transition-colors ${
                    active === i ? "text-white" : "text-white/45"
                  }`}
                >
                  {spec.label}
                </span>
                <span className="font-display text-2xl font-semibold text-white sm:text-3xl">
                  {spec.value}
                  {spec.unit && (
                    <span className="ml-1 text-sm font-normal text-cyan">{spec.unit}</span>
                  )}
                </span>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
