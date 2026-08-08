import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Check,
  TrendingUp,
  DollarSign,
  Target,
  Activity,
  Zap,
  Shield,
  Users,
  Globe,
  Layers,
  Rocket,
  BarChart3,
} from "lucide-react";
import { SiMeta, SiGoogleads } from "react-icons/si";
import PageWrapper from "@/components/layout/PageWrapper";
import LightBeams from "@/components/LightBeams";
import { useAuth } from "@/hooks/useAuth";

/* ─────────────────────────────────────────────
   DATA
   ───────────────────────────────────────────── */

const META_BENEFITS = [
  { Icon: TrendingUp, title: "High Spending Capacity", body: "Run six-figure daily budgets without hitting platform throttles." },
  { Icon: Shield, title: "Better Stability For Scaling", body: "Tier-1 infrastructure resilient to spikes, peaks and aggressive scaling." },
  { Icon: Zap, title: "Lower Restriction Risk", body: "Built on agency MCC trust signals — fewer flags, fewer pauses." },
  { Icon: Rocket, title: "Faster Campaign Scaling", body: "Skip learning-phase delays. Push budgets 2-5x without resets." },
  { Icon: Layers, title: "Multiple Business Support", body: "Run unlimited BMs and verticals under a single agency umbrella." },
  { Icon: Globe, title: "Agency-Level Infrastructure", body: "Direct access to Meta's agency-tier ecosystem and tooling." },
  { Icon: Users, title: "Team Access Support", body: "Add unlimited team members, media buyers, and creative leads." },
  { Icon: BarChart3, title: "Long-Term Advertising Setup", body: "Stable accounts built for years of growth, not weeks of testing." },
  { Icon: Activity, title: "Faster Activation", body: "Live and spending in under 60 minutes — not 3–7 day waits." },
  { Icon: Target, title: "Better Campaign Management", body: "Premium support, performance reviews, and growth consultations." },
];

const GOOGLE_BENEFITS = [
  { Icon: DollarSign, title: "Higher Advertising Capacity", body: "Lift daily budgets aggressively without spend-cap warnings." },
  { Icon: TrendingUp, title: "Better Campaign Scaling", body: "Scale Search, PMax and YouTube without account suspensions." },
  { Icon: Shield, title: "Agency Support", body: "Backed by tier-1 Google Premier Partner relationships." },
  { Icon: Layers, title: "Multi-Niche Compatibility", body: "Run ecom, leads, SaaS, finance — across categories under one roof." },
  { Icon: Globe, title: "Business Friendly Structure", body: "Clean billing, MCC structure, full invoice transparency." },
  { Icon: Activity, title: "Better Stability", body: "Reduced policy strike risk and faster recovery support." },
  { Icon: Rocket, title: "Faster Launch Support", body: "Pre-warmed accounts ready for immediate high-volume launches." },
  { Icon: Users, title: "Team Collaboration", body: "Multi-user access with role-based controls and audit trails." },
  { Icon: BarChart3, title: "Enterprise Environment", body: "Built on the same infrastructure trusted by Fortune-500 buyers." },
  { Icon: Sparkles, title: "Long-Term Growth Support", body: "Quarterly account reviews, optimisation help, scale roadmaps." },
];

const COMPARISON_ROWS = [
  { label: "Daily Spend Capacity", meta: "Unlimited", google: "Unlimited" },
  { label: "Activation Time", meta: "< 1 hour", google: "< 2 hours" },
  { label: "Account Type", meta: "Agency MCC / BM", google: "MCC Premier" },
  { label: "Verticals Supported", meta: "Whitehat + Greyhat", google: "Whitehat + Greyhat" },
  { label: "Replacement Policy", meta: "Lifetime", google: "Lifetime" },
  { label: "Team Access", meta: "Unlimited Seats", google: "Unlimited Seats" },
  { label: "Restriction Risk", meta: "Lowest in market", google: "Lowest in market" },
  { label: "Support Channel", meta: "24/7 Telegram + WA", google: "24/7 Telegram + WA" },
  { label: "Best For", meta: "Ecom, Leads, Apps", google: "Search, PMax, YouTube" },
];

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   PANEL CTA - real client panel access
   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

function PanelCTA({ platform }: { platform: "meta" | "google" }) {
  const { user } = useAuth();
  const isMeta = platform === "meta";

  if (user) {
    return (
      <div className="relative w-full max-w-md mx-auto">
        <div className="absolute -inset-4 bg-gradient-to-br from-emerald-500/15 to-teal-500/10 rounded-3xl blur-2xl opacity-60" />
        <div className="relative rounded-2xl border border-emerald-200 bg-white shadow-[0_30px_80px_-20px_rgba(15,23,42,0.15)] overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-200 bg-gradient-to-r from-emerald-50 to-transparent">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center">
              {isMeta ? <SiMeta className="w-5 h-5 text-white" /> : <SiGoogleads className="w-5 h-5 text-white" />}
            </div>
            <div>
              <div className="text-xs font-black text-slate-900 uppercase tracking-wider">Your Client Panel</div>
              <div className="text-[10px] text-slate-500">Live balance &middot; requests &middot; accounts</div>
            </div>
          </div>
          <div className="p-6">
            <h3 className="text-lg font-black uppercase tracking-tight text-slate-900 mb-2">Welcome back</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              Track your balance, ad-account requests and account status in your real dashboard.
            </p>
            <Link href="/app/dashboard" className="inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-xl bg-emerald-600 text-white font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-colors duration-300">
              Open Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="absolute -inset-4 bg-gradient-to-br from-primary/15 to-teal-500/10 rounded-3xl blur-2xl opacity-60" />
      <div className="relative rounded-2xl border border-slate-200 bg-white shadow-[0_30px_80px_-20px_rgba(15,23,42,0.15)] overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-200 bg-gradient-to-r from-primary/10 to-transparent">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
            {isMeta ? <SiMeta className="w-5 h-5 text-primary" /> : <SiGoogleads className="w-5 h-5 text-teal-600" />}
          </div>
          <div>
            <div className="text-xs font-black text-slate-900 uppercase tracking-wider">Apply for Access</div>
            <div className="text-[10px] text-slate-500">Takes less than 5 minutes</div>
          </div>
        </div>
        <div className="p-6">
          <ul className="space-y-2.5 mb-6">
            {["Activation in under 60 minutes", "Lifetime replacement included", "Unlimited team seats"].map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-slate-700">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> {f}
              </li>
            ))}
          </ul>
          <Link href="/apply-agency" className="inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-xl bg-emerald-600 text-white font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-colors duration-300">
            Apply for Account <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
/* ─────────────────────────────────────────────
   PAGE
   ───────────────────────────────────────────── */

export default function AgencyAccounts() {

  return (
    <PageWrapper>
      {/* Ambient ─────────────────────────────────── */}
      <div className="absolute top-32 left-0 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[40%] right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[80%] left-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative min-h-[80vh] md:min-h-[88vh] pt-24 md:pt-28 pb-16 flex items-center overflow-hidden">
        <LightBeams />

        <div className="container mx-auto px-4 max-w-6xl relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 backdrop-blur mb-6 md:mb-8">
            <Sparkles className="w-3 h-3 text-primary" />
            <span className="text-[10px] font-black tracking-[0.2em] text-primary uppercase">Agency Ad Accounts</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="text-[2.5rem] sm:text-5xl md:text-7xl lg:text-[6rem] font-black uppercase tracking-tighter leading-[0.95] mb-6 md:mb-8 break-words">
            Premium <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">Agency</span><br />
            Advertising <span className="font-light italic text-slate-600">Accounts.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }} className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed mb-8 md:mb-10">
            Built for advertisers, agencies and scaling businesses. Unlimited spend, lifetime replacement, tier-1 infrastructure.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5 }} className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <a href="#meta" className="group relative inline-flex items-center justify-center gap-3 px-8 md:px-10 py-4 md:py-5 rounded-full bg-emerald-600 text-white font-black text-sm uppercase tracking-widest overflow-hidden shadow-lg shadow-emerald-600/25 hover:bg-emerald-700 transition-colors duration-300">
              <SiMeta className="relative w-4 h-4" />
              <span className="relative">Meta Accounts</span>
              <ArrowRight className="relative w-4 h-4" />
            </a>
            <a href="#google" className="group relative inline-flex items-center justify-center gap-3 px-8 md:px-10 py-4 md:py-5 rounded-full border border-slate-300 bg-white text-slate-900 font-black text-sm uppercase tracking-widest hover:bg-slate-100 transition-colors">
              <SiGoogleads className="w-4 h-4 text-teal-600" />
              <span>Google Accounts</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>

          {/* Trust badges */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.7 }} className="mt-10 md:mt-14 flex flex-wrap items-center justify-center gap-4 md:gap-6 text-[10px] md:text-xs text-slate-500 font-bold uppercase tracking-widest">
            <div className="flex items-center gap-2"><Check className="w-3 h-3 text-emerald-600" /> Tier-1 Agency</div>
            <div className="hidden sm:block w-px h-3 bg-slate-200" />
            <div className="flex items-center gap-2"><Check className="w-3 h-3 text-emerald-600" /> Unlimited Spend</div>
            <div className="hidden sm:block w-px h-3 bg-slate-200" />
            <div className="flex items-center gap-2"><Check className="w-3 h-3 text-emerald-400" /> Lifetime Replacement</div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ META SECTION ═══════════════ */}
      <section id="meta" className="py-16 md:py-24 relative scroll-mt-24">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Eyebrow */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-10 md:mb-16">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-3 flex items-center gap-2">
              <SiMeta className="w-3.5 h-3.5" /> Meta Agency Ad Accounts
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.95] max-w-4xl">
              The Meta infrastructure <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">serious advertisers</span> run on.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-14 items-start">
            {/* LEFT — Panel */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }} className="lg:col-span-5 lg:sticky lg:top-28">
              <PanelCTA platform="meta" />
            </motion.div>

            {/* RIGHT — Benefits */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                {META_BENEFITS.map((b, i) => {
                  const Icon = b.Icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.5, delay: i * 0.04 }}
                      whileHover={{ y: -3 }}
                      className="relative group"
                    >
                      <div className="absolute -inset-0.5 bg-gradient-to-br from-primary/30 to-teal-500/20 rounded-2xl blur opacity-0 group-hover:opacity-80 transition-opacity duration-500" />
                      <div className="relative rounded-2xl border border-slate-200 bg-white p-4 md:p-5 overflow-hidden h-full shadow-lg shadow-slate-200/60">
                        <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative">
                          <div className="flex items-start gap-3 mb-2">
                            <div className="w-9 h-9 rounded-xl border border-emerald-200 bg-emerald-50 flex items-center justify-center shrink-0 group-hover:shadow-[0_0_15px_rgba(5,150,105,0.3)] transition-shadow">
                              <Icon className="w-4 h-4 text-emerald-600" />
                            </div>
                            <h3 className="text-sm md:text-base font-black uppercase tracking-tight leading-tight pt-1.5 text-slate-900">{b.title}</h3>
                          </div>
                          <p className="text-xs md:text-sm text-slate-600 leading-relaxed">{b.body}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Meta CTA card */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.7 }} className="mt-10 md:mt-16">
            <div className="relative group rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 opacity-15" />
              <motion.div animate={{ x: ["-100%", "200%"] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} className="absolute top-0 left-0 w-1/3 h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
              <div className="relative rounded-3xl border border-emerald-200 bg-white p-7 sm:p-10 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-slate-200/60">
                <div className="text-center md:text-left">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-2">Ready in &lt; 1 hour</div>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tighter leading-tight text-slate-900">
                    Scale faster with <br className="hidden sm:block" />
                    <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">Meta agency accounts.</span>
                  </h3>
                </div>
                <a href="https://t.me/RazrMarketing" target="_blank" rel="noopener noreferrer" className="shrink-0 inline-flex items-center gap-3 px-7 md:px-9 py-4 md:py-5 rounded-full bg-emerald-600 text-white font-black text-sm uppercase tracking-widest hover:bg-emerald-700 transition-colors duration-300">
                  Get Meta Access <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ GOOGLE SECTION ═══════════════ */}
      <section id="google" className="py-16 md:py-24 relative scroll-mt-24">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-10 md:mb-16 md:text-right">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-600 mb-3 flex items-center gap-2 md:justify-end">
              <SiGoogleads className="w-3.5 h-3.5" /> Google Agency Ad Accounts
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.95] max-w-4xl md:ml-auto text-slate-900">
              Enterprise-grade <span className="bg-gradient-to-r from-teal-600 via-emerald-600 to-emerald-500 bg-clip-text text-transparent">Google Ads</span> for serious growth.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-14 items-start">
            {/* LEFT — Benefits */}
            <div className="lg:col-span-7 lg:order-1 order-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                {GOOGLE_BENEFITS.map((b, i) => {
                  const Icon = b.Icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.5, delay: i * 0.04 }}
                      whileHover={{ y: -3 }}
                      className="relative group"
                    >
                      <div className="absolute -inset-0.5 bg-gradient-to-br from-teal-600/30 to-emerald-500/20 rounded-2xl blur opacity-0 group-hover:opacity-80 transition-opacity duration-500" />
                      <div className="relative rounded-2xl border border-slate-200 bg-white p-4 md:p-5 overflow-hidden h-full shadow-lg shadow-slate-200/60">
                        <div className="absolute -top-12 -right-12 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative">
                          <div className="flex items-start gap-3 mb-2">
                            <div className="w-9 h-9 rounded-xl border border-teal-200 bg-teal-50 flex items-center justify-center shrink-0 group-hover:shadow-[0_0_15px_rgba(20,184,166,0.3)] transition-shadow">
                              <Icon className="w-4 h-4 text-teal-600" />
                            </div>
                            <h3 className="text-sm md:text-base font-black uppercase tracking-tight leading-tight pt-1.5 text-slate-900">{b.title}</h3>
                          </div>
                          <p className="text-xs md:text-sm text-slate-600 leading-relaxed">{b.body}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT — Panel */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }} className="lg:col-span-5 lg:order-2 order-1 lg:sticky lg:top-28">
              <PanelCTA platform="google" />
            </motion.div>
          </div>

          {/* Google CTA */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.7 }} className="mt-10 md:mt-16">
            <div className="relative group rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-600 via-emerald-500 to-emerald-600 opacity-15" />
              <motion.div animate={{ x: ["200%", "-100%"] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} className="absolute top-0 left-0 w-1/3 h-px bg-gradient-to-r from-transparent via-teal-500 to-transparent" />
              <div className="relative rounded-3xl border border-teal-200 bg-white p-7 sm:p-10 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-slate-200/60">
                <div className="text-center md:text-left">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-600 mb-2">Live in &lt; 2 hours</div>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tighter leading-tight text-slate-900">
                    Grow with <br className="hidden sm:block" />
                    <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">Google agency accounts.</span>
                  </h3>
                </div>
                <a href="https://t.me/RazrMarketing" target="_blank" rel="noopener noreferrer" className="shrink-0 inline-flex items-center gap-3 px-7 md:px-9 py-4 md:py-5 rounded-full bg-emerald-600 text-white font-black text-sm uppercase tracking-widest hover:bg-emerald-700 transition-colors duration-300">
                  Get Google Access <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ COMPARISON ═══════════════ */}
      <section className="py-16 md:py-24 relative">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-10 md:mb-14">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-3">Side By Side</div>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.95] text-slate-900">
              Meta vs <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">Google.</span>
            </h2>
            <p className="text-base md:text-lg text-slate-600 mt-4 md:mt-5 max-w-2xl mx-auto">Both built on tier-1 agency infrastructure. Pick what fits your funnel — or run both in parallel.</p>
          </motion.div>

          {/* Header cards (always visible) */}
          <div className="grid grid-cols-2 gap-3 md:gap-6 mb-3 md:mb-4">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="relative group rounded-2xl md:rounded-3xl overflow-hidden">
              <div className="absolute -inset-0.5 bg-gradient-to-br from-primary/50 to-teal-500/30 rounded-2xl md:rounded-3xl blur opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative rounded-2xl md:rounded-3xl border border-primary/30 bg-white p-4 md:p-6 text-center shadow-lg shadow-slate-200/60">
                <div className="inline-flex w-10 h-10 md:w-12 md:h-12 rounded-2xl border border-emerald-200 bg-emerald-50 items-center justify-center mb-2 md:mb-3">
                  <SiMeta className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                </div>
                <h3 className="text-base md:text-2xl font-black uppercase tracking-tight text-slate-900">Meta Agency</h3>
                <p className="text-[10px] md:text-xs text-slate-500 uppercase tracking-wider mt-0.5">Facebook · IG · WA · Messenger</p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }} className="relative group rounded-2xl md:rounded-3xl overflow-hidden">
              <div className="absolute -inset-0.5 bg-gradient-to-br from-teal-600/50 to-emerald-500/30 rounded-2xl md:rounded-3xl blur opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative rounded-2xl md:rounded-3xl border border-teal-200 bg-white p-4 md:p-6 text-center shadow-lg shadow-slate-200/60">
                <div className="inline-flex w-10 h-10 md:w-12 md:h-12 rounded-2xl border border-teal-200 bg-teal-50 items-center justify-center mb-2 md:mb-3">
                  <SiGoogleads className="w-5 h-5 md:w-6 md:h-6 text-teal-600" />
                </div>
                <h3 className="text-base md:text-2xl font-black uppercase tracking-tight text-slate-900">Google Agency</h3>
                <p className="text-[10px] md:text-xs text-slate-500 uppercase tracking-wider mt-0.5">Search · PMax · YT · Display</p>
              </div>
            </motion.div>
          </div>

          {/* Comparison rows */}
          <div className="rounded-2xl md:rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60 overflow-hidden">
            {COMPARISON_ROWS.map((row, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className={`grid grid-cols-[1.1fr_1fr_1fr] md:grid-cols-3 gap-2 md:gap-6 px-3 md:px-6 py-3 md:py-4 items-center ${
                  i !== COMPARISON_ROWS.length - 1 ? "border-b border-slate-200" : ""
                } hover:bg-slate-50 transition-colors`}
              >
                <div className="text-[11px] md:text-sm font-bold text-slate-500 uppercase tracking-wider leading-tight">{row.label}</div>
                <div className="text-xs md:text-sm font-black text-slate-900 text-center flex items-center justify-center gap-1.5">
                  <Check className="w-3 h-3 md:w-3.5 md:h-3.5 text-primary shrink-0" />
                  <span className="truncate">{row.meta}</span>
                </div>
                <div className="text-xs md:text-sm font-black text-slate-900 text-center flex items-center justify-center gap-1.5">
                  <Check className="w-3 h-3 md:w-3.5 md:h-3.5 text-teal-600 shrink-0" />
                  <span className="truncate">{row.google}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FINAL CTA ═══════════════ */}
      <section className="py-12 md:py-20 relative">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.7 }} className="relative group rounded-3xl overflow-hidden">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 16, repeat: Infinity, ease: "linear" }} className="absolute inset-[-200%] bg-[conic-gradient(from_0deg,transparent_0deg,rgba(5,150,105,0.4)_60deg,transparent_120deg,rgba(20,184,166,0.4)_240deg,transparent_300deg)] opacity-40" />
            <div className="relative rounded-3xl border border-emerald-200 bg-white p-7 sm:p-10 md:p-16 text-center overflow-hidden shadow-xl shadow-slate-200/60">
              <motion.div animate={{ x: ["-100%", "200%"] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} className="absolute top-0 left-0 w-1/3 h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
              <motion.div animate={{ x: ["200%", "-100%"] }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute bottom-0 right-0 w-1/3 h-px bg-gradient-to-r from-transparent via-teal-500 to-transparent" />

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 backdrop-blur mb-5 md:mb-6">
                <Sparkles className="w-3 h-3 text-primary" />
                <span className="text-[10px] font-black tracking-[0.2em] text-primary uppercase">Need Agency Access?</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[1.05] mb-5 md:mb-6 text-slate-900">
                Skip the wait. <br />
                <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">Start scaling today.</span>
              </h2>
              <p className="text-base md:text-lg text-slate-600 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed">
                Pick Meta, Google, or both — our team activates accounts in under 60 minutes. No commitment to start, no sales pitch.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <a href="https://t.me/RazrMarketing" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-3 px-8 md:px-10 py-4 md:py-5 rounded-full bg-emerald-600 text-white font-black text-sm uppercase tracking-widest hover:bg-emerald-700 transition-colors duration-300">
                  Get Started <ArrowRight className="w-4 h-4" />
                </a>
                <Link href="/contact" className="inline-flex items-center justify-center gap-3 px-8 md:px-10 py-4 md:py-5 rounded-full border border-slate-300 bg-white text-slate-900 font-black text-sm uppercase tracking-widest hover:bg-slate-100 transition-colors duration-300">
                  Talk to Sales <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </PageWrapper>
  );
}