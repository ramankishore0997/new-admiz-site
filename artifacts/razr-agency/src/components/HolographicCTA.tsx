import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { buildWaLink } from "@/lib/whatsapp";
import AnimatedGradientBackground from "@/components/ui/animated-gradient-background";

export default function HolographicCTA() {
  return (
    <section className="py-16 relative z-10 overflow-hidden bg-black text-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="relative rounded-[2.5rem] p-[1.5px] overflow-hidden group">
          {/* animated multi-color gradient border */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,#8B5CF6_0deg,#EC4899_90deg,#F59E0B_180deg,#10B981_270deg,#06B6D4_360deg)] opacity-75 group-hover:opacity-100 transition-opacity"
          />

          <div className="relative rounded-[2.4rem] bg-[#060608] border border-zinc-800 overflow-hidden shadow-2xl backdrop-blur-2xl">
            {/* Animated Gradient Inside Card */}
            <AnimatedGradientBackground
              Breathing={true}
              animationSpeed={0.015}
              breathingRange={6}
              startingGap={100}
              gradientColors={[
                "#060608",
                "#2e1065",
                "#0c4a6e",
                "#064e3b",
                "#4a044e",
                "#060608",
                "#000000"
              ]}
              gradientStops={[30, 50, 65, 78, 88, 96, 100]}
              containerClassName="opacity-60 pointer-events-none"
            />
            {/* moving light bars */}
            <motion.div
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 left-0 w-[40%] h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
            />
            <motion.div
              animate={{ x: ["100%", "-100%"] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute bottom-0 right-0 w-[40%] h-px bg-gradient-to-r from-transparent via-violet-400 to-transparent"
            />

            <div className="relative p-7 sm:p-10 md:p-20 lg:p-28 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/30 bg-violet-950/40 backdrop-blur mb-5 md:mb-8 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-[10px] font-black tracking-[0.2em] bg-gradient-to-r from-violet-300 via-cyan-300 to-emerald-300 bg-clip-text text-transparent uppercase">Premium Infrastructure</span>
                </div>
                <h2 className="text-[2.25rem] sm:text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-5 md:mb-6 text-white">
                  Stop settling.<br />
                  <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(6,182,212,0.4)]">
                    Start scaling.
                  </span>
                </h2>
                <p className="text-base md:text-lg text-zinc-300 max-w-md leading-relaxed">
                  Join 500+ advertisers running uncapped budgets on agency-tier Meta &amp; Google accounts.
                </p>
              </div>

              <div className="shrink-0 flex flex-col gap-3 md:gap-4 w-full md:w-auto">
                <a
                  href={buildWaLink("general", { source: "final-cta" })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/btn relative inline-flex items-center justify-center gap-3 px-8 md:px-10 py-4 md:py-5 rounded-full bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white font-black text-sm uppercase tracking-widest overflow-hidden hover:opacity-95 transition-all duration-300 shadow-[0_0_30px_rgba(139,92,246,0.35)]"
                >
                  <span className="relative">Chat on Telegram</span>
                  <ArrowRight className="relative w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 md:px-10 py-4 md:py-5 rounded-full border border-zinc-800 bg-zinc-900 text-white font-black text-sm uppercase tracking-widest hover:border-violet-500 hover:text-cyan-300 transition-all"
                >
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
