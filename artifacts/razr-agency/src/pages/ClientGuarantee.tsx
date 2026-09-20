import ClientLayout from "@/components/layout/ClientLayout";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  RefreshCw,
  Lock,
  FileCheck,
  ArrowUpRight,
  Sparkles,
  Building2,
  Download,
  TrendingUp,
  Zap,
  Award,
  Globe2,
  Headphones,
  Check
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface CaseProof {
  niche: string;
  spend: string;
  metric: string;
  result: string;
  platform: string;
  status: string;
}

const VERIFIED_PROOFS: CaseProof[] = [
  {
    niche: "DTC Apparel & E-Commerce",
    spend: "$142,500 / mo",
    metric: "4.6x Blended ROAS",
    result: "$655,500 Generated",
    platform: "Meta Tier-1 Enterprise Line",
    status: "Active & Scaling"
  },
  {
    niche: "Solar & High-Ticket B2B Leads",
    spend: "$38,200 / mo",
    metric: "$3.90 Qualified CPL",
    result: "9,790 High-Intent Leads",
    platform: "Meta Instant Forms + Google MCC",
    status: "Active & Scaling"
  },
  {
    niche: "Web3 & FinTech Trading",
    spend: "$64,000 / mo",
    metric: "0 Ad Bans / Flags",
    result: "18,400 App Signups",
    platform: "Whitelisted Financial Line",
    status: "Active & Scaling"
  },
  {
    niche: "Nutra & Skincare Brand",
    spend: "$92,000 / mo",
    metric: "3.4x Front-End ROAS",
    result: "100% Uptime across Q4",
    platform: "Meta Enterprise + TikTok Spark",
    status: "Active & Scaling"
  }
];

export default function ClientGuarantee() {
  const { user } = useAuth();

  return (
    <ClientLayout>
      <div className="space-y-10">
        {/* Header Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-r from-emerald-50 via-white to-slate-50 p-8 md:p-10 shadow-sm">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-widest mb-3">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Contractual Agency Commitment
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-tight text-slate-900">
                101% Allocation & <span className="text-emerald-600">Performance SLA Guarantee</span>
              </h1>
              <p className="text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
                Every client on RAZR Marketing is protected by our institutional Service Level Agreement: guaranteed 2–12 hour line handover, <span className="font-bold text-slate-900">100% unspent balance security</span>, zero-fee instant replacements, and dedicated Meta/Google internal rep escalation.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link href="/app/application">
                <a className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-600/25">
                  Request New Line <ArrowUpRight className="w-4 h-4" />
                </a>
              </Link>
              <Link href="/app/specs">
                <a className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 text-xs font-black uppercase tracking-widest transition-all">
                  Account Specs
                </a>
              </Link>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 1: 4 CORE PILLARS OF CERTAINTY */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black uppercase tracking-tight text-slate-900">
              2–12 Hour Handover SLA
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Once submitted, our operations team delivers your Business Manager partner invite within 2 to 12 hours guaranteed or your first deposit fee is waived.
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black uppercase tracking-tight text-slate-900">
              100% Capital Escrow Protection
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your unspent ad balance is always 100% protected. If an account is ever flagged, all remaining funds are migrated to a fresh line within 15 minutes.
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black uppercase tracking-tight text-slate-900">
              Zero-Fee Replacements
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Zero replacement charges for unexpected algorithm policy updates. Replacement lines are provisioned from pre-warmed reserve pools within 1–2 hours.
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black uppercase tracking-tight text-slate-900">
              Hong Kong Governing Law
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Backed by registered legal entity RAZR Global Media International Ltd (CR No. 3318942, Two IFC Central) under Hong Kong SAR commercial standards.
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 2: VERIFIED MULTI-NICHE PERFORMANCE PROOFS */}
        {/* ========================================================================= */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-700">
                <Award className="w-4 h-4" /> Real-World Client Verification
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 mt-1">
                Verified Performance Across All Verticals
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Proof of continuous scale, cheap CPMs, and zero downtime across multiple ad sectors on our agency infrastructure.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {VERIFIED_PROOFS.map((proof, idx) => (
              <div
                key={idx}
                className="p-5 rounded-3xl border border-slate-200 bg-white shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                      {proof.niche}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <div className="text-xl font-black text-slate-900 font-mono">{proof.metric}</div>
                  <div className="text-xs font-bold text-emerald-700">{proof.result}</div>
                  <div className="text-[10px] text-slate-500 font-medium pt-1">
                    Monthly Spend: <span className="font-mono font-bold text-slate-700">{proof.spend}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px]">
                  <span className="text-slate-500 font-bold">{proof.platform}</span>
                  <span className="text-emerald-700 font-black uppercase bg-emerald-50 px-2 py-0.5 rounded-full">
                    {proof.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 3: INSTITUTIONAL SLA COMPARISON MATRIX */}
        {/* ========================================================================= */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50 overflow-hidden">
          <div className="p-6 md:p-8 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-700">
                <Award className="w-4 h-4" /> Market Benchmark
              </div>
              <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-slate-900 mt-1">
                RAZR Institutional SLA vs. Traditional Sellers
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Why enterprise media buyers and high-spending agencies choose our Hong Kong infrastructure over informal brokers.
              </p>
            </div>
            <div className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shrink-0">
              ✓ 100% Capital Insured
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Service Feature</th>
                  <th className="px-6 py-4 text-emerald-700 bg-emerald-50/50">RAZR Agency Tier-1 SLA</th>
                  <th className="px-6 py-4 text-slate-400">Traditional Telegram / Third-Party Sellers</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-bold text-slate-900">Unspent Ad Balance Protection</td>
                  <td className="px-6 py-4 font-bold text-emerald-700 bg-emerald-50/30 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>100% Balance Migrated to Fresh Line in 15 Mins</span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">❌ 0% Guarantee; Unspent funds permanently lost</td>
                </tr>

                <tr className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-bold text-slate-900">Line Replacement Policy</td>
                  <td className="px-6 py-4 font-bold text-emerald-700 bg-emerald-50/30">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>$0 Free Replacements from Pre-Warmed Pools</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500">❌ Charges $150–$300 fee per replacement account</td>
                </tr>

                <tr className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-bold text-slate-900">Guaranteed Handover Delivery</td>
                  <td className="px-6 py-4 font-bold text-emerald-700 bg-emerald-50/30">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>2 to 12 Hours Contractual SLA (Or Fee Waived)</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500">❌ Unpredictable 24–72 hr delays</td>
                </tr>

                <tr className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-bold text-slate-900">Direct Human Partner Rep</td>
                  <td className="px-6 py-4 font-bold text-emerald-700 bg-emerald-50/30">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Dedicated Manager & Direct Meta Agency Channel</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500">❌ No rep access; anonymous bot support</td>
                </tr>

                <tr className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-bold text-slate-900">Legal Corporate Accountability</td>
                  <td className="px-6 py-4 font-bold text-emerald-700 bg-emerald-50/30">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Registered Hong Kong Entity (CR: 3318942)</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500">❌ Unregulated anonymous individual accounts</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 4: EMERGENCY LINE MIGRATION & REPLACEMENT ACTION HUB */}
        {/* ========================================================================= */}
        <div className="rounded-3xl border border-slate-200 bg-slate-900 text-white p-8 md:p-10 space-y-6 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-400">
                <RefreshCw className="w-4 h-4" /> 24/7 Rapid Response Desk
              </div>
              <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white mt-1">
                Emergency Line Swap & Balance Migration
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                If any ad line experiences unexpected platform policy adjustments, our operations desk initiates an immediate zero-fee replacement and balance migration within 15 minutes.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <a
                href="https://t.me/razragency"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-600/25"
              >
                <Headphones className="w-4 h-4" /> Contact VIP Partner Desk
              </a>
              <Link href="/app/support">
                <a className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-xs font-black uppercase tracking-widest transition-all">
                  Open SLA Ticket
                </a>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-sans">Turnaround SLA</div>
              <div className="text-xl font-black text-emerald-400 mt-1">&lt; 15 Minutes</div>
              <div className="text-[10px] text-slate-400 font-sans mt-0.5">Average Migration Speed</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-sans">Capital Risk</div>
              <div className="text-xl font-black text-emerald-400 mt-1">$0.00 Loss</div>
              <div className="text-[10px] text-slate-400 font-sans mt-0.5">100% Balance Transferred</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-sans">Replacement Fee</div>
              <div className="text-xl font-black text-emerald-400 mt-1">$0.00 (Zero Fee)</div>
              <div className="text-[10px] text-slate-400 font-sans mt-0.5">Covered Under Agency Contract</div>
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}

