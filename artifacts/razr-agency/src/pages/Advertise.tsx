import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Zap, TrendingUp, Headphones, Globe, BarChart3, CheckCircle, MessageCircle, Star } from "lucide-react";
import { SiMeta, SiGoogleads, SiTelegram } from "react-icons/si";
import PageWrapper from "@/components/layout/PageWrapper";
import { buildWaLink } from "@/lib/whatsapp";
import SpotlightCard from "@/components/ui/SpotlightCard";

const TELEGRAM = buildWaLink("general");

const benefits = [
  {
    icon: ShieldCheck,
    title: "Zero Account Bans",
    desc: "Agency accounts sit behind Meta & Google's enterprise protection layer. No random shutdowns mid-campaign — ever.",
    accent: "from-violet-500 to-cyan-400",
    glow: "rgba(139,92,246,0.25)",
    tone: "aurora" as const,
  },
  {
    icon: TrendingUp,
    title: "No Spending Limits",
    desc: "Scale from $10K to $10M/month without hitting artificial caps. Your budget, your pace.",
    accent: "from-pink-500 to-amber-400",
    glow: "rgba(236,72,153,0.25)",
    tone: "sunset" as const,
  },
  {
    icon: Zap,
    title: "Faster Ad Approvals",
    desc: "Agency accounts get priority review queues. Your ads go live faster than any self-serve account.",
    accent: "from-amber-400 to-emerald-400",
    glow: "rgba(245,158,11,0.25)",
    tone: "cyber" as const,
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    desc: "Real humans on Telegram — not bots. Your account manager responds in minutes, not days.",
    accent: "from-emerald-400 to-cyan-400",
    glow: "rgba(16,185,129,0.25)",
    tone: "neon" as const,
  },
  {
    icon: BarChart3,
    title: "Better Ad Delivery",
    desc: "Agency accounts unlock superior delivery optimization — more reach, lower CPMs, better ROAS.",
    accent: "from-cyan-400 to-violet-500",
    glow: "rgba(6,182,212,0.25)",
    tone: "cyan" as const,
  },
  {
    icon: Globe,
    title: "Meta + Google Under One Roof",
    desc: "Run Facebook, Instagram, and Google campaigns simultaneously — one team, one point of contact.",
    accent: "from-violet-400 to-pink-500",
    glow: "rgba(168,85,247,0.25)",
    tone: "purple" as const,
  },
];

const businesses = [
  "E-commerce & D2C",
  "EdTech Platforms",
  "Real Estate",
  "SaaS & Apps",
  "Finance & BFSI",
  "Health & Wellness",
  "Local Businesses",
  "Fashion & Lifestyle",
  "Travel & Hospitality",
  "Education Institutes",
];

const steps = [
  {
    num: "01",
    title: "Message Us on Telegram",
    desc: "Tell us about your business, target audience, and monthly ad budget. No forms, no calls — just a quick chat.",
    icon: MessageCircle,
  },
  {
    num: "02",
    title: "We Set Up Your Account",
    desc: "Within 24–48 hours your agency-grade Meta and/or Google account is live, fully provisioned, and ready to run.",
    icon: ShieldCheck,
  },
  {
    num: "03",
    title: "Launch & Scale",
    desc: "Your campaigns run on infrastructure used by global agencies. We support you every step of the way.",
    icon: TrendingUp,
  },
];

const stats = [
  { value: "$50M+", label: "Ad Spend Managed" },
  { value: "200+", label: "Brands Served" },
  { value: "98.7%", label: "Account Uptime" },
  { value: "< 15 min", label: "Avg Response Time" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

export default function Advertise() {
  return (
    <PageWrapper>
      {/* ── HERO ── */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-4 pt-32 pb-20 overflow-hidden bg-black">
        {/* Background glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-violet-600/15 rounded-full blur-[140px]" />
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px]" />
          <div className="absolute top-1/3 right-0 w-[300px] h-[300px] bg-pink-500/10 rounded-full blur-[100px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-950/40 text-cyan-300 text-xs font-black tracking-widest uppercase mb-8"
        >
          <Star className="w-3.5 h-3.5 text-cyan-400" />
          <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">Run Ads With Razr Marketing</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.95] text-white mb-6 max-w-5xl"
        >
          Scale Your Business<br />
          <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
            With Agency-Grade Ads.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="relative text-lg md:text-xl text-zinc-300 max-w-2xl mb-10 leading-relaxed"
        >
          Most advertisers run on fragile self-serve accounts — random bans, spending caps, zero support.
          Razr gives your brand the same infrastructure that global agencies use, so your campaigns never stop.
        </motion.p>

        {/* Platform badges */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="relative flex items-center gap-3 mb-10"
        >
          {[
            { icon: SiMeta, label: "Meta Ads", color: "text-violet-400" },
            { icon: SiGoogleads, label: "Google Ads", color: "text-cyan-400" },
          ].map(({ icon: Icon, label, color }) => (
            <div key={label} className="flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-800 bg-[#060608] shadow-lg">
              <Icon className={`w-4 h-4 ${color}`} />
              <span className="text-xs font-bold text-zinc-200">{label}</span>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="relative flex flex-col sm:flex-row items-center gap-4"
        >
          <a
            href={TELEGRAM}
            target="_blank"
            rel="noopener noreferrer"
            data-cta="advertise-hero-telegram"
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white font-black text-sm uppercase tracking-widest overflow-hidden shadow-xl shadow-violet-600/30 hover:opacity-95 hover:scale-[1.02] transition-all"
          >
            <SiTelegram className="w-5 h-5 relative" />
            <span className="relative">Start on Telegram</span>
            <ArrowRight className="w-4 h-4 relative group-hover:translate-x-1 transition-transform" />
          </a>
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            Avg response under 15 min
          </div>
        </motion.div>
      </section>

      {/* ── STATS ── */}
      <section className="relative py-16 border-y border-zinc-800/80 overflow-hidden bg-[#060608]">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-cyan-500/5 to-emerald-500/5" />
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent mb-2 tracking-tight tabular-nums">{s.value}</div>
                <div className="text-sm text-zinc-400 font-medium uppercase tracking-widest">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENEFITS ── */}
      <section className="py-24 md:py-32 px-4 bg-black">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <p className="text-xs font-black tracking-[0.3em] bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent uppercase mb-4">Why Razr</p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-white mb-6">
              What You Get When<br />
              <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">You Run Ads With Us</span>
            </h2>
            <p className="text-zinc-300 max-w-xl mx-auto">
              Agency accounts aren't a workaround — they're the professional infrastructure that serious advertisers rely on.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {benefits.map((b, i) => {
              const Icon = b.icon;
              return (
                <motion.div
                  key={b.title}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  className="h-full"
                >
                  <SpotlightCard tone={b.tone} className="p-7 h-full flex flex-col justify-between">
                    <div>
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${b.accent} flex items-center justify-center mb-5 shadow-lg`}>
                        <Icon className="w-6 h-6 text-black" strokeWidth={2} />
                      </div>
                      <h3 className="text-lg font-black text-white mb-3">{b.title}</h3>
                      <p className="text-sm text-zinc-300 leading-relaxed">{b.desc}</p>
                    </div>
                  </SpotlightCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── WHO WE WORK WITH ── */}
      <section className="py-20 px-4 border-t border-zinc-800/80 bg-[#060608]">
        <div className="container mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-12"
          >
            <p className="text-xs font-black tracking-[0.3em] bg-gradient-to-r from-pink-400 to-amber-300 bg-clip-text text-transparent uppercase mb-4">Industries We Serve</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
              We Work With All Types<br />
              <span className="bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent">of Businesses</span>
            </h2>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-3">
            {businesses.map((biz, i) => (
              <motion.div
                key={biz}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-zinc-800 bg-zinc-950/80 text-zinc-200 text-sm font-semibold hover:border-violet-500/40 hover:text-white hover:bg-violet-950/30 transition-all duration-300 cursor-default"
              >
                <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                {biz}
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-10 text-zinc-400 text-sm"
          >
            Not sure if we can help your business? Just message us — we'll tell you honestly.
          </motion.p>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 md:py-32 px-4 border-t border-zinc-800/80 bg-black">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <p className="text-xs font-black tracking-[0.3em] bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent uppercase mb-4">Simple Process</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
              Getting Started is<br />
              <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">Easier Than You Think</span>
            </h2>
          </motion.div>

          <div className="relative flex flex-col gap-0">
            {/* vertical line */}
            <div className="absolute left-8 md:left-1/2 top-8 bottom-8 w-px bg-gradient-to-b from-violet-500 via-cyan-400 to-emerald-500 hidden sm:block opacity-40" style={{ transform: "translateX(-50%)" }} />

            {steps.map((step, i) => {
              const Icon = step.icon;
              const isRight = i % 2 === 1;
              const tones = ["aurora", "sunset", "neon"] as const;
              return (
                <motion.div
                  key={step.num}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  className={`relative flex items-center gap-6 md:gap-0 mb-12 last:mb-0 ${isRight ? "md:flex-row-reverse" : "md:flex-row"}`}
                >
                  {/* Card */}
                  <div className={`flex-1 ${isRight ? "md:pl-12" : "md:pr-12"}`}>
                    <SpotlightCard tone={tones[i % tones.length]} className="p-7">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-cyan-400" strokeWidth={1.5} />
                        </div>
                        <span className="text-xs font-black tracking-[0.25em] bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent uppercase">Step {step.num}</span>
                      </div>
                      <h3 className="text-xl font-black text-white mb-3">{step.title}</h3>
                      <p className="text-zinc-300 text-sm leading-relaxed">{step.desc}</p>
                    </SpotlightCard>
                  </div>

                  {/* Center dot */}
                  <div className="hidden md:flex w-0 flex-col items-center justify-center relative z-10">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 border-4 border-black shadow-[0_0_20px_rgba(139,92,246,0.8)]" />
                  </div>

                  {/* Spacer */}
                  <div className="hidden md:block flex-1" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-24 md:py-32 px-4 bg-black">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-3xl overflow-hidden"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 rounded-3xl blur opacity-40" />
            <div className="relative rounded-3xl border border-zinc-800/80 bg-[#060608] shadow-2xl px-8 py-16 md:px-16 md:py-20 text-center">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[400px] h-[300px] bg-violet-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-cyan-500/10 rounded-full blur-[100px]" />
              </div>

              <div className="relative">
                <div className="flex items-center justify-center gap-2 mb-6">
                  <SiMeta className="w-5 h-5 text-violet-400" />
                  <span className="text-zinc-500 text-xs">+</span>
                  <SiGoogleads className="w-5 h-5 text-cyan-400" />
                </div>

                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-white mb-6">
                  Ready to Scale?<br />
                  <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
                    Let's Talk on Telegram.
                  </span>
                </h2>

                <p className="text-zinc-300 text-lg mb-10 max-w-xl mx-auto">
                  Message us your business details and budget. We'll get your agency account live within 24–48 hours.
                </p>

                <a
                  href={TELEGRAM}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cta="advertise-final-cta"
                  className="group relative inline-flex items-center gap-3 px-10 py-5 rounded-full bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white font-black text-base uppercase tracking-widest overflow-hidden shadow-xl shadow-violet-600/30 hover:opacity-95 hover:scale-[1.02] transition-all duration-300"
                >
                  <SiTelegram className="w-5 h-5 relative" />
                  <span className="relative">Message Us on Telegram</span>
                  <ArrowRight className="w-5 h-5 relative group-hover:translate-x-1 transition-transform" />
                </a>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-zinc-400">
                  {["No contracts", "No lock-in", "Cancel anytime"].map((t) => (
                    <div key={t} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-cyan-400" />
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </PageWrapper>
  );
}
