"use client";

import { motion } from "framer-motion";
import { useTilt } from "@/hooks/useTilt";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { TECHNOLOGY } from "@/lib/data";
import { fadeUp, stagger, VIEWPORT } from "@/animations/variants";

export function Technology() {
  return (
    <section id="technology" className="relative px-6 py-28 md:py-36">
      <div className="bg-tech-grid absolute inset-0 opacity-[0.12]" />
      <div className="absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-violet/10 blur-[120px]" />

      <div className="relative mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Core Systems"
          title="Intelligence In Every Flight"
          description="Six tightly-integrated subsystems give every airframe situational awareness, autonomy and precision."
          className="mb-16"
        />

        <Reveal from="zoom">
          <motion.div
            variants={stagger(0, 0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {TECHNOLOGY.map((tech, i) => (
              <TechCard key={tech.title} {...tech} index={i} />
            ))}
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}

function TechCard({
  title,
  description,
  accent,
  index,
}: {
  title: string;
  description: string;
  accent: string;
  index: number;
}) {
  const tilt = useTilt(10);

  return (
    <motion.div variants={fadeUp} style={{ perspective: 1000 }}>
      <motion.article
        ref={tilt.ref}
        onMouseMove={tilt.onMouseMove}
        onMouseLeave={tilt.onMouseLeave}
        style={{
          rotateX: tilt.rotateX,
          rotateY: tilt.rotateY,
          transformStyle: "preserve-3d",
          // Stagger the float so cards don't bob in unison.
          animationDelay: `${index * 0.4}s`,
        }}
        className="glass group relative h-full overflow-hidden rounded-3xl p-7 animate-float"
      >
        <div
          className="absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: `radial-gradient(400px circle at 50% 0%, ${accent}22, transparent 70%)` }}
        />
        <div
          className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl"
          style={{
            background: `linear-gradient(135deg, ${accent}33, transparent)`,
            boxShadow: `0 0 24px ${accent}40`,
          }}
        >
          <span className="font-display text-lg font-semibold" style={{ color: accent }}>
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <h3 className="mb-3 font-display text-xl font-semibold text-white">{title}</h3>
        <p className="text-sm leading-relaxed text-white/55">{description}</p>

        <span
          className="mt-6 flex h-px w-full origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
          style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
        />
      </motion.article>
    </motion.div>
  );
}
