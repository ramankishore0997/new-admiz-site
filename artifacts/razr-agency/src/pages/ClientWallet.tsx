import { useState, useEffect } from "react";
import { Link } from "wouter";
import ClientLayout from "@/components/layout/ClientLayout";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import {
  Wallet,
  PlusCircle,
  ArrowDownToLine,
  Copy,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Loader2,
  Upload,
  Trash2,
  X,
  Clock,
  ArrowUpRight,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Sparkles,
} from "lucide-react";
import { MANUAL_PAYMENT_NETWORKS } from "@/config/payment";
import { apiFetch } from "@/lib/api";
import { playSuccessChime } from "@/lib/audioAlerts";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

export default function ClientWallet() {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<"DEPOSITS" | "WITHDRAWALS">("DEPOSITS");

  // Data states
  const [myPayments, setMyPayments] = useState<any[]>([]);
  const [myWithdrawals, setMyWithdrawals] = useState<any[]>([]);
  const [isLoadingPayments, setIsLoadingPayments] = useState(true);
  const [isLoadingWithdrawals, setIsLoadingWithdrawals] = useState(true);
  const [paymentsError, setPaymentsError] = useState("");
  const [withdrawalsError, setWithdrawalsError] = useState("");

  // Deposit Modal State
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositStep, setDepositStep] = useState(1);
  const [selectedNetwork, setSelectedNetwork] = useState(MANUAL_PAYMENT_NETWORKS[0]);
  const [depositAmount, setDepositAmount] = useState("500");
  const [txHash, setTxHash] = useState("");
  const [screenshotBase64, setScreenshotBase64] = useState<string | null>(null);
  const [screenshotFileName, setScreenshotFileName] = useState<string>("");
  const [paymentNote, setPaymentNote] = useState("");
  const [isSubmittingProof, setIsSubmittingProof] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [submittedPayment, setSubmittedPayment] = useState<any>(null);

  // Withdraw Modal State
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("200");
  const [usdtAddress, setUsdtAddress] = useState("");
  const [isSubmittingWithdraw, setIsSubmittingWithdraw] = useState(false);
  const [withdrawError, setWithdrawError] = useState("");
  const [submittedWithdrawal, setSubmittedWithdrawal] = useState<any>(null);

  const MIN_WITHDRAWAL = 200;
  const MIN_DEPOSIT_FIRST = 10;
  const MIN_DEPOSIT_NEXT = 50;

  const totalDeposited = myPayments
    .filter((p) => {
      const st = String(p.status || "").toUpperCase();
      return st === "PAID" || st === "CREDITED" || st === "COMPLETED" || st === "APPROVED" || st === "SUCCESS";
    })
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);

  const totalWithdrawn = myWithdrawals
    .filter((w) => {
      const st = String(w.status || "").toUpperCase();
      return st === "APPROVED" || st === "PAID" || st === "COMPLETED" || st === "SUCCESS";
    })
    .reduce((sum, w) => sum + Number(w.amount || 0), 0);

  const pendingWithdrawals = myWithdrawals
    .filter((w) => {
      const st = String(w.status || "").toUpperCase();
      return st === "PENDING" || st === "PENDING_APPROVAL" || st === "PROCESSING";
    })
    .reduce((sum, w) => sum + Number(w.amount || 0), 0);

  const computedNet = Math.max(0, totalDeposited - totalWithdrawn - pendingWithdrawals);
  const walletBalance = Number(user?.balance && Number(user.balance) > 0 ? user.balance : computedNet);
  const isFirstDeposit = myPayments.length === 0;
  const minDeposit = isFirstDeposit ? MIN_DEPOSIT_FIRST : MIN_DEPOSIT_NEXT;

  const fetchMyPayments = async () => {
    setIsLoadingPayments(true);
    setPaymentsError("");
    try {
      const data = await apiFetch<any[]>("/api/payments/my-payments");
      setMyPayments(data || []);
    } catch (e: any) {
      try {
        const fallback = await apiFetch<any[]>("/api/payments/me");
        setMyPayments(fallback || []);
      } catch (err: any) {
        setPaymentsError(err.message || "Failed to load payment history.");
      }
    } finally {
      setIsLoadingPayments(false);
    }
  };

  const fetchMyWithdrawals = async () => {
    setIsLoadingWithdrawals(true);
    setWithdrawalsError("");
    try {
      const data = await apiFetch<any[]>("/api/withdrawals/my");
      setMyWithdrawals(data || []);
    } catch (e: any) {
      try {
        const fallback = await apiFetch<any[]>("/api/withdrawals/me");
        setMyWithdrawals(fallback || []);
      } catch (err: any) {
        setWithdrawalsError(err.message || "Failed to load withdrawal history.");
      }
    } finally {
      setIsLoadingWithdrawals(false);
    }
  };

  useEffect(() => {
    fetchMyPayments();
    fetchMyWithdrawals();
  }, []);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard.`,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Invalid File Type",
        description: "Please upload a PNG, JPG, or WEBP screenshot.",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File Too Large",
        description: "Screenshot size must be smaller than 5MB.",
      });
      return;
    }

    setScreenshotFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setScreenshotBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitPaymentProof = async (e: React.FormEvent) => {
    e.preventDefault();

    const amt = Number(depositAmount);
    if (!amt || amt <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid Amount",
        description: "Please enter a valid deposit amount.",
      });
      return;
    }

    const cleanHash = txHash.trim();
    const isTron = selectedNetwork.id === "tron";
    const TX_REGEX = isTron ? /^[a-fA-F0-9]{64}$/ : /^0x[a-fA-F0-9]{64}$/;
    if (!cleanHash || !TX_REGEX.test(cleanHash)) {
      toast({
        variant: "destructive",
        title: "Invalid TXID Format",
        description: isTron
          ? "Please enter a valid 64-character hex Transaction Hash (Tron format, no 0x prefix)."
          : "Please enter a valid EVM 66-character hex Transaction Hash starting with 0x.",
      });
      return;
    }

    if (!screenshotBase64) {
      toast({
        variant: "destructive",
        title: "Screenshot Required",
        description: "Please upload your payment confirmation screenshot.",
      });
      return;
    }

    setIsSubmittingProof(true);
    setPaymentError("");

    try {
      const data = await apiFetch<{ orderId: string; status: string; createdAt: string }>("/api/payments/submit-proof", {
        method: "POST",
        body: JSON.stringify({
          amount: amt,
          network: selectedNetwork.id,
          txHash: cleanHash,
          screenshotUrl: screenshotBase64,
          note: paymentNote.trim(),
        }),
      });

      setSubmittedPayment(data);
      setDepositStep(3);
      playSuccessChime();
      fetchMyPayments();
      await refreshUser();
      toast({
        title: "Proof Submitted!",
        description: "Payment proof submitted successfully. Our desk will confirm and credit your balance promptly.",
      });
    } catch (err: any) {
      setPaymentError(err.message || "Network error.");
    } finally {
      setIsSubmittingProof(false);
    }
  };

  const resetDepositModal = () => {
    setShowDepositModal(false);
    setDepositStep(1);
    setTxHash("");
    setScreenshotBase64(null);
    setScreenshotFileName("");
    setPaymentNote("");
    setPaymentError("");
    setSubmittedPayment(null);
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();

    const amt = Number(withdrawAmount);
    if (!amt || amt <= 0) {
      setWithdrawError("Please enter a valid withdrawal amount.");
      return;
    }

    if (walletBalance < MIN_WITHDRAWAL) {
      setWithdrawError(`Your available balance is below the $${MIN_WITHDRAWAL} minimum withdrawal.`);
      return;
    }
    if (amt < MIN_WITHDRAWAL) {
      setWithdrawError(`Minimum withdrawal amount is $${MIN_WITHDRAWAL}.`);
      return;
    }
    if (amt > walletBalance) {
      setWithdrawError(`Insufficient available balance. Your balance is $${walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}.`);
      return;
    }

    const cleanAddress = usdtAddress.trim();
    const TRON_REGEX = /^T[1-9A-HJ-NP-Za-km-z]{33}$/;
    const EVM_REGEX = /^0x[a-fA-F0-9]{40}$/;
    if (!cleanAddress || (!TRON_REGEX.test(cleanAddress) && !EVM_REGEX.test(cleanAddress))) {
      setWithdrawError("Please enter a valid USDT address (TRON T... or EVM 0x...).");
      return;
    }

    setIsSubmittingWithdraw(true);
    setWithdrawError("");
    try {
      const data = await apiFetch<any>("/api/withdrawals/request", {
        method: "POST",
        body: JSON.stringify({ amount: amt, usdtAddress: cleanAddress }),
      });
      setSubmittedWithdrawal(data);
      setUsdtAddress("");
      fetchMyWithdrawals();
      await refreshUser();
      toast({
        title: "Withdrawal Requested!",
        description: `$${amt} USDT withdrawal submitted for administrative clearance.`,
      });
    } catch (err: any) {
      setWithdrawError(err.message || "Could not submit withdrawal request.");
    } finally {
      setIsSubmittingWithdraw(false);
    }
  };

  return (
    <ClientLayout>
      <div className="space-y-8 max-w-7xl mx-auto pb-16">
        {/* Top Header Card */}
        <SpotlightCard tone="violet-cyan" className="p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/60 border border-violet-500/30 text-cyan-300 text-xs font-black uppercase tracking-widest mb-3">
                <Wallet className="w-3.5 h-3.5 text-cyan-400" /> Capital & Treasury Management
              </div>
              <h1 className="text-3xl font-black tracking-tight uppercase text-white">
                Wallet <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">& Treasury</span>
              </h1>
              <p className="text-sm text-zinc-400 mt-1">
                Manage your USDT funds, execute instant deposits, and request withdrawals with 0% foreign transaction fees.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => {
                  setShowDepositModal(true);
                  setDepositStep(1);
                }}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-95 hover:scale-[1.02] text-white text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-violet-600/25 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" /> Deposit Funds
              </button>

              <button
                onClick={() => {
                  setWithdrawError("");
                  setSubmittedWithdrawal(null);
                  setShowWithdrawModal(true);
                }}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-black hover:bg-zinc-900 text-white text-xs font-black uppercase tracking-widest transition-all border border-zinc-800 cursor-pointer"
              >
                <ArrowDownToLine className="w-4 h-4 text-cyan-400" /> Withdraw Funds
              </button>
            </div>
          </div>
        </SpotlightCard>

        {/* 3 Key Treasury Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* 1. Available Balance */}
          <SpotlightCard tone="aurora" className="p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-zinc-400 mb-3">
                <span className="text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent">Available Balance</span>
                <div className="w-11 h-11 rounded-2xl bg-violet-500/10 text-cyan-400 flex items-center justify-center border border-violet-500/30">
                  <Wallet className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl md:text-4xl font-black text-white font-mono tracking-tight tabular-nums">
                ${walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider mt-1.5 block">
                USDT (Ready for Instant Ad Spend)
              </span>
            </div>
            <div className="pt-4 mt-4 border-t border-zinc-800 flex items-center gap-1.5 text-xs text-cyan-400 font-bold">
              <TrendingUp className="w-3.5 h-3.5" /> 100% Commission-Free Balance
            </div>
          </SpotlightCard>

          {/* 2. Total Deposited */}
          <SpotlightCard tone="sunset" className="p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-zinc-400 mb-3">
                <span className="text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-pink-400 to-amber-300 bg-clip-text text-transparent">Total Deposited</span>
                <div className="w-11 h-11 rounded-2xl bg-zinc-900 text-pink-400 flex items-center justify-center border border-zinc-800">
                  <PlusCircle className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl md:text-4xl font-black text-white font-mono tracking-tight tabular-nums">
                ${totalDeposited.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <span className="text-[10px] text-zinc-400 font-medium mt-1.5 block">
                Lifetime credited deposits
              </span>
            </div>
            <div className="pt-4 mt-4 border-t border-zinc-800 text-[11px] text-zinc-400 font-semibold flex items-center justify-between">
              <span>TRC20 · BEP20 · ERC20</span>
              <span className="text-cyan-400 font-bold">Direct Clearance</span>
            </div>
          </SpotlightCard>

          {/* 3. Total Withdrawn */}
          <SpotlightCard className="p-6 flex flex-col justify-between" spotlightColor="rgba(168, 85, 247, 0.15)">
            <div>
              <div className="flex items-center justify-between text-zinc-400 mb-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Total Withdrawn</span>
                <div className="w-11 h-11 rounded-2xl bg-zinc-900 text-violet-400 flex items-center justify-center border border-zinc-800">
                  <ArrowDownToLine className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl md:text-4xl font-black text-white font-mono tracking-tight tabular-nums">
                ${totalWithdrawn.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <span className="text-[10px] text-zinc-400 font-medium mt-1.5 block">
                Dispatched to your address
              </span>
            </div>
            <div className="pt-4 mt-4 border-t border-zinc-800 text-[11px] text-zinc-400 font-semibold">
              {pendingWithdrawals > 0 ? (
                <span className="text-amber-400 font-bold">${pendingWithdrawals.toFixed(2)} in administrative review</span>
              ) : (
                <span className="text-zinc-500">0 pending requests</span>
              )}
            </div>
          </SpotlightCard>
        </div>

        {/* Action Callout Banner */}
        <SpotlightCard tone="violet-cyan" className="p-7 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" /> Instant Agency Line Liquidity
              </span>
              <h3 className="text-xl font-black uppercase tracking-tight bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
                Ready to Load Your Ad Accounts?
              </h3>
              <p className="text-xs text-zinc-400 max-w-xl leading-relaxed">
                Deposits are credited to your central wallet. You can allocate funds into individual Meta, Google, or TikTok ad accounts on demand with tiered service fees (1.5%–3%).
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => {
                  setShowDepositModal(true);
                  setDepositStep(1);
                }}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-90 text-white text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-violet-600/30 cursor-pointer"
              >
                Deposit USDT
              </button>
              <Link href="/app/dashboard">
                <a className="px-5 py-3 rounded-xl bg-black hover:bg-zinc-900 text-white text-xs font-black uppercase tracking-widest transition-all border border-zinc-800">
                  Ad Accounts <ArrowRight className="w-3.5 h-3.5 inline ml-1" />
                </a>
              </Link>
            </div>
          </div>
        </SpotlightCard>

        {/* Transaction History & Records Section */}
        <SpotlightCard tone="default" className="p-6 md:p-8 space-y-6 shadow-2xl backdrop-blur-xl">
          {/* Header & Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
            <div>
              <h2 className="text-lg font-black uppercase tracking-tight bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
                Treasury & Transaction Records
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Complete log of all wallet deposits, withdrawals, and balance movements.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("DEPOSITS")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "DEPOSITS"
                    ? "bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white shadow-md shadow-violet-600/20"
                    : "bg-black text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-800"
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Deposits ({myPayments.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("WITHDRAWALS")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "WITHDRAWALS"
                    ? "bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white shadow-md shadow-violet-600/20"
                    : "bg-black text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-800"
                }`}
              >
                <ArrowDownToLine className="w-3.5 h-3.5" />
                <span>Withdrawals ({myWithdrawals.length})</span>
              </button>
            </div>
          </div>

          {/* TAB 1: DEPOSITS TABLE */}
          {activeTab === "DEPOSITS" && (
            <div className="space-y-4">
              {paymentsError ? (
                <div className="text-xs text-rose-400 bg-rose-950/40 border border-rose-500/30 rounded-xl p-4 flex items-center justify-between">
                  <span>{paymentsError}</span>
                  <button onClick={fetchMyPayments} className="font-bold underline cursor-pointer">Retry</button>
                </div>
              ) : isLoadingPayments ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                </div>
              ) : myPayments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-zinc-800 text-zinc-400 font-black uppercase text-[10px] tracking-wider bg-black">
                        <th className="py-3 px-4">Order / ID</th>
                        <th className="py-3 px-4">Network</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">TXID</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/80">
                      {myPayments.map((p: any) => (
                        <tr key={p.id} className="hover:bg-zinc-900/40 transition-colors">
                          <td className="py-4 px-4 font-mono font-bold text-white">
                            #{p.orderId || p.id}
                          </td>
                          <td className="py-4 px-4">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md font-mono text-[10px] font-bold bg-black text-zinc-300 uppercase border border-zinc-800">
                              {p.network}
                            </span>
                          </td>
                          <td className="py-4 px-4 font-black bg-gradient-to-r from-emerald-400 to-cyan-300 bg-clip-text text-transparent text-sm">
                            ${Number(p.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })} USDT
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-1.5 max-w-[200px]">
                              <span className="font-mono text-[11px] text-cyan-400 truncate" title={p.txHash}>
                                {p.txHash}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCopy(p.txHash, "TXID")}
                                className="text-zinc-500 hover:text-white cursor-pointer"
                                title="Copy TXID"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-zinc-400 text-[11px]">
                            {new Date(p.createdAt).toLocaleDateString()} {new Date(p.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                              p.status === "PAID"
                                ? "text-emerald-400 bg-emerald-950/60 border-emerald-500/30"
                                : p.status === "REJECTED"
                                ? "text-rose-400 bg-rose-950/60 border-rose-500/30"
                                : "text-amber-400 bg-amber-950/60 border-amber-500/30"
                            }`}>
                              {p.status === "PAID" ? (
                                <><CheckCircle2 className="w-3 h-3 text-emerald-400" /> Credited</>
                              ) : p.status === "REJECTED" ? (
                                <><X className="w-3 h-3 text-rose-400" /> Rejected</>
                              ) : (
                                <><Clock className="w-3 h-3 text-amber-400" /> In Review</>
                              )}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 border border-dashed border-zinc-800 rounded-2xl bg-black/40 space-y-3">
                  <Wallet className="w-10 h-10 text-zinc-600 mx-auto" />
                  <div>
                    <h4 className="text-sm font-black uppercase text-white">No Deposits Submitted Yet</h4>
                    <p className="text-xs text-zinc-400 mt-0.5">Top up your wallet with USDT on Tron or BNB Smart Chain.</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowDepositModal(true);
                      setDepositStep(1);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white text-xs font-black uppercase tracking-wider hover:opacity-90 transition-all shadow-md cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" /> Deposit Funds Now
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: WITHDRAWALS TABLE */}
          {activeTab === "WITHDRAWALS" && (
            <div className="space-y-4">
              {withdrawalsError ? (
                <div className="text-xs text-rose-400 bg-rose-950/40 border border-rose-500/30 rounded-xl p-4 flex items-center justify-between">
                  <span>{withdrawalsError}</span>
                  <button onClick={fetchMyWithdrawals} className="font-bold underline cursor-pointer">Retry</button>
                </div>
              ) : isLoadingWithdrawals ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                </div>
              ) : myWithdrawals.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-zinc-800 text-zinc-400 font-black uppercase text-[10px] tracking-wider bg-black">
                        <th className="py-3 px-4">Request ID</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">USDT Payout Address</th>
                        <th className="py-3 px-4">Requested Date</th>
                        <th className="py-3 px-4 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/80">
                      {myWithdrawals.map((w: any) => (
                        <tr key={w.id} className="hover:bg-zinc-900/40 transition-colors">
                          <td className="py-4 px-4 font-mono font-bold text-white">
                            {w.requestId}
                          </td>
                          <td className="py-4 px-4 font-black bg-gradient-to-r from-emerald-400 to-cyan-300 bg-clip-text text-transparent text-sm">
                            ${Number(w.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })} USDT
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-1.5 max-w-[220px]">
                              <span className="font-mono text-[11px] text-cyan-400 truncate" title={w.usdtAddress}>
                                {w.usdtAddress}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCopy(w.usdtAddress, "Payout Address")}
                                className="text-zinc-500 hover:text-white cursor-pointer"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-zinc-400 text-[11px]">
                            {new Date(w.createdAt).toLocaleDateString()} {new Date(w.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                              w.status === "APPROVED"
                                ? "text-emerald-400 bg-emerald-950/60 border-emerald-500/30"
                                : w.status === "REJECTED"
                                ? "text-rose-400 bg-rose-950/60 border-rose-500/30"
                                : "text-amber-400 bg-amber-950/60 border-amber-500/30"
                            }`}>
                              {w.status === "APPROVED" ? (
                                <><CheckCircle2 className="w-3 h-3 text-emerald-400" /> Completed</>
                              ) : w.status === "REJECTED" ? (
                                <><X className="w-3 h-3 text-rose-400" /> Rejected</>
                              ) : (
                                <><Clock className="w-3 h-3 text-amber-400" /> In Review</>
                              )}
                            </span>
                            {w.rejectionReason && (
                              <div className="text-[10px] text-rose-400 mt-1 italic text-right">
                                {w.rejectionReason}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 border border-dashed border-zinc-800 rounded-2xl bg-black/40 space-y-3">
                  <ArrowDownToLine className="w-10 h-10 text-zinc-600 mx-auto" />
                  <div>
                    <h4 className="text-sm font-black uppercase text-white">No Withdrawal Requests</h4>
                    <p className="text-xs text-zinc-400 mt-0.5">Withdraw unspent wallet balance to your USDT address anytime (Min $200).</p>
                  </div>
                  <button
                    onClick={() => {
                      setWithdrawError("");
                      setSubmittedWithdrawal(null);
                      setShowWithdrawModal(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 text-white text-xs font-black uppercase tracking-wider hover:bg-zinc-800 transition-colors shadow-md border border-zinc-800 cursor-pointer"
                  >
                    <ArrowDownToLine className="w-3.5 h-3.5" /> Request Withdrawal
                  </button>
                </div>
              )}
            </div>
          )}
        </SpotlightCard>
      </div>

      {/* MANUAL USDT PAYMENT MODAL */}
      <AnimatePresence>
        {showDepositModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={resetDepositModal}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-xl rounded-3xl border border-zinc-800 bg-[#060608] p-6 md:p-8 overflow-hidden shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500" />
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-cyan-400" /> Deposit USDT
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">Direct blockchain payment with 0% foreign transaction fees</p>
                </div>
                <button
                  onClick={resetDepositModal}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {depositStep === 1 && (
                <div className="space-y-6">
                  {/* Step 1: Network Selection */}
                  <div>
                    <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2.5">
                      1. Select Blockchain Network
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                      {MANUAL_PAYMENT_NETWORKS.map((net) => (
                        <button
                          key={net.id}
                          type="button"
                          onClick={() => setSelectedNetwork(net)}
                          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                            selectedNetwork.id === net.id
                              ? "border-cyan-500 bg-gradient-to-br from-violet-950/40 via-black to-cyan-950/40 text-white shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/50"
                              : "border-zinc-800 bg-black text-zinc-400 hover:border-zinc-700 hover:text-white"
                          }`}
                        >
                          <div className="text-xs font-black uppercase text-white">{net.name}</div>
                          <div className="text-[9px] font-bold text-cyan-400 mt-1">{net.badge}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 2: Amount input */}
                  <div>
                    <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">
                      2. Payment Amount (USDT)
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type="number"
                          min={minDeposit}
                          value={depositAmount}
                          onChange={(e) => setDepositAmount(e.target.value)}
                          className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-cyan-500 font-bold"
                          placeholder="Enter amount"
                        />
                        <span className="absolute right-4 top-3.5 text-xs font-black uppercase text-cyan-400">USDT</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(depositAmount, "Payment Amount")}
                        className="px-4 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white text-xs font-bold uppercase tracking-wider transition-colors shrink-0 cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5 inline mr-1" /> Copy Amount
                      </button>
                    </div>

                    {/* Quick Amount Presets */}
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {[50, 100, 250, 500, 1000, 2500].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setDepositAmount(String(val))}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                            depositAmount === String(val)
                              ? "bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white shadow-md shadow-violet-600/30"
                              : "bg-black text-zinc-300 border border-zinc-800 hover:bg-zinc-900"
                          }`}
                        >
                          ${val}
                        </button>
                      ))}
                    </div>

                    <p className="text-[9px] text-zinc-500 mt-2">
                      {isFirstDeposit
                        ? `First topup: minimum $${MIN_DEPOSIT_FIRST}. Zero commission — the full amount is credited to your main wallet.`
                        : `Minimum topup: $${MIN_DEPOSIT_NEXT}. Zero commission — the full amount is credited to your main wallet.`}
                    </p>
                  </div>

                  {/* Warning banner */}
                  <div className="flex items-start gap-2.5 text-xs text-amber-300 bg-amber-950/20 p-3.5 rounded-xl border border-amber-500/30 font-medium">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                    <p>Send USDT only on the selected <strong>{selectedNetwork.name}</strong> network.</p>
                  </div>

                  {/* Receiving Address & QR Code */}
                  <div className="rounded-2xl border border-zinc-800 bg-black p-5 space-y-4">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      <div className="p-3 bg-white rounded-2xl shrink-0 shadow-lg">
                        <QRCodeSVG value={selectedNetwork.address} size={130} level="H" includeMargin={false} />
                      </div>

                      <div className="space-y-3 flex-1 min-w-0 w-full">
                        <div>
                          <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">
                            Send exactly:
                          </div>
                          <div className="text-2xl font-black bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent tracking-tight">
                            {depositAmount || "0"} USDT
                          </div>
                          <div className="text-[9px] text-zinc-500 mt-0.5">
                            You'll be credited: ${(Number(depositAmount) || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} — full credit, 0% fee
                          </div>
                        </div>

                        <div>
                          <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">
                            Receiving Address:
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="bg-[#060608] border border-zinc-800 rounded-xl px-3 py-2 text-[11px] font-mono text-cyan-300 break-all flex-1">
                              {selectedNetwork.address}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleCopy(selectedNetwork.address, "Receiving Address")}
                              className="p-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition-colors cursor-pointer shrink-0"
                              title="Copy Receiving Address"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Move to Step 2 Form */}
                  <button
                    type="button"
                    onClick={() => setDepositStep(2)}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-95 text-white text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-violet-600/30 cursor-pointer"
                  >
                    Already made the payment? Submit Proof <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {depositStep === 2 && (
                <form onSubmit={handleSubmitPaymentProof} className="space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                    <button
                      type="button"
                      onClick={() => setDepositStep(1)}
                      className="text-xs text-cyan-400 font-bold uppercase hover:underline cursor-pointer"
                    >
                      ← Back to Details
                    </button>
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                      Network: {selectedNetwork.name}
                    </span>
                  </div>

                  <h4 className="text-base font-black uppercase tracking-tight bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
                    Submit Payment Proof
                  </h4>

                  {/* TXID Input */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                        Transaction Hash / TXID <span className="text-rose-400">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            const text = await navigator.clipboard.readText();
                            if (text) {
                              setTxHash(text.trim());
                              toast({ title: "Pasted!", description: "TXID pasted from clipboard." });
                            }
                          } catch {}
                        }}
                        className="text-[10px] font-bold text-cyan-400 hover:underline cursor-pointer"
                      >
                        Paste from Clipboard
                      </button>
                    </div>
                    <input
                      type="text"
                      value={txHash}
                      onChange={(e) => setTxHash(e.target.value)}
                      placeholder="0x... or 64-character hash"
                      required
                      className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs font-mono outline-none focus:border-cyan-500 placeholder:text-zinc-600"
                    />
                    <p className="text-[10px] text-zinc-500 mt-1">
                      {selectedNetwork.id === "tron" ? "Tron hex format, 64 characters (no 0x prefix)" : "EVM hex format starting with 0x (66 characters)"}
                    </p>
                  </div>

                  {/* Payment Screenshot File Upload */}
                  <div>
                    <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">
                      Payment Screenshot Proof <span className="text-rose-400">*</span>
                    </label>

                    {screenshotBase64 ? (
                      <div className="relative rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <img src={screenshotBase64} alt="Preview" className="w-12 h-12 rounded-lg object-cover border border-zinc-800 shrink-0" />
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-white truncate">{screenshotFileName || "screenshot.png"}</div>
                            <div className="text-[9px] text-cyan-400 font-bold uppercase mt-0.5 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" /> Image Uploaded
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setScreenshotBase64(null);
                            setScreenshotFileName("");
                          }}
                          className="p-2 rounded-lg bg-rose-950/60 text-rose-400 hover:bg-rose-900 transition-colors cursor-pointer shrink-0 border border-rose-500/30"
                          title="Remove image"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center p-6 rounded-xl border border-dashed border-zinc-800 bg-black hover:bg-zinc-900/40 transition-colors cursor-pointer text-center">
                        <Upload className="w-7 h-7 text-cyan-400 mb-2" />
                        <span className="text-xs font-bold text-white">Click to Upload Payment Screenshot</span>
                        <span className="text-[10px] text-zinc-500 mt-1">PNG, JPG or WEBP (Max size 5MB)</span>
                        <input
                          type="file"
                          accept="image/png, image/jpeg, image/jpg, image/webp"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  {/* Optional Note */}
                  <div>
                    <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">
                      Optional Payment Note
                    </label>
                    <textarea
                      value={paymentNote}
                      onChange={(e) => setPaymentNote(e.target.value)}
                      placeholder="Add any specific comments regarding your transfer..."
                      rows={2}
                      className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-xs text-white placeholder:text-zinc-600 outline-none focus:border-cyan-500"
                    />
                  </div>

                  {paymentError && (
                    <div className="text-xs text-rose-400 bg-rose-950/40 p-3 rounded-xl border border-rose-500/30">
                      {paymentError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmittingProof}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-90 text-white text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-violet-600/30 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmittingProof ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Submitting Proof...</>
                    ) : (
                      <><ShieldCheck className="w-4 h-4" /> Submit Payment Proof</>
                    )}
                  </button>
                </form>
              )}

              {depositStep === 3 && (
                <div className="text-center py-6 space-y-6">
                  <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400 shadow-lg">
                    <Clock className="w-8 h-8" />
                  </div>

                  <div>
                    <h4 className="text-lg font-black uppercase tracking-tight bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
                      Payment Proof Submitted
                    </h4>
                    <p className="text-xs text-zinc-400 mt-2 leading-relaxed max-w-md mx-auto">
                      Payment proof submitted successfully. Your deposit is pending administrative clearance and will be credited to your balance shortly.
                    </p>
                  </div>

                  {submittedPayment && (
                    <div className="bg-black border border-zinc-800 rounded-2xl p-4 text-left text-xs space-y-2 font-mono text-zinc-300">
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Order ID:</span>
                        <span className="text-white font-bold">{submittedPayment.orderId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Status:</span>
                        <span className="text-cyan-400 font-bold uppercase">{submittedPayment.status}</span>
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={resetDepositModal}
                    className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border border-zinc-800"
                  >
                    Done & Close
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* WITHDRAW MODAL */}
      <AnimatePresence>
        {showWithdrawModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowWithdrawModal(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-xl rounded-3xl border border-zinc-800 bg-[#060608] p-6 md:p-8 overflow-hidden shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500" />

              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent flex items-center gap-2">
                    <ArrowDownToLine className="w-5 h-5 text-cyan-400" /> Withdraw USDT
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">Withdraw available balance to your TRON or EVM USDT address</p>
                </div>
                <button
                  onClick={() => setShowWithdrawModal(false)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Available balance summary */}
              <div className="rounded-2xl border border-zinc-800 bg-black p-4 flex items-center justify-between mb-5">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Available Balance</span>
                <span className="text-xl font-black bg-gradient-to-r from-emerald-400 to-cyan-300 bg-clip-text text-transparent tabular-nums font-mono">
                  ${walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })} USDT
                </span>
              </div>

              {walletBalance < MIN_WITHDRAWAL ? (
                <div className="flex items-start gap-2.5 text-xs text-amber-300 bg-amber-950/20 p-4 rounded-xl border border-amber-500/30 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                  <p>
                    Your available balance is below the <strong>${MIN_WITHDRAWAL} minimum withdrawal</strong>. You can add more funds or allocate remaining balance to active campaigns.
                  </p>
                </div>
              ) : submittedWithdrawal ? (
                <div className="text-center py-6 space-y-6">
                  <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400 shadow-md">
                    <Clock className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black uppercase tracking-tight bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
                      Withdrawal Request Submitted
                    </h4>
                    <p className="text-xs text-zinc-400 mt-2 leading-relaxed max-w-md mx-auto">
                      Your withdrawal is pending administrator review. You'll receive ${Number(submittedWithdrawal.amount || withdrawAmount).toLocaleString()} USDT at your address once dispatched.
                    </p>
                  </div>
                  <div className="bg-black border border-zinc-800 rounded-2xl p-4 text-left text-xs space-y-2 font-mono text-zinc-300">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Request ID:</span>
                      <span className="text-white font-bold">{submittedWithdrawal.requestId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Status:</span>
                      <span className="text-cyan-400 font-bold uppercase">{submittedWithdrawal.status}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowWithdrawModal(false);
                      setSubmittedWithdrawal(null);
                    }}
                    className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border border-zinc-800"
                  >
                    Done & Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleWithdraw} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">
                      Withdrawal Amount (USDT) <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500" />
                      <input
                        type="number"
                        min={MIN_WITHDRAWAL}
                        max={walletBalance}
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        placeholder={`Min $${MIN_WITHDRAWAL}`}
                        className="w-full bg-black border border-zinc-800 rounded-xl pl-11 pr-4 py-3.5 text-white text-sm font-black outline-none focus:border-cyan-500"
                        required
                      />
                    </div>
                    <p className="text-[9px] text-zinc-500 mt-1">Minimum withdrawal: ${MIN_WITHDRAWAL} USDT.</p>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">
                      Your USDT Receiving Address <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={usdtAddress}
                      onChange={(e) => setUsdtAddress(e.target.value)}
                      placeholder="e.g. TRON (T...) or EVM (0x...)"
                      className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs font-mono outline-none focus:border-cyan-500 placeholder:text-zinc-600"
                      required
                    />
                    <p className="text-[9px] text-zinc-500 mt-1">TRON (TRC20) or EVM (BSC/ETH) supported.</p>
                  </div>

                  {withdrawError && (
                    <div className="text-xs text-rose-400 bg-rose-950/40 p-3 rounded-xl border border-rose-500/30">
                      {withdrawError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmittingWithdraw}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-90 text-white text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-violet-600/30 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmittingWithdraw ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Submitting Request...</>
                    ) : (
                      <><ArrowDownToLine className="w-4 h-4" /> Submit Withdrawal Request</>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ClientLayout>
  );
}
