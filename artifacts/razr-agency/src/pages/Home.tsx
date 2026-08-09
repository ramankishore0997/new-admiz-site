import PageWrapper from "@/components/layout/PageWrapper";
import FloatingOrbs from "@/components/FloatingOrbs";
import HolographicCTA from "@/components/HolographicCTA";
import ProblemSolution from "@/components/ProblemSolution";
import ROISimulator from "@/components/ROISimulator";
import AccessFlowJourney from "@/components/AccessFlowJourney";
import UrgencyBadge from "@/components/UrgencyBadge";
import GrowthMetrics from "@/components/GrowthMetrics";
import CaseStudyTimeline from "@/components/CaseStudyTimeline";
import FaqPreview from "@/components/FaqPreview";
import BookCallSection from "@/components/BookCallSection";

export default function Home() {

  return (
    <PageWrapper>
      <FloatingOrbs />

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
