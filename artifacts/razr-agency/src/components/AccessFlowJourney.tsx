import { motion } from "framer-motion";
import { Send, FileSearch, Rocket, TrendingUp } from "lucide-react";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

const STEPS = [
  {
    n: "01",
    icon: Send,
    title: "Request",
    desc: "Tell us your spend, vertical, and targets on Telegram. Takes 3 minutes — no paperwork.",
    time: "Step 1 • 3 min",
    color: "from-violet-600 via-indigo-600 to-purple-500",
    tone: "purple",
    glow: "text-violet-300",
  },
  {
    n: "02",
    icon: FileSearch,
    title: "Review",
    desc: "Instant compliance match. We assign the optimal Tier-1 agency BM for your vertical.",
    time: "Step 2 • Under 1 hr",
    color: "from-cyan-500 via-teal-500 to-blue-500",
    tone: "cyan",
    glow: "text-cyan-300",
  },
  {
    n: "03",
    icon: Rocket,
    title: "Activation",
    desc: "BM connected, billing set, team access granted, replacement guarantee active. Launch-ready.",
    time: "Step 3 • Same day",
    color: "from-pink-500 via-rose-500 to-amber-500",
    tone: "sunset",
    glow: "text-pink-300",
  },
  {
    n: "04",
    icon: TrendingUp,
    title: "Scale",
    desc: "Uncapped daily spend, dedicated manager on standby, lifetime account replacement. Run.",
    time: "Step 4 • Continuous",
    color: "from-emerald-400 via-teal-500 to-cyan-500",
    tone: "neon",
    glow: "text-emerald-300",
  },
];

export default function AccessFlowJourney() {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-black text-white border-y border-zinc-900">
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-14 md:mb-20"
        >
          <div className="text-[10px] font-black uppercase tracking-[0.25em] bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent mb-3 font-mono">Access Flow</div>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.95] text-white mb-4">
            From request to <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">live spend.</span>
          </h2>
          <p className="text-base md:text-lg text-zinc-300 leading-relaxed">
            Most clients are running campaigns within <span className="text-cyan-300 font-bold">2–4 hours</span> of first contact. Here's the exact path.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6, delay: i * 0.12 }}
                  className="h-full"
                >
                  <SpotlightCard
                    tone={step.tone as any}
                    enableSkewGradient={true}
                    className="h-full p-6 bg-[#060608] border-zinc-800 flex flex-col justify-between"
                  >
                    <div>
                      {/* Icon orb */}
                      <div className="relative mb-5 flex items-center justify-between">
                        <div className={`w-13 h-13 rounded-2xl bg-gradient-to-br ${step.color} p-3.5 flex items-center justify-center text-white shadow-lg`}>
                          <Icon className="w-6 h-6 text-white stroke-[2.5]" />
                        </div>
                        {/* Step number floating */}
                        <div className="px-2.5 py-0.5 rounded-full border border-zinc-700 bg-zinc-900 text-[10px] font-mono font-black tracking-wider text-cyan-300 shadow-sm">
                          {step.n}
                        </div>
                      </div>

                      <div className={`text-[10px] font-mono font-bold uppercase tracking-[0.2em] ${step.glow} mb-1.5`}>{step.time}</div>
                      <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white mb-2">{step.title}</h3>
                      <p className="text-sm text-zinc-400 leading-relaxed">{step.desc}</p>
                    </div>
                  </SpotlightCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
