# CORTEXIS — Drones of the Future

A cinematic, Awwwards-grade single-page promo site for next-generation FPV,
military and civilian drones. Dark / cyberpunk / military-tech aesthetic with
glassmorphism, neon glow and heavy motion design.

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript** (strict)
- **Tailwind CSS** for styling + a small custom design system
- **Framer Motion** — scroll reveals, parallax, magnetic & tilt interactions
- **GSAP + ScrollTrigger** — synced to smooth scroll
- **Lenis** — buttery smooth scrolling
- **React Three Fiber / Three.js** — 3D particle field in the hero

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build && npm start   # production
```

> **Videos are optional.** By default the site requests **no media at all** (a
> clean Network tab, no 404s) and renders animated cinematic gradients instead.
> To use real footage, drop `.mp4`s into `public/videos/` and set
> `NEXT_PUBLIC_ENABLE_VIDEO=true` in `.env.local` (see `public/videos/README.md`).

## Architecture

```
app/                     # App Router entry, root layout, global styles
components/
  sections/              # One file per page section (Hero, Showcase, …)
  shared/                # Cross-cutting chrome (Navbar, Preloader, SmoothScroll…)
  ui/                    # Reusable primitives (SmartVideo, MagneticButton, RevealText…)
hooks/                   # useMagnetic, useTilt, useCountUp
lib/                     # data (content/specs) + utils (cn)
animations/              # shared Framer Motion variants
public/videos/           # drop-in footage (optional)
```

## Sections

Hero · Drone Showcase · Technology · Numbers · Video Gallery · Timeline ·
Drone Fleet · Contact · Footer

## Notes

- The custom cursor + `cursor: none` apply only on fine-pointer devices.
- All motion respects `prefers-reduced-motion`.
- Below-the-fold sections are code-split via `next/dynamic`.
- The contact form is front-end only (no backend) — wire `onSubmit` to your API.
