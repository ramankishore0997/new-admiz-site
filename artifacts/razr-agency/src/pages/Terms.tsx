import PageWrapper from "@/components/layout/PageWrapper";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

const SECTIONS = [
  {
    title: "1. Acceptance of Terms",
    body: "By accessing or using Razr Marketing services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.",
  },
  {
    title: "2. Services Provided",
    body: "Razr Marketing provides agency advertising accounts across Meta (Facebook & Instagram) and Google ecosystem, including account provisioning, Business Manager access, corporate billing lines, and continuous technical uptime management.",
  },
  {
    title: "3. Client Responsibilities",
    body: "You are responsible for ensuring all advertising content complies with applicable laws and the policies of the platforms you advertise on. You must not use our accounts for illegal activities, fraud, unauthorized IP infringement, or any purpose that could harm our corporate infrastructure.",
  },
  {
    title: "4. Account Usage",
    body: "Accounts provided are for your business use only and may not be resold or transferred without our written consent. You must follow our operational guidelines regarding scaling velocity, payment methods, and compliance protocols.",
  },
  {
    title: "5. Lifetime Replacement Guarantee",
    body: "We provide prompt lifetime replacements for accounts that encounter unexpected restrictions without policy violations by you. Remaining ad balance allocations are automatically transferred to your replacement infrastructure.",
  },
  {
    title: "6. Payment & Billing",
    body: "All service fees must be settled in advance. We accept bank transfers, USDT/Crypto, and direct methods communicated at onboarding. Setup allocations are non-refundable once infrastructure configuration has started.",
  },
  {
    title: "7. Limitation of Liability",
    body: "Razr Marketing is not liable for indirect, incidental, or consequential damages including external platform ad auction outcomes or business interruption. Total liability is limited strictly to the fees paid for the affected service in the preceding 30 days.",
  },
  {
    title: "8. Platform Policy Changes",
    body: "External platform algorithms and policies may shift. We adapt our enterprise routing and whitelisted bins continuously to maintain seamless scaling uptime.",
  },
  {
    title: "9. Termination",
    body: "We reserve the right to suspend or terminate services to any client who breaches these terms or conducts activities hazardous to our institutional corporate framework.",
  },
  {
    title: "10. Governing Law",
    body: "These terms are governed by the laws of England and Wales. Any disputes will be resolved through arbitration or in the appropriate courts of the United Kingdom jurisdiction.",
  },
  {
    title: "11. Contact",
    body: "For questions about these Terms of Service, contact our team via Telegram @RazrMarketing, WhatsApp +44 7473 951923, or email scale@razr.marketing.",
  },
];

export default function Terms() {
  return (
    <PageWrapper>
      <section className="pt-28 pb-20 relative bg-black">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-950/40 text-[10px] font-black uppercase tracking-widest text-cyan-300 mb-6">
            Institutional Legal Framework
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white mb-4">
            Terms of <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">Service</span>
          </h1>
          <p className="text-zinc-400 text-sm md:text-base mb-12">
            Last updated: October 2026 — RAZR Global Media International Limited (London, UK)
          </p>

          <div className="space-y-6">
            {SECTIONS.map((s, idx) => {
              const tones = ["aurora", "cyber", "sunset", "neon"] as const;
              return (
                <SpotlightCard key={s.title} tone={tones[idx % tones.length]} className="p-6 md:p-8">
                  <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white mb-3">
                    {s.title}
                  </h2>
                  <p className="text-zinc-300 leading-relaxed text-sm md:text-[15px]">
                    {s.body}
                  </p>
                </SpotlightCard>
              );
            })}
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
