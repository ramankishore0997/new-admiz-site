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
      current.current.x += (target.current.x - current.current.x) * 0.16;
      current.current.y += (target.current.y - current.current.y) * 0.16;
      if (ref.current) {
        ref.current.style.transform = `translate3d(${current.current.x - 250}px, ${current.current.y - 250}px, 0)`;
      }
      const idleFor = performance.now() - lastMoveAt.current;
      const settled =
        Math.abs(target.current.x - current.current.x) < SETTLE_EPS &&
        Math.abs(target.current.y - current.current.y) < SETTLE_EPS;
      if (!settled || idleFor < SETTLE_MS) {
        raf.current = requestAnimationFrame(tick);
      } else {
        raf.current = null;
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
      className="pointer-events-none fixed top-0 left-0 z-[1] h-[500px] w-[500px] rounded-full opacity-70 will-change-transform"
      style={{
        background:
          "radial-gradient(closest-side, rgba(16,185,129,0.18), rgba(6,182,212,0.08) 45%, transparent 70%)",
        mixBlendMode: "screen",
        transform: "translate3d(-9999px, -9999px, 0)",
      }}
    />
  );
}
