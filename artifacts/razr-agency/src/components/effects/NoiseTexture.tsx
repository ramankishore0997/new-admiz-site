import { useEffect, useState } from "react";

// Pure-CSS SVG noise overlay. Desktop only — disabled on mobile/low-power
// to avoid mix-blend compositing cost on integrated GPUs.
const NOISE_SVG =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' seed='4'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.35 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>";

export default function NoiseTexture() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Disable on touch / coarse pointer (most mobiles) and on reduced motion
    const desktop = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1024px)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!desktop || reduced) return;
    setEnabled(true);
  }, []);

  if (!enabled) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1] mix-blend-overlay"
      style={{
        backgroundImage: `url("${NOISE_SVG}")`,
        backgroundRepeat: "repeat",
        opacity: 0.04,
      }}
    />
  );
}
