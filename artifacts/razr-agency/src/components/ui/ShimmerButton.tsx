import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  shimmerColor?: string;
  glowColor?: string;
  asChild?: boolean;
}

export function ShimmerButton({
  children,
  className,
  onClick,
  disabled = false,
  ...props
}: ShimmerButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group relative inline-flex items-center justify-center overflow-hidden rounded-2xl p-[1.5px] font-black text-xs uppercase tracking-widest transition-all cursor-pointer shadow-[0_0_30px_rgba(139,92,246,0.35)] hover:shadow-[0_0_40px_rgba(6,182,212,0.5)]",
        className
      )}
      {...(props as any)}
    >
      {/* Dynamic Multi-Color Conic Spinning Border */}
      <span
        className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] opacity-100 transition-opacity"
        style={{
          background: `conic-gradient(from 90deg at 50% 50%, #8B5CF6 0%, #EC4899 20%, #F59E0B 40%, #10B981 60%, #06B6D4 80%, #8B5CF6 100%)`,
        }}
      />
      {/* Button Interior */}
      <span className="relative flex h-full w-full items-center justify-center gap-2 rounded-2xl bg-black px-6 py-3.5 text-white font-extrabold transition-all group-hover:bg-zinc-950">
        {children}
      </span>
    </motion.button>
  );
}
