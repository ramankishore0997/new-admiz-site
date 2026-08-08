import { motion } from "framer-motion";

export default function FloatingOrbs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Orb 1: Primary Blue */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -100, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-[120px]"
      />
      {/* Orb 2: Indigo */}
      <motion.div
        animate={{
          x: [0, -100, 0],
          y: [0, 100, 0],
          scale: [1, 1.5, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[150px]"
      />
      {/* Orb 3: Deep Teal */}
      <motion.div
        animate={{
          x: [0, 50, -50, 0],
          y: [0, 50, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[100px]"
      />
    </div>
  );
}
