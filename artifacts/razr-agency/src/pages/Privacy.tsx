import PageWrapper from "@/components/layout/PageWrapper";

const SECTIONS = [
  {
    title: "1. Information We Collect",
    body: "We collect information you provide directly to us when you contact us via Telegram, email, or our contact form. This includes your name, email address, Telegram handle, business details, and any messages you send us. We also collect basic technical information such as IP address and browser type when you visit our website.",
  },
  {
    title: "2. How We Use Your Information",
    body: "Your information is used solely to: (a) respond to your inquiries about our Meta and Google agency ad accounts, (b) provide and manage the services you purchase, (c) deliver account access, replacements, and ongoing support, and (d) send important service updates. We do not use your data for unsolicited marketing.",
  },
  {
    title: "3. Information Sharing",
    body: "We do not sell, rent, or trade your personal information to third parties. We may share necessary information with Meta and Google when provisioning your agency ad accounts, and with our payment processors strictly for transaction processing. All third parties are bound by confidentiality.",
  },
  {
    title: "4. Data Security",
    body: "We use industry-standard security measures including encrypted communications (HTTPS) and secure messaging platforms (Telegram end-to-end encryption) to protect your data. However, no method of transmission over the internet is 100% secure.",
  },
  {
    title: "5. Data Retention",
    body: "We retain your information for as long as your account or service is active, plus a reasonable period afterwards for legal, accounting, or operational purposes. You may request deletion of your data at any time by contacting us.",
  },
  {
    title: "6. Your Rights",
    body: "You have the right to access, correct, or request deletion of your personal information. To exercise these rights, contact us via Telegram @RazrMarketing or email scale@razr.marketing.",
  },
  {
    title: "7. Cookies",
    body: "Our website uses minimal cookies for basic functionality only. We do not use third-party tracking cookies or advertising cookies.",
  },
  {
    title: "8. Changes to This Policy",
    body: "We may update this Privacy Policy from time to time. Material changes will be communicated to active clients via their primary contact channel.",
  },
  {
    title: "9. Contact Us",
    body: "For any questions about this Privacy Policy or our data practices, reach out to us on Telegram @RazrMarketing or email scale@razr.marketing.",
  },
];

export default function Privacy() {
  return (
    <PageWrapper>
      <section className="pt-28 pb-16 relative">
        <div className="container mx-auto px-4 max-w-4xl">
          <span className="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-6 block">Legal</span>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-6">
            Privacy <span className="text-primary">Policy</span>
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
