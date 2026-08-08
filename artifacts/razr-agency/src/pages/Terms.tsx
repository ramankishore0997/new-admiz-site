import PageWrapper from "@/components/layout/PageWrapper";

const SECTIONS = [
  {
    title: "1. Acceptance of Terms",
    body: "By accessing or using Razr Marketing services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.",
  },
  {
    title: "2. Services Provided",
    body: "Razr Marketing provides premium Meta (Facebook & Instagram) and Google agency advertising accounts, including account provisioning, Business Manager access, billing setup, and ongoing technical support. We offer both Whitehat (policy-compliant) and Blackhat (aggressive vertical) account options.",
  },
  {
    title: "3. Client Responsibilities",
    body: "You are responsible for ensuring all advertising content complies with applicable laws and the policies of the platforms you advertise on. You must not use our accounts for illegal activities, fraud, intellectual property infringement, or any purpose that could harm our infrastructure or other clients.",
  },
  {
    title: "4. Account Usage",
    body: "Accounts provided are for your use only and may not be resold, transferred, or shared without our written consent. You must follow our operational guidelines regarding scaling, payment methods, and creative compliance.",
  },
  {
    title: "5. Lifetime Replacement Policy",
    body: "We provide free lifetime replacements for accounts that fail without policy violation by you. Remaining ad balances are transferred to replacement accounts where technically possible. This replacement guarantee is our primary form of service guarantee.",
  },
  {
    title: "6. Payment & Billing",
    body: "All service fees must be paid in advance. We accept bank transfers, USDT, and other payment methods communicated at the time of order. Setup fees are non-refundable once account provisioning has begun.",
  },
  {
    title: "7. Limitation of Liability",
    body: "Razr Marketing is not liable for indirect, incidental, or consequential damages including lost ad spend, lost revenue, or business interruption. Our total liability is limited to the amount you paid for the affected service in the preceding 30 days.",
  },
  {
    title: "8. Platform Policy Changes",
    body: "Meta and Google may change their advertising policies at any time. We work to adapt our infrastructure quickly but cannot guarantee continuous service if external platforms make sweeping changes affecting agency accounts.",
  },
  {
    title: "9. Termination",
    body: "We reserve the right to terminate service to any client who violates these terms, abuses our support, or engages in activities that damage our infrastructure or relationships with platform providers.",
  },
  {
    title: "10. Governing Law",
    body: "These terms are governed by the laws of the Hong Kong Special Administrative Region of the People's Republic of China. Any disputes will be resolved through arbitration or in the appropriate courts of Hong Kong jurisdiction.",
  },
  {
    title: "11. Contact",
    body: "For any questions about these Terms of Service, contact us via Telegram @RazrMarketing or email scale@razr.marketing.",
  },
];

export default function Terms() {
  return (
    <PageWrapper>
      <section className="pt-28 pb-16 relative">
        <div className="container mx-auto px-4 max-w-4xl">
          <span className="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-6 block">Legal</span>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-6">
            Terms of <span className="text-primary">Service</span>
          </h1>
          <p className="text-muted-foreground text-lg mb-10">
            Last updated: June 27, 2026 — razr.marketing
          </p>

          <div className="space-y-10">
            {SECTIONS.map((s) => (
              <div key={s.title} className="border-l-2 border-slate-200 pl-6 md:pl-8 hover:border-primary transition-colors">
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-4">{s.title}</h2>
                <p className="text-muted-foreground leading-relaxed text-[15px] md:text-base">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
