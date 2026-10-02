import PageWrapper from "@/components/layout/PageWrapper";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "wouter";
import LightBeams from "@/components/LightBeams";
import SpotlightCard from "@/components/ui/SpotlightCard";
import {
  AlertTriangle, Lock, Clock4, XCircle, Sparkles,
  Key, Zap, TrendingUp, MessageCircle, RefreshCw, ArrowRight,
  Rocket, BarChart3, Trophy, ArrowUpRight, type LucideIcon,
} from "lucide-react";

// ────────────────────────────────────────────────────────────
// Problem cards
// ────────────────────────────────────────────────────────────
const PROBLEMS = [
  { Icon: AlertTriangle, title: "Random Restrictions", body: "Wake up to a banned account mid-campaign. Lose ad data, retargeting, weeks of pixel learning — overnight.", tone: "sunset" },
  { Icon: Lock, title: "$50/day Spend Cap", body: "Your campaign is profitable but the platform won't let you scale. Trapped at low budgets for weeks of 'warmup'.", tone: "amber" },
  { Icon: Clock4, title: "Slow Setup", body: "Days lost on Business Manager approvals, billing issues, pixel installation, and policy bottlenecks.", tone: "rose" },
  { Icon: XCircle, title: "Generic Support", body: "Outsourced helpdesk that copy-pastes from a script. Real issues take weeks to escalate — if ever.", tone: "purple" },
];

// ────────────────────────────────────────────────────────────
// Solution pillars
// ────────────────────────────────────────────────────────────
type Pillar = { Icon: LucideIcon; step: string; title: string; body: string; bullets: string[]; tone: "aurora" | "cyan" | "sunset" | "neon" };

const PILLARS: Pillar[] = [
  {
    Icon: Key, step: "Pillar 01", title: "Access",
    body: "Pre-vetted, agency-grade Meta + Google accounts under authenticated enterprise Business Managers. You get direct admin access.",
    bullets: ["MCC-backed Google accounts", "Enterprise BM structure", "Admin role granted"],
    tone: "aurora",
  },
  {
    Icon: Zap, step: "Pillar 02", title: "Activation",
    body: "Same-day provisioning. Pixel, domains, payment methods configured. Live campaigns within an hour of confirmation.",
    bullets: ["<1 hour onboarding", "Pixel + domain wiring", "Pre-configured payment lines"],
    tone: "cyan",
  },
  {
    Icon: TrendingUp, step: "Pillar 03", title: "Scaling",
    body: "Uncapped daily spend from hour one. No warmup, no throttling. Push $50k/day or scale gradually — your call.",
    bullets: ["No daily spend caps", "Aggressive vertical scaling", "Stable through BFCM"],
    tone: "neon",
  },
  {
    Icon: MessageCircle, step: "Pillar 04", title: "Support",
    body: "Direct Telegram access to our internal media buyers. 12-minute average response. Not a ticketing system.",
    bullets: ["12-min avg response", "Direct to media buyers", "24/7 coverage"],
    tone: "sunset",
  },
  {
    Icon: RefreshCw, step: "Pillar 05", title: "Replacement",
    body: "Account flagged unfairly? Free lifetime replacement with balance transfer where technically possible.",
    bullets: ["Lifetime replacement", "Balance transfer", "No questions, no fees"],
    tone: "aurora",
  },
];

// ────────────────────────────────────────────────────────────
// Result timeline
// ────────────────────────────────────────────────────────────
const TIMELINE = [
  { Icon: Rocket, when: "Day 1", title: "Launch", body: "First campaigns live. Account fully provisioned. No warmup needed.", metric: "$2,000/day", color: "from-violet-400 to-indigo-300" },
  { Icon: BarChart3, when: "Week 2", title: "Growth", body: "Scaling winning creatives. Pixel learning accelerated by pre-warmed history.", metric: "$15,000/day", color: "from-cyan-300 to-teal-300" },
  { Icon: Trophy, when: "Month 3", title: "Scale", body: "Aggressive vertical scaling. Same account, no restrictions, ROAS stable.", metric: "$50,000+/day", color: "from-emerald-300 to-cyan-300" },
];

function AnimatedBar({ from, to, color, label, delay = 0 }: { from: number; to: number; color: string; label: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <div ref={ref} className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-zinc-400 font-bold uppercase tracking-wider">{label}</span>
        <span className="text-white font-black tabular-nums">
          {inView ? to : from}{label.includes("Spend") ? "$/day" : "%"}
        </span>
      </div>
      <div className="h-2 rounded-full bg-zinc-900 overflow-hidden">
        <motion.div
          initial={{ width: `${(from / 100) * 30}%` }}
          animate={inView ? { width: `${Math.min(to / 5, 100)}%` } : {}}
          transition={{ duration: 1.4, delay, ease: [0.16, 1, 0.3, 1] }}
          className={`h-full bg-gradient-to-r ${color} rounded-full`}
        />
      </div>
    </div>
  );
}

export default function Solutions() {
  return (
    <PageWrapper>
      {/* ─────────────── HERO ─────────────── */}
      <section className="relative min-h-[68vh] md:min-h-[78vh] pt-24 md:pt-28 pb-10 flex items-center overflow-hidden bg-black text-white">
        <LightBeams />
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="flex items-center justify-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="w-full text-center">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-violet-500/30 bg-[#0A0515] backdrop-blur mb-6 md:mb-8 shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-[10px] font-black tracking-[0.2em] bg-gradient-to-r from-violet-300 via-cyan-300 to-emerald-300 bg-clip-text text-transparent uppercase">Built For Scaling</span>
              </div>
              <h1 className="text-[2.5rem] sm:text-5xl md:text-7xl lg:text-[6rem] font-black uppercase tracking-tighter leading-[0.95] mb-6 md:mb-8 break-words text-white">
                Advertising <br />
                <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(6,182,212,0.4)]">infrastructure</span>
                <span className="font-light italic text-zinc-400">, built for scaling.</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto font-medium leading-relaxed mb-8 md:mb-10">
                Stop fighting the platform. Run campaigns on infrastructure designed for high-volume advertisers — pre-vetted accounts, zero warm-up, and support that answers in minutes.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-xl mx-auto">
                {[{v:"$2.4B+",l:"Processed"},{v:"1,200+",l:"Advertisers"},{v:"99.2%",l:"Uptime"}].map((s,i)=>(
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i*0.1 }} className="rounded-2xl border border-zinc-800 bg-[#060608] shadow-xl backdrop-blur-xl px-5 py-3.5 min-w-[130px]">
                    <div className="text-lg sm:text-xl font-black bg-gradient-to-r from-violet-300 via-cyan-300 to-emerald-300 bg-clip-text text-transparent tabular-nums truncate">{s.v}</div>
                    <div className="text-[9px] sm:text-[10px] uppercase tracking-wider text-zinc-400 font-bold mt-0.5 truncate">{s.l}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─────────────── PROBLEM ─────────────── */}
      <section className="py-12 md:py-16 relative bg-black text-white border-y border-zinc-900">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="mb-8 md:mb-12">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-400 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> The Problem
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.95] text-white">Why advertisers <span className="font-light italic text-zinc-500">hit walls.</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {PROBLEMS.map((p, i) => {
              const Icon = p.Icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="h-full"
                >
                  <SpotlightCard tone={p.tone as any} className="p-6 md:p-7 h-full flex flex-col justify-between bg-[#060608] border-zinc-800">
                    <div>
                      <div className="w-12 h-12 rounded-2xl border border-rose-500/30 bg-rose-950/40 flex items-center justify-center mb-5 text-rose-400">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg md:text-xl font-black uppercase tracking-tight mb-2.5 leading-tight text-white">{p.title}</h3>
                      <p className="text-sm text-zinc-400 leading-relaxed">{p.body}</p>
                    </div>
                  </SpotlightCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────── SOLUTION ─────────────── */}
      <section className="py-12 md:py-16 relative bg-black text-white">
        <div className="container mx-auto px-4 max-w-7xl mb-8 md:mb-10">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent mb-3 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> The Solution
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.95] text-white">5 pillars <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent font-light italic">of scale.</span></h2>
        </div>

        <div className="container mx-auto px-4 max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {PILLARS.map((p, i) => {
            const Icon = p.Icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: (i % 2) * 0.1 }}
                className="h-full"
              >
                <SpotlightCard tone={p.tone} className="p-6 md:p-8 h-full flex flex-col justify-between bg-[#060608] border-zinc-800">
                  <div>
                    <div className="flex items-start justify-between mb-5">
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl border border-violet-500/30 bg-violet-950/40 backdrop-blur flex items-center justify-center text-cyan-300">
                        <Icon className="w-5 h-5 md:w-6 md:h-6" />
                      </div>
                      <div className="text-6xl md:text-7xl font-black leading-none text-white/[0.05] select-none">{String(i + 1).padStart(2, "0")}</div>
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent mb-2">{p.step}</div>
                    <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter mb-3 leading-[0.95] text-white">{p.title}</h3>
                    <p className="text-sm md:text-base text-zinc-300 leading-relaxed mb-6">{p.body}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {p.bullets.map((b, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-xs md:text-sm text-zinc-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)] shrink-0" />
                        {b}
                      </div>
                    ))}
                  </div>
                </SpotlightCard>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ─────────────── BEFORE / AFTER ─────────────── */}
      <section className="py-12 md:py-16 relative bg-black text-white border-y border-zinc-900">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-8 md:mb-12">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent mb-3">The Difference</div>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase tracking-tighter text-white">Before vs <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">Razr.</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* BEFORE */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="relative rounded-2xl md:rounded-3xl border border-rose-500/20 bg-[#080508] shadow-2xl p-6 md:p-8 overflow-hidden">
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-400">Before</div>
                  <div className="text-xs text-zinc-500">Self-serve BM</div>
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight mb-6 text-white">Stuck advertiser</h3>
                <div className="space-y-5">
                  <AnimatedBar from={50} to={500} color="from-rose-500 to-amber-500" label="Daily Spend" delay={0.1} />
                  <AnimatedBar from={20} to={45} color="from-rose-500 to-amber-500" label="ROAS Stability %" delay={0.2} />
                  <AnimatedBar from={10} to={30} color="from-rose-500 to-amber-500" label="Account Uptime %" delay={0.3} />
                </div>
                <div className="mt-8 pt-6 border-t border-zinc-800 grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-3xl font-black text-rose-400">14</div>
                    <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold mt-1">Bans/yr</div>
                  </div>
                  <div>
                    <div className="text-3xl font-black text-rose-400">72h</div>
                    <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold mt-1">Avg downtime</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* AFTER */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="relative group rounded-2xl md:rounded-3xl overflow-hidden">
              <div className="relative rounded-2xl md:rounded-3xl border border-cyan-500/30 bg-[#060608] shadow-2xl p-6 md:p-8 overflow-hidden">
                <div className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent">With Razr</div>
                    <div className="flex items-center gap-2 text-xs text-zinc-400"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" /> Live</div>
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tight mb-6 text-white">Scaling operator</h3>
                  <div className="space-y-5">
                    <AnimatedBar from={100} to={50000} color="from-violet-500 via-cyan-400 to-emerald-400" label="Daily Spend" delay={0.1} />
                    <AnimatedBar from={50} to={98} color="from-violet-500 via-cyan-400 to-emerald-400" label="ROAS Stability %" delay={0.2} />
                    <AnimatedBar from={30} to={99} color="from-violet-500 via-cyan-400 to-emerald-400" label="Account Uptime %" delay={0.3} />
                  </div>
                  <div className="mt-8 pt-6 border-t border-zinc-800 grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-3xl font-black bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent">0</div>
                      <div className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold mt-1">Bans/yr</div>
                    </div>
                    <div>
                      <div className="text-3xl font-black bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent">12m</div>
                      <div className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold mt-1">Avg response</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─────────────── RESULT TIMELINE ─────────────── */}
      <section className="py-12 md:py-16 relative bg-black text-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-8 md:mb-12">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent mb-3">The Result</div>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.95] text-white">From launch <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent font-light italic">to scale.</span></h2>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="hidden md:block absolute top-20 left-[16%] right-[16%] h-px bg-gradient-to-r from-violet-600 via-cyan-400 to-emerald-400 opacity-40" />

            {TIMELINE.map((t, i) => {
              const Icon = t.Icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  className="h-full"
                >
                  <SpotlightCard tone="aurora" className="p-6 md:p-8 h-full flex flex-col justify-between bg-[#060608] border-zinc-800">
                    <div>
                      <div className="relative w-14 h-14 md:w-16 md:h-16 mx-auto mb-5 md:mb-6 rounded-2xl border border-violet-500/30 bg-zinc-950 flex items-center justify-center shadow-lg shadow-violet-500/20 text-cyan-300">
                        <Icon className="w-6 h-6 md:w-7 md:h-7" />
                      </div>
                      <div className="text-center">
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400 mb-2">{t.when}</div>
                        <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-3 text-white">{t.title}</h3>
                        <p className="text-sm text-zinc-300 leading-relaxed mb-5">{t.body}</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className={`inline-block px-4 py-2 rounded-full border border-zinc-700 bg-zinc-950 text-sm font-black bg-gradient-to-r ${t.color} bg-clip-text text-transparent tabular-nums`}>{t.metric}</div>
                    </div>
                  </SpotlightCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────── CTA ─────────────── */}
      <section className="py-12 md:py-20 relative bg-black text-white border-t border-zinc-900">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="relative group rounded-3xl overflow-hidden">
            <div className="relative rounded-3xl border border-zinc-800 bg-[#060608] shadow-2xl p-7 sm:p-10 md:p-16 text-center overflow-hidden">
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[1.05] mb-5 md:mb-6 text-white">
                Your vertical, <br />
                <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">our infrastructure.</span>
              </h2>
              <p className="text-base md:text-lg text-zinc-400 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed">We'll match you with the right setup in under 10 minutes. No commitment, no sales pitch.</p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <a href="https://t.me/RazrMarketing" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-3 px-8 md:px-10 py-4 md:py-5 rounded-full bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white font-black text-sm uppercase tracking-widest hover:opacity-95 transition-all duration-300 shadow-xl shadow-violet-600/30">
                  Chat on Telegram <ArrowRight className="w-4 h-4" />
                </a>
                <Link href="/contact" className="inline-flex items-center justify-center gap-3 px-8 md:px-10 py-4 md:py-5 rounded-full border border-zinc-800 bg-zinc-950 text-white font-black text-sm uppercase tracking-widest hover:border-violet-500 hover:text-cyan-300 transition-colors duration-300">
                  Get Custom Plan <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
