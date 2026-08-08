import { motion } from "framer-motion";
import RobotMascot from "@/components/RobotMascot";

export default function HeroRobot() {
  return (
    <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
      {/* orbiting rings */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute w-[420px] h-[420px] md:w-[520px] md:h-[520px] rounded-full border border-primary/15"
      >
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary shadow-[0_0_12px_rgba(5,150,105,0.5)]" />
      </motion.div>
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute w-[320px] h-[320px] md:w-[400px] md:h-[400px] rounded-full border border-emerald-500/15"
      >
        <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(5,150,105,0.5)]" />
      </motion.div>

      {/* soft halo behind robot */}
      <div
        aria-hidden
        className="absolute w-[260px] h-[260px] md:w-[320px] md:h-[320px] rounded-full motion-reduce:hidden"
        style={{
          background: "radial-gradient(closest-side, rgba(5,150,105,0.22), transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* robot — gentle float */}
      <div className="relative pointer-events-auto float-soft">
        <RobotMascot />
      </div>
    </div>
  );
}
