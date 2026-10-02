import PageWrapper from "@/components/layout/PageWrapper";
import { CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

const ELIGIBLE = [
  "Account setup was not delivered within the guaranteed SLA window",
  "Initial account credentials non-functional at delivery handover",
  "Infrastructure replacement guaranteed if affected by sudden platform wave without policy breach",
  "Service unfulfilled according to agreed platform scope specifications",
];

const NOT_ELIGIBLE = [
  "Disruptions caused by advertiser policy violations (malware, deceptive creatives, prohibited goods)",
  "Uncoordinated aggressive spend surges exceeding recommended warmup limits",
  "Voluntary cancellation after infrastructure provisioning has completed",
  "Claims submitted past the 24-hour delivery inspection window",
  "Interference from unauthorized 3rd-party cloakers or unauthorized access modifications",
  "One-time onboarding and server reservation setup fees",
];

const SECTIONS = [
  {
    title: "1. Inspection Window",
    body: "Initial setup reviews and allocation checks must be confirmed within 24 hours of delivery. Beyond this window, our standard lifetime replacement warranty provides continuous coverage.",
  },
  {
    title: "2. Lifetime Replacement Protocol (Primary Resolution)",
    body: "Rather than waiting for slow monetary processing, our enterprise agreement guarantees immediate, free replacements for accounts that encounter unexpected downtime without policy breach — seamlessly transferring remaining balances to keep ad campaigns live.",
  },
  {
    title: "3. Resolution Claim Process",
    body: "Contact your dedicated agent via Telegram @RazrMarketing or WhatsApp +44 7473 951923 with your invoice reference, screenshots, and logs. Cases are acknowledged within 12 minutes.",
  },
  {
    title: "4. Settlement Timelines",
    body: "Approved adjustments or credit reversals are processed within 3-5 business days back to your original source (crypto or wire transfer).",
  },
];

export default function Refund() {
  return (
    <PageWrapper>
      <section className="pt-28 pb-20 relative bg-black">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-950/40 text-[10px] font-black uppercase tracking-widest text-cyan-300 mb-6">
            Guarantee & Refund Terms
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white mb-4">
            Refund & <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">Replacement</span> Policy
          </h1>
          <p className="text-zinc-400 text-sm md:text-base mb-12">
            Last updated: October 2026 — RAZR Global Media International Limited
          </p>

          {/* Eligible / Not Eligible Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="rounded-3xl border border-cyan-500/30 bg-[#060608] p-6 md:p-8 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle2 className="w-6 h-6 text-cyan-400" />
                <h3 className="text-lg font-black uppercase tracking-tight bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">Eligible For Guarantee</h3>
              </div>
              <ul className="space-y-3">
                {ELIGIBLE.map((item) => (
                  <li key={item} className="flex gap-3 text-xs md:text-sm text-zinc-300 leading-relaxed">
                    <span className="text-cyan-400 mt-0.5 shrink-0 font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-rose-500/30 bg-[#060608] p-6 md:p-8 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <XCircle className="w-6 h-6 text-rose-400" />
                <h3 className="text-lg font-black uppercase tracking-tight bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">Non-Eligible Circumstances</h3>
              </div>
              <ul className="space-y-3">
                {NOT_ELIGIBLE.map((item) => (
                  <li key={item} className="flex gap-3 text-xs md:text-sm text-zinc-300 leading-relaxed">
                    <span className="text-rose-400 mt-0.5 shrink-0 font-bold">✕</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Policy Sections */}
          <div className="space-y-6 mb-12">
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

          {/* CTA */}
          <SpotlightCard tone="aurora" className="p-8 md:p-12 text-center">
            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white mb-3">
              Need assistance with an active account?
            </h3>
            <p className="text-zinc-400 text-sm max-w-lg mx-auto mb-8">
              Our London and international support desk is active 24/7 with a 12-minute average response SLA.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="https://t.me/RazrMarketing"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white font-black text-xs uppercase tracking-widest hover:opacity-95 hover:scale-[1.02] transition-all shadow-xl shadow-violet-600/20"
              >
                Telegram Support
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/447473951923"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-zinc-700 bg-zinc-900/80 text-white font-black text-xs uppercase tracking-widest hover:bg-zinc-800 transition-all"
              >
                WhatsApp Desk
              </a>
            </div>
          </SpotlightCard>
        </div>
      </section>
    </PageWrapper>
  );
}
