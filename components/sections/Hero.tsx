"use client";

import dynamic from "next/dynamic";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { SmartVideo } from "@/components/ui/SmartVideo";
import { MagneticButton } from "@/components/ui/MagneticButton";

// 3D particle field is client-only and heavy — load it lazily.
const ParticleField = dynamic(
  () => import("@/components/shared/ParticleField"),
  { ssr: false }
);

// Interactive background sensor (its own lightweight WebGL scene).
const SensorRig = dynamic(
  () => import("@/components/shared/SensorRig").then((m) => m.SensorRig),
  { ssr: false }
);

// Background quadcopter with spinning rotors that lifts on hover.
const DroneRig = dynamic(
  () => import("@/components/shared/DroneRig").then((m) => m.DroneRig),
  { ssr: false }
);

const TITLE = "Аргус";

// Staggered per-letter reveal: each glyph flips up out of the depth.
const titleContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.45 } },
};
const letterReveal = {
  hidden: { y: 70, opacity: 0, rotateX: 90, filter: "blur(10px)" },
  visible: {
    y: 0,
    opacity: 1,
    rotateX: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Cinematic scroll parallax.
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  // Pointer-driven 3D tilt for the title (spring-smoothed, no re-renders).
  const tiltX = useSpring(0, { stiffness: 120, damping: 18 });
  const tiltY = useSpring(0, { stiffness: 120, damping: 18 });
  const onPointerMove = (e: React.PointerEvent) => {
    tiltY.set((e.clientX / window.innerWidth - 0.5) * 18);
    tiltX.set((0.5 - e.clientY / window.innerHeight) * 14);
  };

  return (
    <section
      ref={ref}
      id="top"
      onPointerMove={onPointerMove}
      className="relative flex h-[100svh] min-h-[640px] w-full items-center justify-center overflow-hidden"
    >
      {/* Background video (animated gradient fallback if absent). */}
      <motion.div style={{ scale: videoScale }} className="absolute inset-0">
        <SmartVideo src="/videos/hero.mp4" poster="/videos/posters/hero.jpg" seed={0} />
      </motion.div>

      {/* 3D particle field. */}
      <div className="absolute inset-0 opacity-70">
        <ParticleField />
      </div>

      {/* Darkening + color overlays. */}
      <div className="absolute inset-0 bg-ink-950/55" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/30 to-ink-950/70" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(0,209,255,0.12),transparent_55%)]" />

      {/* Animated corner brackets / HUD lines. */}
      <HudFrame />

      {/* Interactive sci-fi sensors — part of the background composition. */}
      <SensorRig place="lower-right" accent="cyan" />
      <DroneRig place="upper-left" />

      {/* Content. */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 flex flex-col items-center px-6 text-center"
      >
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] uppercase tracking-[0.3em] text-cyan backdrop-blur"
        >
          <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-teal" />
          Autonomous Aerial Systems
        </motion.span>

        <motion.div
          style={{ rotateX: tiltX, rotateY: tiltY, transformPerspective: 1000 }}
          className="[transform-style:preserve-3d]"
        >
          {/* Gentle idle float. */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <motion.h1
              variants={titleContainer}
              initial="hidden"
              animate="visible"
              className="relative font-display text-[26vw] font-bold leading-[0.95] tracking-tight drop-shadow-[0_0_45px_rgba(0,209,255,0.45)] sm:text-[18vw] md:text-[14rem]"
            >
              {/* Blurred aura behind the word for extra bloom. */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 select-none bg-gradient-to-b from-white via-cyan to-violet bg-clip-text text-transparent opacity-50 blur-2xl"
              >
                {TITLE}
              </span>

              {/* Each glyph carries its own gradient so it's always visible. */}
              {TITLE.split("").map((ch, i) => (
                <motion.span
                  key={i}
                  variants={letterReveal}
                  style={{ transformPerspective: 900 }}
                  className="inline-block bg-gradient-to-b from-white via-cyan to-violet bg-clip-text text-transparent"
                >
                  {ch}
                </motion.span>
              ))}
            </motion.h1>
          </motion.div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ delay: 1.4, duration: 1 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-base font-light text-white/70 sm:text-xl"
        >
          <span>Autonomous Intelligence.</span>
          <span className="text-cyan neon-cyan">Precision.</span>
          <span className="text-violet">Speed.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7, duration: 0.8 }}
          className="mt-12 flex flex-col items-center gap-4 sm:flex-row"
        >
          <MagneticButton href="#showcase">Explore</MagneticButton>
          <MagneticButton href="#contact" variant="ghost">
            Contact
          </MagneticButton>
        </motion.div>
      </motion.div>

      {/* Scroll cue. */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">Scroll</span>
        <span className="flex h-9 w-5 justify-center rounded-full border border-white/20 p-1">
          <motion.span
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="h-1.5 w-1 rounded-full bg-cyan"
          />
        </span>
      </motion.div>
    </section>
  );
}

/** Animated HUD corner brackets that draw in on load. */
function HudFrame() {
  const corners = [
    "left-6 top-24 border-l border-t",
    "right-6 top-24 border-r border-t",
    "bottom-6 left-6 border-b border-l",
    "bottom-6 right-6 border-b border-r",
  ];
  return (
    <div className="pointer-events-none absolute inset-0 z-[5]">
      {corners.map((c, i) => (
        <motion.span
          key={c}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 + i * 0.1, duration: 0.6 }}
          className={`absolute h-10 w-10 border-cyan/40 ${c}`}
        />
      ))}
    </div>
  );
}
