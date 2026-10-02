import React from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import { motion } from "framer-motion";
import { Link } from "wouter";
import LightBeams from "@/components/LightBeams";
import { buildWaLink } from "@/lib/whatsapp";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { ShimmerButton } from "@/components/ui/ShimmerButton";
import { MagneticButton } from "@/components/ui/MagneticButton";
import {
  Shield, Zap, Users, TrendingUp, DollarSign, Globe2, Rocket,
  ArrowRight, Check, X, Crown, Award, Clock, RefreshCw,
  Headphones, FileCheck, ShieldCheck, Layers, Building2,
  Coins, Dice5, HeartHandshake, Pill, Cigarette, Banknote, Gift,
  Home as HomeIcon, ShoppingBag, Bitcoin, Sparkle, GraduationCap,
  Activity, Wallet, Receipt, MessageCircle, Languages, PhoneCall,
  Target, BarChart3, Database, Quote, Trophy, Diamond, Star, Flame,
  type LucideIcon,
} from "lucide-react";
import { SiTelegram } from "react-icons/si";

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
  { Icon: ShoppingBag, name: "Dropshipping / E-Com", tag: "Global COD & DTC" },
  { Icon: Bitcoin, name: "NFT / Web3 / Crypto", tag: "Exchanges allowed" },
  { Icon: Sparkle, name: "Astrology / Tarot", tag: "Spiritual niches" },
  { Icon: GraduationCap, name: "Edu / Coaching / Jobs", tag: "Info products" },
];

const REASONS: { Icon: LucideIcon; title: string; body: string }[] = [
  { Icon: ShieldCheck, title: "Whitelisted Agency BM", body: "Direct Tier-1 partner status. Policy enforcement is relaxed for whitelisted BMs — what gets your personal account flagged doesn't trigger ours." },
  { Icon: Clock, title: "Pre-Warmed Aged Accounts", body: "Every account has 90+ days of real spend history. Fresh accounts get flagged instantly — ours look like established advertisers from minute one." },
  { Icon: Crown, title: "Tier-1 BM (not Tier-3 Reseller)", body: "Most sellers resell Tier-3 BMs that collapse in weeks. We provide direct Tier-1 partner accounts with the highest possible trust score." },
  { Icon: ShieldCheck, title: "Domain Pre-Configured", body: "Business setup, domain ownership, and pixel setup are completed before handover. You skip the most common ban triggers." },
  { Icon: PhoneCall, title: "Direct Meta Rep Channel", body: "Disputes go straight to a Meta partner rep — not through public support tickets. Most policy flags get reversed within 24 hours." },
  { Icon: Activity, title: "Daily Health Monitoring", body: "Our operations desk watches account quality scores proactively. Issues are caught and resolved before they become bans." },
];

const REPLACEMENT_STEPS = [
  { Icon: MessageCircle, title: "You Report", body: "Message us on Telegram the moment an account needs migration — 24/7 coverage." },
  { Icon: Clock, title: "15-Min to 2-Hr SLA", body: "New account assigned and activated immediately. No paperwork, zero friction." },
  { Icon: RefreshCw, title: "Lifetime Cover", body: "Free replacements forever. Same spend capacity, same Tier-1 BM, zero questions asked." },
];

const SPEND_FEATURES: { Icon: LucideIcon; title: string; body: string }[] = [
  { Icon: Rocket, title: "$10K+ Daily Spend Day 1", body: "No warmup needed — push full budget on your first campaign, first hour." },
  { Icon: TrendingUp, title: "No Daily / Lifetime Caps", body: "Lifetime Access removes all spend ceilings. Scale to any number you want." },
  { Icon: Globe2, title: "Multi-Region Targeting", body: "US, UK, Australia, EU, Asia, Middle East — all geographies unlocked." },
  { Icon: Wallet, title: "Multi-Currency Campaigns", body: "Run in USD, EUR, GBP, AED — switch per campaign, not per account." },
  { Icon: Layers, title: "Multi-Pixel on Single BM", body: "Track multiple websites and funnels from one Business Manager." },
  { Icon: Target, title: "Custom + Lookalike Audiences", body: "Full Custom Audience and Lookalike features unlocked from day one." },
];

const COMPARISON: { feature: string; normal: string; razr: string }[] = [
  { feature: "Trading / Gambling / Crypto Ads", normal: "Flagged instantly", razr: "Fully allowed & whitelisted" },
  { feature: "Daily Spend Limit", normal: "$500 (new accounts)", razr: "$10K+ to Uncapped from Day 1" },
  { feature: "Ban Risk", normal: "High — random algorithms", razr: "Protected Tier-1 Agency ASN" },
  { feature: "Replacement Policy", normal: "None — start over", razr: "Lifetime free replacement" },
  { feature: "Setup Time", normal: "7-14 days waiting", razr: "60 minutes" },
  { feature: "Support", normal: "Generic ticket bot", razr: "24/7 dedicated manager on Telegram" },
  { feature: "Account Age", normal: "Fresh (flagged)", razr: "Pre-warmed 90+ days history" },
  { feature: "Meta Escalation Channel", normal: "Public ticket queue", razr: "Direct partner internal rep" },
  { feature: "Multi-Region Targeting", normal: "Limited by country", razr: "All geos unlocked (0% tax)" },
  { feature: "Pixel & CAPI Setup", normal: "DIY manual", razr: "Done-for-you integration" },
];

const QUALITY_SPECS: { Icon: LucideIcon; title: string; body: string }[] = [
  { Icon: Crown, title: "Tier-1 Business Manager", body: "Top 1% Meta partner-level BM with maximum trust score." },
  { Icon: Clock, title: "90+ Day Aged Accounts", body: "Real spend history pre-loaded — no fresh-account flags." },
  { Icon: FileCheck, title: "Direct Billing Integration", body: "Payment + billing already attached and approved by Meta." },
  { Icon: ShieldCheck, title: "High Trust Score", body: "Account health rated 'Good' or better before handover." },
  { Icon: Database, title: "Full Credentials Handover", body: "You own the login — full admin access, not shared seats." },
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
  { Icon: ShieldCheck, label: "Enterprise Trust Process" },
  { Icon: Diamond, label: "Tier-1 BM Network" },
  { Icon: Star, label: "5,000+ Advertisers Worldwide" },
  { Icon: Flame, label: "$500M+ Ad Spend Routed" },
];

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="container mx-auto px-4 max-w-7xl py-6">
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-800 to-zinc-800" />
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
          {label}
        </span>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent via-zinc-800 to-zinc-800" />
      </div>
    </div>
  );
}

function SectionHeader({ no, kicker, title, subtitle }: { no: string; kicker: string; title: React.ReactNode; subtitle?: string }) {
  return (
    <div className="mb-10 md:mb-14">
      <div className="inline-flex items-center gap-2 mb-4">
        <span className="text-[10px] font-black tabular-nums px-2.5 py-0.5 rounded-full border border-violet-500/30 bg-violet-950/40 text-cyan-300 font-mono">
          {no}
        </span>
        <span className="text-[10px] font-black uppercase tracking-[0.25em] bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
          {kicker}
        </span>
      </div>
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-[0.95] text-white mb-3 md:mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-base md:text-lg text-zinc-300 max-w-2xl leading-relaxed">{subtitle}</p>
      )}
    </div>
  );
}

export default function Features() {
  return (
    <PageWrapper>
      {/* ─────────────── HERO ─────────────── */}
      <section className="relative min-h-[75vh] pt-24 md:pt-28 pb-12 flex items-center overflow-hidden bg-black text-white">
        <LightBeams />
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            {/* Hero badge with multi-color shine */}
            <div className="relative inline-flex mb-7 md:mb-9">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-violet-500/30 bg-[#0A0515] backdrop-blur-md shadow-lg shadow-violet-950/50">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
                </span>
                <span className="text-[10px] font-black tracking-[0.25em] bg-gradient-to-r from-violet-300 via-cyan-300 to-emerald-300 bg-clip-text text-transparent uppercase">
                  Agency-Grade Infrastructure · UK HQ
                </span>
              </div>
            </div>

            <h1 className="text-[2.75rem] sm:text-5xl md:text-7xl lg:text-[7rem] font-black uppercase tracking-tighter leading-[0.92] text-white mb-6 md:mb-8 break-words">
              Accounts that <br />
              <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(6,182,212,0.4)]">
                don't get flagged.
              </span><br />
              <span className="font-light italic text-zinc-400 text-[1.9rem] sm:text-4xl md:text-6xl lg:text-[5rem]">
                Built for heavy spenders.
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-2xl text-zinc-300 max-w-3xl font-medium leading-relaxed">
              Trading. Gambling. Crypto. Nutra. Dating. Loans. All the high-scale verticals that break normal ad accounts — run seamlessly on <span className="text-cyan-300 font-bold">Tier-1 agency infrastructure</span> with lifetime replacement guarantee.
            </p>

            {/* Stats bar */}
            <div className="mt-8 md:mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 max-w-5xl">
              {HERO_STATS.map((c, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.06 }}
                >
                  <SpotlightCard tone="aurora" className="p-3.5 md:p-4 text-center bg-[#060608] border-zinc-800">
                    <div className="text-lg md:text-2xl font-black bg-gradient-to-r from-violet-300 via-cyan-300 to-emerald-300 bg-clip-text text-transparent font-mono tabular-nums">{c.v}</div>
                    <div className="text-[9px] md:text-[10px] uppercase tracking-wider text-zinc-400 font-bold mt-1">{c.l}</div>
                  </SpotlightCard>
                </motion.div>
              ))}
            </div>

            {/* Hero CTAs */}
            <div className="mt-8 md:mt-10 flex flex-wrap items-center gap-3">
              <a href="https://t.me/RazrMarketing" target="_blank" rel="noopener noreferrer">
                <ShimmerButton>
                  <SiTelegram className="w-4 h-4 text-[#229ED9]" />
                  <span>Chat on Telegram</span>
                  <ArrowRight className="w-4 h-4" />
                </ShimmerButton>
              </a>
              <Link href="/contact">
                <MagneticButton className="px-7 py-4 rounded-2xl border border-zinc-800 bg-zinc-950 text-white font-black text-xs uppercase tracking-widest hover:border-violet-500 hover:text-cyan-300">
                  Talk to Sales
                </MagneticButton>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─────────────── RECOGNITION STRIP ─────────────── */}
      <section className="relative py-6 md:py-8 border-y border-zinc-800/80 bg-black text-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center gap-2 mb-4 md:mb-5">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-zinc-800" />
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent px-2">
              Recognized for · Trusted by · Built with
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-zinc-800" />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
            {RECOGNITIONS.map((r, i) => {
              const Icon = r.Icon;
              return (
                <div
                  key={i}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-800 bg-[#060608] shadow-md text-zinc-300"
                >
                  <Icon className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider">
                    {r.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────── 01 · ALLOWED NICHES ─────────────── */}
      <section className="py-16 md:py-24 relative bg-black text-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <SectionHeader
            no="01"
            kicker="Allowed Niches"
            title={<>Run the niches that <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">normal accounts can't.</span></>}
            subtitle="Every category below is fully supported on our agency BMs. No arbitrary shadow-bans or policy roulette."
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
                  className="h-full"
                >
                  <SpotlightCard tone="aurora" className="p-4 md:p-5 h-full flex flex-col justify-between bg-[#060608] border-zinc-800">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl border border-violet-500/30 bg-violet-950/40 flex items-center justify-center text-cyan-300">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="w-6 h-6 rounded-full bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 text-cyan-300" strokeWidth={3} />
                        </div>
                      </div>
                      <h3 className="text-sm md:text-base font-black uppercase tracking-tight text-white mb-1">
                        {n.name}
                      </h3>
                      <p className="text-[11px] md:text-xs text-zinc-400 font-medium leading-snug">{n.tag}</p>
                    </div>
                  </SpotlightCard>
                </motion.div>
              );
            })}
          </div>

          <p className="mt-8 text-center text-xs md:text-sm text-zinc-400">
            Niche not listed? <a href="https://t.me/RazrMarketing" target="_blank" rel="noopener noreferrer" className="text-cyan-400 font-bold hover:underline">Ask on Telegram →</a> (most are allowed)
          </p>
        </div>
      </section>

      <SectionDivider label="The Architecture · Why It Works" />

      {/* ─────────────── 02 · WHY NO BANS ─────────────── */}
      <section className="py-16 md:py-24 relative bg-black text-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <SectionHeader
            no="02"
            kicker="Why No Bans"
            title={<>6 reasons our accounts <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">survive everything.</span></>}
            subtitle="Most agencies sell you the same Tier-3 BMs that collapse in 2 weeks. Here's what makes ours institutional-grade."
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
                  className="h-full"
                >
                  <SpotlightCard tone="aurora" className="p-6 md:p-8 h-full min-h-[240px] bg-[#060608] border-zinc-800">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-2xl border border-violet-500/30 bg-violet-950/50 flex items-center justify-center text-cyan-300">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400">
                        REASON {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="text-lg md:text-xl font-black uppercase tracking-tight text-white mb-2 leading-tight">
                      {r.title}
                    </h3>
                    <p className="text-sm text-zinc-300 leading-relaxed">{r.body}</p>
                  </SpotlightCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────── 03 · REPLACEMENT GUARANTEE ─────────────── */}
      <section className="py-16 md:py-24 relative bg-black text-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <SectionHeader
            no="03"
            kicker="Replacement Guarantee"
            title={<>Banned anyway? <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">New account in 24 hours.</span></>}
            subtitle="No paperwork. No endless reviews. Just a fresh Tier-1 line, free, forever."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {REPLACEMENT_STEPS.map((s, i) => {
              const Icon = s.Icon;
              return (
                <SpotlightCard key={i} tone="aurora" className="p-7 md:p-8 text-center bg-[#060608] border-zinc-800">
                  <div className="w-16 h-16 rounded-full bg-violet-950/60 border border-violet-500/40 flex items-center justify-center mx-auto mb-5 relative text-cyan-300">
                    <Icon className="w-7 h-7" />
                    <span className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-xs font-black flex items-center justify-center border-2 border-black tabular-nums">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white mb-3">{s.title}</h3>
                  <p className="text-sm text-zinc-300 leading-relaxed">{s.body}</p>
                </SpotlightCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────── 04 · COMPARISON TABLE ─────────────── */}
      <section className="py-16 md:py-24 relative bg-black text-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <SectionHeader
            no="04"
            kicker="Head to Head"
            title={<>Standard Accounts vs <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">RAZR Agency Tier-1.</span></>}
            subtitle="The structural difference between amateur setups and enterprise media buying."
          />

          <div className="rounded-3xl border border-zinc-800 bg-[#060608] shadow-2xl overflow-hidden">
            {/* Header row */}
            <div className="grid grid-cols-3 gap-2 md:gap-4 px-4 md:px-6 py-4 md:py-5 border-b border-zinc-800 bg-zinc-950">
              <div className="text-[10px] md:text-xs font-black uppercase tracking-widest text-zinc-400">Feature</div>
              <div className="text-[10px] md:text-xs font-black uppercase tracking-widest text-red-400 flex items-center gap-1.5">
                <X className="w-3.5 h-3.5" /> Normal Account
              </div>
              <div className="text-[10px] md:text-xs font-black uppercase tracking-widest text-cyan-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> RAZR Tier-1 Line
              </div>
            </div>

            {COMPARISON.map((row, i) => (
              <div
                key={i}
                className={`grid grid-cols-3 gap-2 md:gap-4 px-4 md:px-6 py-3.5 md:py-4 border-b border-zinc-850 last:border-b-0 hover:bg-zinc-900/50 transition-colors ${i % 2 === 0 ? "bg-zinc-950/40" : ""}`}
              >
                <div className="text-xs md:text-sm font-bold text-white leading-snug">{row.feature}</div>
                <div className="text-xs md:text-sm text-zinc-400 leading-snug flex items-start gap-2">
                  <X className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                  <span>{row.normal}</span>
                </div>
                <div className="text-xs md:text-sm text-cyan-300 leading-snug flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" strokeWidth={3} />
                  <span className="font-semibold">{row.razr}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────── 05 · QUALITY SPECS ─────────────── */}
      <section className="py-16 md:py-24 relative bg-black text-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <SectionHeader
            no="05"
            kicker="Quality & Specs"
            title={<>Built to <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">enterprise spec.</span></>}
            subtitle="The technical standards that separate Tier-1 partner accounts from reseller scraps."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {QUALITY_SPECS.map((q, i) => {
              const Icon = q.Icon;
              return (
                <SpotlightCard key={i} tone="aurora" className="p-5 md:p-6 bg-[#060608] border-zinc-800">
                  <div className="w-10 h-10 rounded-xl border border-violet-500/30 bg-violet-950/40 flex items-center justify-center mb-3 text-cyan-300">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm md:text-base font-black uppercase tracking-tight text-white mb-2 leading-tight">{q.title}</h3>
                  <p className="text-xs md:text-sm text-zinc-400 leading-relaxed">{q.body}</p>
                </SpotlightCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────── FINAL CTA ─────────────── */}
      <section className="py-16 md:py-24 relative bg-black text-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="rounded-3xl border border-zinc-800 bg-[#060608] p-8 sm:p-12 md:p-16 text-center shadow-2xl space-y-6">
            <Rocket className="w-12 h-12 text-cyan-400 mx-auto" strokeWidth={1.5} />
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase tracking-tighter text-white leading-tight">
              Stop losing accounts.<br />
              <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">Start scaling safely.</span>
            </h2>
            <p className="text-base md:text-lg text-zinc-300 max-w-2xl mx-auto leading-relaxed">
              Activated in under an hour. Lifetime replacement guarantee included. Message us on Telegram to get started.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <a href="https://t.me/RazrMarketing" target="_blank" rel="noopener noreferrer">
                <ShimmerButton className="w-full sm:w-auto">
                  <SiTelegram className="w-4 h-4 text-[#229ED9]" />
                  <span>Chat on Telegram</span>
                  <ArrowRight className="w-4 h-4" />
                </ShimmerButton>
              </a>
              <Link href="/signup">
                <MagneticButton className="w-full sm:w-auto px-8 py-4 rounded-2xl border border-zinc-800 bg-zinc-950 text-white font-black text-xs uppercase tracking-widest hover:border-violet-500 hover:text-cyan-300">
                  Open Client Portal
                </MagneticButton>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
