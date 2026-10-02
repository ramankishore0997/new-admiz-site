import PageWrapper from "@/components/layout/PageWrapper";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Sparkles, MessageCircle, Eye, Zap, Rocket, ArrowRight, CheckCircle2 } from "lucide-react";
import SpotlightCard from "@/components/ui/SpotlightCard";

const STEPS = [
  {
    step: "01",
    icon: MessageCircle,
    title: "Initial Contact & Vetting",
    desc: "Reach out via Telegram. We respond within minutes. Brief review of your vertical and spend goals to confirm fit.",
    bullets: ["Share your niche / vertical", "Discuss target daily spend", "Confirm policy compliance"],
    tone: "aurora" as const,
    duration: "5–15 min",
    color: "from-violet-400 to-indigo-300",
  },
  {
    step: "02",
    icon: Eye,
    title: "Transparent Review",
    desc: "Before you pay a dime, we show you the exact account you'll receive. Full transparency on history, BM structure, and limit tiers.",
    bullets: ["Live screen-share or screenshots", "Validate BM structure", "Confirm billing setup"],
    tone: "cyan" as const,
    duration: "30 min",
    color: "from-cyan-300 to-teal-300",
  },
  {
    step: "03",
    icon: Zap,
    title: "Activation & Provisioning",
    desc: "Once confirmed, we handle the technical heavy lifting. Account assigned to your Business Manager with proper roles and access.",
    bullets: ["Admin access granted", "Pixel / domain connections", "Backup admins assigned"],
    tone: "neon" as const,
    duration: "1 hour",
    color: "from-emerald-300 to-cyan-300",
  },
  {
    step: "04",
    icon: Rocket,
    title: "Launch & Scale",
    desc: "Your account is live. Launch your campaigns. Our team monitors the critical first 48 hours to ensure zero friction.",
    bullets: ["Publish first campaigns", "Monitor initial spend", "Gradual limit scaling"],
    tone: "sunset" as const,
    duration: "Ongoing",
    color: "from-pink-400 to-amber-300",
  },
];

export default function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start center", "end center"] });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <PageWrapper>
      {/* Hero */}
      <section className="pt-28 pb-12 relative bg-black text-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-violet-500/30 bg-[#0A0515] backdrop-blur mb-6 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[10px] font-black tracking-[0.2em] bg-gradient-to-r from-violet-300 via-cyan-300 to-emerald-300 bg-clip-text text-transparent uppercase">The Process</span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-6 text-white">
              From first message <br />
              <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(6,182,212,0.4)]">to live campaigns.</span>
            </h1>
            <p className="text-lg text-zinc-300 max-w-2xl mx-auto">
              Four steps. <span className="text-cyan-300 font-bold">Same-day activation.</span> No paperwork, no friction.
            </p>

            {/* Progress chips */}
            <div className="flex flex-wrap justify-center gap-2.5 mt-10">
              {STEPS.map((s, i) => (
                <div key={i} className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-zinc-800 bg-[#060608] text-[10px] font-black uppercase tracking-wider text-zinc-300">
                  <span className="text-cyan-400">{s.step}</span>
                  <span>{s.duration}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Roadmap */}
      <section ref={containerRef} className="py-16 relative bg-black text-white border-y border-zinc-900">
        <div className="container mx-auto px-4 max-w-5xl relative">
          {/* Vertical glow line */}
          <div className="absolute left-6 md:left-12 top-0 bottom-0 w-px bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              style={{ height: lineHeight }}
              className="absolute top-0 left-0 right-0 bg-gradient-to-b from-violet-500 via-cyan-400 to-emerald-400 shadow-[0_0_20px_rgba(6,182,212,0.8)]"
            />
          </div>

          <div className="flex flex-col gap-16">
            {STEPS.map((step, i) => (
              <StepCard key={i} step={step} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 relative bg-black text-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="relative group">
            <div className="relative rounded-3xl border border-zinc-800 bg-[#060608] shadow-2xl p-10 md:p-14 text-center overflow-hidden">
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4 text-white">
                Ready to start <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">step 01?</span>
              </h2>
              <p className="text-zinc-400 mb-8 max-w-xl mx-auto">Send us a message and we'll have your scaling plan ready before you finish your coffee.</p>
              <a
                href="https://t.me/RazrMarketing"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white font-black text-sm uppercase tracking-widest hover:opacity-95 transition-all shadow-xl shadow-violet-600/30"
              >
                Begin Onboarding
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}

function StepCard({ step, index }: { step: (typeof STEPS)[number]; index: number }) {
  const Icon = step.icon;
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ margin: "-100px", once: true }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative pl-10 md:pl-28"
    >
      {/* Node on timeline */}
      <div className="absolute left-0 md:left-9 top-6 z-10">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-cyan-500 blur-md scale-150 opacity-80" />
          <div className="relative w-7 h-7 rounded-full bg-black border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.6)]">
            <div className="w-2 h-2 rounded-full bg-cyan-400" />
          </div>
        </div>
      </div>

      {/* Card */}
      <div className={`${isEven ? "" : "md:ml-auto md:max-w-[92%]"}`}>
        <SpotlightCard tone={step.tone} className="p-6 md:p-10 bg-[#060608] border-zinc-800">
          <div className="flex items-start justify-between mb-6 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl border border-violet-500/30 bg-violet-950/40 backdrop-blur flex items-center justify-center shrink-0">
                <Icon className="w-6 h-6 text-cyan-300" />
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent mb-1">Step {step.step}</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">{step.duration}</div>
              </div>
            </div>
            <div className="text-[2.5rem] sm:text-[3.5rem] md:text-[6rem] font-black leading-none text-white/[0.05] select-none shrink-0">
              {step.step}
            </div>
          </div>

          <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight mb-4 text-white">{step.title}</h2>
          <p className="text-base md:text-lg text-zinc-300 leading-relaxed mb-6">{step.desc}</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {step.bullets.map((b, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-950 text-sm text-zinc-300"
              >
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{b}</span>
              </div>
            ))}
          </div>
        </SpotlightCard>
      </div>
    </motion.div>
  );
}
