const ITEMS = [
  "FPV",
  "AUTONOMOUS",
  "THERMAL",
  "AI NAVIGATION",
  "PRECISION",
  "MILITARY GRADE",
  "COMPUTER VISION",
  "SWARM",
];

/** Infinite scrolling tech strip used as a section transition. */
export function Marquee() {
  // Duplicate the set so translating the track by -50% loops seamlessly.
  const loop = [...ITEMS, ...ITEMS];

  return (
    <div className="relative overflow-hidden border-y border-white/5 bg-ink-900/50 py-5">
      <div className="mask-fade-x flex w-max animate-marquee items-center gap-10 pr-10">
        {loop.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-10 whitespace-nowrap font-display text-sm uppercase tracking-[0.3em] text-white/30"
          >
            {item}
            <span className="h-1.5 w-1.5 rounded-full bg-cyan/50" />
          </span>
        ))}
      </div>
    </div>
  );
}
