import PageWrapper from "@/components/layout/PageWrapper";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

const SECTIONS = [
  {
    title: "1. Information We Collect",
    body: "We collect information you provide directly when you contact us via Telegram, WhatsApp, email, or our application forms. This includes your contact information, business profile, Telegram handle, and requested ad spend volume.",
  },
  {
    title: "2. How We Use Your Information",
    body: "Your information is used strictly to: (a) provision and manage your agency ad account allocations, (b) deliver account routing credentials, billing top-ups, and support, and (c) communicate essential infrastructure notices.",
  },
  {
    title: "3. Information Protection & Sharing",
    body: "We do not sell, rent, or trade your personal data. Data is processed securely for account creation and transaction processing under strict non-disclosure and confidentiality frameworks.",
  },
  {
    title: "4. Data Security",
    body: "We deploy enterprise-grade end-to-end encryption protocols and isolated access structures across all databases and messaging channels to protect your credentials.",
  },
  {
    title: "5. Data Retention",
    body: "We retain account history for as long as your service is active, maintaining audit logs required for accounting compliance. You may request deletion of records at any time.",
  },
  {
    title: "6. Your Rights",
    body: "You maintain full rights to access, update, or purge your business profile records. To exercise these rights, contact us via Telegram @RazrMarketing or email scale@razr.marketing.",
  },
  {
    title: "7. Cookies & Tracking",
    body: "Our portal uses minimal essential session cookies required for authentication and security tokens. We do not use third-party invasive ad tracking cookies.",
  },
  {
    title: "8. Corporate Jurisdiction",
    body: "Governed under the Data Protection Act and UK GDPR standards by RAZR Global Media International Limited (London, United Kingdom).",
  },
];

export default function Privacy() {
  return (
    <PageWrapper>
      <section className="pt-28 pb-20 relative bg-black">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-950/40 text-[10px] font-black uppercase tracking-widest text-cyan-300 mb-6">
            Data Privacy & Security
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white mb-4">
            Privacy <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">Policy</span>
          </h1>
          <p className="text-zinc-400 text-sm md:text-base mb-12">
            Last updated: October 2026 — RAZR Global Media International Limited
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
