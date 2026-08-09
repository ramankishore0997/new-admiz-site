import PageWrapper from "@/components/layout/PageWrapper";
import { motion } from "framer-motion";
import { Link } from "wouter";
import FloatingOrbs from "@/components/FloatingOrbs";
import TrustWall from "@/components/TrustWall";
import HongKongTrustStrip from "@/components/HongKongTrustStrip";
import HolographicCTA from "@/components/HolographicCTA";
import LightBeams from "@/components/LightBeams";
import ProblemSolution from "@/components/ProblemSolution";
import ROISimulator from "@/components/ROISimulator";
import AccessFlowJourney from "@/components/AccessFlowJourney";
import UrgencyBadge from "@/components/UrgencyBadge";
import MeshBackground from "@/components/MeshBackground";
import GrowthMetrics from "@/components/GrowthMetrics";
import CaseStudyTimeline from "@/components/CaseStudyTimeline";
import FaqPreview from "@/components/FaqPreview";
import BookCallSection from "@/components/BookCallSection";
import { buildWaLink } from "@/lib/whatsapp";
import RevealHeading from "@/components/ui/RevealHeading";
import { Zap, ShieldCheck, Headphones, Clock3, ArrowRight, Star } from "lucide-react";

const HERO_POINTS = [
  { Icon: Zap, title: "No Spend Caps", sub: "Scale past $50k/day" },
  { Icon: ShieldCheck, title: "Lifetime Replacement", sub: "Free on any policy flag" },
  { Icon: Clock3, title: "1-Hour Activation", sub: "Live campaigns fast" },
  { Icon: Headphones, title: "24/7 Support", sub: "12-min avg response" },
];

const AVATARS = ["RK", "AS", "MJ", "DP", "TS"];

export default function Home() {

  return (
    <PageWrapper>
      <FloatingOrbs />
      
      {/* HERO SECTION - Premium Centered */}
      <section className="relative min-h-[100vh] pt-32 md:pt-36 pb-14 flex items-center justify-center overflow-hidden z-10">
        <LightBeams />
        <MeshBackground />

        {/* deep center glow behind headline */}
        <div
          aria-hidden
          className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[560px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, rgba(5,150,105,0.16), transparent 62%)" }}
        />
        {/* conic ring accent */}
        <div aria-hidden className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[820px] h-[820px] rounded-full border border-primary/10 pointer-events-none" />
        <div aria-hidden className="absolute top-[32%] left-1/2 -translate-x-1/2 w-[620px] h-[620px] rounded-full border border-emerald-500/10 pointer-events-none" />

        <div className="container mx-auto px-4 relative z-20">
          <div className="w-full max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 mb-8 rounded-full border border-primary/25 bg-white/60 backdrop-blur-xl shadow-[0_8px_30px_-12px_rgba(5,150,105,0.35)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-[10px] md:text-[11px] font-black tracking-[0.2em] text-slate-900 uppercase">
                  Meta & Google Agency Accounts
                </span>
              </div>

              {/* Headline */}
              <RevealHeading
                as="h1"
                className="text-[2.9rem] sm:text-6xl md:text-7xl lg:text-[6.75rem] font-black tracking-tighter leading-[0.9] text-slate-900 mb-8"
                stagger={0.08}
                delay={0.1}
              >
                Scale Like An Agency.{" "}
                <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
                  Without The Limits.
                </span>
              </RevealHeading>

              {/* Sub */}
              <p className="text-lg md:text-2xl text-slate-500 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
                Premium Meta & Google agency accounts for high-volume advertisers. No spend caps, no warm-up phases, no random bans — just infrastructure built for scaling.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full mb-10">
                <a href={buildWaLink("general", { source: "home-hero" })} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full blur-lg opacity-40 group-hover:opacity-80 transition-opacity duration-500" />
                  <button className="btn-premium tap-spring relative w-full sm:w-auto px-10 py-4.5 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white font-black text-sm tracking-widest uppercase overflow-hidden">
                    <span className="absolute inset-y-0 -left-full w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12 group-hover:left-full transition-all duration-700" />
                    Get Started
                    <ArrowRight className="inline w-4 h-4 ml-2 -mt-0.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </a>
                <Link href="/contact" className="btn-premium tap-spring w-full sm:w-auto px-10 py-4.5 border border-slate-300 bg-white/60 backdrop-blur-xl text-slate-900 font-black text-sm tracking-widest uppercase hover:border-emerald-400 hover:text-emerald-700 transition-colors shadow-[0_10px_40px_-18px_rgba(15,23,42,0.3)]">
                  Contact Us
                </Link>
              </div>

              {/* Trust row */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
                <div className="flex -space-x-2.5">
                  {AVATARS.map((a, i) => (
                    <div
                      key={a}
                      className={`w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-black text-white shadow-md ${
                        ["bg-gradient-to-br from-emerald-500 to-teal-600", "bg-gradient-to-br from-teal-500 to-cyan-600", "bg-gradient-to-br from-emerald-600 to-emerald-400", "bg-gradient-to-br from-cyan-600 to-teal-500", "bg-gradient-to-br from-teal-600 to-emerald-500"][i]
                      }`}
                    >
                      {a}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-600">
                  Trusted by <span className="text-slate-900">1,200+</span> high-volume advertisers
                </span>
              </div>

              {/* Feature chips */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-3xl mx-auto">
                {HERO_POINTS.map((p, i) => {
                  const Icon = p.Icon;
                  return (
                    <motion.div
                      key={p.title}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.6 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                      whileHover={{ y: -5 }}
                      className="group relative overflow-hidden rounded-2xl border border-white/70 bg-white/60 backdrop-blur-2xl p-4 text-left shadow-[0_16px_50px_-20px_rgba(15,23,42,0.25)]"
                    >
                      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/80 to-transparent" />
                      <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary/15 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="relative flex flex-col items-start gap-2">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-600/25">
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-[11px] font-black text-slate-900 leading-tight">{p.title}</div>
                        <div className="text-[9px] font-bold text-slate-500 leading-tight">{p.sub}</div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <TrustWall />

      {/* HONG KONG HQ TRUST STRIP — flag + global payment methods */}
      <HongKongTrustStrip />

      {/* PROBLEM / SOLUTION COMPARISON */}
      <ProblemSolution />

      {/* ACCESS FLOW JOURNEY — Request → Review → Activation → Scale */}
      <AccessFlowJourney />

      {/* GROWTH METRICS */}
      <GrowthMetrics />

      {/* ROI SIMULATOR — interactive budget calculator */}
      <ROISimulator />

      {/* CASE STUDY TIMELINE */}
      <CaseStudyTimeline />

      {/* BOOK A STRATEGY CALL */}
      <BookCallSection />

      {/* FAQ PREVIEW */}
      <FaqPreview />

      {/* URGENCY BADGE — scarcity push above final CTA */}
      <section className="relative z-10 pt-16 pb-4 flex justify-center px-4">
        <UrgencyBadge />
      </section>

      <HolographicCTA />

    </PageWrapper>
  );
}
