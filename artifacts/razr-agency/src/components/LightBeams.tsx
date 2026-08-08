import { motion } from "framer-motion";

export default function LightBeams() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* vertical beam 1 */}
      <motion.div
        animate={{ opacity: [0.15, 0.45, 0.15], scaleY: [1, 1.1, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 left-1/4 w-px h-full origin-top bg-gradient-to-b from-primary via-primary/30 to-transparent blur-[1px]"
      />
      {/* vertical beam 2 */}
      <motion.div
        animate={{ opacity: [0.4, 0.1, 0.4], scaleY: [1.1, 1, 1.1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-0 right-1/3 w-px h-full origin-top bg-gradient-to-b from-emerald-500 via-emerald-500/20 to-transparent blur-[1px]"
      />
      {/* horizontal sweeping beam */}
      <motion.div
        animate={{ x: ["-100%", "200%"] }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/3 left-0 w-[40%] h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
      />
      <motion.div
        animate={{ x: ["200%", "-100%"] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute top-2/3 left-0 w-[35%] h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent"
      />
      {/* radial pulse */}
      <motion.div
        animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px]"
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-1/3 right-0 w-[400px] h-[400px] rounded-full bg-emerald-500/10 blur-[100px]"
      />
    </div>
  );
}
