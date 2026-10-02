import { motion } from "framer-motion";
import { X, Check, AlertTriangle, ShieldCheck } from "lucide-react";
import { buildWaLink } from "@/lib/whatsapp";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { ShimmerButton } from "@/components/ui/ShimmerButton";

const PAINS = [
  {
    title: "$500/day spending cap",
    body: "Fresh BMs and personal ad accounts strangle scaling. Every breakthrough creative dies in the warm-up phase.",
  },
  {
    title: "Random account bans",
    body: "Wake up to a disabled BM, frozen balance, and a 14-day appeal that comes back denied. No recovery, no replacement.",
  },
  {
    title: "Slow, scripted support",
    body: "Tier-1 reps reading from a help center. 48-hour reply times. Issues escalate to nobody. You're alone with the loss.",
  },
  {
    title: "No agency-grade trust",
    body: "Limited audience reach, weaker delivery, capped optimization windows. You're playing the game on hard mode.",
  },
];

const GAINS = [
  {
    title: "Uncapped daily spend",
    body: "Agency BMs with $50k+ daily limits from day one. Scale winning creatives without artificial walls or warm-up rituals.",
  },
  {
    title: "Lifetime replacement",
    body: "If a Lifetime Access account dies without policy violation, balance and access transfer instantly to a fresh asset. Zero downtime.",
  },
  {
    title: "24/7 dedicated managers",
    body: "Real humans on Telegram. Median 12-minute response. Direct escalation to Meta & Google internal contacts.",
  },
  {
    title: "Premium trust signals",
    body: "Tier-1 agency network. Higher delivery priority, wider audiences, faster learning phase. Win the auction before the click.",
  },
];

export default function ProblemSolution() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden bg-black text-white border-y border-zinc-900">
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-14 md:mb-20"
        >
          <div className="text-[10px] font-black uppercase tracking-[0.25em] bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent mb-3">The Difference</div>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.95] text-white mb-5">
            Stop fighting <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(6,182,212,0.3)]">
              the platform.
            </span>
          </h2>
          <p className="text-base md:text-xl text-zinc-300 leading-relaxed">
            Every advertiser hits the same walls. We built Razr to remove them — <span className="text-cyan-300 font-bold">permanently.</span>
          </p>
        </motion.div>

        {/* Comparison Grid */}
        <div className="grid md:grid-cols-2 gap-5 md:gap-8 max-w-6xl mx-auto">
          {/* WITHOUT RAZR */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="h-full"
          >
            <SpotlightCard
              tone="sunset"
              enableSkewGradient={true}
              className="h-full p-6 md:p-8 bg-[#080508] border-zinc-800"
            >
              <div className="relative">
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-rose-900/30">
                  <div className="w-10 h-10 rounded-xl bg-rose-950/60 border border-rose-800/40 flex items-center justify-center text-rose-400 shadow-md">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-400">Status Quo</div>
                    <div className="text-xl md:text-2xl font-black uppercase tracking-tight text-white">Without Razr</div>
                  </div>
                </div>

                <div className="space-y-5">
                  {PAINS.map((p, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="shrink-0 w-6 h-6 rounded-full bg-rose-950/80 border border-rose-700/50 flex items-center justify-center mt-0.5">
                        <X className="w-3.5 h-3.5 text-rose-400" strokeWidth={3} />
                      </div>
                      <div>
                        <div className="font-bold text-white mb-1">{p.title}</div>
                        <div className="text-sm text-zinc-400 leading-relaxed">{p.body}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </SpotlightCard>
          </motion.div>

          {/* WITH RAZR */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="h-full"
          >
            <SpotlightCard
              tone="aurora"
              enableSkewGradient={true}
              className="h-full p-6 md:p-8 bg-[#060608] border-zinc-800 shadow-2xl"
            >
              <div className="relative">
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-cyan-900/30">
                  <div className="w-10 h-10 rounded-xl bg-violet-950/60 border border-violet-700/40 flex items-center justify-center text-cyan-300 shadow-md">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent">The Upgrade</div>
                    <div className="text-xl md:text-2xl font-black uppercase tracking-tight bg-gradient-to-r from-violet-300 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">With Razr</div>
                  </div>
                </div>

                <div className="space-y-5">
                  {GAINS.map((g, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="shrink-0 w-6 h-6 rounded-full bg-violet-950/80 border border-violet-500/50 flex items-center justify-center mt-0.5">
                        <Check className="w-3.5 h-3.5 text-cyan-300" strokeWidth={3} />
                      </div>
                      <div>
                        <div className="font-bold text-white mb-1">{g.title}</div>
                        <div className="text-sm text-zinc-300 leading-relaxed">{g.body}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </SpotlightCard>
          </motion.div>
        </div>

        {/* CTA strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-center mt-12 md:mt-16 flex flex-col items-center"
        >
          <a
            href={buildWaLink("setup-access", { source: "problem-solution" })}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ShimmerButton>
              <span>Get Agency Access Now</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            </ShimmerButton>
          </a>
          <div className="text-xs uppercase tracking-[0.2em] bg-gradient-to-r from-violet-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent mt-4 font-bold">
            Zero hidden fees • 1-hour fast activation
          </div>
        </motion.div>
      </div>
    </section>
  );
}
