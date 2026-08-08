import { motion } from "framer-motion";
import { X, Check, AlertTriangle, ShieldCheck } from "lucide-react";
import { buildWaLink } from "@/lib/whatsapp";

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
    <section className="relative py-20 md:py-32 overflow-hidden bg-slate-50 border-y border-slate-200">
      {/* background glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-red-100/60 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/[0.10] rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-14 md:mb-20"
        >
          <div className="text-[10px] font-black uppercase tracking-[0.25em] text-primary mb-3">The Difference</div>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.95] mb-5">
            Stop fighting <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">the platform.</span>
          </h2>
          <p className="text-base md:text-xl text-slate-600 leading-relaxed">
            Every advertiser hits the same walls. We built Razr to remove them — permanently.
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
            className="relative p-6 md:p-8 rounded-2xl border border-red-200 bg-white shadow-lg shadow-red-100/60 overflow-hidden"
          >
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-red-100/70 rounded-full blur-3xl pointer-events-none" />

            <div className="relative">
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-red-100">
                <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600/80">Status Quo</div>
                  <div className="text-xl md:text-2xl font-black uppercase tracking-tight">Without Razr</div>
                </div>
              </div>

              <div className="space-y-5">
                {PAINS.map((p, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="shrink-0 w-6 h-6 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mt-0.5">
                      <X className="w-3.5 h-3.5 text-red-600" strokeWidth={3} />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 mb-1">{p.title}</div>
                      <div className="text-sm text-slate-500 leading-relaxed">{p.body}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* WITH RAZR */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative p-6 md:p-8 rounded-2xl border border-primary/30 bg-gradient-to-br from-emerald-50/80 via-white to-white overflow-hidden shadow-xl shadow-emerald-100/50"
          >
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative">
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-primary/20">
                <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/40 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/90">The Upgrade</div>
                  <div className="text-xl md:text-2xl font-black uppercase tracking-tight">With Razr</div>
                </div>
              </div>

              <div className="space-y-5">
                {GAINS.map((g, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="shrink-0 w-6 h-6 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center mt-0.5">
                      <Check className="w-3.5 h-3.5 text-primary" strokeWidth={3} />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 mb-1">{g.title}</div>
                      <div className="text-sm text-slate-600 leading-relaxed">{g.body}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* CTA strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-center mt-12 md:mt-16"
        >
          <a
            href={buildWaLink("setup-access", { source: "problem-solution" })}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-7 py-4 rounded-full bg-emerald-600 text-white font-bold uppercase tracking-wider text-sm hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/25"
          >
            Get Agency Access Now
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </a>
          <div className="text-xs uppercase tracking-[0.2em] text-slate-500 mt-4">No setup fee • 1-hour activation</div>
        </motion.div>
      </div>
    </section>
  );
}
