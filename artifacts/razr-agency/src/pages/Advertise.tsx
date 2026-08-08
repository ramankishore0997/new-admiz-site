import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Zap, TrendingUp, Headphones, Globe, BarChart3, CheckCircle, MessageCircle, Star } from "lucide-react";
import { SiMeta, SiGoogleads, SiTelegram } from "react-icons/si";
import PageWrapper from "@/components/layout/PageWrapper";
import { buildWaLink } from "@/lib/whatsapp";

const TELEGRAM = buildWaLink("general");

const benefits = [
  {
    icon: ShieldCheck,
    title: "Zero Account Bans",
    desc: "Agency accounts sit behind Meta & Google's enterprise protection layer. No random shutdowns mid-campaign — ever.",
    accent: "from-emerald-400 to-teal-500",
    glow: "rgba(52,211,153,0.25)",
  },
  {
    icon: TrendingUp,
    title: "No Spending Limits",
    desc: "Scale from $10K to $10M/month without hitting artificial caps. Your budget, your pace.",
    accent: "from-primary to-teal-500",
    glow: "rgba(5,150,105,0.25)",
  },
  {
    icon: Zap,
    title: "Faster Ad Approvals",
    desc: "Agency accounts get priority review queues. Your ads go live faster than any self-serve account.",
    accent: "from-yellow-400 to-orange-400",
    glow: "rgba(251,191,36,0.25)",
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    desc: "Real humans on Telegram — not bots. Your account manager responds in minutes, not days.",
    accent: "from-emerald-500 to-teal-500",
    glow: "rgba(5,150,105,0.25)",
  },
  {
    icon: BarChart3,
    title: "Better Ad Delivery",
    desc: "Agency accounts unlock superior delivery optimization — more reach, lower CPMs, better ROAS.",
    accent: "from-teal-400 to-emerald-500",
    glow: "rgba(5,150,105,0.25)",
  },
  {
    icon: Globe,
    title: "Meta + Google Under One Roof",
    desc: "Run Facebook, Instagram, and Google campaigns simultaneously — one team, one point of contact.",
    accent: "from-rose-400 to-red-400",
    glow: "rgba(251,113,133,0.25)",
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
    desc: "Within 24–48 hours your agency-grade Meta and/or Google account is live, verified, and ready to run.",
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
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-4 pt-32 pb-20 overflow-hidden">
        {/* Background glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-primary/20 rounded-full blur-[140px]" />
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px]" />
          <div className="absolute top-1/3 right-0 w-[300px] h-[300px] bg-teal-500/10 rounded-full blur-[100px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-black tracking-widest uppercase mb-8"
        >
          <Star className="w-3 h-3" />
          Run Ads With Razr Marketing
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.95] text-slate-900 mb-6 max-w-5xl"
        >
          Scale Your Business<br />
          <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
            With Agency-Grade Ads.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="relative text-lg md:text-xl text-slate-600 max-w-2xl mb-10 leading-relaxed"
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
            { icon: SiMeta, label: "Meta Ads", color: "text-slate-600" },
            { icon: SiGoogleads, label: "Google Ads", color: "text-yellow-500" },
          ].map(({ icon: Icon, label, color }) => (
            <div key={label} className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white shadow-sm shadow-slate-200/60">
              <Icon className={`w-4 h-4 ${color}`} />
              <span className="text-xs font-bold text-slate-700">{label}</span>
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
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-emerald-600 text-white font-black text-sm uppercase tracking-widest overflow-hidden shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-600/30 transition-shadow"
          >
            <span className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
            <SiTelegram className="w-5 h-5 relative" />
            <span className="relative">Start on Telegram</span>
            <ArrowRight className="w-4 h-4 relative group-hover:translate-x-1 transition-transform" />
          </a>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Avg response under 15 min
          </div>
        </motion.div>
      </section>

      {/* ── STATS ── */}
      <section className="relative py-16 border-y border-slate-200 overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-emerald-500/5 to-teal-500/5" />
        <div className="container mx-auto px-4">
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
                <div className="text-4xl md:text-5xl font-black text-slate-900 mb-2 tracking-tight">{s.value}</div>
                <div className="text-sm text-slate-500 font-medium uppercase tracking-widest">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENEFITS ── */}
      <section className="py-24 md:py-32 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <p className="text-xs font-black tracking-[0.3em] text-primary uppercase mb-4">Why Razr</p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-slate-900 mb-6">
              What You Get When<br />
              <span className="text-slate-500">You Run Ads With Us</span>
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto">
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
                  whileHover={{ y: -6 }}
                  className="group relative p-7 rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60 overflow-hidden cursor-default"
                  style={{ boxShadow: `0 0 0 0 ${b.glow}` }}
                >
                  {/* hover glow */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                    style={{ background: `radial-gradient(circle at 30% 30%, ${b.glow}, transparent 70%)` }}
                  />
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${b.accent} flex items-center justify-center mb-5 shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mb-3">{b.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{b.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── WHO WE WORK WITH ── */}
      <section className="py-20 px-4 border-t border-slate-200 bg-white">
        <div className="container mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-12"
          >
            <p className="text-xs font-black tracking-[0.3em] text-primary uppercase mb-4">Industries We Serve</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900">
              We Work With All Types<br />
              <span className="text-slate-500">of Businesses</span>
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
                className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:border-primary/40 hover:text-slate-900 hover:bg-emerald-50 transition-all duration-300 cursor-default"
              >
                <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0" />
                {biz}
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-10 text-slate-400 text-sm"
          >
            Not sure if we can help your business? Just message us — we'll tell you honestly.
          </motion.p>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 md:py-32 px-4 border-t border-slate-200">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <p className="text-xs font-black tracking-[0.3em] text-primary uppercase mb-4">Simple Process</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900">
              Getting Started is<br />
              <span className="text-slate-500">Easier Than You Think</span>
            </h2>
          </motion.div>

          <div className="relative flex flex-col gap-0">
            {/* vertical line */}
            <div className="absolute left-8 md:left-1/2 top-8 bottom-8 w-px bg-gradient-to-b from-primary/60 via-emerald-500/40 to-transparent hidden sm:block" style={{ transform: "translateX(-50%)" }} />

            {steps.map((step, i) => {
              const Icon = step.icon;
              const isRight = i % 2 === 1;
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
                    <div className="group p-7 rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60 hover:border-primary/30 hover:bg-emerald-50/60 transition-all duration-500">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-500 flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-white" strokeWidth={1.5} />
                        </div>
                        <span className="text-xs font-black tracking-[0.25em] text-primary uppercase">Step {step.num}</span>
                      </div>
                      <h3 className="text-xl font-black text-slate-900 mb-3">{step.title}</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>

                  {/* Center dot */}
                  <div className="hidden md:flex w-0 flex-col items-center justify-center relative z-10">
                    <div className="w-5 h-5 rounded-full bg-primary border-4 border-background shadow-[0_0_20px_rgba(5,150,105,0.4)]" />
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
      <section className="py-24 md:py-32 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-3xl overflow-hidden"
          >
            {/* glow border */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 rounded-3xl blur opacity-40" />
            <div className="relative rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 px-8 py-16 md:px-16 md:py-20 text-center">
              {/* ambient */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[400px] h-[300px] bg-primary/15 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-emerald-500/10 rounded-full blur-[100px]" />
              </div>

              <div className="relative">
                <div className="flex items-center justify-center gap-2 mb-6">
                  <SiMeta className="w-5 h-5 text-slate-600" />
                  <span className="text-slate-400 text-xs">+</span>
                  <SiGoogleads className="w-5 h-5 text-yellow-500" />
                </div>

                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-slate-900 mb-6">
                  Ready to Scale?<br />
                  <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
                    Let's Talk on Telegram.
                  </span>
                </h2>

                <p className="text-slate-600 text-lg mb-10 max-w-xl mx-auto">
                  Message us your business details and budget. We'll get your agency account live within 24–48 hours.
                </p>

                <a
                  href={TELEGRAM}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cta="advertise-final-cta"
                  className="group relative inline-flex items-center gap-3 px-10 py-5 rounded-full bg-emerald-600 text-white font-black text-base uppercase tracking-widest overflow-hidden shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-600/30 transition-all duration-300"
                >
                  <span className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300 rounded-full" />
                  <SiTelegram className="w-5 h-5 relative" />
                  <span className="relative">Message Us on Telegram</span>
                  <ArrowRight className="w-5 h-5 relative group-hover:translate-x-1 transition-transform" />
                </a>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-slate-400">
                  {["No contracts", "No lock-in", "Cancel anytime"].map((t) => (
                    <div key={t} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
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
