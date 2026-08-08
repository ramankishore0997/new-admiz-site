import { useEffect, useRef, useState } from "react";

// Soft radial glow that trails the cursor. Desktop-only (hover:hover devices).
// rAF runs ONLY while pointer is moving + brief settle window. Stops when idle.
// Single fixed element, GPU transform only. Respects reduced motion.
const SETTLE_MS = 220;
const SETTLE_EPS = 0.5;

export default function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const target = useRef({ x: -9999, y: -9999 });
  const current = useRef({ x: -9999, y: -9999 });
  const raf = useRef<number | null>(null);
  const lastMoveAt = useRef(0);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hoverable = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!hoverable || reduced) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const tick = () => {
      // Lerp toward target
      current.current.x += (target.current.x - current.current.x) * 0.18;
      current.current.y += (target.current.y - current.current.y) * 0.18;
      if (ref.current) {
        ref.current.style.transform = `translate3d(${current.current.x - 200}px, ${current.current.y - 200}px, 0)`;
      }
      const idleFor = performance.now() - lastMoveAt.current;
      const settled =
        Math.abs(target.current.x - current.current.x) < SETTLE_EPS &&
        Math.abs(target.current.y - current.current.y) < SETTLE_EPS;
      // Keep ticking only while moving or until settle window closes
      if (!settled || idleFor < SETTLE_MS) {
        raf.current = requestAnimationFrame(tick);
      } else {
        raf.current = null; // stop — no CPU cost while idle
      }
    };

    const onMove = (e: PointerEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      lastMoveAt.current = performance.now();
      if (raf.current == null) {
        raf.current = requestAnimationFrame(tick);
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[2] h-[400px] w-[400px] rounded-full opacity-60 will-change-transform"
      style={{
        background:
          "radial-gradient(closest-side, rgba(5,150,105,0.16), rgba(5,150,105,0.06) 35%, transparent 70%)",
        mixBlendMode: "multiply",
        transform: "translate3d(-9999px, -9999px, 0)",
      }}
    />
  );
}
