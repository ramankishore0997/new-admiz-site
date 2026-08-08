import { useRef, type ReactNode, type CSSProperties } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  color?: string;
  radius?: number;
};

// Mouse-tracking radial spotlight inside a card. CSS variables updated via rAF.
export default function SpotlightCard({
  children,
  className = "",
  style,
  color = "rgba(0, 102, 255, 0.18)",
  radius = 320,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef<number | null>(null);
  const pending = useRef<{ x: number; y: number } | null>(null);

  const apply = () => {
    raf.current = null;
    if (!ref.current || !pending.current) return;
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--spot-x", `${pending.current.x - r.left}px`);
    ref.current.style.setProperty("--spot-y", `${pending.current.y - r.top}px`);
  };

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    pending.current = { x: e.clientX, y: e.clientY };
    if (raf.current == null) raf.current = requestAnimationFrame(apply);
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      className={`group relative isolate ${className}`}
      style={
        {
          "--spot-x": "50%",
          "--spot-y": "-100%",
          "--spot-color": color,
          "--spot-radius": `${radius}px`,
          ...style,
        } as CSSProperties
      }
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100 motion-reduce:hidden"
        style={{
          background:
            "radial-gradient(var(--spot-radius) circle at var(--spot-x) var(--spot-y), var(--spot-color), transparent 70%)",
        }}
      />
      {children}
    </div>
  );
}
