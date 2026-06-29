"use client";

import { motion } from "framer-motion";
import { useMagnetic } from "@/hooks/useMagnetic";
import { scrollToSection } from "@/lib/scroll";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "ghost";
  className?: string;
};

/** Glowing, cursor-magnetic CTA button. */
export function MagneticButton({
  children,
  href,
  onClick,
  variant = "primary",
  className,
}: Props) {
  const { ref, x, y, onMouseMove, onMouseLeave } = useMagnetic(0.45);

  const content = (
    <motion.span
      ref={ref}
      style={{ x, y }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-8 py-4 text-sm font-medium uppercase tracking-widest transition-colors",
        variant === "primary"
          ? "text-ink-950"
          : "glass text-white hover:text-cyan",
        className
      )}
    >
      {variant === "primary" && (
        <span className="absolute inset-0 -z-10 bg-gradient-to-r from-cyan via-teal to-violet bg-[length:200%_100%] animate-shimmer" />
      )}
      {variant === "primary" && (
        <span className="absolute inset-0 -z-20 rounded-full bg-cyan blur-xl opacity-50 transition-opacity group-hover:opacity-90" />
      )}
      <span className="relative z-10">{children}</span>
    </motion.span>
  );

  if (href) {
    // In-page hash links scroll smoothly via Lenis; external links behave normally.
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (href.startsWith("#")) {
        e.preventDefault();
        scrollToSection(href);
      }
    };
    return (
      <a href={href} onClick={handleClick} className="inline-block">
        {content}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className="inline-block">
      {content}
    </button>
  );
}
