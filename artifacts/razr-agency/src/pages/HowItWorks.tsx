import PageWrapper from "@/components/layout/PageWrapper";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Sparkles, MessageCircle, Eye, Zap, Rocket, ArrowRight, CheckCircle2 } from "lucide-react";

const STEPS = [
  {
    step: "01",
    icon: MessageCircle,
    title: "Initial Contact & Vetting",
    desc: "Reach out via Telegram. We respond within minutes. Brief review of your vertical and spend goals to confirm fit.",
    bullets: ["Share your niche / vertical", "Discuss target daily spend", "Confirm policy compliance"],
    accent: "from-emerald-500/30 to-teal-500/20",
    duration: "5–15 min",
  },
  {
    step: "02",
    icon: Eye,
    title: "Transparent Review",
    desc: "Before you pay a dime, we show you the exact account you'll receive. Full transparency on history, BM structure, and limit tiers.",
    bullets: ["Live screen-share or screenshots", "Verify BM structure", "Confirm billing setup"],
    accent: "from-emerald-500/30 to-teal-500/20",
    duration: "30 min",
  },
  {
    step: "03",
    icon: Zap,
    title: "Activation & Provisioning",
    desc: "Once confirmed, we handle the technical heavy lifting. Account assigned to your Business Manager with proper roles and access.",
    bullets: ["Admin access granted", "Pixel / domain connections", "Backup admins assigned"],
    accent: "from-emerald-500/30 to-teal-500/20",
    duration: "1 hour",
  },
  {
    step: "04",
    icon: Rocket,
    title: "Launch & Scale",
    desc: "Your account is live. Launch your campaigns. Our team monitors the critical first 48 hours to ensure zero friction.",
    bullets: ["Publish first campaigns", "Monitor initial spend", "Gradual limit scaling"],
    accent: "from-amber-500/30 to-orange-500/20",
    duration: "Ongoing",
  },
];

export default function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start center", "end center"] });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <PageWrapper>
      {/* Ambient glows */}
      <div className="absolute top-32 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Hero */}
      <section className="pt-28 pb-12 relative">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 backdrop-blur mb-6">
              <Sparkles className="w-3 h-3 text-primary" />
              <span className="text-[10px] font-black tracking-[0.2em] text-primary uppercase">The Process</span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-6">
              From first message <br />
              <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">to live campaigns.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Four steps. Same-day activation. No paperwork, no friction.
            </p>

            {/* Progress chips */}
            <div className="flex flex-wrap justify-center gap-2 mt-10">
              {STEPS.map((s, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 bg-white shadow-sm shadow-slate-200/60 text-[10px] font-black uppercase tracking-wider text-slate-600">
                  <span className="text-primary">{s.step}</span>
                  <span>{s.duration}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Roadmap */}
      <section ref={containerRef} className="py-16 relative">
        <div className="container mx-auto px-4 max-w-5xl relative">
          {/* Vertical glow line */}
          <div className="absolute left-6 md:left-12 top-0 bottom-0 w-px bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              style={{ height: lineHeight }}
              className="absolute top-0 left-0 right-0 bg-gradient-to-b from-emerald-600 via-emerald-500 to-teal-500 shadow-[0_0_20px_rgba(5,150,105,0.4)]"
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
      <section className="py-16 relative">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 rounded-3xl blur opacity-40 group-hover:opacity-70 transition-opacity duration-500" />
            <div className="relative rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 p-10 md:p-14 text-center overflow-hidden">
              <motion.div
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 left-0 w-1/3 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
              />
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4">Ready to start step 01?</h2>
              <p className="text-slate-600 mb-8 max-w-xl mx-auto">Send us a message and we'll have your scaling plan ready before you finish your coffee.</p>
              <a
                href="https://t.me/RazrMarketing"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-emerald-600 text-white font-black text-sm uppercase tracking-widest hover:bg-emerald-700 transition-colors duration-300"
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
  const cardRef = useRef<HTMLDivElement>(null);
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
          <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${step.accent} blur-md scale-150 opacity-80`} />
          <div className="relative w-7 h-7 rounded-full bg-white border-2 border-primary flex items-center justify-center shadow-[0_0_20px_rgba(5,150,105,0.35)]">
            <div className="w-2 h-2 rounded-full bg-primary" />
          </div>
        </div>
      </div>

      {/* Card */}
      <motion.div
        ref={cardRef}
        whileHover={{ y: -4 }}
        className={`relative group rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60 overflow-hidden ${isEven ? "" : "md:ml-auto md:max-w-[92%]"}`}
      >
        {/* gradient backdrop on hover */}
        <div className={`absolute inset-0 bg-gradient-to-br ${step.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/15 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        <div className="relative p-6 md:p-10">
          {/* Top row */}
          <div className="flex items-start justify-between mb-6 gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl border border-primary/30 bg-primary/10 backdrop-blur flex items-center justify-center shrink-0`}>
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-1">Step {step.step}</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{step.duration}</div>
              </div>
            </div>
            <div className="text-[2.5rem] sm:text-[3.5rem] md:text-[6rem] font-black leading-none text-slate-900/[0.05] select-none shrink-0">
              {step.step}
            </div>
          </div>

          <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight mb-4">{step.title}</h2>
          <p className="text-base md:text-lg text-slate-600 leading-relaxed mb-6">{step.desc}</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {step.bullets.map((b, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800"
              >
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>{b}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
