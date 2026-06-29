"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NAV_LINKS } from "@/lib/data";
import { scrollToSection } from "@/lib/scroll";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Smooth-scroll to the target and (on mobile) close the burger menu.
  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    scrollToSection(href);
    setOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-[95] flex justify-center px-4 pt-4"
    >
      <nav
        className={cn(
          "flex w-full max-w-6xl items-center justify-between rounded-full px-6 py-3 transition-all duration-500",
          scrolled ? "glass-strong shadow-[0_8px_40px_rgba(0,0,0,0.45)]" : "bg-transparent"
        )}
      >
        <a
          href="#top"
          onClick={(e) => handleNav(e, "#top")}
          className="flex items-center gap-2"
        >
          <span className="relative flex h-7 w-7 items-center justify-center">
            <span className="absolute inset-0 rounded-md bg-gradient-to-br from-cyan to-violet opacity-80 blur-[6px]" />
            <span className="relative h-3 w-3 rotate-45 rounded-sm bg-white" />
          </span>
          <span className="font-display text-sm font-semibold uppercase tracking-[0.3em] text-white">
            Cortexis
          </span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => handleNav(e, link.href)}
                className="group relative text-sm text-white/65 transition-colors hover:text-white"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-cyan transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          onClick={(e) => handleNav(e, "#contact")}
          className="hidden rounded-full border border-cyan/40 px-5 py-2 text-xs uppercase tracking-widest text-cyan transition-all hover:bg-cyan hover:text-ink-950 md:inline-block"
        >
          Deploy
        </a>

        <button
          onClick={() => setOpen((v) => !v)}
          className="flex flex-col gap-1.5 md:hidden"
          aria-label="Toggle menu"
        >
          <span
            className={cn(
              "h-px w-6 bg-white transition-transform",
              open && "translate-y-[7px] rotate-45"
            )}
          />
          <span className={cn("h-px w-6 bg-white transition-opacity", open && "opacity-0")} />
          <span
            className={cn(
              "h-px w-6 bg-white transition-transform",
              open && "-translate-y-[7px] -rotate-45"
            )}
          />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-strong absolute left-4 right-4 top-20 flex flex-col gap-1 rounded-3xl p-4 md:hidden"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNav(e, link.href)}
                className="rounded-xl px-4 py-3 text-white/75 transition-colors hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
