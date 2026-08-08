import { motion } from "framer-motion";
import { Quote, Rocket, BarChart3, Trophy, ArrowUpRight } from "lucide-react";
import { buildWaLink } from "@/lib/whatsapp";

const STAGES = [
  {
    Icon: Rocket,
    when: "Week 1",
    title: "Activation",
    body: "Onboarded onto two agency BMs. First campaigns live within 4 hours. No warmup, $2k/day from day one.",
    metrics: [{ k: "Daily spend", v: "$2,000" }, { k: "ROAS", v: "2.4x" }],
    accent: "from-primary/40 to-emerald-500/20",
  },
  {
    Icon: BarChart3,
    when: "Month 2",
    title: "Vertical scaling",
    body: "Winners scaled aggressively. Pixel learning compressed by pre-warmed account history. Zero restrictions.",
    metrics: [{ k: "Daily spend", v: "$18,500" }, { k: "ROAS", v: "3.8x" }],
    accent: "from-amber-500/40 to-orange-500/20",
  },
  {
    Icon: Trophy,
    when: "Month 6",
    title: "Enterprise scale",
    body: "BFCM peak hit cleanly. Account survived 14× spend jump without throttling. Lifetime replacement never triggered.",
    metrics: [{ k: "Daily spend", v: "$52,000" }, { k: "ROAS", v: "4.6x" }],
    accent: "from-emerald-500/40 to-teal-500/20",
  },
];

export default function CaseStudyTimeline() {
  return (
    <section className="py-20 relative z-10 overflow-hidden">
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-500/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative">
        <div className="text-center mb-16">
          <div className="text-[10px] font-black uppercase tracking-[0.25em] text-primary mb-3">Case Study · Hong Kong D2C Skincare Brand</div>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.95] mb-5">
            $2k to $52k/day in <br />
            <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">6 months.</span>
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Same offer. Same creative. Different infrastructure. Here's how the curve looked for one of our Hong Kong clients.
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* connector line */}
          <div className="hidden md:block absolute top-20 left-[16%] right-[16%] h-px bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500 opacity-30" />

          {STAGES.map((s, i) => {
            const Icon = s.Icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="relative group"
              >
                <div className={`absolute -inset-0.5 bg-gradient-to-br ${s.accent} rounded-3xl blur opacity-0 group-hover:opacity-80 transition-opacity duration-500`} />
                <div className="card-premium tap-spring relative rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60 p-7 h-full">
                  {/* timeline dot */}
                  <div className="relative w-14 h-14 mx-auto mb-6 rounded-full border-2 border-primary bg-background flex items-center justify-center shadow-lg shadow-emerald-100">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] font-black uppercase tracking-[0.25em] text-primary mb-2">{s.when}</div>
                    <h3 className="text-2xl font-black uppercase tracking-tight mb-3">{s.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed mb-6">{s.body}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-5 border-t border-slate-200">
                    {s.metrics.map((m, j) => (
                      <div key={j} className="text-center">
                        <div className="text-lg font-black text-slate-900 tabular-nums">{m.v}</div>
                        <div className="text-[9px] uppercase tracking-wider text-slate-500 font-bold mt-1">{m.k}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Quote card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="relative mt-12 max-w-4xl mx-auto"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-teal-500/15 to-emerald-500/20 rounded-3xl blur-xl opacity-50" />
          <div className="relative rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 p-8 md:p-10 overflow-hidden">
            <motion.div animate={{ x: ["-100%", "200%"] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} className="absolute top-0 left-0 w-1/3 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
            <Quote className="w-10 h-10 text-primary mb-5 opacity-60" />
            <blockquote className="text-xl md:text-2xl font-light text-slate-900 leading-relaxed mb-6 italic">
              "We were stuck at $2k/day for 6 months on our self-serve BM. Switched to Razr, hit $50k/day in under 6 months. Same product, same ad team. The infrastructure was the entire problem."
            </blockquote>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white font-black">R</div>
                <div>
                  <div className="text-sm font-bold text-slate-900">Rohan M.</div>
                  <div className="text-xs text-slate-500">Founder · Hong Kong D2C Skincare ($8M ARR)</div>
                </div>
              </div>
              <a href={buildWaLink("case-study", { caseName: "Hong Kong D2C Skincare ($8M ARR)", source: "case-study-timeline" })} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:text-emerald-700 transition-colors">
                Get the same setup <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
