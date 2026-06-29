"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { TIMELINE } from "@/lib/data";
import { VIEWPORT } from "@/animations/variants";

export function Timeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 65%", "end 75%"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 25 });
  const scaleY = useTransform(progress, [0, 1], [0, 1]);

  return (
    <section className="relative px-6 py-28 md:py-36">
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          eyebrow="Trajectory"
          title="From Prototype To Platform"
          className="mb-20"
        />

        <Reveal from="left">
        <div ref={ref} className="relative pl-10 md:pl-0">
          {/* Static rail. */}
          <div className="absolute left-3 top-0 h-full w-px bg-white/10 md:left-1/2 md:-translate-x-1/2" />
          {/* Animated drawn line. */}
          <motion.div
            style={{ scaleY }}
            className="absolute left-3 top-0 h-full w-px origin-top bg-gradient-to-b from-cyan via-teal to-violet shadow-[0_0_12px_rgba(0,209,255,0.6)] md:left-1/2 md:-translate-x-1/2"
          />

          <div className="flex flex-col gap-16">
            {TIMELINE.map((item, i) => (
              <TimelineItem key={item.year} {...item} side={i % 2 === 0 ? "left" : "right"} />
            ))}
          </div>
        </div>
        </Reveal>
      </div>
    </section>
  );
}

function TimelineItem({
  year,
  title,
  description,
  side,
}: {
  year: string;
  title: string;
  description: string;
  side: "left" | "right";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`relative md:w-1/2 ${
        side === "right" ? "md:ml-auto md:pl-12" : "md:pr-12 md:text-right"
      }`}
    >
      {/* Node. */}
      <span
        className={`absolute top-2 h-3 w-3 -translate-x-[26px] rounded-full bg-cyan shadow-[0_0_16px_rgba(0,209,255,0.9)] md:translate-x-0 ${
          side === "right" ? "md:-left-[54px]" : "md:-right-[54px] md:left-auto"
        }`}
      />
      <div className="glass rounded-2xl p-6">
        <span className="font-display text-sm font-semibold tracking-widest text-cyan">{year}</span>
        <h3 className="mt-2 font-display text-2xl font-semibold text-white">{title}</h3>
        <p className="mt-2 text-sm text-white/55">{description}</p>
      </div>
    </motion.div>
  );
}
