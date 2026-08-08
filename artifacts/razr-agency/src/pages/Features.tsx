import PageWrapper from "@/components/layout/PageWrapper";
import { motion } from "framer-motion";
import { Link } from "wouter";
import LightBeams from "@/components/LightBeams";
import { buildWaLink } from "@/lib/whatsapp";
import {
  Shield, Zap, Users, TrendingUp, DollarSign, Globe2, Rocket,
  ArrowRight, Check, X, Crown, Award, Clock, RefreshCw,
  Headphones, FileCheck, BadgeCheck, ShieldCheck, Layers, Building2,
  Coins, Dice5, HeartHandshake, Pill, Cigarette, Banknote, Gift,
  Home as HomeIcon, ShoppingBag, Bitcoin, Sparkle, GraduationCap,
  Activity, Wallet, Receipt, MessageCircle, Languages, PhoneCall,
  Target, BarChart3, Database, Quote, Trophy, Diamond, Star, Flame,
  type LucideIcon,
} from "lucide-react";

// ────────────────────────────────────────────────────────────
// DATA
// ────────────────────────────────────────────────────────────
const NICHES: { Icon: LucideIcon; name: string; tag: string }[] = [
  { Icon: Coins, name: "Trading / Forex", tag: "Crypto signals OK" },
  { Icon: Dice5, name: "Gambling / Casino", tag: "Betting & fantasy" },
  { Icon: HeartHandshake, name: "Adult / Dating", tag: "Soft-adult allowed" },
  { Icon: Pill, name: "Nutra / Supplements", tag: "Weight loss OK" },
  { Icon: Cigarette, name: "CBD / Vape", tag: "Tobacco-adjacent" },
  { Icon: Banknote, name: "Loans / Lending", tag: "Insurance too" },
  { Icon: Gift, name: "Sweepstakes / Cashback", tag: "Affiliate friendly" },
  { Icon: HomeIcon, name: "Real Estate / Lead Gen", tag: "All countries" },
  { Icon: ShoppingBag, name: "Dropshipping / Gray-Hat", tag: "E-com OK" },
  { Icon: Bitcoin, name: "NFT / Web3 / Crypto", tag: "Exchanges allowed" },
  { Icon: Sparkle, name: "Astrology / Tarot", tag: "Spiritual niches" },
  { Icon: GraduationCap, name: "Edu / Coaching / Jobs", tag: "Info products" },
];

const REASONS: { Icon: LucideIcon; title: string; body: string }[] = [
  { Icon: BadgeCheck, title: "Whitelisted Agency BM", body: "Meta-verified Tier-1 partner status. Policy enforcement is relaxed for whitelisted BMs — what gets your personal account banned doesn't trigger ours." },
  { Icon: Clock, title: "Pre-Warmed Aged Accounts", body: "Every account has 90+ days of real spend history. Fresh accounts get flagged instantly — ours look like established advertisers from minute one." },
  { Icon: Crown, title: "Tier-1 BM (not Tier-3 Reseller)", body: "Most agencies resell Tier-3 BMs that collapse in weeks. We provide direct Tier-1 partner accounts with the highest possible trust score." },
  { Icon: ShieldCheck, title: "Domain Pre-Verified", body: "Business verification, domain ownership, and pixel setup are completed before handover. You skip the most common ban triggers." },
  { Icon: PhoneCall, title: "Direct Meta Rep Channel", body: "Disputes go straight to a Meta partner rep — not through public support tickets. Most policy flags get reversed within 24 hours." },
  { Icon: Activity, title: "Daily Health Monitoring", body: "Our team watches account quality scores proactively. Issues are caught and fixed before they become bans." },
];

const REPLACEMENT_STEPS = [
  { Icon: MessageCircle, title: "You Report", body: "Message us on Telegram the moment an account is restricted — anytime, any day." },
  { Icon: Clock, title: "24-Hour SLA", body: "New account assigned and activated within 1 working day. No paperwork, no waiting." },
  { Icon: RefreshCw, title: "Lifetime Cover", body: "Free replacements forever. Same spend capacity, same Tier-1 BM, no questions asked." },
];

const SPEND_FEATURES: { Icon: LucideIcon; title: string; body: string }[] = [
  { Icon: Rocket, title: "$10K+ Daily Spend Day 1", body: "No warmup needed — push full budget on your first campaign, first hour." },
  { Icon: TrendingUp, title: "No Daily / Lifetime Caps", body: "Lifetime Access removes all spend ceilings. Scale to any number you want." },
  { Icon: Globe2, title: "Multi-Region Targeting", body: "US, UK, Australia, EU, Asia, Middle East — all geographies unlocked." },
  { Icon: Wallet, title: "Multi-Currency Campaigns", body: "Run in USD, EUR, HKD, GBP, AED — switch per campaign, not per account." },
  { Icon: Layers, title: "Multi-Pixel on Single BM", body: "Track multiple websites and funnels from one Business Manager." },
  { Icon: Target, title: "Custom + Lookalike Audiences", body: "Full Custom Audience and Lookalike features unlocked from day one." },
];

const COMPARISON: { feature: string; normal: string; razr: string }[] = [
  { feature: "Trading / Gambling / Crypto Ads", normal: "Banned instantly", razr: "Fully allowed" },
  { feature: "Daily Spend Limit", normal: "$500 (new accounts)", razr: "$10K+ from Day 1" },
  { feature: "Ban Risk", normal: "High — random flags", razr: "Near zero" },
  { feature: "Replacement Policy", normal: "None — start over", razr: "Lifetime free" },
  { feature: "Setup Time", normal: "7-14 days verification", razr: "60 minutes" },
  { feature: "Support", normal: "Chatbot only", razr: "Dedicated manager" },
  { feature: "Account Age", normal: "Fresh (flagged)", razr: "Pre-warmed 90+ days" },
  { feature: "Meta Escalation Channel", normal: "Public ticket queue", razr: "Direct partner rep" },
  { feature: "Multi-Region Targeting", normal: "Limited by country", razr: "All geos unlocked" },
  { feature: "Pixel & CAPI Setup", normal: "DIY", razr: "Done for you" },
];

const QUALITY_SPECS: { Icon: LucideIcon; title: string; body: string }[] = [
  { Icon: Crown, title: "Tier-1 Business Manager", body: "Top 1% Meta partner-level BM with maximum trust score." },
  { Icon: Clock, title: "90+ Day Aged Accounts", body: "Real spend history pre-loaded — no fresh-account flags." },
  { Icon: FileCheck, title: "Verified Payment Methods", body: "Payment + billing already attached and approved by Meta." },
  { Icon: ShieldCheck, title: "High Trust Score", body: "Account health rated 'Good' or better before handover." },
  { Icon: Database, title: "Full Credentials Handover", body: "You own the login — full admin access, not shared seats." },
];

const SUPPORT_FEATURES: { Icon: LucideIcon; title: string; body: string }[] = [
  { Icon: Users, title: "Dedicated Account Manager", body: "One human, not a queue. Same person handles your account for life." },
  { Icon: MessageCircle, title: "Telegram", body: "Reach us where you actually chat — not via slow email tickets." },
  { Icon: Zap, title: "12-Min Avg Response", body: "Real-time support across global timezones — Asia, Europe, Americas." },
  { Icon: Languages, title: "English + Global Support", body: "Talk in the language you're comfortable in. No translation gaps." },
  { Icon: Headphones, title: "Free Onboarding Call", body: "30-min strategy + setup call included with Lifetime Access plan." },
  { Icon: PhoneCall, title: "Direct Meta Escalation", body: "Disputes routed directly to Meta partner rep — fastest possible resolution." },
];

const BONUS_FEATURES: { Icon: LucideIcon; title: string; body: string }[] = [
  { Icon: BarChart3, title: "Conversion API (CAPI) Help", body: "We help you set up server-side tracking for iOS 14.5+ accuracy." },
  { Icon: Database, title: "Pixel Data Transfer", body: "Migrate existing pixel data to your new agency account smoothly." },
  { Icon: TrendingUp, title: "CBO / ABO Setup Ready", body: "Campaign Budget Optimization configured and tested before handover." },
  { Icon: Building2, title: "Multi-Account Management", body: "Guidance on scaling to 5, 10, 20+ accounts as you grow." },
  { Icon: Receipt, title: "Tax Invoice — Every Payment", body: "Compliant invoices in your business name for every transaction." },
  { Icon: Award, title: "Free Strategy Consultation", body: "Get our team's media-buying playbook — what works in your niche." },
];

const HERO_STATS = [
  { v: "5,000+", l: "Accounts delivered" },
  { v: "0", l: "Random bans" },
  { v: "24hr", l: "Replacement SLA" },
  { v: "$500M+", l: "Spend processed" },
  { v: "60min", l: "Activation" },
  { v: "12min", l: "Avg support" },
];

const RECOGNITIONS = [
  { Icon: Trophy, label: "Meta Business Partner Level" },
  { Icon: ShieldCheck, label: "ISO-Style Trust Process" },
  { Icon: Diamond, label: "Tier-1 BM Network" },
  { Icon: Star, label: "5,000+ Advertisers Worldwide" },
  { Icon: Flame, label: "$500M+ Ad Spend Routed" },
];

// ────────────────────────────────────────────────────────────
// PREMIUM UI HELPERS
// ────────────────────────────────────────────────────────────

// Subtle blueprint grid background
function BlueprintGrid() {
  return (
    <div
      className="absolute inset-0 opacity-[0.06] pointer-events-none"
      style={{
        backgroundImage:
          "linear-gradient(rgba(15,23,42,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,.08) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
        maskImage: "radial-gradient(ellipse 80% 60% at 50% 30%, black 40%, transparent 80%)",
      }}
    />
  );
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="container mx-auto px-4 max-w-7xl py-3 md:py-4">
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-slate-200" />
        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
          {label}
        </span>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent via-slate-200 to-slate-200" />
      </div>
    </div>
  );
}

function SectionHeader({ no, kicker, title, subtitle }: { no: string; kicker: string; title: React.ReactNode; subtitle?: string }) {
  return (
    <div className="mb-10 md:mb-14">
      <div className="inline-flex items-center gap-2 mb-4">
        <span className="text-[9px] md:text-[10px] font-black tabular-nums px-2 py-0.5 rounded-full border border-primary/30 bg-primary/10 text-primary">
          {no}
        </span>
        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">
          {kicker}
        </span>
      </div>
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-[0.95] mb-3 md:mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-base md:text-lg text-slate-600 max-w-2xl leading-relaxed">{subtitle}</p>
      )}
    </div>
  );
}

export default function Features() {
  return (
    <PageWrapper>
      {/* Ambient glows */}
      <div className="absolute top-32 left-0 w-[600px] h-[600px] bg-primary/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[35%] right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[65%] left-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[85%] right-1/4 w-[500px] h-[500px] bg-amber-500/8 rounded-full blur-[140px] pointer-events-none" />

      {/* ─────────────── HERO ─────────────── */}
      <section className="relative min-h-[78vh] md:min-h-[82vh] pt-24 md:pt-28 pb-10 md:pb-12 flex items-center overflow-hidden">
        <LightBeams />
        <BlueprintGrid />
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            {/* Hero badge with shine */}
            <div className="relative inline-flex mb-7 md:mb-9">
              <div className="absolute inset-0 bg-emerald-500/20 blur-xl opacity-60 rounded-full" />
              <div className="relative inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-emerald-200 bg-white shadow-lg shadow-emerald-100/50">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-[10px] font-black tracking-[0.25em] text-emerald-700 uppercase">
                  Ban-Proof Infrastructure · Est. 2024
                </span>
              </div>
            </div>

            <h1 className="text-[2.75rem] sm:text-5xl md:text-7xl lg:text-[7rem] font-black uppercase tracking-tighter leading-[0.92] mb-6 md:mb-8 break-words">
              Accounts that <br />
              <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
                don't get banned.
              </span><br />
              <span className="font-light italic text-slate-500 text-[1.9rem] sm:text-4xl md:text-6xl lg:text-[5rem]">
                Even for the gray niches.
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-2xl text-slate-600 max-w-3xl font-medium leading-relaxed">
              Trading. Gambling. Crypto. Nutra. Dating. Loans.
              All the verticals that destroy normal ad accounts —
              we run them on Tier-1 agency BMs with lifetime replacement cover.
            </p>

            {/* Stats bar */}
            <div className="mt-8 md:mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 md:gap-3 max-w-5xl">
              {HERO_STATS.map((c, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.06 }}
                  className="relative group rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60 px-3 py-3 md:px-4 md:py-4 hover:border-primary/40 transition-colors"
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/0 via-primary/0 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative text-lg md:text-2xl font-black text-slate-900 tabular-nums">{c.v}</div>
                  <div className="relative text-[9px] md:text-[10px] uppercase tracking-wider text-slate-500 font-bold mt-0.5">{c.l}</div>
                </motion.div>
              ))}
            </div>

            {/* Hero CTAs */}
            <div className="mt-8 md:mt-10 flex flex-wrap items-center gap-3">
              <a
                href={buildWaLink("general", { source: "features-hero" })}
                target="_blank"
                rel="noopener noreferrer"
                data-cta="features-hero-wa"
                className="btn-premium tap-spring inline-flex items-center justify-center gap-3 px-7 md:px-8 py-3.5 md:py-4 rounded-full bg-emerald-600 text-white font-black text-xs md:text-sm uppercase tracking-widest hover:bg-emerald-700 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Chat on Telegram
                <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                href="/contact"
                data-cta="features-hero-contact"
                className="btn-premium tap-spring inline-flex items-center justify-center gap-3 px-7 md:px-8 py-3.5 md:py-4 rounded-full border border-slate-300 text-slate-900 font-black text-xs md:text-sm uppercase tracking-widest hover:bg-slate-100 hover:border-slate-400"
              >
                Talk to Sales
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─────────────── RECOGNITION STRIP (premium trust bar) ─────────────── */}
      <section className="relative py-6 md:py-8 border-y border-slate-200 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center gap-2 mb-4 md:mb-5">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-slate-200" />
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 px-2">
              Recognized for · Trusted by · Built with
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-slate-200" />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
            {RECOGNITIONS.map((r, i) => {
              const Icon = r.Icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-slate-200 bg-white shadow-sm shadow-slate-200/60 hover:border-amber-300 hover:bg-amber-50 transition-colors"
                >
                  <Icon className="w-3.5 h-3.5 text-amber-500/80 group-hover:text-amber-600" />
                  <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-700 group-hover:text-slate-900">
                    {r.label}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────── 01 · ALLOWED NICHES ─────────────── */}
      <section className="py-16 md:py-24 relative">
        <div className="container mx-auto px-4 max-w-7xl">
          <SectionHeader
            no="01"
            kicker="Allowed Niches"
            title={<>Run the niches that <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">normal accounts can't.</span></>}
            subtitle="Every category below is fully approved on our agency BMs. No shadow-bans, no overnight kills, no policy roulette."
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
            {NICHES.map((n, i) => {
              const Icon = n.Icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.4, delay: (i % 4) * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="relative group rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60 p-4 md:p-5 overflow-hidden transition-colors hover:border-emerald-300"
                >
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-400/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Check className="w-3.5 h-3.5 text-emerald-600" strokeWidth={3.5} />
                  </div>
                  <div className="relative w-10 h-10 md:w-11 md:h-11 rounded-xl border border-primary/30 bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:-rotate-3 transition-transform">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="relative text-sm md:text-base font-black uppercase tracking-tight leading-tight mb-1 pr-7">
                    {n.name}
                  </h3>
                  <p className="relative text-[11px] md:text-xs text-slate-500 font-medium leading-snug">{n.tag}</p>
                </motion.div>
              );
            })}
          </div>

          <p className="mt-8 text-center text-xs md:text-sm text-slate-500">
            Niche not listed? <a href={buildWaLink("general", { source: "features-niche-ask" })} target="_blank" rel="noopener noreferrer" data-cta="features-niche-ask" className="text-primary font-bold hover:underline">Ask on Telegram →</a> (most are allowed)
          </p>
        </div>
      </section>

      <SectionDivider label="The Architecture · Why It Works" />

      {/* ─────────────── 02 · WHY NO BANS — ghost numbers ─────────────── */}
      <section className="py-16 md:py-24 relative">
        <div className="container mx-auto px-4 max-w-7xl">
          <SectionHeader
            no="02"
            kicker="Why No Bans"
            title={<>6 reasons our accounts <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">survive everything.</span></>}
            subtitle="Most agencies sell you the same Tier-3 BMs that get killed in 2 weeks. Here's what makes ours different."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {REASONS.map((r, i) => {
              const Icon = r.Icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="relative group rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60 p-6 md:p-8 overflow-hidden hover:border-primary/40 transition-colors min-h-[260px]"
                >
                  {/* Huge ghost number behind */}
                  <span
                    aria-hidden
                    className="absolute -top-4 -right-2 md:-top-6 md:-right-4 text-[7rem] md:text-[10rem] font-black leading-none text-slate-900/[0.04] group-hover:text-primary/10 transition-colors duration-500 select-none pointer-events-none tabular-nums"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {/* Hover glow */}
                  <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-2xl border border-primary/40 bg-primary/15 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        Reason {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="text-lg md:text-xl font-black uppercase tracking-tight mb-3 leading-tight">{r.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{r.body}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────── 03 · REPLACEMENT GUARANTEE ─────────────── */}
      <section className="py-16 md:py-24 relative">
        <div className="container mx-auto px-4 max-w-6xl">
          <SectionHeader
            no="03"
            kicker="Replacement Guarantee"
            title={<>Banned anyway? <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">New account in 24 hours.</span></>}
            subtitle="No paperwork. No reviews. No 'sorry, your case is unique.' Just a fresh Tier-1 account, free, forever."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 relative">
            <div className="hidden md:block absolute top-12 left-[16.66%] right-[16.66%] h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

            {REPLACEMENT_STEPS.map((s, i) => {
              const Icon = s.Icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="relative rounded-3xl border border-emerald-200 bg-white shadow-xl shadow-emerald-100/50 p-7 md:p-8 text-center overflow-hidden"
                >
                  <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl" />
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mx-auto mb-5 relative">
                      <Icon className="w-7 h-7 text-emerald-600" />
                      <span className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-emerald-600 text-white text-xs font-black flex items-center justify-center border-2 border-white tabular-nums">
                        {i + 1}
                      </span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-3">{s.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{s.body}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-6 text-center text-xs md:text-sm text-slate-500">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-slate-50">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Same spend capacity restored · Same Tier-1 BM · Carry-over balance protection
            </span>
          </div>
        </div>
      </section>

      {/* ─────────────── MEGA STAT BANNER — million-dollar centerpiece ─────────────── */}
      <section className="py-12 md:py-20 relative">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-white shadow-xl shadow-slate-200/60 p-8 md:p-14">
            {/* Animated conic backdrop */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[-200%] bg-[conic-gradient(from_0deg,transparent_0deg,rgba(5,150,105,0.30)_40deg,transparent_120deg,rgba(20,184,166,0.25)_220deg,transparent_300deg)] opacity-25"
            />
            <div className="absolute inset-px rounded-3xl bg-white/90" />

            {/* Moving shine line */}
            <motion.div
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 left-0 w-1/3 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
            />

            <div className="relative">
              <div className="text-center mb-8 md:mb-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-200 bg-amber-50 mb-4">
                  <Trophy className="w-3 h-3 text-amber-500" />
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-600">The Receipts</span>
                </div>
                <h2 className="text-3xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.95]">
                  Numbers that <br className="md:hidden"/>
                  <span className="text-slate-900">
                    speak louder than promises.
                  </span>
                </h2>
              </div>

              <div className="grid grid-cols-3 gap-3 md:gap-8 text-center">
                {[
                  { v: "0", l: "Random bans in 2026", sub: "Across all Lifetime Access accounts" },
                  { v: "5,000+", l: "Accounts delivered", sub: "Across 12+ verticals" },
                  { v: "$500M+", l: "Ad spend processed", sub: "Through our agency BMs" },
                ].map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                  >
                    <div className="text-4xl sm:text-6xl md:text-8xl font-black tabular-nums leading-none mb-2 md:mb-3 text-slate-900">
                      {s.v}
                    </div>
                    <div className="text-[10px] sm:text-xs md:text-sm font-black uppercase tracking-wider text-slate-700 leading-tight">
                      {s.l}
                    </div>
                    <div className="hidden md:block text-[11px] text-slate-400 mt-1.5 font-medium">{s.sub}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────── 04 · SPEND & PERFORMANCE ─────────────── */}
      <section className="py-16 md:py-24 relative">
        <div className="container mx-auto px-4 max-w-7xl">
          <SectionHeader
            no="04"
            kicker="Spend & Performance"
            title={<>Scale without <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">spend ceilings.</span></>}
            subtitle="Every limit a normal account hits — daily caps, region locks, currency restrictions — gone."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {SPEND_FEATURES.map((f, i) => {
              const Icon = f.Icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="relative group rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60 p-6 md:p-7 overflow-hidden hover:border-primary/40 transition-colors"
                >
                  <div className="absolute -top-16 -right-16 w-44 h-44 bg-primary/15 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl border border-primary/40 bg-primary/15 flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-base md:text-lg font-black uppercase tracking-tight mb-2 leading-tight">{f.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{f.body}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <SectionDivider label="The Comparison · Side By Side" />

      {/* ─────────────── 05 · COMPARISON TABLE — premium with winning column glow ─────────────── */}
      <section className="py-16 md:py-24 relative">
        <div className="container mx-auto px-4 max-w-6xl">
          <SectionHeader
            no="05"
            kicker="Head to Head"
            title={<>Normal account vs <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">Razr Marketing.</span></>}
            subtitle="The truth no agency wants you to compare directly."
          />

          <div className="relative rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60 overflow-hidden">
            {/* Subtle vertical highlight on RAZR column */}
            <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-primary/10 via-primary/5 to-transparent pointer-events-none" />
            <motion.div
              animate={{ y: ["-100%", "200%"] }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              className="absolute right-0 top-0 w-1/3 h-1/4 bg-gradient-to-b from-transparent via-primary/10 to-transparent pointer-events-none"
            />

            {/* Header row */}
            <div className="relative grid grid-cols-3 gap-2 md:gap-4 px-4 md:px-6 py-4 md:py-5 border-b border-slate-200 bg-slate-50">
              <div className="text-[10px] md:text-xs font-black uppercase tracking-[0.15em] text-slate-500">Feature</div>
              <div className="text-[10px] md:text-xs font-black uppercase tracking-[0.15em] text-slate-500 flex items-center gap-1.5">
                <X className="w-3 h-3 text-red-500" /> Normal Account
              </div>
              <div className="text-[10px] md:text-xs font-black uppercase tracking-[0.15em] text-primary flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3" /> Razr Marketing
              </div>
            </div>

            {COMPARISON.map((row, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.03 }}
                className={`relative grid grid-cols-3 gap-2 md:gap-4 px-4 md:px-6 py-3.5 md:py-4 border-b border-slate-200 last:border-b-0 transition-colors hover:bg-slate-50 ${i % 2 === 0 ? "bg-slate-50/60" : ""}`}
              >
                <div className="text-xs md:text-sm font-bold text-slate-900 leading-snug">{row.feature}</div>
                <div className="text-xs md:text-sm text-slate-500 leading-snug flex items-start gap-2">
                  <X className="w-3.5 h-3.5 text-red-500/70 shrink-0 mt-0.5" />
                  <span>{row.normal}</span>
                </div>
                <div className="text-xs md:text-sm text-slate-900 leading-snug flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" strokeWidth={3} />
                  <span className="font-semibold">{row.razr}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────── 06 · QUALITY SPECS ─────────────── */}
      <section className="py-16 md:py-24 relative">
        <div className="container mx-auto px-4 max-w-7xl">
          <SectionHeader
            no="06"
            kicker="Quality & Specs"
            title={<>Built to <span className="text-amber-600">premium spec.</span></>}
            subtitle="The technical details that separate Tier-1 partner accounts from reseller scraps."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {QUALITY_SPECS.map((q, i) => {
              const Icon = q.Icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  whileHover={{ y: -4 }}
                  className="relative group rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60 p-5 md:p-6 overflow-hidden hover:border-amber-300 transition-colors"
                >
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-400/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl border border-amber-200 bg-amber-50 flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5 text-amber-600" />
                    </div>
                    <h3 className="text-sm md:text-base font-black uppercase tracking-tight mb-2 leading-tight">{q.title}</h3>
                    <p className="text-xs md:text-sm text-slate-600 leading-relaxed">{q.body}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────── PULL QUOTE — founder voice ─────────────── */}
      <section className="py-16 md:py-24 relative">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <Quote className="absolute -top-6 -left-2 md:-top-10 md:-left-6 w-20 h-20 md:w-32 md:h-32 text-primary/10" strokeWidth={1} />
            <div className="relative pl-6 md:pl-12">
              <p className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-light italic tracking-tight leading-[1.2] text-slate-800 mb-7 md:mb-10">
                "Every advertiser I know has had an account banned at 2 AM with a $5K live campaign. We built Razr so that doesn't happen — <span className="not-italic font-bold bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">ever again.</span>"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 flex items-center justify-center text-white font-black text-lg shrink-0 border-2 border-white shadow-lg shadow-emerald-600/25">
                  R
                </div>
                <div>
                  <div className="text-sm md:text-base font-black uppercase tracking-wider text-slate-900">Rajan · Founder, Razr Marketing</div>
                  <div className="text-[11px] md:text-xs font-bold uppercase tracking-widest text-slate-500 mt-0.5">
                    $500M+ ad spend managed · 5+ years media buying
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─────────────── 07 · SUPPORT ─────────────── */}
      <section className="py-16 md:py-24 relative">
        <div className="container mx-auto px-4 max-w-7xl">
          <SectionHeader
            no="07"
            kicker="Support & Service"
            title={<>Real humans. <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">Hong Kong HQ.</span> Fast replies.</>}
            subtitle="The post-purchase experience most agencies skip — it's the whole point for us."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {SUPPORT_FEATURES.map((s, i) => {
              const Icon = s.Icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="relative group rounded-3xl border border-teal-200 bg-white shadow-lg shadow-slate-200/60 p-6 md:p-7 overflow-hidden hover:border-teal-300 transition-colors"
                >
                  <div className="absolute -top-16 -right-16 w-40 h-40 bg-teal-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl border border-teal-200 bg-teal-50 flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-teal-600" />
                    </div>
                    <h3 className="text-base md:text-lg font-black uppercase tracking-tight mb-2 leading-tight">{s.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{s.body}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────── 08 · BONUS FEATURES ─────────────── */}
      <section className="py-16 md:py-24 relative">
        <div className="container mx-auto px-4 max-w-7xl">
          <SectionHeader
            no="08"
            kicker="Bonus & Extras"
            title={<>Everything else <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">that's included.</span></>}
            subtitle="The thoughtful touches that take a setup from 'okay' to 'just works'."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {BONUS_FEATURES.map((f, i) => {
              const Icon = f.Icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="relative group rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60 p-5 md:p-6 overflow-hidden hover:border-emerald-300 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl border border-emerald-200 bg-emerald-50 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-sm md:text-base font-black uppercase tracking-tight mb-1.5 leading-tight">{f.title}</h3>
                      <p className="text-xs md:text-sm text-slate-600 leading-relaxed">{f.body}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <SectionDivider label="Ready when you are" />

      {/* ─────────────── FINAL CTA ─────────────── */}
      <section className="py-16 md:py-24 relative">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="relative group rounded-3xl overflow-hidden">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[-200%] bg-[conic-gradient(from_0deg,transparent_0deg,rgba(5,150,105,0.35)_60deg,transparent_120deg,rgba(20,184,166,0.30)_240deg,transparent_300deg)] opacity-25"
            />
            <div className="relative rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 p-7 sm:p-10 md:p-16 text-center overflow-hidden">
              <motion.div animate={{ x: ["-100%", "200%"] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} className="absolute top-0 left-0 w-1/3 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
              <motion.div animate={{ x: ["200%", "-100%"] }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute bottom-0 right-0 w-1/3 h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />

              {/* Live "advertisers viewing" social proof */}
              <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border border-emerald-200 bg-emerald-50">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">
                  Live · 12 advertisers viewing this page right now
                </span>
              </div>

              <Rocket className="w-10 h-10 md:w-12 md:h-12 text-primary mx-auto mb-5 md:mb-6" strokeWidth={1.5} />
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[1.05] mb-5 md:mb-6">
                Stop losing accounts.<br/>
                <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">Start scaling safely.</span>
              </h2>
              <p className="text-base md:text-lg text-slate-600 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed">
                Activated in under an hour. Lifetime replacement included.
                Delivered worldwide. Message us on Telegram to start.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <a
                  href={buildWaLink("general", { source: "features-final-wa" })}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cta="features-final-wa"
                  className="btn-premium tap-spring inline-flex items-center justify-center gap-3 px-8 md:px-10 py-4 md:py-5 rounded-full bg-emerald-600 text-white font-black text-sm uppercase tracking-widest hover:bg-emerald-700 transition-colors duration-300"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat on Telegram <ArrowRight className="w-4 h-4" />
                </a>
                <Link
                  href="/contact"
                  data-cta="features-final-contact"
                  className="btn-premium tap-spring inline-flex items-center justify-center gap-3 px-8 md:px-10 py-4 md:py-5 rounded-full border border-slate-300 text-slate-900 font-black text-sm uppercase tracking-widest hover:bg-slate-100 transition-colors duration-300"
                >
                  Get Custom Plan
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
