import PageWrapper from "@/components/layout/PageWrapper";
import Hero from "@/components/home/Hero";
import HolographicCTA from "@/components/HolographicCTA";
import ProblemSolution from "@/components/ProblemSolution";
import AccessFlowJourney from "@/components/AccessFlowJourney";
import GrowthMetrics from "@/components/GrowthMetrics";
import CaseStudyTimeline from "@/components/CaseStudyTimeline";
import FaqPreview from "@/components/FaqPreview";
import BookCallSection from "@/components/BookCallSection";
export default function Home() {
  return (
    <PageWrapper>
      <div className="relative z-10">
        {/* PRO DARK HERO */}
        <Hero />

        {/* PROBLEM / SOLUTION COMPARISON */}
        <ProblemSolution />

        {/* ACCESS FLOW JOURNEY — Request → Review → Activation → Scale */}
        <AccessFlowJourney />

        {/* GROWTH METRICS */}
        <GrowthMetrics />

        {/* CASE STUDY TIMELINE */}
        <CaseStudyTimeline />

        {/* BOOK A STRATEGY CALL */}
        <BookCallSection />

        {/* FAQ PREVIEW */}
        <FaqPreview />

        {/* FINAL HOLOGRAPHIC CALL TO ACTION */}
        <HolographicCTA />
      </div>
    </PageWrapper>
  );
}

