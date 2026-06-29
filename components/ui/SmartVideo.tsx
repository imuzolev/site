"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// Only attempt to load real footage when explicitly enabled. With no videos in
// /public/videos this keeps the Network tab clean (no 404s) — set
// NEXT_PUBLIC_ENABLE_VIDEO=true once you've added the files.
const VIDEO_ENABLED = process.env.NEXT_PUBLIC_ENABLE_VIDEO === "true";

type SmartVideoProps = {
  src: string;
  poster?: string;
  className?: string;
  /** When true the video plays; otherwise it pauses (used for hover galleries). */
  active?: boolean;
  autoPlay?: boolean;
  /** Seed shifts the fallback gradient hue so multiple fallbacks look distinct. */
  seed?: number;
};

/**
 * Video element that degrades gracefully: if the source is missing or fails to
 * load, an animated cinematic gradient stands in so the layout never looks
 * broken. Drop real footage into /public/videos to upgrade automatically.
 */
export function SmartVideo({
  src,
  poster,
  className,
  active = true,
  autoPlay = true,
  seed = 0,
}: SmartVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);

  // Toggle playback for hover-driven galleries.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (active && autoPlay) void el.play().catch(() => {});
    else el.pause();
  }, [active, autoPlay]);

  // No request is made unless video is enabled (avoids 404 noise when the
  // /public/videos folder is empty).
  if (!VIDEO_ENABLED || failed) {
    return <VideoFallback className={className} seed={seed} animated={active} />;
  }

  return (
    <video
      ref={ref}
      className={cn("h-full w-full object-cover", className)}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      autoPlay={autoPlay && active}
      preload="metadata"
      onError={() => setFailed(true)}
    />
  );
}

/**
 * Pure CSS stand-in for missing footage. Kept mostly static for performance —
 * the page can render a dozen of these at once, so the only motion is a cheap
 * opacity pulse (compositor-only) on the glow when `animated` is true.
 */
export function VideoFallback({
  className,
  seed = 0,
  animated = true,
}: {
  className?: string;
  seed?: number;
  animated?: boolean;
}) {
  const hue = 190 + (seed % 4) * 30;
  return (
    <div
      className={cn("relative h-full w-full overflow-hidden bg-ink-900", className)}
      aria-hidden
    >
      <div
        className="absolute inset-0 opacity-80"
        style={{
          backgroundImage: `linear-gradient(135deg, hsl(${hue} 90% 8%), hsl(${
            hue + 40
          } 80% 13%), hsl(260 55% 9%))`,
        }}
      />
      <div className="absolute inset-0 bg-tech-grid opacity-30" />
      <div
        className={cn(
          "absolute left-1/2 top-1/2 h-[60%] w-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl",
          animated && "animate-pulse-glow"
        )}
        style={{
          background: `radial-gradient(circle, hsl(${hue} 100% 50% / 0.3), transparent 70%)`,
        }}
      />
    </div>
  );
}
