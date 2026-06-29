"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { SmartVideo } from "@/components/ui/SmartVideo";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GALLERY } from "@/lib/data";
import { cn } from "@/lib/utils";

const COUNT = GALLERY.length;
const AUTO_MS = 4000; // dwell time before the wheel rotates to the next card

// Signed shortest distance from the active card, wrapped to [-COUNT/2, COUNT/2).
function offsetOf(i: number, active: number) {
  let d = i - active;
  if (d > COUNT / 2) d -= COUNT;
  if (d < -COUNT / 2) d += COUNT;
  return d;
}

// Orbiting spark positions (degrees around the wheel) + size/timing jitter.
const SPARKS = Array.from({ length: 16 }, (_, i) => ({
  angle: (360 / 16) * i,
  size: 1.5 + (i % 3),
  delay: (i % 5) * 0.4,
}));

export function VideoGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.25 });

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = (dir: number) => setActive((a) => (a + dir + COUNT) % COUNT);

  // Auto-rotate while visible and not hovered (respects reduced motion).
  useEffect(() => {
    if (!inView || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setActive((a) => (a + 1) % COUNT), AUTO_MS);
    return () => clearInterval(id);
  }, [inView, paused]);

  return (
    <section
      ref={sectionRef}
      id="gallery"
      className="relative overflow-hidden py-28 md:py-36"
    >
      {/* Dark-blue → violet gradient backdrop, faded into the page at top/bottom. */}
      <div className="absolute inset-0 bg-[linear-gradient(160deg,#070b1f_0%,#0b1033_45%,#1a0f33_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(0,209,255,0.16),transparent_55%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink-950 via-transparent to-ink-950" />

      <div className="relative mx-auto mb-16 max-w-6xl px-6">
        <SectionHeading
          align="center"
          eyebrow="Field Footage"
          title="Captured In Operation"
          description="Real mission profiles across every environment. Spin the wheel — the front clip plays live."
        />
      </div>

      {/* 3D wheel stage. */}
      <div
        className="relative mx-auto flex h-[440px] max-w-6xl items-center justify-center sm:h-[540px]"
        style={{ perspective: "1600px" }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Orbiting sparks / particles. */}
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
          {SPARKS.map((s, i) => (
            <motion.span
              key={i}
              className="absolute left-1/2 top-1/2 rounded-full bg-cyan"
              style={{
                width: s.size,
                height: s.size,
                boxShadow: "0 0 8px rgba(0,209,255,0.9)",
                transform: `rotate(${s.angle}deg) translateX(min(40vw,460px))`,
              }}
              animate={{ opacity: [0.15, 1, 0.15], scale: [0.6, 1.3, 0.6] }}
              transition={{
                duration: 3 + (i % 4),
                repeat: Infinity,
                ease: "easeInOut",
                delay: s.delay,
              }}
            />
          ))}
        </div>

        {/* Cards arranged on a convex arc. */}
        <div className="relative h-full w-full" style={{ transformStyle: "preserve-3d" }}>
          {GALLERY.map((item, i) => {
            const offset = offsetOf(i, active);
            const isActive = offset === 0;
            const abs = Math.abs(offset);

            return (
              <motion.article
                key={item.id}
                onClick={() => !isActive && setActive(i)}
                data-cursor="hover"
                className={cn(
                  "absolute left-1/2 top-1/2 aspect-[3/4] w-[260px] overflow-hidden rounded-3xl border sm:w-[330px]",
                  isActive
                    ? "cursor-default border-cyan/70"
                    : "cursor-pointer border-cyan/20"
                )}
                style={{ transformStyle: "preserve-3d", zIndex: 50 - abs * 10 }}
                initial={false}
                animate={{
                  x: `${-50 + offset * 56}%`,
                  y: "-50%",
                  z: isActive ? 90 : -abs * 200,
                  rotateY: offset * -34,
                  scale: isActive ? 1.06 : 0.82,
                  opacity: abs > 2 ? 0 : isActive ? 1 : abs === 1 ? 0.82 : 0.45,
                  filter: `brightness(${isActive ? 1 : 0.6})`,
                  boxShadow: isActive
                    ? "0 0 0 1px rgba(0,209,255,0.6), 0 30px 80px -20px rgba(0,209,255,0.45)"
                    : "0 20px 50px -30px rgba(0,0,0,0.8)",
                }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <SmartVideo
                  src={item.video}
                  active={isActive}
                  autoPlay
                  seed={i + 1}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/10 to-transparent" />

                {/* Glass info bar. */}
                <div className="glass absolute inset-x-3 bottom-3 rounded-2xl px-5 py-4">
                  <p className="text-[11px] uppercase tracking-widest text-cyan">
                    {item.location}
                  </p>
                  <h3 className="mt-1 font-display text-xl font-semibold text-white">
                    {item.title}
                  </h3>
                </div>

                {/* Play indicator on the front card. */}
                <div
                  className={cn(
                    "glass absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full transition-all duration-300",
                    isActive ? "scale-100 opacity-100" : "scale-75 opacity-0"
                  )}
                >
                  <span className="ml-0.5 h-0 w-0 border-y-[6px] border-l-[10px] border-y-transparent border-l-cyan" />
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>

      {/* Controls. */}
      <div className="relative mt-12 flex items-center justify-center gap-6">
        <WheelButton onClick={() => go(-1)} label="Previous">
          <span className="rotate-180">›</span>
        </WheelButton>

        <div className="flex items-center gap-2.5">
          {GALLERY.map((item, i) => (
            <button
              key={item.id}
              onClick={() => setActive(i)}
              data-cursor="hover"
              aria-label={`Show ${item.title}`}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === active ? "w-7 bg-cyan" : "w-2 bg-white/25 hover:bg-white/50"
              )}
            />
          ))}
        </div>

        <WheelButton onClick={() => go(1)} label="Next">
          ›
        </WheelButton>
      </div>
    </section>
  );
}

function WheelButton({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      data-cursor="hover"
      className="glass flex h-12 w-12 items-center justify-center rounded-full text-xl text-cyan transition-colors hover:border-cyan/60 hover:text-white"
    >
      {children}
    </button>
  );
}
