import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  HelpCircle,
  Sparkles,
  FileText,
  Wallet,
  Building,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Copy,
  ArrowRight,
  Send,
  Zap,
  Clock,
  Layers
} from "lucide-react";
import { SiMeta, SiTelegram } from "react-icons/si";
import { useToast } from "@/hooks/use-toast";

interface ClientGuideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDeposit?: () => void;
}

export default function ClientGuideDrawer({ isOpen, onClose, onOpenDeposit }: ClientGuideDrawerProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"APPLY" | "DEPOSIT" | "BM_ID" | "SLA">("APPLY");

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard.`,
    });
  };

  const TABS = [
    { id: "APPLY", label: "How to Apply", icon: FileText },
    { id: "DEPOSIT", label: "Deposit Funds", icon: Wallet },
    { id: "BM_ID", label: "Meta BM ID Guide", icon: Building },
    { id: "SLA", label: "SLA Guarantee", icon: ShieldCheck },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Drawer Body */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="relative w-full max-w-lg h-full bg-[#060608] border-l border-zinc-800 shadow-2xl flex flex-col z-10 overflow-hidden"
          >
            {/* Top Bar */}
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-black/90 backdrop-blur-md">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white flex items-center justify-center shadow-md shadow-violet-500/20 font-black">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black uppercase tracking-tight text-white">
                    Platform User <span className="bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent">Guide & Setup</span>
                  </h3>
                  <p className="text-[11px] text-zinc-400 font-medium">
                    Everything you need to apply, deposit, and scale your accounts.
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Guide Tabs */}
            <div className="flex items-center gap-1.5 p-3 border-b border-zinc-800 bg-black overflow-x-auto">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                      isActive
                        ? "bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-md shadow-violet-500/20"
                        : "bg-[#060608] text-zinc-400 hover:bg-zinc-900 hover:text-white border border-zinc-800"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Content Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* TAB 1: HOW TO APPLY */}
              {activeTab === "APPLY" && (
                <div className="space-y-6">
                  <div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-cyan-300 bg-violet-500/10 px-2.5 py-0.5 rounded-full border border-violet-500/30 mb-2">
                      <Sparkles className="w-3 h-3 text-cyan-400" /> Complete Walkthrough
                    </span>
                    <h4 className="text-lg font-black uppercase text-white tracking-tight">
                      How to Apply for <span className="bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent">Agency Ad Accounts</span>
                    </h4>
                    <p className="text-xs text-zinc-400 mt-1">
                      Applying takes less than 2 minutes. Follow these 4 straightforward steps:
                    </p>
                  </div>

                  <div className="space-y-3.5">
                    <div className="p-4 rounded-2xl bg-black border border-zinc-800 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 text-white flex items-center justify-center font-black text-xs">1</span>
                        <h5 className="text-xs font-black uppercase text-white">Ensure Wallet Has Deposit Balance</h5>
                      </div>
                      <p className="text-xs text-zinc-400 pl-8 leading-relaxed">
                        Top up USDT in your main wallet ($10 first-time fee credited to your account balance). Your deposit remains yours and fuels your ad campaigns.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-black border border-zinc-800 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 text-white flex items-center justify-center font-black text-xs">2</span>
                        <h5 className="text-xs font-black uppercase text-white">Fill the Application Form</h5>
                      </div>
                      <p className="text-xs text-zinc-400 pl-8 leading-relaxed">
                        Go to <strong className="text-white">My Application</strong>, select your desired platform (Meta, Google, or TikTok), select your timezone & billing currency, and enter your destination website URL.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-black border border-zinc-800 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 text-white flex items-center justify-center font-black text-xs">3</span>
                        <h5 className="text-xs font-black uppercase text-white">Provide Your Business Manager ID</h5>
                      </div>
                      <p className="text-xs text-zinc-400 pl-8 leading-relaxed">
                        For Meta, provide your 15–16 digit Business Manager ID so our system can dispatch the direct partnership share invitation.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-black border border-zinc-800 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 text-white flex items-center justify-center font-black text-xs">4</span>
                        <h5 className="text-xs font-black uppercase text-white">Instant Admin Provisioning (~15–30m)</h5>
                      </div>
                      <p className="text-xs text-zinc-400 pl-8 leading-relaxed">
                        Our compliance team reviews your line. Once approved, accept the invite in your Business Manager and start running ads with zero spend caps!
                      </p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link href="/app/application">
                      <span onClick={onClose} className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-95 hover:scale-105 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-violet-600/30 transition-all cursor-pointer">
                        Start Application Now <ArrowRight className="w-4 h-4" />
                      </span>
                    </Link>
                  </div>
                </div>
              )}

              {/* TAB 2: DEPOSIT FUNDS */}
              {activeTab === "DEPOSIT" && (
                <div className="space-y-6">
                  <div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-cyan-300 bg-violet-500/10 px-2.5 py-0.5 rounded-full border border-violet-500/30 mb-2">
                      <Wallet className="w-3 h-3 text-cyan-400" /> Wallet Guide
                    </span>
                    <h4 className="text-lg font-black uppercase text-white tracking-tight">
                      How Wallet Top-Ups & <span className="bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent">Balances Work</span>
                    </h4>
                    <p className="text-xs text-zinc-400 mt-1">
                      Our platform uses USDT (Tether) for instant, cross-border payments with 0% foreign transaction fees.
                    </p>
                  </div>

                  <div className="space-y-3.5">
                    <div className="p-4 rounded-2xl bg-black border border-zinc-800 space-y-1.5">
                      <div className="font-black text-xs uppercase text-white flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Supported USDT Networks
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        We support <strong className="text-white">TRC20 (Tron)</strong>, <strong className="text-white">BEP20 (BNB Smart Chain)</strong>, and <strong className="text-white">ERC20 (Ethereum)</strong>. TRC20 and BEP20 offer the fastest transfer speeds and lowest gas fees.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-black border border-zinc-800 space-y-1.5">
                      <div className="font-black text-xs uppercase text-white flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400" /> How to Submit Deposit
                      </div>
                      <ol className="text-xs text-zinc-400 list-decimal list-inside space-y-1 pt-1">
                        <li>Click <strong className="text-white">Deposit Funds</strong> in your dashboard.</li>
                        <li>Copy the designated receiving wallet address and send USDT.</li>
                        <li>Paste your <strong className="text-white">Transaction Hash (TxID)</strong> and upload a screenshot proof.</li>
                        <li>Admin team reviews within 5–15 minutes and credits your balance.</li>
                      </ol>
                    </div>

                    <div className="p-4 rounded-2xl bg-black border border-zinc-800 space-y-1.5">
                      <div className="font-black text-xs uppercase text-white flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400" /> 100% Usable for Ad Spend
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Your deposited funds sit securely in your main wallet and can be loaded into your active ad accounts anytime with 1 click.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        if (onOpenDeposit) onOpenDeposit();
                      }}
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-95 hover:scale-105 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-violet-600/30 transition-all cursor-pointer"
                    >
                      Open Deposit Modal <Wallet className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: BM ID GUIDE */}
              {activeTab === "BM_ID" && (
                <div className="space-y-6">
                  <div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-cyan-300 bg-violet-500/10 px-2.5 py-0.5 rounded-full border border-violet-500/30 mb-2">
                      <SiMeta className="w-3.5 h-3.5 text-[#1877F2]" /> Meta Business Manager
                    </span>
                    <h4 className="text-lg font-black uppercase text-white tracking-tight">
                      Finding Your Meta <span className="bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent">BM ID</span>
                    </h4>
                    <p className="text-xs text-zinc-400 mt-1">
                      Quick walkthrough on how to locate your 15–16 digit ID in Facebook Business Manager.
                    </p>
                  </div>

                  <div className="space-y-3.5">
                    <div className="p-4 rounded-2xl bg-black border border-zinc-800 space-y-1">
                      <div className="text-xs font-black uppercase text-white">Step 1: Go to Business Settings</div>
                      <p className="text-xs text-zinc-400">
                        Visit <a href="https://business.facebook.com/settings" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline font-bold">business.facebook.com/settings</a>.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-black border border-zinc-800 space-y-1">
                      <div className="text-xs font-black uppercase text-white">Step 2: Click "Business Info"</div>
                      <p className="text-xs text-zinc-400">
                        Scroll to the bottom of the left sidebar and click on <strong className="text-white">Business Info</strong>.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-black border border-zinc-800 space-y-2">
                      <div className="text-xs font-black uppercase text-white">Step 3: Copy the 15-Digit Number</div>
                      <p className="text-xs text-zinc-400">
                        At the top under <strong className="text-white">Business Manager Info</strong>, copy the numeric ID.
                      </p>
                      <div className="p-3 rounded-xl bg-[#0c0c10] border border-zinc-800 flex items-center justify-between text-xs font-mono font-bold text-white">
                        <span>102938475619283</span>
                        <button
                          type="button"
                          onClick={() => handleCopy("102938475619283", "Example BM ID")}
                          className="px-2.5 py-1 rounded-lg bg-black hover:bg-zinc-800 text-[10px] text-zinc-300 font-sans border border-zinc-800 cursor-pointer"
                        >
                          Copy Example
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-violet-950/30 border border-violet-500/30 space-y-2">
                    <div className="text-xs font-black uppercase text-cyan-300">Need a New Business Manager?</div>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      Purchase high-trust, active Meta Business Managers from our store starting at $7 USDT with instant delivery.
                    </p>
                    <Link href="/app/buy-bm">
                      <span onClick={onClose} className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer">
                        Open BM Store <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </Link>
                  </div>
                </div>
              )}

              {/* TAB 4: SLA GUARANTEE */}
              {activeTab === "SLA" && (
                <div className="space-y-6">
                  <div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-cyan-300 bg-violet-500/10 px-2.5 py-0.5 rounded-full border border-violet-500/30 mb-2">
                      <ShieldCheck className="w-3 h-3 text-cyan-400" /> Enterprise Protection
                    </span>
                    <h4 className="text-lg font-black uppercase text-white tracking-tight">
                      100% SLA & Account <span className="bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent">Replacement Guarantee</span>
                    </h4>
                    <p className="text-xs text-zinc-400 mt-1">
                      Our institutional structure ensures your campaigns remain active with zero downtime.
                    </p>
                  </div>

                  <div className="space-y-3.5">
                    <div className="p-4 rounded-2xl bg-black border border-zinc-800 space-y-1.5">
                      <div className="font-black text-xs uppercase text-white flex items-center gap-2">
                        <Zap className="w-4 h-4 text-cyan-400" /> Unlimited Free Replacements
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        If an ad account faces algorithmic suspension or policy flag, click <strong className="text-white">Request Replacement</strong> in your dashboard. A fresh, pre-warmed account is provisioned immediately.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-black border border-zinc-800 space-y-1.5">
                      <div className="font-black text-xs uppercase text-white flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-cyan-400" /> 100% Balance Security
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Any remaining unspent ad budget in a suspended account is instantly transferred to your new account or refunded to your main wallet.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-black border border-zinc-800 space-y-1.5">
                      <div className="font-black text-xs uppercase text-white flex items-center gap-2">
                        <Clock className="w-4 h-4 text-cyan-400" /> 24/7 Dedicated Human Escalation
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Direct communication with Meta, Google, and TikTok partner representatives to expedite approvals and appeal false positives.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Support Footer */}
            <div className="p-4 border-t border-zinc-800 bg-black flex items-center justify-between text-xs">
              <span className="text-zinc-400 text-[11px]">
                Have custom scaling questions?
              </span>
              <a
                href="https://t.me/RazrMarketing"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-95 text-white text-[11px] font-black uppercase tracking-wider transition-all shadow-md shadow-violet-500/20"
              >
                <SiTelegram className="w-3.5 h-3.5" /> Telegram Support
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
