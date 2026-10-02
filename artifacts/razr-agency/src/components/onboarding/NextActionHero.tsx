import { Link } from "wouter";
import {
  Sparkles,
  ArrowRight,
  Wallet,
  FileText,
  Clock,
  ExternalLink,
  PlusCircle,
  Zap,
  Copy,
  Check
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

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
      <SpotlightCard tone="violet-cyan" className="p-6 md:p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-950/60 border border-violet-500/30 text-[10px] font-black uppercase tracking-widest text-cyan-300">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: "6s" }} /> Action Required · BM Invite Ready
            </div>
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white">
              Your Purchased Meta Business Manager is <span className="bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent">Ready!</span>
            </h2>
            <p className="text-xs text-zinc-300 leading-relaxed font-medium">
              Order <strong className="text-white">#{readyBmOrder.orderId}</strong> ({readyBmOrder.bmType}) has been provisioned. Click below to accept the BM admin invite immediately.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href={readyBmOrder.inviteLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white text-xs font-black uppercase tracking-widest hover:opacity-95 hover:scale-105 transition-all shadow-lg shadow-violet-600/30 cursor-pointer"
            >
              Accept BM Invite <ExternalLink className="w-4 h-4" />
            </a>
            <button
              type="button"
              onClick={() => handleCopyLink(readyBmOrder.inviteLink)}
              className="inline-flex items-center gap-1.5 px-4 py-3.5 rounded-xl bg-black hover:bg-zinc-900 text-white text-xs font-black uppercase tracking-widest border border-zinc-800 transition-all cursor-pointer"
            >
              {copiedLink ? <Check className="w-4 h-4 text-cyan-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? "Copied" : "Copy Link"}</span>
            </button>
          </div>
        </div>
      </SpotlightCard>
    );
  }

  // State 2: Ready Ad Account with Invite Link or BM access
  if (activeAdAccWithBm && activeAdAccWithBm.inviteLink) {
    return (
      <SpotlightCard tone="cyber" className="p-6 md:p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-950/60 border border-violet-500/30 text-[10px] font-black uppercase tracking-widest text-cyan-300">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Agency Line Access Active
            </div>
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white">
              Your Agency Ad Account Access is <span className="bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent">Ready!</span>
            </h2>
            <p className="text-xs text-zinc-300 leading-relaxed font-medium">
              Line <strong className="text-white">{activeAdAccWithBm.name || activeAdAccWithBm.platform}</strong> is provisioned. Click below to accept the direct partnership share in your Business Manager.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href={activeAdAccWithBm.inviteLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white text-xs font-black uppercase tracking-widest hover:opacity-95 hover:scale-105 transition-all shadow-lg shadow-violet-600/30 cursor-pointer"
            >
              Accept BM Partner Invite <ExternalLink className="w-4 h-4" />
            </a>
            <button
              type="button"
              onClick={() => handleCopyLink(activeAdAccWithBm.inviteLink)}
              className="inline-flex items-center gap-1.5 px-4 py-3.5 rounded-xl bg-black hover:bg-zinc-900 text-white text-xs font-black uppercase tracking-widest border border-zinc-800 transition-all cursor-pointer"
            >
              {copiedLink ? <Check className="w-4 h-4 text-cyan-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? "Copied" : "Copy"}</span>
            </button>
          </div>
        </div>
      </SpotlightCard>
    );
  }

  // State 3: Approved Ad Account Needs Initial Topup to Activate BM
  if (needsTopupAcc && onOpenLoadModal) {
    return (
      <SpotlightCard tone="amber" className="p-6 md:p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/30 text-[10px] font-black uppercase tracking-widest text-amber-300">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Step 4 of 4 · Approved & Ready for Topup
            </div>
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white">
              Account Approved! Top Up Ad Budget to Unlock <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-cyan-300 bg-clip-text text-transparent">BM Access</span>
            </h2>
            <p className="text-xs text-zinc-300 leading-relaxed font-medium">
              Your agency compliance check is complete. Load at least $50 ad spend to receive your Business Manager access link within 24 hours.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onOpenLoadModal(needsTopupAcc)}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white text-xs font-black uppercase tracking-widest hover:opacity-95 hover:scale-105 transition-all shadow-lg shadow-violet-600/30 cursor-pointer"
            >
              <Wallet className="w-4 h-4 text-cyan-300" /> Load Budget & Get BM Access
            </button>
          </div>
        </div>
      </SpotlightCard>
    );
  }

  // State 4: Review in Progress
  if (reviewApp) {
    return (
      <SpotlightCard tone="violet-cyan" className="p-6 md:p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-950/60 border border-violet-500/30 text-cyan-300 text-[10px] font-black uppercase tracking-widest">
              <Clock className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: "8s" }} /> Step 3 of 4 · Compliance Review in Progress
            </div>
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white">
              Your Application is Being Whitelisted <span className="bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent">(~15–30 mins)</span>
            </h2>
            <p className="text-xs text-zinc-300 leading-relaxed font-medium">
              Application ID: <strong className="text-cyan-300">{reviewApp.publicId}</strong>. Our compliance team is setting up your agency lines. You will receive real-time updates right here.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link href="/app/application">
              <span className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-black hover:bg-zinc-900 text-white text-xs font-black uppercase tracking-widest transition-all border border-zinc-800 cursor-pointer">
                Track Application <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>
      </SpotlightCard>
    );
  }

  // State 5: Draft Application Exists
  if (draftApp) {
    return (
      <SpotlightCard tone="amber" className="p-6 md:p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-300 text-[10px] font-black uppercase tracking-widest">
              <FileText className="w-3.5 h-3.5 text-amber-400" /> Step 2 of 4 · Incomplete Draft
            </div>
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white">
              Resume Your Ad Account <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-cyan-300 bg-clip-text text-transparent">Application</span>
            </h2>
            <p className="text-xs text-zinc-300 leading-relaxed font-medium">
              You have a saved draft application (<strong className="text-white">{draftApp.publicId}</strong>). Complete the remaining fields to launch your line.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link href="/app/application">
              <span className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-95 hover:scale-105 text-white text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-violet-600/30 cursor-pointer">
                Submit Draft Now <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>
      </SpotlightCard>
    );
  }

  // State 6: Funded Wallet, No Application Yet
  if (walletBalance > 0 && applications.length === 0) {
    return (
      <SpotlightCard tone="violet-cyan" className="p-6 md:p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-950/60 border border-violet-500/30 text-cyan-300 text-[10px] font-black uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Step 2 of 4 · Funds Ready
            </div>
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white">
              Apply for Your First <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">Agency Ad Account</span>
            </h2>
            <p className="text-xs text-zinc-300 leading-relaxed font-medium">
              You have <strong className="text-cyan-300">${walletBalance.toFixed(2)} USDT</strong> in your wallet. Select your platform (Meta, Google, or TikTok) and submit your application in 60 seconds.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link href="/app/application">
              <span className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-95 hover:scale-105 text-white text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-violet-600/30 cursor-pointer">
                Apply for Account <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>
      </SpotlightCard>
    );
  }

  // State 7: Fresh User ($0 Balance, 0 Applications)
  return (
    <SpotlightCard tone="violet-cyan" className="p-6 md:p-8 shadow-2xl backdrop-blur-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div className="space-y-1.5 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-950/60 border border-violet-500/30 text-cyan-300 text-[10px] font-black uppercase tracking-widest">
            <PlusCircle className="w-3.5 h-3.5 text-cyan-400" /> Step 1 of 4 · Get Started
          </div>
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white">
            Top Up Your Wallet to <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">Unlock Ad Accounts</span>
          </h2>
          <p className="text-xs text-zinc-300 leading-relaxed font-medium">
            Deposit USDT ($10 first-time top-up). 100% credited to your wallet, zero commission. Usable for unlimited accounts and ad spend.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenDeposit}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-95 hover:scale-105 text-white text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-violet-600/30 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" /> Deposit Funds ($10 Min)
          </button>
        </div>
      </div>
    </SpotlightCard>
  );
}
