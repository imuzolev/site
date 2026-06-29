"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Reveal } from "@/components/ui/Reveal";
import { fadeUp, VIEWPORT } from "@/animations/variants";

export function Contact() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // No backend wired — simulate a successful dispatch.
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section id="contact" className="relative px-6 py-28 md:py-36">
      <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan/10 blur-[140px]" />

      <Reveal from="right" className="relative mx-auto max-w-3xl">
        <SectionHeading
          eyebrow="Establish Contact"
          title="Request A Briefing"
          description="Tell us about your mission. Our engineering team responds within 24 hours."
          className="mb-14"
        />

        <motion.form
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          onSubmit={onSubmit}
          className="glass-strong relative overflow-hidden rounded-3xl p-8 sm:p-10"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <Field id="name" label="Full Name" type="text" />
            <Field id="email" label="Email Address" type="email" />
          </div>
          <div className="mt-6">
            <Field id="subject" label="Subject" type="text" />
          </div>
          <div className="mt-6">
            <Field id="message" label="Mission Details" textarea />
          </div>

          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <p className="text-xs text-white/40">
              {sent ? (
                <span className="text-teal">✓ Transmission received. Stand by.</span>
              ) : (
                "Encrypted · End-to-end secure"
              )}
            </p>
            <MagneticButton>{sent ? "Sent" : "Transmit"}</MagneticButton>
          </div>
        </motion.form>
      </Reveal>
    </section>
  );
}

/** Floating-label glass input with focus glow. */
function Field({
  id,
  label,
  type = "text",
  textarea = false,
}: {
  id: string;
  label: string;
  type?: string;
  textarea?: boolean;
}) {
  const shared =
    "peer w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 pb-2 pt-6 text-white outline-none transition-all duration-300 placeholder-transparent focus:border-cyan/60 focus:bg-white/[0.05] focus:shadow-[0_0_0_4px_rgba(0,209,255,0.12)]";

  return (
    <div className="relative">
      {textarea ? (
        <textarea id={id} rows={4} placeholder={label} className={shared} required />
      ) : (
        <input id={id} type={type} placeholder={label} className={shared} required />
      )}
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-4 top-4 text-sm text-white/40 transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-focus:text-cyan peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs"
      >
        {label}
      </label>
    </div>
  );
}
