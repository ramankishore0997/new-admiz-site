import { useRef, type ReactNode, type CSSProperties } from "react";

type Props = {
  children: ReactNode;
  max?: number; // max tilt in degrees
  scale?: number;
  className?: string;
  style?: CSSProperties;
};

// Lightweight 3D tilt wrapper. rAF-throttled mousemove, GPU transform only.
// Disabled on touch / reduced-motion via CSS.
export default function TiltCard({ children, max = 6, scale = 1.015, className = "", style }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef<number | null>(null);
  const pending = useRef<{ x: number; y: number } | null>(null);

  const apply = () => {
    raf.current = null;
    if (!ref.current || !pending.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (pending.current.x - r.left) / r.width - 0.5;
    const py = (pending.current.y - r.top) / r.height - 0.5;
    const rx = (-py * max).toFixed(2);
    const ry = (px * max).toFixed(2);
    ref.current.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${scale})`;
  };

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    pending.current = { x: e.clientX, y: e.clientY };
    if (raf.current == null) raf.current = requestAnimationFrame(apply);
  };

  const onLeave = () => {
    if (raf.current) {
      cancelAnimationFrame(raf.current);
      raf.current = null;
    }
    if (ref.current) {
      ref.current.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)";
    }
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`will-change-transform transition-transform duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${className}`}
      style={{ transformStyle: "preserve-3d", ...style }}
    >
      {children}
    </div>
  );
}
