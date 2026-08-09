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

export default function Home() {

  return (
    <PageWrapper>
      <FloatingOrbs />
      
      {/* HERO SECTION - Centered */}
      <section className="relative min-h-[78vh] pt-24 pb-10 flex items-center overflow-hidden z-10">
        <LightBeams />
        <MeshBackground />
        <div className="container mx-auto px-4 h-full relative z-10">
          <div className="flex items-center justify-center h-full">
            <div className="w-full max-w-4xl text-center relative z-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <div className="inline-flex items-center gap-2.5 px-4 py-2 mb-8 rounded-full border border-primary/30 bg-primary/10 backdrop-blur">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(5,150,105,0.6)] animate-pulse" />
                  <span className="text-[10px] md:text-xs font-black tracking-[0.2em] text-primary uppercase">
                    Meta & Google Agency Accounts
                  </span>
                </div>

                <RevealHeading
                  as="h1"
                  className="text-[2.75rem] sm:text-6xl md:text-7xl lg:text-[6.5rem] font-black tracking-tighter leading-[0.92] text-slate-900 mb-7"
                  stagger={0.09}
                  delay={0.1}
                >
                  Scale Like An Agency.{" "}
                  <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
                    Without The Limits.
                  </span>
                </RevealHeading>

                <p className="text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
                  Premium Meta & Google agency accounts for high-volume advertisers. No spend caps, no warm-up phases, no random bans — just infrastructure built for scaling.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full">
                  <a href={buildWaLink("general", { source: "home-hero" })} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto relative group">
                    <div className="absolute inset-0 bg-primary rounded-none blur-md opacity-30 group-hover:opacity-70 group-hover:blur-lg transition-all duration-500" />
                    <button className="btn-premium tap-spring relative w-full sm:w-auto px-10 py-4 bg-emerald-600 text-white font-bold text-sm tracking-widest uppercase">
                      Get Started
                    </button>
                  </a>
                  <Link href="/contact" className="btn-premium tap-spring w-full sm:w-auto px-10 py-4 border border-slate-300 text-slate-900 font-bold text-sm tracking-widest uppercase hover:bg-slate-100 hover:border-slate-400">
                    Contact Us
                  </Link>
                </div>

                {/* TRUST PILL */}
                <div className="mt-8 flex flex-wrap items-center justify-center gap-2 md:gap-3">
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
