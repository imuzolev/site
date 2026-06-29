"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type RevealTextProps = {
  text: string;
  className?: string;
  /** Stagger unit: per word or per character. */
  by?: "word" | "char";
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
};

const container = (delay: number, stagger: number) => ({
  hidden: {},
  visible: { transition: { delayChildren: delay, staggerChildren: stagger } },
});

const child = {
  hidden: { y: "120%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
  },
};

/** Split-text reveal: each word/char slides up from a clipped mask. */
export function RevealText({
  text,
  className,
  by = "word",
  delay = 0,
  as = "span",
}: RevealTextProps) {
  const units = by === "word" ? text.split(" ") : text.split("");
  const stagger = by === "word" ? 0.08 : 0.03;
  const Tag = motion[as];

  return (
    <Tag
      className={cn("inline-block", className)}
      variants={container(delay, stagger)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
      aria-label={text}
    >
      {units.map((unit, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span variants={child} className="inline-block" aria-hidden>
            {unit}
            {by === "word" && i < units.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
