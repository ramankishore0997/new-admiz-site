import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  spotlightColor?: string;
  borderColor?: string;
  tone?: "aurora" | "sunset" | "cyber" | "neon" | "purple" | "cyan" | "emerald" | "amber" | "rose" | "violet-cyan" | "default";
  enableSkewGradient?: boolean;
  skewGradientFrom?: string;
  skewGradientTo?: string;
}

const TONE_COLORS = {
  "violet-cyan": {
    spotlight: "radial-gradient(550px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(139, 92, 246, 0.18), rgba(6, 182, 212, 0.12), transparent 70%)",
    border: "radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(139, 92, 246, 0.8), rgba(6, 182, 212, 0.6), transparent 70%)",
    gradientFrom: "#8B5CF6",
    gradientTo: "#06B6D4",
  },
  aurora: {
    spotlight: "radial-gradient(550px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(139, 92, 246, 0.18), rgba(6, 182, 212, 0.12), transparent 70%)",
    border: "radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(139, 92, 246, 0.8), rgba(6, 182, 212, 0.6), transparent 70%)",
    gradientFrom: "#8B5CF6",
    gradientTo: "#06B6D4",
  },
  sunset: {
    spotlight: "radial-gradient(550px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(244, 63, 94, 0.18), rgba(245, 158, 11, 0.12), transparent 70%)",
    border: "radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(244, 63, 94, 0.8), rgba(245, 158, 11, 0.6), transparent 70%)",
    gradientFrom: "#F43F5E",
    gradientTo: "#F59E0B",
  },
  cyber: {
    spotlight: "radial-gradient(550px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(6, 182, 212, 0.18), rgba(59, 130, 246, 0.12), transparent 70%)",
    border: "radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(6, 182, 212, 0.8), rgba(59, 130, 246, 0.6), transparent 70%)",
    gradientFrom: "#06B6D4",
    gradientTo: "#3B82F6",
  },
  neon: {
    spotlight: "radial-gradient(550px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(16, 185, 129, 0.18), rgba(6, 182, 212, 0.12), transparent 70%)",
    border: "radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(16, 185, 129, 0.8), rgba(6, 182, 212, 0.6), transparent 70%)",
    gradientFrom: "#10B981",
    gradientTo: "#06B6D4",
  },
  purple: {
    spotlight: "radial-gradient(550px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(168, 85, 247, 0.18), rgba(139, 92, 246, 0.12), transparent 70%)",
    border: "radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(168, 85, 247, 0.8), rgba(139, 92, 246, 0.6), transparent 70%)",
    gradientFrom: "#A855F7",
    gradientTo: "#6366F1",
  },
  cyan: {
    spotlight: "radial-gradient(550px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(6, 182, 212, 0.18), rgba(59, 130, 246, 0.12), transparent 70%)",
    border: "radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(6, 182, 212, 0.8), rgba(59, 130, 246, 0.6), transparent 70%)",
    gradientFrom: "#06B6D4",
    gradientTo: "#3B82F6",
  },
  emerald: {
    spotlight: "radial-gradient(550px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(16, 185, 129, 0.18), rgba(20, 184, 166, 0.12), transparent 70%)",
    border: "radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(16, 185, 129, 0.8), rgba(20, 184, 166, 0.6), transparent 70%)",
    gradientFrom: "#10B981",
    gradientTo: "#14B8A6",
  },
  amber: {
    spotlight: "radial-gradient(550px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(245, 158, 11, 0.18), rgba(234, 88, 12, 0.12), transparent 70%)",
    border: "radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(245, 158, 11, 0.8), rgba(234, 88, 12, 0.6), transparent 70%)",
    gradientFrom: "#F59E0B",
    gradientTo: "#EA580C",
  },
  rose: {
    spotlight: "radial-gradient(550px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(244, 63, 94, 0.18), rgba(225, 29, 72, 0.12), transparent 70%)",
    border: "radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(244, 63, 94, 0.8), rgba(225, 29, 72, 0.6), transparent 70%)",
    gradientFrom: "#F43F5E",
    gradientTo: "#E11D48",
  },
  default: {
    spotlight: "radial-gradient(550px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(139, 92, 246, 0.18), rgba(6, 182, 212, 0.12), transparent 70%)",
    border: "radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(139, 92, 246, 0.8), rgba(6, 182, 212, 0.6), transparent 70%)",
    gradientFrom: "#8B5CF6",
    gradientTo: "#06B6D4",
  },
};

export function SpotlightCard({
  className,
  children,
  tone = "violet-cyan",
  spotlightColor,
  borderColor,
  enableSkewGradient = false,
  skewGradientFrom,
  skewGradientTo,
  ...props
}: SpotlightCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    containerRef.current.style.setProperty("--mouse-x", `${x}px`);
    containerRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  const toneConfig = TONE_COLORS[tone] || TONE_COLORS["violet-cyan"];
  const activeSpotlight = spotlightColor || toneConfig.spotlight;
  const activeBorder = borderColor || toneConfig.border;
  const fromColor = skewGradientFrom || toneConfig.gradientFrom;
  const toColor = skewGradientTo || toneConfig.gradientTo;

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden rounded-3xl border border-zinc-800 bg-[#060608] backdrop-blur-2xl transition-all duration-500 text-white group",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {/* Skewed Gradient Reflection Panels on Hover */}
      {enableSkewGradient && (
        <>
          <span
            className="pointer-events-none absolute top-0 left-[40px] w-1/2 h-full rounded-2xl transform skew-x-[14deg] opacity-0 group-hover:opacity-30 transition-all duration-700 group-hover:skew-x-0 group-hover:left-[15px] group-hover:w-[calc(100%-30px)] z-0"
            style={{
              background: `linear-gradient(315deg, ${fromColor}, ${toColor})`,
            }}
          />
          <span
            className="pointer-events-none absolute top-0 left-[40px] w-1/2 h-full rounded-2xl transform skew-x-[14deg] blur-[28px] opacity-0 group-hover:opacity-25 transition-all duration-700 group-hover:skew-x-0 group-hover:left-[15px] group-hover:w-[calc(100%-30px)] z-0"
            style={{
              background: `linear-gradient(315deg, ${fromColor}, ${toColor})`,
            }}
          />
        </>
      )}

      {/* Dynamic Cursor Ambient Spotlight Glow */}
      <div
        className="pointer-events-none absolute -inset-px rounded-3xl transition-opacity duration-300 z-0"
        style={{
          opacity: isHovered ? 1 : 0,
          background: activeSpotlight,
        }}
      />

      {/* Dynamic Cursor Border Illumination */}
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl transition-opacity duration-300 p-[1px] z-0"
        style={{
          opacity: isHovered ? 1 : 0,
          background: activeBorder,
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      {/* Card Content with z-index protection */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default SpotlightCard;
