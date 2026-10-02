import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlowingTiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  tiltAmount?: number;
  glareOpacity?: number;
  perspective?: number;
  glowColor?: string;
}

export function GlowingTiltCard({
  children,
  className,
  tiltAmount = 6,
  glareOpacity = 0.2,
  perspective = 1000,
  glowColor = "rgba(139, 92, 246, 0.35)",
  ...props
}: GlowingTiltCardProps) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glarePosition, setGlarePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const tiltX = ((y - centerY) / centerY) * -tiltAmount;
    const tiltY = ((centerX - x) / centerX) * -tiltAmount;

    setTilt({ x: tiltX, y: tiltY });
    setGlarePosition({ x, y });
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        "relative overflow-hidden rounded-2xl md:rounded-3xl border border-zinc-800/90 bg-[#060608] backdrop-blur-2xl text-white shadow-2xl",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: `${perspective}px`,
        transformStyle: "preserve-3d",
      }}
      animate={{
        rotateX: tilt.x,
        rotateY: tilt.y,
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30,
      }}
      {...(props as any)}
    >
      {/* Glare effect */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl md:rounded-3xl transition-opacity duration-300 z-20"
        style={{
          opacity: isHovered ? glareOpacity : 0,
          background: `radial-gradient(450px circle at ${glarePosition.x}px ${glarePosition.y}px, ${glowColor}, transparent 65%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

export default GlowingTiltCard;
