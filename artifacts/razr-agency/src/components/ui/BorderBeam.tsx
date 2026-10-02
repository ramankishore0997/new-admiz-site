import React from "react";

interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  colorFrom?: string;
  colorTo?: string;
}

export function BorderBeam({
  className = "",
  duration = 6,
  colorFrom = "#8B5CF6",
  colorTo = "#06B6D4",
}: BorderBeamProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute -inset-[1px] rounded-[inherit] p-[1.5px] overflow-hidden z-0 ${className}`}
      style={{
        WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
      }}
    >
      <div
        className="absolute inset-[-150%] will-change-transform"
        style={{
          background: `conic-gradient(from 0deg, transparent 0 310deg, ${colorFrom} 335deg, ${colorTo} 360deg)`,
          animation: `spin-laser ${duration}s linear infinite`,
        }}
      />
    </div>
  );
}

export default BorderBeam;
