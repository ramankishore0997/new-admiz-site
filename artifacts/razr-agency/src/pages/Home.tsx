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
import HeroDashboardMock from "@/components/HeroDashboardMock";
import MeshBackground from "@/components/MeshBackground";
import GrowthMetrics from "@/components/GrowthMetrics";
import CaseStudyTimeline from "@/components/CaseStudyTimeline";
import FaqPreview from "@/components/FaqPreview";
import BookCallSection from "@/components/BookCallSection";
import { buildWaLink } from "@/lib/whatsapp";
import RevealHeading from "@/components/ui/RevealHeading";

export default function Home() {

  return (
    <PageWrapper>
      <FloatingOrbs />
      
      {/* HERO SECTION - Asymmetric */}
      <section className="relative min-h-[78vh] pt-24 pb-10 flex items-center overflow-hidden z-10">
        <LightBeams />
        <MeshBackground />
        <div className="container mx-auto px-4 h-full relative z-10">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-8 items-center h-full">
            {/* Left Column - 60% */}
            <div className="w-full lg:w-[60%] flex flex-col items-start relative z-20">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <div className="inline-flex items-center gap-2 mb-6 border-b border-primary/30 pb-2">
                  <span className="text-[10px] md:text-xs font-black tracking-[0.2em] text-primary uppercase">
                    May 23, 2026 // Meta & Google Agency Accounts
                  </span>
                </div>
                
                <RevealHeading
                  as="h1"
                  className="text-[3.25rem] sm:text-6xl md:text-8xl lg:text-[7.5rem] font-black tracking-tighter leading-[0.85] text-slate-900 mb-6"
                  stagger={0.09}
                  delay={0.1}
                >
                  SCALE <br/>
                  <span className="font-light italic tracking-tight text-slate-700">WITHOUT</span><br/>
                  LIMITS.
                </RevealHeading>
                
                <p className="text-lg md:text-xl text-muted-foreground max-w-lg mb-8 font-medium leading-relaxed">
                  Premium Meta & Google Agency infrastructure for high-volume advertisers. Stop fighting the platform, start scaling your campaigns.
                </p>

                <div className="flex flex-col sm:flex-row items-start gap-6 w-full max-w-md">
                  <a href={buildWaLink("general", { source: "home-hero" })} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto relative group">
                    <div className="absolute inset-0 bg-primary rounded-none blur-md opacity-30 group-hover:opacity-70 group-hover:blur-lg transition-all duration-500" />
                    <button className="btn-premium tap-spring relative w-full sm:w-auto px-8 py-4 bg-emerald-600 text-white font-bold text-sm tracking-widest uppercase">
                      Get Started
                    </button>
                  </a>
                  <Link href="/contact" className="btn-premium tap-spring w-full sm:w-auto px-8 py-4 border border-slate-300 text-slate-900 font-bold text-sm tracking-widest uppercase hover:bg-slate-100 hover:border-slate-400">
                    Contact Us
                  </Link>
                </div>

                {/* TRUST PILL — replaces pricing teaser */}
                <div className="mt-7 flex flex-wrap items-center gap-2 md:gap-3">
                  <a
                    href={buildWaLink("setup-access", { source: "hero-trust-pill" })}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cta="hero-trust-pill"
                    className="group inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/40 bg-primary/15 hover:bg-primary/20 hover:border-primary/60 backdrop-blur transition-colors shadow-[0_8px_24px_-8px_rgba(5,150,105,0.25)]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(5,150,105,0.6)] animate-pulse" />
                    <span className="text-xs font-black text-slate-900 uppercase tracking-wider">Lifetime Access</span>
                    <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">· Replacement Incl. · 60-min Setup</span>
                  </a>
                </div>

              </motion.div>
            </div>

            {/* Right Column - 40% - Product Dashboard Mock */}
            <div className="w-full lg:w-[40%] relative h-[420px] lg:h-[560px] hidden md:block z-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="absolute inset-0 flex items-center justify-center z-20"
              >
                <HeroDashboardMock />
              </motion.div>
            </div>
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
