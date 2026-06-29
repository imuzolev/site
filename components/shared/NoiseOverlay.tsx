/** Full-screen film grain + vignette sitting above content. */
export function NoiseOverlay() {
  return (
    <>
      <div className="noise pointer-events-none fixed inset-0 z-[80] opacity-[0.035] mix-blend-overlay" />
      <div className="pointer-events-none fixed inset-0 z-[80] bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.55))]" />
    </>
  );
}
