import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Wallet,
  FileText,
  Clock,
  CheckCircle2,
  ExternalLink,
  PlusCircle,
  Zap,
  ShoppingBag,
  Copy,
  Check
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface NextActionHeroProps {
  walletBalance: number;
  applications: any[];
  adAccounts: any[];
  bmOrders?: any[];
  onOpenDeposit: () => void;
  onOpenLoadModal?: (acc: any) => void;
}

export default function NextActionHero({
  walletBalance,
  applications,
  adAccounts,
  bmOrders = [],
  onOpenDeposit,
  onOpenLoadModal
}: NextActionHeroProps) {
  const { toast } = useToast();
  const [copiedLink, setCopiedLink] = useState(false);

  // 1. Check if there is a ready BM store order with invite link
  const readyBmOrder = bmOrders.find((o) => o.status === "COMPLETED" && o.inviteLink);

  // 2. Check if there is an active/approved ad account with BM access link/ID
  const activeAdAccWithBm = adAccounts.find(
    (a) => (a.status === "ACTIVE" || a.status === "APPROVED") && (a.inviteLink || a.businessPortfolioId)
  );

  // 3. Check application states
  const draftApp = applications.find((a) => a.status === "DRAFT");
  const reviewApp = applications.find((a) => ["SUBMITTED", "UNDER_REVIEW", "INFORMATION_REQUIRED"].includes(a.status));
  const approvedApp = applications.find((a) => a.status === "APPROVED");
  const needsTopupAcc = adAccounts.find((a) => a.status === "APPROVED" && (Number(a.balance) || 0) < 50);

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    toast({
      title: "Invite Link Copied!",
      description: "Paste into your browser or accept the Business Manager invite.",
    });
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // State 1: Ready BM Store Order
  if (readyBmOrder) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-emerald-300 bg-gradient-to-r from-emerald-600 via-teal-600 to-slate-900 text-white p-6 md:p-8 shadow-xl shadow-emerald-600/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-emerald-100">
              <Sparkles className="w-3.5 h-3.5 text-emerald-200 animate-spin" style={{ animationDuration: "6s" }} /> Action Required · BM Invite Ready
            </div>
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight">
              Your Purchased Meta Business Manager is Ready!
            </h2>
            <p className="text-xs text-emerald-100/90 leading-relaxed font-medium">
              Order <strong className="text-white">#{readyBmOrder.orderId}</strong> ({readyBmOrder.bmType}) has been provisioned. Click below to accept the BM admin invite immediately.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href={readyBmOrder.inviteLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-emerald-900 text-xs font-black uppercase tracking-widest hover:bg-emerald-50 transition-all shadow-lg cursor-pointer"
            >
              Accept BM Invite <ExternalLink className="w-4 h-4" />
            </a>
            <button
              type="button"
              onClick={() => handleCopyLink(readyBmOrder.inviteLink)}
              className="inline-flex items-center gap-1.5 px-4 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-black uppercase tracking-widest border border-white/20 transition-all cursor-pointer"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? "Copied" : "Copy Link"}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // State 2: Ready Ad Account with Invite Link or BM access
  if (activeAdAccWithBm && activeAdAccWithBm.inviteLink) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-emerald-300 bg-gradient-to-r from-emerald-600 via-teal-600 to-slate-900 text-white p-6 md:p-8 shadow-xl shadow-emerald-600/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-emerald-100">
              <Sparkles className="w-3.5 h-3.5 text-emerald-200" /> Agency Line Access Active
            </div>
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight">
              Your Agency Ad Account Access is Ready!
            </h2>
            <p className="text-xs text-emerald-100/90 leading-relaxed font-medium">
              Line <strong className="text-white">{activeAdAccWithBm.name || activeAdAccWithBm.platform}</strong> is provisioned. Click below to accept the direct partnership share in your Business Manager.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href={activeAdAccWithBm.inviteLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-emerald-900 text-xs font-black uppercase tracking-widest hover:bg-emerald-50 transition-all shadow-lg cursor-pointer"
            >
              Accept BM Partner Invite <ExternalLink className="w-4 h-4" />
            </a>
            <button
              type="button"
              onClick={() => handleCopyLink(activeAdAccWithBm.inviteLink)}
              className="inline-flex items-center gap-1.5 px-4 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-black uppercase tracking-widest border border-white/20 transition-all cursor-pointer"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? "Copied" : "Copy"}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // State 3: Approved Ad Account Needs Initial Topup to Activate BM
  if (needsTopupAcc && onOpenLoadModal) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-amber-300 bg-gradient-to-r from-amber-500 via-amber-600 to-slate-900 text-white p-6 md:p-8 shadow-xl shadow-amber-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-amber-100">
              <Zap className="w-3.5 h-3.5 text-amber-200" /> Step 4 of 4 · Approved & Ready for Topup
            </div>
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight">
              Account Approved! Top Up Ad Budget to Unlock BM Access
            </h2>
            <p className="text-xs text-amber-100/90 leading-relaxed font-medium">
              Your agency compliance check is complete. Load at least $50 ad spend to receive your Business Manager access link within 24 hours.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onOpenLoadModal(needsTopupAcc)}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-amber-900 text-xs font-black uppercase tracking-widest hover:bg-amber-50 transition-all shadow-lg cursor-pointer"
            >
              <Wallet className="w-4 h-4 text-amber-600" /> Load Budget & Get BM Access
            </button>
          </div>
        </div>
      </div>
    );
  }

  // State 4: Review in Progress
  if (reviewApp) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-blue-200 bg-gradient-to-r from-blue-50 via-white to-slate-50 p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-black uppercase tracking-widest">
              <Clock className="w-3.5 h-3.5 text-blue-600 animate-spin" style={{ animationDuration: "8s" }} /> Step 3 of 4 · Compliance Review in Progress
            </div>
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-slate-900">
              Your Application is Being Whitelisted (~15–30 mins)
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Application ID: <strong className="text-slate-900">{reviewApp.publicId}</strong>. Our compliance team is setting up your agency lines. You will receive real-time updates right here.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link href="/app/application">
              <a className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-widest transition-all shadow-md">
                Track Application <ArrowRight className="w-4 h-4" />
              </a>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // State 5: Draft Application Exists
  if (draftApp) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-amber-200 bg-gradient-to-r from-amber-50 via-white to-slate-50 p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-black uppercase tracking-widest">
              <FileText className="w-3.5 h-3.5 text-amber-600" /> Step 2 of 4 · Incomplete Draft
            </div>
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-slate-900">
              Resume Your Ad Account Application
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              You have a saved draft application (<strong className="text-slate-900">{draftApp.publicId}</strong>). Complete the remaining fields to launch your line.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link href="/app/application">
              <a className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-widest transition-all shadow-md shadow-emerald-600/20">
                Submit Draft Now <ArrowRight className="w-4 h-4" />
              </a>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // State 6: Funded Wallet, No Application Yet
  if (walletBalance > 0 && applications.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-slate-50 p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-black uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Step 2 of 4 · Funds Ready
            </div>
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-slate-900">
              Apply for Your First Agency Ad Account
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              You have <strong className="text-emerald-700">${walletBalance.toFixed(2)} USDT</strong> in your wallet. Select your platform (Meta, Google, or TikTok) and submit your application in 60 seconds.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link href="/app/application">
              <a className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-widest transition-all shadow-md shadow-emerald-600/20">
                Apply for Account <ArrowRight className="w-4 h-4" />
              </a>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // State 7: Fresh User ($0 Balance, 0 Applications) -> Next Step: Deposit $10
  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-r from-emerald-50 via-white to-slate-50 p-6 md:p-8 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div className="space-y-1.5 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-black uppercase tracking-widest">
            <PlusCircle className="w-3.5 h-3.5 text-emerald-600" /> Step 1 of 4 · Get Started
          </div>
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-slate-900">
            Top Up Your Wallet to Unlock Ad Accounts
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Deposit USDT ($10 first-time top-up). 100% credited to your wallet, zero commission. Usable for unlimited accounts and ad spend.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenDeposit}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-600/25 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" /> Deposit Funds ($10 Min)
          </button>
        </div>
      </div>
    </div>
  );
}
