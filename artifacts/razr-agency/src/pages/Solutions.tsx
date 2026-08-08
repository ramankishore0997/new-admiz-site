import PageWrapper from "@/components/layout/PageWrapper";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Link } from "wouter";
import LightBeams from "@/components/LightBeams";
import HeroRobot from "@/components/HeroRobot";
import {
  AlertTriangle, Lock, Clock4, XCircle, Sparkles,
  Key, Zap, TrendingUp, MessageCircle, RefreshCw, ArrowRight,
  Rocket, BarChart3, Trophy, ArrowUpRight, type LucideIcon,
} from "lucide-react";

// ────────────────────────────────────────────────────────────
// Problem cards
// ────────────────────────────────────────────────────────────
const PROBLEMS = [
  { Icon: AlertTriangle, title: "Random Restrictions", body: "Wake up to a banned account mid-campaign. Lose ad data, retargeting, weeks of pixel learning — overnight.", color: "from-red-500/40 to-orange-500/20" },
  { Icon: Lock, title: "$50/day Spend Cap", body: "Your campaign is profitable but the platform won't let you scale. Trapped at low budgets for weeks of 'warmup'.", color: "from-amber-500/40 to-yellow-500/20" },
  { Icon: Clock4, title: "Slow Setup", body: "Days lost on Business Manager verification, billing approval, pixel installation, and policy reviews.", color: "from-rose-500/40 to-pink-500/20" },
  { Icon: XCircle, title: "Generic Support", body: "Outsourced helpdesk that copy-pastes from a script. Real issues take weeks to escalate — if ever.", color: "from-emerald-500/40 to-teal-500/20" },
];

// ────────────────────────────────────────────────────────────
// Solution pillars (sticky reveal)
// ────────────────────────────────────────────────────────────
type Pillar = { Icon: LucideIcon; step: string; title: string; body: string; bullets: string[]; accent: string };

const PILLARS: Pillar[] = [
  {
    Icon: Key, step: "Pillar 01", title: "Access",
    body: "Pre-vetted, agency-grade Meta + Google accounts under verified Business Managers. You get admin access from day one.",
    bullets: ["MCC-backed Google accounts", "Verified BM structure", "Admin role granted"],
    accent: "from-primary/40 to-emerald-500/20",
  },
  {
    Icon: Zap, step: "Pillar 02", title: "Activation",
    body: "Same-day provisioning. Pixel, domains, payment methods configured. Live campaigns within an hour of confirmation.",
    bullets: ["<1 hour onboarding", "Pixel + domain wiring", "Pre-warmed payment methods"],
    accent: "from-amber-500/40 to-yellow-500/20",
  },
  {
    Icon: TrendingUp, step: "Pillar 03", title: "Scaling",
    body: "Uncapped daily spend from hour one. No warmup, no throttling. Push $50k/day or scale gradually — your call.",
    bullets: ["No daily spend caps", "Aggressive vertical scaling", "Stable through BFCM"],
    accent: "from-emerald-500/40 to-teal-500/20",
  },
  {
    Icon: MessageCircle, step: "Pillar 04", title: "Support",
    body: "Direct Telegram access to our internal media buyers. 12-minute average response. Not a ticketing system.",
    bullets: ["12-min avg response", "Direct to media buyers", "24/7 coverage"],
    accent: "from-emerald-500/40 to-teal-500/20",
  },
  {
    Icon: RefreshCw, step: "Pillar 05", title: "Replacement",
    body: "Account flagged unfairly? Free lifetime replacement with balance transfer where technically possible.",
    bullets: ["Lifetime replacement", "Balance transfer", "No questions, no fees"],
    accent: "from-rose-500/40 to-pink-500/20",
  },
];

// ────────────────────────────────────────────────────────────
// Result timeline
// ────────────────────────────────────────────────────────────
const TIMELINE = [
  { Icon: Rocket, when: "Day 1", title: "Launch", body: "First campaigns live. Account fully provisioned. No warmup needed.", metric: "$2,000/day" },
  { Icon: BarChart3, when: "Week 2", title: "Growth", body: "Scaling winning creatives. Pixel learning accelerated by pre-warmed history.", metric: "$15,000/day" },
  { Icon: Trophy, when: "Month 3", title: "Scale", body: "Aggressive vertical scaling. Same account, no restrictions, ROAS stable.", metric: "$50,000+/day" },
];

function AnimatedBar({ from, to, color, label, delay = 0 }: { from: number; to: number; color: string; label: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <div ref={ref} className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-600 font-bold uppercase tracking-wider">{label}</span>
        <span className="text-slate-900 font-black tabular-nums">
          {inView ? to : from}{label.includes("Spend") ? "$/day" : "%"}
        </span>
      </div>
      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
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
      {/* Ambient glows */}
      <div className="absolute top-32 left-0 w-[600px] h-[600px] bg-primary/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[40%] right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* ─────────────── HERO ─────────────── */}
      <section className="relative min-h-[68vh] md:min-h-[78vh] pt-24 md:pt-28 pb-10 flex items-center overflow-hidden">
        <LightBeams />
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 backdrop-blur mb-6 md:mb-8">
                <Sparkles className="w-3 h-3 text-primary" />
                <span className="text-[10px] font-black tracking-[0.2em] text-primary uppercase">Built For Scaling</span>
              </div>
              <h1 className="text-[2.5rem] sm:text-5xl md:text-7xl lg:text-[5.5rem] font-black uppercase tracking-tighter leading-[0.95] mb-6 md:mb-8 break-words">
                Advertising <br />
                <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">infrastructure</span><br />
                <span className="font-light italic text-slate-500">built for scaling.</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-xl font-medium leading-relaxed mb-6 md:mb-8">
                Stop fighting the platform. Start running campaigns on infrastructure designed for advertisers — not local bakeries.
              </p>
              <div className="grid grid-cols-3 gap-2.5 sm:flex sm:flex-wrap sm:gap-3">
                {[{v:"$2.4B+",l:"Processed"},{v:"1,200+",l:"Advertisers"},{v:"99.2%",l:"Uptime"}].map((s,i)=>(
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i*0.1 }} className="rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60 px-3 sm:px-4 py-3">
                    <div className="text-base sm:text-xl font-black text-slate-900 truncate">{s.v}</div>
                    <div className="text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-500 font-bold mt-0.5 truncate">{s.l}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <div className="hidden lg:block lg:col-span-5 h-[480px]">
              <HeroRobot />
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────── PROBLEM ─────────────── */}
      <section className="py-12 md:py-16 relative">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="mb-8 md:mb-12">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-3 h-3" /> The Problem
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.95]">Why advertisers <span className="font-light italic text-slate-500">hit walls.</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {PROBLEMS.map((p, i) => {
              const Icon = p.Icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="relative group rounded-2xl md:rounded-3xl border border-red-200 bg-white shadow-lg shadow-red-100/60 p-5 md:p-7 overflow-hidden"
                >
                  <div className={`absolute -top-16 -right-16 w-40 h-40 bg-gradient-to-br ${p.color} rounded-full blur-3xl opacity-40 group-hover:opacity-100 transition-opacity duration-500`} />
                  <div className="relative">
                    <div className={`w-11 h-11 md:w-12 md:h-12 rounded-2xl border border-red-200 bg-red-50 flex items-center justify-center mb-4 md:mb-5`}>
                      <Icon className="w-5 h-5 text-red-600" />
                    </div>
                    <h3 className="text-lg md:text-xl font-black uppercase tracking-tight mb-2 md:mb-3 leading-tight">{p.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{p.body}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────── SOLUTION (Sticky Reveal — DESKTOP) ─────────────── */}
      <section className="py-12 md:py-16 relative">
        <div className="container mx-auto px-4 max-w-7xl mb-8 md:mb-10">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-3 flex items-center gap-2">
            <Sparkles className="w-3 h-3" /> The Solution
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.95]">5 pillars <span className="font-light italic text-slate-500">of scale.</span></h2>
        </div>

        {/* Responsive stacked grid — no scroll-jacking on any viewport */}
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
                whileHover={{ y: -4 }}
                className="relative group"
              >
                <div className={`absolute -inset-0.5 bg-gradient-to-br ${p.accent} rounded-3xl blur opacity-30 group-hover:opacity-60 transition-opacity duration-500`} />
                <div className="relative h-full rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60 p-6 md:p-8 overflow-hidden">
                  <div className={`absolute -top-16 -right-16 w-44 h-44 bg-gradient-to-br ${p.accent} rounded-full blur-3xl opacity-40 group-hover:opacity-70 transition-opacity duration-500`} />
                  <div className="relative">
                    <div className="flex items-start justify-between mb-5">
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl border border-primary/30 bg-primary/10 backdrop-blur flex items-center justify-center group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500">
                        <Icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                      </div>
                      <div className="text-6xl md:text-7xl font-black leading-none text-slate-900/[0.05] select-none">{String(i + 1).padStart(2, "0")}</div>
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-2">{p.step}</div>
                    <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter mb-3 leading-[0.95]">{p.title}</h3>
                    <p className="text-sm md:text-base text-slate-600 leading-relaxed mb-5">{p.body}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {p.bullets.map((b, idx) => (
                        <div key={idx} className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs md:text-sm text-slate-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(5,150,105,0.6)] shrink-0" />
                          {b}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ─────────────── BEFORE / AFTER ─────────────── */}
      <section className="py-12 md:py-16 relative">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-8 md:mb-12">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-3">The Difference</div>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase tracking-tighter">Before vs <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">Razr.</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* BEFORE */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="relative rounded-2xl md:rounded-3xl border border-red-200 bg-white shadow-lg shadow-red-100/60 p-6 md:p-8 overflow-hidden">
              <div className="absolute -top-16 -right-16 w-40 h-40 bg-red-100/60 rounded-full blur-3xl" />
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600">Before</div>
                  <div className="text-xs text-slate-500">Self-serve BM</div>
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight mb-6">Stuck advertiser</h3>
                <div className="space-y-5">
                  <AnimatedBar from={50} to={500} color="from-red-500 to-orange-500" label="Daily Spend" delay={0.1} />
                  <AnimatedBar from={20} to={45} color="from-red-500 to-orange-500" label="ROAS Stability %" delay={0.2} />
                  <AnimatedBar from={10} to={30} color="from-red-500 to-orange-500" label="Account Uptime %" delay={0.3} />
                </div>
                <div className="mt-8 pt-6 border-t border-red-100 grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-3xl font-black text-red-600">14</div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mt-1">Bans/yr</div>
                  </div>
                  <div>
                    <div className="text-3xl font-black text-red-600">72h</div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mt-1">Avg downtime</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* AFTER */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="relative group rounded-2xl md:rounded-3xl overflow-hidden">
              <div className="absolute -inset-0.5 bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 rounded-2xl md:rounded-3xl blur opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative rounded-2xl md:rounded-3xl border border-primary/30 bg-gradient-to-br from-emerald-50/80 via-white to-white shadow-xl shadow-emerald-100/50 p-6 md:p-8 overflow-hidden">
                <div className="absolute -top-16 -right-16 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
                <motion.div animate={{ x: ["-100%", "200%"] }} transition={{ duration: 7, repeat: Infinity, ease: "linear" }} className="absolute top-0 left-0 w-1/3 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">With Razr</div>
                    <div className="flex items-center gap-2 text-xs text-slate-600"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live</div>
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tight mb-6">Scaling operator</h3>
                  <div className="space-y-5">
                    <AnimatedBar from={100} to={50000} color="from-primary to-teal-500" label="Daily Spend" delay={0.1} />
                    <AnimatedBar from={50} to={98} color="from-primary to-teal-500" label="ROAS Stability %" delay={0.2} />
                    <AnimatedBar from={30} to={99} color="from-primary to-teal-500" label="Account Uptime %" delay={0.3} />
                  </div>
                  <div className="mt-8 pt-6 border-t border-primary/20 grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-3xl font-black text-primary">0</div>
                      <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mt-1">Bans/yr</div>
                    </div>
                    <div>
                      <div className="text-3xl font-black text-primary">12m</div>
                      <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mt-1">Avg response</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─────────────── RESULT TIMELINE ─────────────── */}
      <section className="py-12 md:py-16 relative">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-8 md:mb-12">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-3">The Result</div>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.95]">From launch <span className="font-light italic text-slate-500">to scale.</span></h2>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {/* connector line */}
            <div className="hidden md:block absolute top-20 left-[16%] right-[16%] h-px bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 opacity-40" />

            {TIMELINE.map((t, i) => {
              const Icon = t.Icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  className="relative group"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-br from-primary/30 to-teal-500/20 rounded-2xl md:rounded-3xl blur opacity-0 group-hover:opacity-80 transition-opacity duration-500" />
                  <div className="relative rounded-2xl md:rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60 p-6 md:p-8 h-full">
                    <div className="relative w-14 h-14 md:w-16 md:h-16 mx-auto mb-5 md:mb-6 rounded-full border-2 border-primary bg-background flex items-center justify-center shadow-[0_0_20px_rgba(5,150,105,0.25)]">
                      <Icon className="w-6 h-6 md:w-7 md:h-7 text-primary" />
                    </div>
                    <div className="text-center">
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-2">{t.when}</div>
                      <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-3">{t.title}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed mb-4 md:mb-5">{t.body}</p>
                      <div className="inline-block px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-sm font-black text-primary tabular-nums">{t.metric}</div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────── CTA ─────────────── */}
      <section className="py-12 md:py-20 relative">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="relative group rounded-3xl overflow-hidden">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 14, repeat: Infinity, ease: "linear" }} className="absolute inset-[-200%] bg-[conic-gradient(from_0deg,transparent_0deg,rgba(5,150,105,0.35)_60deg,transparent_120deg,rgba(20,184,166,0.30)_240deg,transparent_300deg)] opacity-25" />
            <div className="relative rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 p-7 sm:p-10 md:p-16 text-center overflow-hidden">
              <motion.div animate={{ x: ["-100%", "200%"] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} className="absolute top-0 left-0 w-1/3 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[1.05] mb-5 md:mb-6">
                Your vertical, <br />
                <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">our infrastructure.</span>
              </h2>
              <p className="text-base md:text-lg text-slate-600 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed">We'll match you with the right setup in under 10 minutes. No commitment, no sales pitch.</p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <a href="https://t.me/RazrMarketing" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-3 px-8 md:px-10 py-4 md:py-5 rounded-full bg-emerald-600 text-white font-black text-sm uppercase tracking-widest hover:bg-emerald-700 transition-colors duration-300">
                  Chat on Telegram <ArrowRight className="w-4 h-4" />
                </a>
                <Link href="/contact" className="inline-flex items-center justify-center gap-3 px-8 md:px-10 py-4 md:py-5 rounded-full border border-slate-300 text-slate-900 font-black text-sm uppercase tracking-widest hover:bg-slate-100 transition-colors duration-300">
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
