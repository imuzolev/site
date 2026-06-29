"use client";

import { useEffect, useRef } from "react";

// Grid + interaction tuning.
const SPACING = 32; // px between dots
const BASE_R = 1.3; // resting dot radius
const HOVER_R = 160; // cursor influence radius (px)
const MAX_R = 4; // dot radius right under the cursor

// Resting dot colour and the accent it lights up to near the cursor.
const BASE = [130, 150, 175] as const;
const ACCENT = [0, 209, 255] as const;

/**
 * Interactive dot-grid page background. Sits behind the content as a fixed
 * layer, so it only shows through the (transparent) sections below the hero —
 * the hero paints over it with its own opaque backdrop.
 *
 * Drawn on a canvas for performance: the resting grid is rendered once to an
 * offscreen buffer and blitted each frame, while only the handful of dots inside
 * the cursor halo are recomputed. Redraws are coalesced to one per animation
 * frame and only happen while the pointer moves — it idles to zero cost.
 */
export function DotGrid() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const interactive =
      !reduce && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let cols = 0;
    let rows = 0;
    let ox = 0;
    let oy = 0;
    let base: HTMLCanvasElement | null = null;
    const mouse = { x: -9999, y: -9999 };
    let raf = 0;
    let scheduled = false;

    // Pre-render the resting grid once; it's the expensive (full-grid) pass.
    const buildBase = () => {
      base = document.createElement("canvas");
      base.width = canvas.width;
      base.height = canvas.height;
      const b = base.getContext("2d");
      if (!b) return;
      b.setTransform(dpr, 0, 0, dpr, 0, 0);
      b.fillStyle = `rgba(${BASE[0]},${BASE[1]},${BASE[2]},0.22)`;
      b.beginPath();
      for (let i = 0; i < cols; i++) {
        const x = ox + i * SPACING;
        for (let j = 0; j < rows; j++) {
          const y = oy + j * SPACING;
          b.moveTo(x + BASE_R, y);
          b.arc(x, y, BASE_R, 0, Math.PI * 2);
        }
      }
      b.fill();
    };

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / SPACING) + 1;
      rows = Math.ceil(h / SPACING) + 1;
      ox = (w - (cols - 1) * SPACING) / 2;
      oy = (h - (rows - 1) * SPACING) / 2;
      buildBase();
      draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      if (base) ctx.drawImage(base, 0, 0, w, h);
      if (!interactive || mouse.x < -9000) return;

      // Only the dots inside the cursor halo get the live treatment.
      const r2 = HOVER_R * HOVER_R;
      const iMin = Math.max(0, Math.floor((mouse.x - HOVER_R - ox) / SPACING));
      const iMax = Math.min(cols - 1, Math.ceil((mouse.x + HOVER_R - ox) / SPACING));
      const jMin = Math.max(0, Math.floor((mouse.y - HOVER_R - oy) / SPACING));
      const jMax = Math.min(rows - 1, Math.ceil((mouse.y + HOVER_R - oy) / SPACING));

      for (let i = iMin; i <= iMax; i++) {
        const x = ox + i * SPACING;
        for (let j = jMin; j <= jMax; j++) {
          const y = oy + j * SPACING;
          const dx = x - mouse.x;
          const dy = y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 >= r2) continue;

          const t = 1 - Math.sqrt(d2) / HOVER_R; // 0..1 proximity
          const e = t * t; // eased falloff
          const r = BASE_R + e * (MAX_R - BASE_R);
          const cr = (BASE[0] + (ACCENT[0] - BASE[0]) * e) | 0;
          const cg = (BASE[1] + (ACCENT[1] - BASE[1]) * e) | 0;
          const cb = (BASE[2] + (ACCENT[2] - BASE[2]) * e) | 0;

          ctx.beginPath();
          ctx.fillStyle = `rgba(${cr},${cg},${cb},${0.22 + e * 0.68})`;
          ctx.shadowColor = `rgba(${ACCENT[0]},${ACCENT[1]},${ACCENT[2]},${e})`;
          ctx.shadowBlur = e * 12;
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.shadowBlur = 0;
    };

    // Coalesce redraws to one per frame while the pointer is moving.
    const schedule = () => {
      if (scheduled) return;
      scheduled = true;
      raf = requestAnimationFrame(() => {
        scheduled = false;
        draw();
      });
    };

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      schedule();
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
      schedule();
    };

    resize();
    window.addEventListener("resize", resize);
    if (interactive) {
      window.addEventListener("mousemove", onMove, { passive: true });
      document.addEventListener("mouseleave", onLeave);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
    />
  );
}
