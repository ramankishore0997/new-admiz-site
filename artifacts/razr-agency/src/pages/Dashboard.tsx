import { useState } from "react";
import { useLocation } from "wouter";
import PageWrapper from "@/components/layout/PageWrapper";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  ShieldAlert,
  ShieldCheck,
  PlusCircle,
  Check,
  Copy,
  ArrowUpRight,
  ArrowRight,
  TrendingUp,
  Activity,
  History,
  User,
  LogOut,
  Sparkles,
  Zap,
  Globe,
  DollarSign,
  AlertCircle,
  QrCode,
  CheckCircle,
  Loader2,
  Lock,
} from "lucide-react";
import { SiTelegram, SiMeta, SiGoogleads, SiTiktok } from "react-icons/si";
import { PAYMENT_CONFIG } from "@/config/payment";

const CRYPTO_OPTIONS = PAYMENT_CONFIG.wallets;
const TELEGRAM_SUPPORT_URL = PAYMENT_CONFIG.telegramSupportUrl;

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { user, logout, refreshUser, submitDepositProof, applyAdAccount } = useAuth();
  const { toast } = useToast();

  // Redirect if not logged in
  if (!user) {
    setTimeout(() => setLocation("/login"), 50);
    return null;
  }

  // Modals/Forms State
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);

  // Deposit flow state
  const [selectedCrypto, setSelectedCrypto] = useState(CRYPTO_OPTIONS[0]);
  const [depositAmount, setDepositAmount] = useState("500");
  const [depositStep, setDepositStep] = useState(1); // 1: Setup, 2: Address/QR, 3: Verification
  const [txHash, setTxHash] = useState("");
  const [screenshotDataUrl, setScreenshotDataUrl] = useState("");
  const [submittedOrderId, setSubmittedOrderId] = useState("");
  const [isSubmittingDeposit, setIsSubmittingDeposit] = useState(false);

  // Apply Form State
  const [applyPlatform, setApplyPlatform] = useState("meta");
  const [applySpendLimit, setApplySpendLimit] = useState("Starter ($50/day warmup)");
  const [applyNotes, setApplyNotes] = useState("");

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard.`,
    });
  };

  const handleApplyAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    const platName =
      applyPlatform === "meta"
        ? "Meta Ads (Facebook/IG)"
        : applyPlatform === "google"
        ? "Google Ads (YouTube/PMax)"
        : applyPlatform === "tiktok"
        ? "TikTok Ads"
        : "Other Ads Platform";

    const result = await applyAdAccount(platName, applySpendLimit, applyNotes);

    if (!result.success) {
      toast({
        variant: "destructive",
        title: "Application Failed",
        description: result.error || "Something went wrong while submitting your application.",
      });
      return;
    }

    toast({
      title: "Account Request Submitted",
      description: `Your request for a ${platName} account is pending verification.`,
    });

    setShowApplyModal(false);
    setApplyNotes("");
  };

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Unsupported File",
        description: "Please upload a PNG, JPEG, or WEBP screenshot of your payment.",
      });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File Too Large",
        description: "Screenshot must not exceed 5 MB.",
      });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setScreenshotDataUrl(String(reader.result || ""));
    reader.readAsDataURL(file);
  };

  const submitDepositVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    const EVM_TX_REGEX = /^0x[a-fA-F0-9]{64}$/;

    if (!txHash.trim()) {
      toast({
        variant: "destructive",
        title: "Missing TxID",
        description: "Please enter the transaction hash or TxID to verify your deposit.",
      });
      return;
    }
    if (!EVM_TX_REGEX.test(txHash.trim())) {
      toast({
        variant: "destructive",
        title: "Invalid TxID",
        description: "The transaction hash must be a valid 66-character hex hash starting with 0x.",
      });
      return;
    }
    if (!screenshotDataUrl) {
      toast({
        variant: "destructive",
        title: "Screenshot Required",
        description: "Please upload a screenshot of the payment as proof.",
      });
      return;
    }

    setIsSubmittingDeposit(true);
    const result = await submitDepositProof({
      amount: Number(depositAmount),
      network: selectedCrypto.id,
      txHash: txHash.trim(),
      screenshotUrl: screenshotDataUrl,
    });
    setIsSubmittingDeposit(false);

    if (!result.success) {
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: result.error || "Something went wrong while submitting your proof.",
      });
      return;
    }

    setSubmittedOrderId(result.orderId || "");
    setDepositStep(3);
    await refreshUser();

    toast({
      title: "Proof Submitted",
      description: "Your payment proof is pending admin verification.",
    });
  };

  return (
    <PageWrapper>
      {/* Orbs */}
      <div className="absolute top-20 right-10 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl pt-8 pb-20 relative z-10">
        
        {/* Profile overview bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white shadow-[0_8px_30px_rgba(5,150,105,0.2)] p-1.5">
              <img
                src="/logo.png"
                alt="Razr Marketing"
                style={{ height: 56, width: "auto" }}
                className="object-contain"
              />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase flex items-center gap-2">
                {user.companyName}
                <span className="text-xs bg-primary/15 border border-primary/30 text-primary px-2.5 py-0.5 rounded-full font-bold uppercase">Client BM</span>
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 font-medium mt-1">
                <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {user.username}</span>
                <span className="text-slate-300">|</span>
                <span className="flex items-center gap-1.5"><SiTelegram className="w-3.5 h-3.5 text-[#229ED9]" /> @{user.telegramHandle}</span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-500">{user.email}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowApplyModal(true)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-white text-xs font-black uppercase tracking-wider hover:bg-primary/95 transition-all shadow-[0_8px_25px_rgba(5,150,105,0.25)]"
            >
              <PlusCircle className="w-4 h-4" /> Apply Ad Account
            </button>
            <button
              onClick={logout}
              className="p-3 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: Financials & Deposits (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Wallet Card */}
            <div className="relative group rounded-3xl border border-slate-200 bg-white p-6 overflow-hidden shadow-xl shadow-slate-200/60">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-primary" /> Razr Ledger
                </span>
                <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">Active</span>
              </div>
              <h4 className="text-slate-600 text-xs font-bold uppercase tracking-wider mb-1">Available Ad Funds</h4>
              <div className="text-4xl font-black text-slate-900 tracking-tight tabular-nums">${user.balance.toLocaleString()} <span className="text-lg text-slate-400 font-medium">USD</span></div>
              
              <button
                onClick={() => {
                  setDepositStep(1);
                  setDepositAmount("500");
                  setShowDepositModal(true);
                }}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 text-white text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-all duration-300 mt-6 shadow-[0_4px_20px_rgba(5,150,105,0.25)]"
              >
                <ArrowUpRight className="w-4 h-4" /> Deposit Funds
              </button>
            </div>

            {/* Deposit History */}
            <div className="rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60 p-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                <History className="w-4 h-4" /> Funding History
              </h3>
              
              {user.deposits.length === 0 ? (
                <div className="text-center py-8 text-slate-400 border border-dashed border-slate-200 rounded-2xl">
                  <DollarSign className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-medium">No deposits made yet</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[250px] overflow-y-auto custom-scrollbar pr-1">
                  {user.deposits.map((d) => (
                    <div key={d.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div>
                        <div className="text-xs font-bold text-slate-900">${d.amount.toLocaleString()} <span className="text-[10px] text-slate-500">({d.crypto})</span></div>
                        <div className="text-[9px] text-slate-400 mt-0.5">{d.date}</div>
                        {d.txHash && (
                          <div className="text-[8px] font-mono text-slate-400 mt-1 truncate max-w-[150px]" title={d.txHash}>
                            TxID: {d.txHash}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${
                          d.status === "PENDING"
                            ? "text-amber-600 bg-amber-50 border-amber-200"
                            : d.status === "FAILED"
                            ? "text-red-600 bg-red-50 border-red-200"
                            : "text-emerald-600 bg-emerald-50 border-emerald-200"
                        }`}>
                          {d.status === "PENDING" ? "Pending" : d.status === "FAILED" ? "Failed" : "Success"}
                        </span>
                        {d.status === "PENDING" && (
                          <span className="text-[8px] text-slate-400 font-medium uppercase tracking-wider">Awaiting admin verification</span>
                        )}
                        {d.status === "FAILED" && d.rejectionReason && (
                          <span className="text-[8px] text-red-600 font-medium max-w-[130px] text-right" title={d.rejectionReason}>
                            {d.rejectionReason}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* RIGHT: Ad Accounts lists (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Summary counters */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60 p-4">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                  <Activity className="w-3 h-3 text-primary" /> Active Ads
                </span>
                <span className="text-xl font-black text-slate-900 tabular-nums">
                  {user.adAccounts.filter((a) => a.status === "ACTIVE").length}
                </span>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60 p-4">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                  <TrendingUp className="w-3 h-3 text-emerald-600" /> Pending Requests
                </span>
                <span className="text-xl font-black text-slate-900 tabular-nums">
                  {user.adAccounts.filter((a) => a.status === "PENDING").length}
                </span>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60 p-4 col-span-2 sm:col-span-1">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                  <Zap className="w-3 h-3 text-amber-500" /> Infrastructure
                </span>
                <span className="text-xs font-black text-amber-600 uppercase tracking-wider block mt-1">Multi-BM MCC</span>
              </div>
            </div>

            {/* Ad Accounts Table */}
            <div className="rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Your Agency Accounts</h3>
                  <p className="text-xs text-slate-500">Scale limits and operational status of your platforms</p>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[9px] font-bold uppercase tracking-wider text-emerald-600">
                  <ShieldCheck className="w-3 h-3" /> Premier Trust
                </div>
              </div>

              {user.adAccounts.length === 0 ? (
                <div className="text-center py-16 text-slate-400 border border-dashed border-slate-200 rounded-2xl">
                  <Globe className="w-12 h-12 text-slate-300 mx-auto mb-3 animate-spin" style={{ animationDuration: "12s" }} />
                  <p className="text-sm font-semibold text-slate-700 mb-1">No ad accounts provisioned</p>
                  <p className="text-xs text-slate-500 mb-6">Submit an application to get started</p>
                  <button
                    onClick={() => setShowApplyModal(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 text-white text-xs font-black uppercase tracking-wider hover:bg-emerald-700 transition-all"
                  >
                    Apply Now
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {user.adAccounts.map((acc) => {
                    const isMeta = acc.platform.includes("Meta");
                    const isGoogle = acc.platform.includes("Google");
                    const PlatformIcon = isMeta ? SiMeta : isGoogle ? SiGoogleads : SiTiktok;
                    const platColor = isMeta ? "text-[#1877F2]" : isGoogle ? "text-[#FBBC05]" : "text-[#EE1D52]";

                    return (
                      <div
                        key={acc.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center ${platColor}`}>
                            <PlatformIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-sm font-black text-slate-900 flex items-center gap-2">
                              {acc.platform}
                              <span className="text-[10px] text-slate-400 font-mono tracking-tight">{acc.id}</span>
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5">Applied: {acc.dateApplied}</div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 sm:gap-6 justify-between sm:justify-end">
                          <div className="text-left sm:text-right">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block leading-none mb-1">Spend Cap</span>
                            <span className="text-xs font-black text-slate-900">{acc.spendLimit}</span>
                          </div>
                          <div className="text-left sm:text-right">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block leading-none mb-1">Status</span>
                            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                              acc.status === "ACTIVE"
                                ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                                : acc.status === "PENDING"
                                ? "bg-amber-50 border-amber-200 text-amber-600"
                                : "bg-red-50 border-red-200 text-red-600"
                            }`}>
                              {acc.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* DEPOSIT MODAL */}
      <AnimatePresence>
        {showDepositModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => !isSubmittingDeposit && setShowDepositModal(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 md:p-8 overflow-hidden shadow-2xl shadow-slate-200/60 z-10"
            >
              {/* STEP 1: SELECT CRYPTO & AMOUNT */}
              {depositStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 flex items-center gap-2">
                      <img src="/logo.png" alt="Razr Marketing" style={{ height: 30, width: "auto" }} className="object-contain" /> Add Ad Funds
                    </h3>
                    <p className="text-xs text-slate-600 mt-1">Fund your wallet with cryptocurrency to allocate budget instantly.</p>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Select Cryptocurrency</label>
                    <div className="grid grid-cols-2 gap-3">
                      {CRYPTO_OPTIONS.map((c) => {
                        const isSelected = selectedCrypto.id === c.id;
                        return (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => setSelectedCrypto(c)}
                            className={`p-4 rounded-2xl border text-left flex flex-col gap-1 transition-all duration-300 relative overflow-hidden group ${
                              isSelected
                                ? `bg-gradient-to-br ${c.color} border-current ${c.text} shadow-[0_0_15px_rgba(15,23,42,0.08)]`
                                : "border-slate-200 bg-white hover:border-slate-300 text-slate-600 hover:text-slate-900"
                            }`}
                          >
                            {isSelected && (
                              <div className="absolute top-3.5 right-3.5 w-4 h-4 rounded-full bg-white text-emerald-600 flex items-center justify-center">
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              </div>
                            )}
                            <span className="text-xs font-black uppercase tracking-wider leading-none">{c.symbol}</span>
                            <span className="text-[9px] text-slate-400 leading-none group-hover:text-slate-500 transition-colors">{c.network}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Deposit Amount (USD Value) *</label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                      <input
                        type="number"
                        min={user?.deposits?.length ? "100" : "10"}
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        placeholder={user?.deposits?.length ? "Min 100" : "Min 10"}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 text-slate-900 font-black outline-none focus:border-primary/50 transition-colors"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {user?.deposits?.length
                        ? "Minimum top-up is $100. No commission on deposits — the full amount is credited to your main wallet."
                        : "First-time top-up minimum is $10 (covers the $10 ad-account application fee). No commission on deposits."}
                    </span>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-200">
                    <button
                      onClick={() => setDepositStep(2)}
                      disabled={Number(depositAmount) < (user?.deposits?.length ? 100 : 10)}
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-emerald-600 text-white text-xs font-black uppercase tracking-wider hover:bg-emerald-700 disabled:opacity-30 disabled:pointer-events-none transition-all"
                    >
                      Next Step <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: ADDRESS COPY & QR CODE */}
              {depositStep === 2 && (
                <form onSubmit={submitDepositVerification} className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 flex items-center gap-2">
                        <img src="/logo.png" alt="Razr Marketing" style={{ height: 30, width: "auto" }} className="object-contain" /> Send Crypto
                      </h3>
                      <p className="text-xs text-slate-600 mt-1">Send exact value to the secure wallet below</p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-[9px] font-black uppercase tracking-wider text-amber-600">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500" />
                      </span>
                      Pending Payment
                    </span>
                  </div>

                  {/* QR and Details Box */}
                  <div className="flex flex-col sm:flex-row gap-5 p-4 rounded-2xl bg-slate-50 border border-slate-200 items-center">
                    {/* Mock SVG QR Code with high-end style */}
                    <div className="w-24 h-24 bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(15,23,42,0.08)] relative group">
                      <svg width="76" height="76" viewBox="0 0 100 100" className="text-slate-900">
                        <path d="M0,0h40v40h-40z M10,10v20h20v-20z" fill="currentColor"/>
                        <path d="M60,0h40v40h-40z M70,10v20h20v-20z" fill="currentColor"/>
                        <path d="M0,60h40v40h-40z M10,70v20h20v-20z" fill="currentColor"/>
                        <path d="M45,45h10v10h-10z" fill="currentColor"/>
                        <path d="M45,15h10v20h-10z M75,45h20v10h-20z M45,75h10v15h-10z M75,75h15v15h-15z" fill="currentColor"/>
                        <circle cx="20" cy="20" r="4" fill="currentColor"/>
                        <circle cx="80" cy="20" r="4" fill="currentColor"/>
                        <circle cx="20" cy="80" r="4" fill="currentColor"/>
                      </svg>
                    </div>
                    
                    <div className="space-y-2.5 min-w-0 w-full text-center sm:text-left">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Amount to Send</span>
                        <span className="text-2xl font-black text-slate-900 tracking-tight">${Number(depositAmount).toLocaleString()} <span className="text-xs text-slate-500 font-medium">USD</span></span>
                        <span className="text-[10px] text-slate-500 block mt-0.5 font-bold uppercase tracking-wider">in {selectedCrypto.symbol}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Network Channel</span>
                        <span className="text-[10px] font-black text-primary uppercase tracking-wider bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full inline-block mt-0.5">{selectedCrypto.network}</span>
                      </div>
                    </div>
                  </div>

                  {/* Address Copy Field */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Secure Destination Address</label>
                    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl p-3 text-xs font-mono text-slate-900 min-w-0 transition-colors">
                      <span className="truncate flex-1 select-all">{selectedCrypto.address}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(selectedCrypto.address, "Deposit Address")}
                        className="p-2 rounded bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Warning banner */}
                  <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50 flex items-start gap-2.5 text-[10px] text-amber-700 leading-relaxed">
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5 animate-pulse" />
                    <p>
                      Warning: Send only <strong className="text-amber-600">{selectedCrypto.symbol}</strong> via <strong className="text-amber-600">{selectedCrypto.network}</strong> network. Other assets or networks will result in permanent loss.
                    </p>
                  </div>

                  {/* Transaction Hash / TxID Input */}
                  <div className="flex flex-col gap-2 pt-2 border-t border-slate-200">
                    <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider flex items-center justify-between">
                      <span>Transaction Hash / TxID *</span>
                      <span className="text-[9px] text-primary lowercase tracking-normal font-normal">Required for validation</span>
                    </label>
                    <input
                      value={txHash}
                      onChange={(e) => setTxHash(e.target.value)}
                      placeholder="Paste blockchain TxID / Hash here"
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-xs font-mono outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
                    />
                  </div>

                  {/* Payment Screenshot Proof */}
                  <div className="flex flex-col gap-2 border-t border-slate-200 pt-4">
                    <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider flex items-center justify-between">
                      <span>Payment Screenshot Proof *</span>
                      <span className="text-[9px] text-primary lowercase tracking-normal font-normal">PNG, JPEG or WEBP up to 5 MB</span>
                    </label>
                    {screenshotDataUrl ? (
                      <div className="flex items-center gap-3 p-2 rounded-xl border border-emerald-200 bg-emerald-50">
                        <img src={screenshotDataUrl} alt="Payment proof preview" className="w-14 h-14 object-cover rounded-lg border border-slate-200" />
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Screenshot attached</span>
                          <span className="text-[9px] text-slate-400 block truncate">Ready for admin verification</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setScreenshotDataUrl("")}
                          className="text-[9px] font-bold text-slate-500 hover:text-red-600 uppercase tracking-wider underline transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <label className="w-full cursor-pointer flex flex-col items-center justify-center gap-1.5 p-4 rounded-xl border border-dashed border-slate-300 bg-white hover:border-primary/40 hover:bg-emerald-50 transition-colors">
                        <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        </svg>
                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Upload payment screenshot</span>
                        <span className="text-[9px] text-slate-400">Shows the outgoing USDT transfer for this TxID</span>
                        <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleScreenshotChange} />
                      </label>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center pt-2">
                    <button
                      type="button"
                      onClick={() => setDepositStep(1)}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs font-black uppercase tracking-wider transition-all"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingDeposit || !txHash.trim()}
                      className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-black uppercase tracking-wider hover:brightness-110 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-[0_4px_20px_rgba(16,185,129,0.3)]"
                    >
                      Verify & Send <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 3: SUBMITTED SUCCESS & TELEGRAM REDIRECT */}
              {depositStep === 3 && (
                <div className="space-y-6 text-center py-4">
                  <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-600 shadow-[0_0_30px_rgba(217,119,6,0.15)] mb-4">
                    <CheckCircle className="w-8 h-8 animate-bounce" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-black uppercase tracking-tight text-slate-900">Proof Submitted</h3>
                    <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                      Your payment proof is registered as <span className="text-amber-600 font-bold uppercase">PENDING VERIFICATION</span>.
                      An admin will verify the transaction on-chain and credit your balance.
                    </p>
                    {submittedOrderId && (
                      <p className="text-[10px] font-mono text-slate-500 pt-1">Order ID: {submittedOrderId}</p>
                    )}
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-left text-[10px] text-slate-500 leading-relaxed font-mono">
                    💡 <strong>What's Next?</strong> The admin will verify your TxID on-chain and approve your deposit from the admin panel. Your balance updates automatically once approved.
                  </div>

                  <div className="flex flex-col gap-2 max-w-xs mx-auto">
                    <a
                      href={TELEGRAM_SUPPORT_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#229ED9] text-white text-xs font-black uppercase tracking-widest hover:bg-[#229ED9]/95 transition-all shadow-[0_4px_20px_rgba(34,158,217,0.3)]"
                    >
                      <SiTelegram className="w-4 h-4" /> Message Support
                    </a>
                    <button
                      onClick={() => setShowDepositModal(false)}
                      className="text-[10px] font-bold text-slate-400 hover:text-slate-900 uppercase tracking-wider py-1 underline transition-colors"
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* APPLY AD ACCOUNT MODAL */}
      <AnimatePresence>
        {showApplyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setShowApplyModal(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 md:p-8 overflow-hidden shadow-2xl shadow-slate-200/60 z-10"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 to-teal-500" />

              <div className="mb-6">
                <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 flex items-center gap-2">
                  <img src="/logo.png" alt="Razr Marketing" style={{ height: 30, width: "auto" }} className="object-contain" /> Request Agency Account
                </h3>
                <p className="text-xs text-slate-600 mt-1">Get immediate high-spend billing capacity on your preferred networks.</p>
              </div>

              <form onSubmit={handleApplyAccount} className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Select Network *</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "meta", name: "Meta Ads", Icon: SiMeta, color: "text-emerald-600 border-emerald-200 bg-emerald-50" },
                      { id: "google", name: "Google Ads", Icon: SiGoogleads, color: "text-[#FBBC05] border-[#FBBC05]/20 bg-[#FBBC05]/5" },
                      { id: "tiktok", name: "TikTok Ads", Icon: SiTiktok, color: "text-[#EE1D52] border-[#EE1D52]/20 bg-[#EE1D52]/5" },
                    ].map((p) => {
                      const Icon = p.Icon;
                      const isSelected = applyPlatform === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setApplyPlatform(p.id)}
                          className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                            isSelected
                              ? `${p.color} border-current`
                              : "border-slate-200 bg-white hover:border-slate-300 text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          <Icon className="w-5 h-5 mb-2" />
                          <span className="text-[10px] font-bold">{p.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Requested Spend Cap *</label>
                  <select
                    value={applySpendLimit}
                    onChange={(e) => setApplySpendLimit(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm outline-none focus:border-primary/50 transition-colors"
                  >
                    <option value="Starter ($50/day warmup)">Starter ($50/day warmup)</option>
                    <option value="Growth ($5,000/day limit)">Growth ($5,000/day limit)</option>
                    <option value="Enterprise (Unlimited daily spend)">Enterprise (Unlimited daily spend)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                    <span>Niche Details & Notes</span>
                    <span className="text-[9px] text-slate-400 capitalize tracking-normal font-normal">Optional</span>
                  </label>
                  <textarea
                    value={applyNotes}
                    onChange={(e) => setApplyNotes(e.target.value)}
                    rows={3}
                    placeholder="Describe your offer, landing page, and target geography..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm outline-none focus:border-primary/50 transition-colors resize-none"
                  />
                </div>

                {user.balance < 10 ? (
                  <div className="p-3.5 rounded-xl border border-red-200 bg-red-50 flex items-start gap-2 text-[10px] text-red-600 leading-relaxed">
                    <Lock className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <p>
                      The application fee is <strong className="text-red-600">$10 per ad account</strong> (includes unlimited
                      replacements) and is deducted from your main wallet on submission. Your current balance is insufficient —
                      please deposit funds first ({user?.deposits?.length
                        ? "minimum top-up "
                        : "first-time top-up minimum "}
                      <strong className="text-red-600">{user?.deposits?.length ? "$100" : "$10"}</strong>, no commission on deposits).
                    </p>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl border border-primary/20 bg-primary/5 flex items-start gap-2 text-[10px] text-primary/90 leading-relaxed">
                    <Wallet className="w-4 h-4 shrink-0 mt-0.5" />
                    <p>
                      <strong className="text-primary">Application fee: $10 per ad account</strong> — includes unlimited free
                      replacements. Deducted from your ledger ({'$'}{user.balance.toLocaleString()} available) when you submit.
                    </p>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setShowApplyModal(false)}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs font-black uppercase tracking-wider transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={user.balance < 10}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-emerald-600 text-white text-xs font-black uppercase tracking-wider hover:bg-emerald-700 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-[0_4px_20px_rgba(5,150,105,0.25)]"
                  >
                    Submit Application ($10 fee)
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}
