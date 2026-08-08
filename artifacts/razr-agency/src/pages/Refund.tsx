import PageWrapper from "@/components/layout/PageWrapper";
import { CheckCircle2, XCircle } from "lucide-react";

const ELIGIBLE = [
  "Account was not delivered within the promised activation window (1 hour)",
  "Account is non-functional at the time of delivery (cannot run ads at all)",
  "We failed to provide a lifetime replacement when an account died without policy violation",
  "Service was not delivered as described on this website",
];

const NOT_ELIGIBLE = [
  "Account suspension or restriction due to your own policy violations (e.g. prohibited content, fraudulent activity, trademark violations)",
  "Ban caused by aggressive campaigns that violate Meta or Google policies on a Whitehat account",
  "Change of mind after the account has been delivered and accessed",
  "Refund requests made more than 24 hours after account delivery",
  "Issues caused by third-party tools, cloakers, or unauthorized modifications",
  "Setup fees and one-time service charges are non-refundable",
];

const SECTIONS = [
  {
    title: "1. Refund Window",
    body: "Refund requests must be made within 24 hours of account delivery. After this window, our standard lifetime replacement policy applies instead of monetary refunds.",
  },
  {
    title: "2. Lifetime Replacement (Preferred Resolution)",
    body: "For the vast majority of issues, we offer free lifetime account replacements instead of refunds. If your account dies without policy violation, we replace it at no cost — including transferring any remaining ad balance to the new account. This is faster and more valuable than a refund in almost every case.",
  },
  {
    title: "3. How to Request a Refund",
    body: "Contact us via Telegram @RazrMarketing with: (a) your order details, (b) screenshots demonstrating the issue, and (c) a clear description of what happened. Our team will review and respond within 24 hours.",
  },
  {
    title: "4. Refund Processing Time",
    body: "Approved refunds are processed within 5-7 business days via the original payment method. International bank transfers and cryptocurrency refunds may take longer depending on network conditions.",
  },
  {
    title: "5. Partial Refunds",
    body: "In cases where partial service was delivered (e.g. account was active for some time before issues arose), we may issue partial refunds proportional to unused service time, after deducting any platform fees incurred.",
  },
  {
    title: "6. Disputes",
    body: "We are committed to fair resolution. If you disagree with a refund decision, you may escalate the matter to our senior support team via email at scale@razr.marketing. We will conduct a final review and respond within 5 business days.",
  },
];

export default function Refund() {
  return (
    <PageWrapper>
      <section className="pt-28 pb-16 relative">
        <div className="container mx-auto px-4 max-w-4xl">
          <span className="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-6 block">Legal</span>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-6">
            Refund <span className="text-primary">Policy</span>
          </h1>
          <p className="text-muted-foreground text-lg mb-10">
            Last updated: June 27, 2026 — razr.marketing
          </p>

          {/* Eligible / Not Eligible Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                <h3 className="text-xl font-black uppercase tracking-tight text-slate-900">Eligible for Refund</h3>
              </div>
              <ul className="space-y-3">
                {ELIGIBLE.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-slate-700 leading-relaxed">
                    <span className="text-emerald-600 mt-1 shrink-0">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-red-200 bg-red-50 p-8">
              <div className="flex items-center gap-3 mb-6">
                <XCircle className="w-7 h-7 text-red-600" />
                <h3 className="text-xl font-black uppercase tracking-tight text-slate-900">Not Eligible</h3>
              </div>
              <ul className="space-y-3">
                {NOT_ELIGIBLE.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-slate-700 leading-relaxed">
                    <span className="text-red-600 mt-1 shrink-0">✕</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Policy Sections */}
          <div className="space-y-10">
            {SECTIONS.map((s) => (
              <div key={s.title} className="border-l-2 border-slate-200 pl-6 md:pl-8 hover:border-primary transition-colors">
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-4">{s.title}</h2>
                <p className="text-muted-foreground leading-relaxed text-[15px] md:text-base">{s.body}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-10 p-8 md:p-12 rounded-3xl border border-primary/20 bg-primary/[0.04] text-center">
            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-4">
              Need help with an order?
            </h3>
            <p className="text-muted-foreground mb-8">
              Our team responds within 12 minutes on Telegram.
            </p>
            <a
              href="https://t.me/RazrMarketing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-10 py-5 bg-primary text-black font-black text-base uppercase tracking-widest hover:bg-white transition-colors"
            >
              Chat on Telegram
            </a>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
