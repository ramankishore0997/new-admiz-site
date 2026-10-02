import { motion } from "framer-motion";
import { Quote, Rocket, BarChart3, Trophy, ArrowUpRight } from "lucide-react";
import { buildWaLink } from "@/lib/whatsapp";
import SpotlightCard from "@/components/ui/SpotlightCard";

const STAGES = [
  {
    Icon: Rocket,
    when: "Week 1",
    title: "Activation",
    body: "Onboarded onto two agency BMs. First campaigns live within 4 hours. No warmup, $2k/day from day one.",
    metrics: [{ k: "Daily spend", v: "$2,000" }, { k: "ROAS", v: "2.4x" }],
    tone: "purple",
    color: "from-violet-400 to-indigo-300",
  },
  {
    Icon: BarChart3,
    when: "Month 2",
    title: "Vertical scaling",
    body: "Winners scaled aggressively. Pixel learning compressed by pre-warmed account history. Zero restrictions.",
    metrics: [{ k: "Daily spend", v: "$18,500" }, { k: "ROAS", v: "3.8x" }],
    tone: "cyan",
    color: "from-cyan-300 to-teal-300",
  },
  {
    Icon: Trophy,
    when: "Month 6",
    title: "Enterprise scale",
    body: "BFCM peak hit cleanly. Account survived 14× spend jump without throttling. Lifetime replacement never triggered.",
    metrics: [{ k: "Daily spend", v: "$52,000" }, { k: "ROAS", v: "4.6x" }],
    tone: "neon",
    color: "from-emerald-300 to-cyan-300",
  },
];

export default function CaseStudyTimeline() {
  return (
    <section className="py-20 relative z-10 overflow-hidden bg-black text-white">
      <div className="container mx-auto px-4 max-w-7xl relative">
        <div className="text-center mb-16">
          <div className="text-[10px] font-black uppercase tracking-[0.25em] bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent mb-3">Case Study · UK D2C Skincare Brand</div>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.95] mb-5 text-white">
            $2k to $52k/day in <br />
            <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">6 months.</span>
          </h2>
          <p className="text-lg text-zinc-300 max-w-2xl mx-auto">
            Same offer. Same creative. <span className="text-cyan-300 font-bold">Different infrastructure.</span> Here's how the curve looked for one of our UK clients.
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* multi-color connector line */}
          <div className="hidden md:block absolute top-20 left-[16%] right-[16%] h-px bg-gradient-to-r from-violet-600 via-cyan-400 to-emerald-400 opacity-50" />

          {STAGES.map((s, i) => {
            const Icon = s.Icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="relative h-full"
              >
                <SpotlightCard tone={s.tone as any} className="p-7 h-full flex flex-col justify-between bg-[#060608] border-zinc-800">
                  <div>
                    {/* timeline dot */}
                    <div className="relative w-14 h-14 mx-auto mb-6 rounded-2xl border border-violet-500/40 bg-zinc-950 flex items-center justify-center shadow-lg shadow-violet-500/20">
                      <Icon className="w-6 h-6 text-cyan-300" />
                    </div>
                    <div className="text-center">
                      <div className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-400 mb-2">{s.when}</div>
                      <h3 className="text-2xl font-black uppercase tracking-tight mb-3 text-white">{s.title}</h3>
                      <p className="text-sm text-zinc-300 leading-relaxed mb-6">{s.body}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-5 border-t border-zinc-800">
                    {s.metrics.map((m, j) => (
                      <div key={j} className="text-center">
                        <div className={`text-lg font-black tabular-nums bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}>{m.v}</div>
                        <div className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold mt-1">{m.k}</div>
                      </div>
                    ))}
                  </div>
                </SpotlightCard>
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
          <div className="relative rounded-3xl border border-zinc-800 bg-[#060608] shadow-2xl p-8 md:p-10 overflow-hidden">
            <Quote className="w-10 h-10 text-cyan-400 mb-5 opacity-70" />
            <blockquote className="text-xl md:text-2xl font-light text-zinc-200 leading-relaxed mb-6 italic">
              "We were stuck at $2k/day for 6 months on our self-serve BM. Switched to <span className="bg-gradient-to-r from-violet-300 via-cyan-300 to-emerald-300 bg-clip-text text-transparent font-bold not-italic">Razr</span>, hit $50k/day in under 6 months. Same product, same ad team. The infrastructure was the entire problem."
            </blockquote>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white font-black shadow-md">R</div>
                <div>
                  <div className="text-sm font-bold text-white">Rohan M.</div>
                  <div className="text-xs text-zinc-400">Founder · UK D2C Skincare ($8M ARR)</div>
                </div>
              </div>
              <a href={buildWaLink("case-study", { caseName: "UK D2C Skincare ($8M ARR)", source: "case-study-timeline" })} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-cyan-300 hover:text-white transition-colors">
                Get the same setup <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
