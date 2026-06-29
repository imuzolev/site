"use client";

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";

// Anchor sections the assistant guides the visitor through, in page order.
// Each carries a distinct on-screen landing spot (vw/vh) so the robot "hops"
// to a different corner per section, plus a tooltip side, facing lean & accent.
// Only sections that actually carry an id are tracked.
type Side = "left" | "right" | "center";
type Anchor = {
  id: string;
  label: string;
  message: string;
  x: string; // viewport-x landing spot
  y: string; // viewport-y landing spot
  side: Side; // where the tooltip sits / which way the bot faces
  lean: number; // resting tilt for this section (deg)
  accent: string;
};

const SECTIONS: Anchor[] = [
  { id: "top", label: "Welcome", message: "I'm ARIA — your flight guide. Scroll to explore CORTEXIS.", x: "5vw", y: "16vh", side: "left", lean: 8, accent: "#00D1FF" },
  { id: "showcase", label: "Showcase", message: "Meet the VORTEX X-1 — our flagship FPV interceptor.", x: "76vw", y: "28vh", side: "right", lean: -8, accent: "#00FFE5" },
  { id: "technology", label: "Technology", message: "The AI stack: neural nav, thermal vision, edge autonomy.", x: "5vw", y: "24vh", side: "left", lean: 8, accent: "#8B5CF6" },
  { id: "gallery", label: "Field Footage", message: "Real missions, every environment. Spin the wheel.", x: "76vw", y: "58vh", side: "right", lean: -8, accent: "#00D1FF" },
  { id: "fleet", label: "The Fleet", message: "Six airframes — from micro interceptors to heavy lifters.", x: "6vw", y: "60vh", side: "left", lean: 8, accent: "#00FFE5" },
  { id: "contact", label: "Contact", message: "Ready for deployment? Let's talk mission parameters.", x: "75vw", y: "56vh", side: "right", lean: -8, accent: "#8B5CF6" },
];

// Tooltip placement classes per side (+ the little pointer triangle).
const TIP: Record<Side, { box: string; arrow: string }> = {
  right: { box: "right-full top-6 mr-3", arrow: "right-0 top-7 translate-x-1/2" },
  left: { box: "left-full top-6 ml-3", arrow: "left-0 top-7 -translate-x-1/2" },
  center: { box: "top-full left-1/2 mt-3 -translate-x-1/2", arrow: "left-1/2 top-0 -translate-x-1/2 -translate-y-1/2" },
};

export function RobotAssistant() {
  const [active, setActive] = useState(0);
  const [showTip, setShowTip] = useState(true);
  const [hovered, setHovered] = useState(false);

  // Bank/tilt with scroll velocity (compositor-only, no React re-render), then
  // settle back to neutral when idle — reads as the robot leaning into flight.
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const tilt = useSpring(
    useTransform(velocity, [-2500, 0, 2500], [14, 0, -14]),
    { stiffness: 130, damping: 22 }
  );

  // --- Active section via IntersectionObserver (state changes only on cross) ---
  useEffect(() => {
    const ratios = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          ratios.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0);
        }
        let bestId: string | null = null;
        let best = 0;
        ratios.forEach((r, id) => {
          if (r > best) {
            best = r;
            bestId = id;
          }
        });
        if (bestId) {
          const idx = SECTIONS.findIndex((s) => s.id === bestId);
          if (idx !== -1) setActive((prev) => (prev === idx ? prev : idx));
        }
      },
      { threshold: [0.25, 0.5, 0.75], rootMargin: "-15% 0px -25% 0px" }
    );

    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  // Surface the tooltip on each new section, then auto-dismiss.
  useEffect(() => {
    setShowTip(true);
    const t = setTimeout(() => setShowTip(false), 4500);
    return () => clearTimeout(t);
  }, [active]);

  const section = SECTIONS[active];
  const accent = section.accent;
  const tipVisible = showTip || hovered;
  const facing = section.side === "left" ? -1 : 1; // mirror to face the content
  const tip = TIP[section.side];

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[60] hidden md:block motion-reduce:hidden"
      // The "hop" to each section's landing spot. Different springs per axis
      // bow the path into an arc rather than a straight line.
      animate={{ x: section.x, y: section.y }}
      transition={{
        x: { type: "spring", stiffness: 48, damping: 14, mass: 0.9 },
        y: { type: "spring", stiffness: 80, damping: 18, mass: 0.7 },
      }}
    >
      {/* Banking with scroll velocity. */}
      <motion.div style={{ rotate: tilt }}>
        <motion.div
          className="pointer-events-auto relative"
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
          whileHover={{ scale: 1.08 }}
        >
          {/* Section tooltip — placed on the side away from the screen edge so
              it never covers content. */}
          <AnimatePresence>
            {tipVisible && (
              <motion.div
                key={active}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className={`glass pointer-events-none absolute w-60 rounded-2xl px-4 py-3 ${tip.box}`}
              >
                <p
                  className="text-[10px] font-medium uppercase tracking-[0.25em]"
                  style={{ color: accent }}
                >
                  {section.label}
                </p>
                <p className="mt-1 text-[13px] leading-snug text-white/85">
                  {section.message}
                </p>
                <span className={`glass absolute h-3 w-3 rotate-45 rounded-[3px] ${tip.arrow}`} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Idle bob + per-section resting lean & facing. */}
          <motion.div
            animate={{ y: [0, -9, 0], rotate: section.lean, scaleX: facing }}
            transition={{
              y: { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
              scaleX: { duration: 0.5 },
            }}
          >
            <RobotBot accent={accent} />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/** Futuristic floating assistant droid — pure SVG, transform/opacity anims only. */
function RobotBot({ accent }: { accent: string }) {
  return (
    <svg
      viewBox="0 0 140 150"
      className="h-[120px] w-[112px] drop-shadow-[0_10px_30px_rgba(0,209,255,0.3)]"
      fill="none"
    >
      <defs>
        <linearGradient id="botBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1B2233" />
          <stop offset="100%" stopColor="#0A0E18" />
        </linearGradient>
        <linearGradient id="botEdge" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00D1FF" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
        <filter id="botGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Hover thruster glow. */}
      <motion.ellipse
        cx="70"
        cy="138"
        rx="34"
        ry="7"
        fill={accent}
        animate={{ opacity: [0.18, 0.4, 0.18], scaleX: [0.9, 1.05, 0.9] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      />

      {/* Antenna + blinking tip. */}
      <line x1="70" y1="22" x2="70" y2="8" stroke="url(#botEdge)" strokeWidth="2.5" />
      <motion.circle
        cx="70"
        cy="7"
        r="4"
        fill={accent}
        filter="url(#botGlow)"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Side fins. */}
      <rect x="16" y="58" width="9" height="26" rx="4" fill="#8B5CF6" opacity="0.85" />
      <rect x="115" y="58" width="9" height="26" rx="4" fill="#8B5CF6" opacity="0.85" />

      {/* Head / body. */}
      <rect x="26" y="24" width="88" height="86" rx="32" fill="url(#botBody)" stroke="url(#botEdge)" strokeWidth="2.5" />

      {/* Visor. */}
      <rect x="40" y="46" width="60" height="34" rx="17" fill="#05070D" stroke={accent} strokeWidth="1.5" opacity="0.95" />

      {/* Scanning highlight inside the visor. */}
      <motion.rect
        x="44"
        y="50"
        width="10"
        height="26"
        rx="5"
        fill={accent}
        opacity="0.25"
        animate={{ x: [44, 86, 44] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Eyes. */}
      <motion.g
        fill={accent}
        filter="url(#botGlow)"
        animate={{ opacity: [1, 1, 0.15, 1] }}
        transition={{ duration: 5, repeat: Infinity, times: [0, 0.92, 0.96, 1], ease: "linear" }}
      >
        <circle cx="58" cy="63" r="5.5" />
        <circle cx="82" cy="63" r="5.5" />
      </motion.g>

      {/* Status LED row. */}
      <rect x="56" y="92" width="28" height="5" rx="2.5" fill="#0A0E18" stroke="#2A3344" strokeWidth="1" />
      <motion.rect
        x="58"
        y="93.5"
        width="8"
        height="2"
        rx="1"
        fill={accent}
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Hover ring under the body. */}
      <motion.ellipse
        cx="70"
        cy="120"
        rx="38"
        ry="9"
        fill="none"
        stroke={accent}
        strokeWidth="1.5"
        strokeDasharray="6 8"
        opacity="0.5"
        animate={{ rotate: 360 }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      />
    </svg>
  );
}
