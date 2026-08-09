import { useRef, type ReactNode, type MouseEvent } from "react";

type Tone = "emerald" | "red" | "neutral";

const TONES: Record<Tone, { spotlight: string; border: string; topLine: string }> = {
  emerald: {
    spotlight: "rgba(16,185,129,0.16)",
    border: "border-emerald-200/80",
    topLine: "from-transparent via-emerald-200/90 to-transparent",
  },
  red: {
    spotlight: "rgba(239,68,68,0.13)",
    border: "border-red-200/80",
    topLine: "from-transparent via-red-200/80 to-transparent",
  },
  neutral: {
    spotlight: "rgba(100,116,139,0.11)",
    border: "border-slate-200/90",
    topLine: "from-transparent via-slate-200 to-transparent",
  },
};

export default function SpotlightCard({
  children,
  className = "",
  tone = "neutral",
  glow = true,
}: {
  children: ReactNode;
  className?: string;
  tone?: Tone;
  glow?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const t = TONES[tone];

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      className={`group relative overflow-hidden rounded-3xl border ${t.border} bg-white/75 backdrop-blur-xl shadow-[0_24px_70px_-28px_rgba(15,23,42,0.25)] ${className}`}
    >
      {/* mouse spotlight */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `radial-gradient(420px circle at var(--mx,50%) var(--my,50%), ${t.spotlight}, transparent 70%)` }}
      />
      {/* top glass highlight line */}
      <div className={`pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r ${t.topLine}`} />
      {/* inner glass sheen */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-transparent" />
      {glow && (
        <div className="pointer-events-none absolute -top-24 -right-24 w-64 h-64 rounded-full bg-primary/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
