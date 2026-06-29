import type Lenis from "lenis";

/**
 * Single source of truth for programmatic smooth scrolling. The Lenis instance
 * (created in SmoothScroll) registers itself here so any component can scroll to
 * a section without prop-drilling. Falls back to native smooth scroll if Lenis
 * is unavailable (e.g. prefers-reduced-motion).
 */

let instance: Lenis | null = null;

export function registerLenis(lenis: Lenis | null) {
  instance = lenis;
}

/** Vertical offset (px) so targets clear the fixed navbar. */
const NAV_OFFSET = -90;

/**
 * Smoothly scroll to an element referenced by a hash (e.g. "#showcase").
 * @param hash   target id, with or without the leading "#"
 * @param offset extra vertical offset; defaults to clearing the navbar
 */
export function scrollToSection(hash: string, offset = NAV_OFFSET) {
  const id = hash.startsWith("#") ? hash : `#${hash}`;
  const el = document.querySelector(id);
  if (!el) return;

  if (instance) {
    instance.scrollTo(el as HTMLElement, { offset, duration: 1.4 });
  } else {
    const top =
      (el as HTMLElement).getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: "smooth" });
  }
}
