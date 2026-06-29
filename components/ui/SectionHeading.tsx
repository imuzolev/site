"use client";

import { motion } from "framer-motion";
import { RevealText } from "./RevealText";
import { fadeUp, VIEWPORT } from "@/animations/variants";
import { cn } from "@/lib/utils";

type Props = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: Props) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      <motion.span
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-ultra text-cyan"
      >
        <span className="h-px w-8 bg-cyan/60" />
        {eyebrow}
      </motion.span>

      <RevealText
        as="h2"
        text={title}
        by="word"
        className="font-display text-4xl font-semibold leading-[1.05] text-white sm:text-5xl md:text-6xl"
      />

      {description && (
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className={cn(
            "max-w-2xl text-base text-white/55 sm:text-lg",
            align === "center" && "mx-auto"
          )}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
