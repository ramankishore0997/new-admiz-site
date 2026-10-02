import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MouseGlowProps {
  color?: string;
  size?: number;
  blur?: number;
  opacity?: number;
  followSpeed?: number;
  zIndex?: number;
  disabled?: boolean;
}

export function MouseGlow({
  color = "rgba(16, 185, 129, 0.08)", // subtle luxury emerald glow
  size = 500,
  blur = 120,
  opacity = 0.6,
  followSpeed = 0.12,
  zIndex = 0,
  disabled = false,
}: MouseGlowProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const lastMousePosition = useRef({ x: 0, y: 0 });
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    if (disabled) {
      setIsVisible(false);
      return;
    }

    // Don't show cursor glow on touch-only devices
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const updateMousePosition = (e: MouseEvent) => {
      lastMousePosition.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const smoothlyUpdatePosition = () => {
      if (!isVisible) return;
      const newX = mousePosition.x + (lastMousePosition.current.x - mousePosition.x) * followSpeed;
      const newY = mousePosition.y + (lastMousePosition.current.y - mousePosition.y) * followSpeed;
      setMousePosition({ x: newX, y: newY });
      animationFrameId.current = requestAnimationFrame(smoothlyUpdatePosition);
    };

    window.addEventListener("mousemove", updateMousePosition, { passive: true });
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    animationFrameId.current = requestAnimationFrame(smoothlyUpdatePosition);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isVisible, followSpeed, disabled, mousePosition]);

  return (
    <AnimatePresence>
      {isVisible && !disabled && (
        <motion.div
          className="fixed pointer-events-none overflow-hidden inset-0 select-none"
          style={{ zIndex }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              backgroundColor: color,
              width: size,
              height: size,
              filter: `blur(${blur}px)`,
              opacity,
              transform: `translate3d(${mousePosition.x - size / 2}px, ${mousePosition.y - size / 2}px, 0)`,
              willChange: "transform",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
