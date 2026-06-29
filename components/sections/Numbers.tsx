"use client";

import { motion } from "framer-motion";
import { useCountUp } from "@/hooks/useCountUp";
import { STATS } from "@/lib/data";
import { fadeUp, stagger, VIEWPORT } from "@/animations/variants";

export function Numbers() {
  return (
    <section className="relative px-6 py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,209,255,0.08),transparent_60%)]" />
      <motion.div
        variants={stagger(0, 0.12)}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        className="relative mx-auto grid max-w-6xl grid-cols-2 gap-8 lg:grid-cols-4"
      >
        {STATS.map((stat) => (
          <Stat key={stat.label} {...stat} />
        ))}
      </motion.div>
    </section>
  );
}

function Stat({
  value,
  suffix,
  label,
}: {
  value: number;
  suffix: string;
  label: string;
}) {
  const { ref, value: current } = useCountUp(value);

  return (
    <motion.div variants={fadeUp} className="flex flex-col items-center text-center">
      <span ref={ref} className="font-display text-5xl font-bold text-gradient sm:text-6xl">
        {current}
        <span className="text-3xl text-cyan sm:text-4xl">{suffix}</span>
      </span>
      <span className="mt-3 text-xs uppercase tracking-[0.25em] text-white/45">{label}</span>
    </motion.div>
  );
}
