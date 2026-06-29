"use client";

import { motion } from "framer-motion";
import { useTilt } from "@/hooks/useTilt";
import { SmartVideo } from "@/components/ui/SmartVideo";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { FLEET, type Drone } from "@/lib/data";
import { fadeUp, stagger, VIEWPORT } from "@/animations/variants";

export function DroneFleet() {
  return (
    <section id="fleet" className="relative px-6 py-28 md:py-36">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="The Fleet"
          title="One Platform. Every Mission."
          description="A modular family of airframes spanning FPV, military and civilian operations."
          className="mb-16"
        />

        <Reveal from="up">
          <motion.div
            variants={stagger(0, 0.08)}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {FLEET.map((drone, i) => (
              <FleetCard key={drone.id} drone={drone} index={i} />
            ))}
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}

function FleetCard({ drone, index }: { drone: Drone; index: number }) {
  const tilt = useTilt(8);

  return (
    <motion.div variants={fadeUp} style={{ perspective: 1000 }}>
      <motion.article
        ref={tilt.ref}
        onMouseMove={tilt.onMouseMove}
        onMouseLeave={tilt.onMouseLeave}
        style={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY, transformStyle: "preserve-3d" }}
        data-cursor="hover"
        className="group relative overflow-hidden rounded-3xl border border-white/10 bg-ink-900"
      >
        {/* Video. */}
        <div className="relative aspect-[4/5] overflow-hidden">
          <motion.div
            className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
          >
            <SmartVideo src={drone.video} active autoPlay seed={index + 2} />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/20 to-transparent" />

          {/* Hover glow ring. */}
          <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 [box-shadow:inset_0_0_60px_rgba(0,209,255,0.35)]" />

          <span className="glass absolute left-4 top-4 rounded-full px-3 py-1 text-[10px] uppercase tracking-widest text-cyan">
            {drone.category}
          </span>
        </div>

        {/* Body. */}
        <div className="relative p-6">
          <div className="flex items-baseline justify-between">
            <h3 className="font-display text-2xl font-semibold text-white">{drone.name}</h3>
            <span className="text-xs uppercase tracking-widest text-white/35">{drone.codename}</span>
          </div>
          <p className="mt-1 text-sm text-white/50">{drone.tagline}</p>

          <div className="mt-5 flex gap-6">
            {drone.specs.map((spec) => (
              <div key={spec.label}>
                <p className="font-display text-lg font-semibold text-cyan">{spec.value}</p>
                <p className="text-[10px] uppercase tracking-widest text-white/40">{spec.label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.article>
    </motion.div>
  );
}
