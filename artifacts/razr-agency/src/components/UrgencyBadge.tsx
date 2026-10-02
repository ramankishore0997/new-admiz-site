import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Flame, Clock } from "lucide-react";

const TOTAL_SLOTS = 12;

function computeSlotsLeft(): number {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  const base = [8, 9, 6, 4, 3, 2, 1][day] ?? 5;
  const decay = hour >= 18 ? 1 : 0;
  return Math.max(1, base - decay);
}

export default function UrgencyBadge({ className = "" }: { className?: string }) {
  const [slotsLeft, setSlotsLeft] = useState(() => computeSlotsLeft());

  useEffect(() => {
    const id = setInterval(() => setSlotsLeft(computeSlotsLeft()), 90_000);
    return () => clearInterval(id);
  }, []);

  const filled = TOTAL_SLOTS - slotsLeft;
  const pct = (filled / TOTAL_SLOTS) * 100;
  const critical = slotsLeft <= 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className={`relative inline-flex flex-col gap-3 px-5 py-4 rounded-2xl border border-zinc-800 bg-[#060608] backdrop-blur-xl max-w-md ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className={`relative w-9 h-9 rounded-xl flex items-center justify-center ${
          critical ? "bg-pink-500/10 border border-pink-500/30 text-pink-400" : "bg-cyan-500/10 border border-cyan-500/30 text-cyan-400"
        }`}>
          <Flame className="w-4 h-4" />
          <span className={`absolute inset-0 rounded-xl ${critical ? "bg-pink-400/20" : "bg-cyan-400/20"} animate-ping opacity-60`} style={{ animationDuration: "2.4s" }} />
        </div>

        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <span className={`text-lg md:text-xl font-black tabular-nums bg-gradient-to-r ${critical ? "from-pink-400 to-amber-400" : "from-violet-400 to-cyan-400"} bg-clip-text text-transparent`}>{slotsLeft}</span>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-200">
              {slotsLeft === 1 ? "slot" : "slots"} left this week
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Clock className="w-3 h-3 text-zinc-500" />
            <span className="text-[10px] uppercase tracking-wider text-zinc-400">Onboarding closes Sunday 11:59 PM GMT</span>
          </div>
        </div>
      </div>

      <div className="relative w-full h-1.5 rounded-full bg-zinc-900 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full rounded-full bg-gradient-to-r ${critical ? "from-pink-500 via-rose-500 to-amber-500" : "from-violet-500 via-cyan-400 to-emerald-400"}`}
        />
      </div>
    </motion.div>
  );
}
