"use client";

import { motion } from "framer-motion";
import { SOCIALS } from "@/lib/data";
import { fadeUp, VIEWPORT } from "@/animations/variants";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/5 bg-ink-950 px-6 py-16">
      <div className="bg-tech-grid absolute inset-0 opacity-[0.15]" />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-12">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end"
        >
          <div>
            <span className="font-display text-3xl font-semibold uppercase tracking-[0.2em] text-gradient">
              Cortexis
            </span>
            <p className="mt-3 max-w-sm text-sm text-white/45">
              Building the autonomous aerial systems that define the next decade
              of flight.
            </p>
          </div>

          <ul className="flex flex-col gap-2 md:items-end">
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 text-sm text-white/60 transition-colors hover:text-cyan"
                >
                  <span className="text-[11px] uppercase tracking-widest text-white/30">
                    {s.label}
                  </span>
                  <span className="transition-transform group-hover:translate-x-1">
                    {s.handle}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </motion.div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-xs text-white/30 sm:flex-row">
          <span>© {new Date().getFullYear()} Cortexis Aerospace. All rights reserved.</span>
          <span className="uppercase tracking-widest">Autonomous · Precision · Speed</span>
        </div>
      </div>
    </footer>
  );
}
