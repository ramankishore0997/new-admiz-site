import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function RobotMascot() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pupil, setPupil] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.min(Math.sqrt(dx * dx + dy * dy), 200);
      const angle = Math.atan2(dy, dx);
      const maxOffset = 2.2;
      const intensity = dist / 200;
      setPupil({
        x: Math.cos(angle) * maxOffset * intensity,
        y: Math.sin(angle) * maxOffset * intensity,
      });
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 140);
    }, 3800);
    return () => clearInterval(blinkInterval);
  }, []);

  return (
    <motion.div
      ref={containerRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      className="relative select-none"
      data-cursor="hover"
    >
      {/* glow halo */}
      <motion.div
        animate={{
          opacity: hovered ? 0.7 : 0.4,
          scale: hovered ? 1.15 : 1,
        }}
        transition={{ duration: 0.4 }}
        className="absolute inset-0 rounded-[2rem] blur-2xl bg-primary/20"
      />

      <div className="relative w-44 h-52 md:w-52 md:h-60">
        {/* Antenna */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-6 flex flex-col items-center">
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-primary shadow-[0_0_12px_rgba(5,150,105,0.5)]"
          />
          <div className="w-px h-5 bg-gradient-to-b from-primary/80 to-transparent" />
        </div>

        {/* Head */}
        <div className="absolute inset-x-2 top-2 h-32 md:h-36 rounded-[2rem] bg-gradient-to-b from-slate-100 to-slate-200 border border-slate-300 shadow-lg shadow-slate-200/60 overflow-hidden">
          {/* Screen face */}
          <div className="absolute inset-3 rounded-[1.5rem] bg-white border border-slate-200 flex items-center justify-center overflow-hidden">
            {/* Scan line */}
            <motion.div
              animate={{ y: ["-100%", "100%"] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
              className="absolute inset-x-0 h-8 bg-gradient-to-b from-transparent via-primary/10 to-transparent"
            />

            {/* Eyes */}
            <div className="flex gap-5 items-center relative z-10">
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className="relative w-7 h-7 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center"
                >
                  <motion.div
                    animate={{
                      x: pupil.x,
                      y: pupil.y,
                      scaleY: blink ? 0.08 : 1,
                    }}
                    transition={{
                      x: { duration: 0.15 },
                      y: { duration: 0.15 },
                      scaleY: { duration: 0.07 },
                    }}
                    className="w-3 h-3 rounded-full bg-primary shadow-[0_0_8px_rgba(5,150,105,0.5)]"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Corner LEDs */}
          <div className="absolute top-2 right-2 w-1 h-1 rounded-full bg-primary" />
          <div className="absolute top-2 left-2 w-1 h-1 rounded-full bg-primary/40" />
        </div>

        {/* Neck */}
        <div className="absolute left-1/2 -translate-x-1/2 top-[8.5rem] md:top-[9.5rem] w-3 h-3 bg-primary/30 rounded-sm" />

        {/* Body */}
        <div className="absolute inset-x-6 bottom-0 h-16 md:h-20 rounded-2xl bg-gradient-to-b from-slate-100 to-slate-200 border border-slate-300 shadow-lg shadow-slate-200/60 flex items-center justify-center">
          <div className="flex flex-col gap-1.5 items-center">
            {/* Chest indicator */}
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{
                    duration: 1.4,
                    delay: i * 0.2,
                    repeat: Infinity,
                  }}
                  className="w-1 h-2.5 rounded-full bg-primary"
                />
              ))}
            </div>
            <div className="w-12 h-px bg-primary/30" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
