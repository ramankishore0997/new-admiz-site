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
      className={`pointer-events-none absolute -inset-[1px] rounded-[inherit] overflow-hidden z-0 ${className}`}
    >
      <div
        className="absolute inset-[-150%] will-change-transform"
        style={{
          background: `conic-gradient(from 0deg, transparent 0 290deg, ${colorFrom} 325deg, ${colorTo} 360deg)`,
          animation: `spin-laser ${duration}s linear infinite`,
        }}
      />
      <div className="absolute inset-[1.5px] rounded-[inherit] bg-[#07070a] z-0" />
    </div>
  );
}

export default BorderBeam;
