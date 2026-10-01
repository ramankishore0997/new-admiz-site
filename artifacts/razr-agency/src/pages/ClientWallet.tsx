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
  History,
  ShieldCheck,
  Building,
  CheckCircle2,
  ExternalLink,
  Layers,
  Sparkles,
  RefreshCw,
  Zap,
  Info
} from "lucide-react";
import { SiTelegram } from "react-icons/si";
import { PAYMENT_CONFIG, MANUAL_PAYMENT_NETWORKS } from "@/config/payment";
import { apiFetch } from "@/lib/api";
import { playSuccessChime } from "@/lib/audioAlerts";

export default function ClientWallet() {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<"DEPOSITS" | "WITHDRAWALS" | "ALLOCATIONS">("DEPOSITS");

  // Data states
  const [myPayments, setMyPayments] = useState<any[]>([]);
  const [myWithdrawals, setMyWithdrawals] = useState<any[]>([]);
  const [isLoadingPayments, setIsLoadingPayments] = useState(true);
  const [isLoadingWithdrawals, setIsLoadingWithdrawals] = useState(true);
  const [paymentsError, setPaymentsError] = useState("");
  const [withdrawalsError, setWithdrawalsError] = useState("");

  // Deposit Modal State
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositStep, setDepositStep] = useState(1); // 1: Pay & Instructions, 2: Submit Proof, 3: Submitted Confirmation
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

  const isFirstDeposit = myPayments.length === 0;
  const minDeposit = isFirstDeposit ? MIN_DEPOSIT_FIRST : MIN_DEPOSIT_NEXT;
  const walletBalance = Number(user?.balance ?? 0);

  const fetchMyPayments = async () => {
    setIsLoadingPayments(true);
    setPaymentsError("");
    try {
      const data = await apiFetch<any[]>("/api/payments/my-payments");
      setMyPayments(data || []);
    } catch (e: any) {
      setPaymentsError(e.message || "Failed to load payment history.");
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
      setWithdrawalsError(e.message || "Failed to load withdrawal history.");
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
        description: "Payment proof submitted successfully. Our team will review and credit your balance promptly.",
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

  const totalDeposited = myPayments
    .filter((p) => p.status === "PAID")
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);

  const totalWithdrawn = myWithdrawals
    .filter((w) => w.status === "APPROVED")
    .reduce((sum, w) => sum + Number(w.amount || 0), 0);

  const pendingWithdrawals = myWithdrawals
    .filter((w) => w.status === "PENDING")
    .reduce((sum, w) => sum + Number(w.amount || 0), 0);

  return (
    <ClientLayout>
      <div className="space-y-8 max-w-7xl mx-auto pb-16">
        {/* Top Header Card */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-r from-emerald-50 via-white to-slate-50 p-8 shadow-sm">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black uppercase tracking-widest mb-3">
                <Wallet className="w-3.5 h-3.5 text-emerald-600" /> Capital & Treasury Management
              </div>
              <h1 className="text-3xl font-black tracking-tight uppercase text-slate-900">
                Wallet <span className="text-emerald-600">& Treasury</span>
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Manage your USDT funds, execute instant deposits, and request withdrawals with 0% foreign transaction fees.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => {
                  setShowDepositModal(true);
                  setDepositStep(1);
                }}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-widest transition-all duration-300 shadow-lg shadow-emerald-600/25 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" /> Deposit Funds
              </button>

              <button
                onClick={() => {
                  setWithdrawError("");
                  setSubmittedWithdrawal(null);
                  setShowWithdrawModal(true);
                }}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-widest transition-all shadow-md cursor-pointer"
              >
                <ArrowDownToLine className="w-4 h-4" /> Withdraw Funds
              </button>
            </div>
          </div>
        </div>

        {/* Telegram Fast Deposit & Treasury Support Line */}
        <div className="rounded-3xl border border-[#229ED9]/30 bg-gradient-to-r from-[#229ED9]/10 via-[#229ED9]/5 to-white p-5 md:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#229ED9] text-white flex items-center justify-center shrink-0 shadow-lg shadow-[#229ED9]/30">
              <SiTelegram className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Instant Deposit Clearance & Treasury Concierge
                </span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Online
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Sent USDT and want instant credit within 2 minutes? Send your TXID directly to our treasury desk on Telegram.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href={PAYMENT_CONFIG.telegramSupportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#229ED9] hover:bg-[#1a8bc2] text-white text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-[#229ED9]/20 cursor-pointer"
            >
              <SiTelegram className="w-4 h-4" />
              <span>Ping Treasury on Telegram</span>
            </a>
          </div>
        </div>

        {/* 3 Key Treasury Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* 1. Available Balance */}
          <div className="relative overflow-hidden rounded-3xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/80 via-white to-white p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
            <div>
              <div className="flex items-center justify-between text-slate-500 mb-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800/80">Available Balance</span>
                <div className="w-11 h-11 rounded-2xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center border border-emerald-200/60 shadow-xs group-hover:scale-105 transition-transform">
                  <Wallet className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl md:text-4xl font-black text-slate-900 font-mono tracking-tight tabular-nums">
                ${walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mt-1.5 block">
                USDT (Ready for Instant Ad Spend)
              </span>
            </div>
            <div className="pt-4 mt-4 border-t border-emerald-100/80 flex items-center gap-1.5 text-xs text-emerald-700 font-bold">
              <TrendingUp className="w-3.5 h-3.5" /> 100% Commission-Free Balance
            </div>
          </div>

          {/* 2. Total Deposited */}
          <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 backdrop-blur-sm p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-slate-400 via-slate-600 to-slate-800" />
            <div>
              <div className="flex items-center justify-between text-slate-500 mb-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Total Deposited</span>
                <div className="w-11 h-11 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center border border-slate-200/60 shadow-xs group-hover:scale-105 transition-transform">
                  <PlusCircle className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
              <div className="text-3xl md:text-4xl font-black text-slate-900 font-mono tracking-tight tabular-nums">
                ${totalDeposited.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <span className="text-[10px] text-slate-500 font-medium mt-1.5 block">
                Lifetime credited deposits
              </span>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 text-[11px] text-slate-500 font-semibold flex items-center justify-between">
              <span>TRC20 · BEP20 · ERC20</span>
              <span className="text-emerald-600 font-bold">Direct Clearance</span>
            </div>
          </div>

          {/* 3. Total Withdrawn */}
          <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 backdrop-blur-sm p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500" />
            <div>
              <div className="flex items-center justify-between text-slate-500 mb-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Total Withdrawn</span>
                <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100 shadow-xs group-hover:scale-105 transition-transform">
                  <ArrowDownToLine className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl md:text-4xl font-black text-slate-900 font-mono tracking-tight tabular-nums">
                ${totalWithdrawn.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <span className="text-[10px] text-slate-500 font-medium mt-1.5 block">
                Dispatched to your address
              </span>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 text-[11px] text-slate-500 font-semibold">
              {pendingWithdrawals > 0 ? (
                <span className="text-amber-600 font-bold">${pendingWithdrawals.toFixed(2)} in administrative review</span>
              ) : (
                <span className="text-slate-400">0 pending requests</span>
              )}
            </div>
          </div>
        </div>

        {/* Action Callout Banner */}
        <div className="p-7 rounded-3xl bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl shadow-slate-900/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-1.5 relative z-10">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" /> Instant Agency Line Liquidity
            </span>
            <h3 className="text-xl font-black uppercase tracking-tight">
              Ready to Load Your Ad Accounts?
            </h3>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Deposits are credited to your central wallet. You can allocate funds into individual Meta, Google, or TikTok ad accounts on demand with tiered service fees (1.5%–3%).
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0 relative z-10">
            <button
              onClick={() => {
                setShowDepositModal(true);
                setDepositStep(1);
              }}
              className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-widest transition-all shadow-md cursor-pointer active:scale-95"
            >
              Deposit USDT
            </button>
            <Link href="/app/dashboard">
              <a className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-black uppercase tracking-widest transition-all border border-white/10">
                Ad Accounts <ArrowRight className="w-3.5 h-3.5 inline ml-1" />
              </a>
            </Link>
          </div>
        </div>

        {/* Transaction History & Records Section */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 p-6 md:p-8 space-y-6">
          {/* Header & Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-black uppercase tracking-tight text-slate-900">
                Treasury & Transaction Records
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Complete log of all wallet deposits, withdrawals, and balance movements.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("DEPOSITS")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "DEPOSITS"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
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
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
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
                <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between">
                  <span>{paymentsError}</span>
                  <button onClick={fetchMyPayments} className="font-bold underline cursor-pointer">Retry</button>
                </div>
              ) : isLoadingPayments ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
              ) : myPayments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 font-black uppercase text-[10px] tracking-wider">
                        <th className="pb-3 pr-4">Order / ID</th>
                        <th className="pb-3 px-4">Network</th>
                        <th className="pb-3 px-4">Amount</th>
                        <th className="pb-3 px-4">TXID</th>
                        <th className="pb-3 px-4">Date</th>
                        <th className="pb-3 pl-4 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {myPayments.map((p: any) => (
                        <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-4 pr-4 font-mono font-bold text-slate-900">
                            #{p.orderId || p.id}
                          </td>
                          <td className="py-4 px-4">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md font-mono text-[10px] font-bold bg-slate-100 text-slate-700 uppercase border border-slate-200">
                              {p.network}
                            </span>
                          </td>
                          <td className="py-4 px-4 font-black text-slate-900 text-sm">
                            ${Number(p.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })} USDT
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-1.5 max-w-[200px]">
                              <span className="font-mono text-[11px] text-slate-500 truncate" title={p.txHash}>
                                {p.txHash}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCopy(p.txHash, "TXID")}
                                className="text-slate-400 hover:text-slate-900 cursor-pointer"
                                title="Copy TXID"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-slate-500 text-[11px]">
                            {new Date(p.createdAt).toLocaleDateString()} {new Date(p.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="py-4 pl-4 text-right">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                              p.status === "PAID"
                                ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                                : p.status === "REJECTED"
                                ? "text-red-700 bg-red-50 border-red-200"
                                : "text-amber-700 bg-amber-50 border-amber-200"
                            }`}>
                              {p.status === "PAID" ? (
                                <><CheckCircle2 className="w-3 h-3 text-emerald-600" /> Credited</>
                              ) : p.status === "REJECTED" ? (
                                <><X className="w-3 h-3 text-red-600" /> Rejected</>
                              ) : (
                                <><Clock className="w-3 h-3 text-amber-600" /> In Review</>
                              )}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50 space-y-3">
                  <Wallet className="w-10 h-10 text-slate-300 mx-auto" />
                  <div>
                    <h4 className="text-sm font-black uppercase text-slate-700">No Deposits Submitted Yet</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Top up your wallet with USDT on Tron or BNB Smart Chain.</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowDepositModal(true);
                      setDepositStep(1);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-black uppercase tracking-wider hover:bg-emerald-700 transition-colors shadow-sm cursor-pointer"
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
                <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between">
                  <span>{withdrawalsError}</span>
                  <button onClick={fetchMyWithdrawals} className="font-bold underline cursor-pointer">Retry</button>
                </div>
              ) : isLoadingWithdrawals ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
              ) : myWithdrawals.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 font-black uppercase text-[10px] tracking-wider">
                        <th className="pb-3 pr-4">Request ID</th>
                        <th className="pb-3 px-4">Amount</th>
                        <th className="pb-3 px-4">USDT Payout Address</th>
                        <th className="pb-3 px-4">Requested Date</th>
                        <th className="pb-3 pl-4 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {myWithdrawals.map((w: any) => (
                        <tr key={w.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-4 pr-4 font-mono font-bold text-slate-900">
                            {w.requestId}
                          </td>
                          <td className="py-4 px-4 font-black text-slate-900 text-sm">
                            ${Number(w.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })} USDT
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-1.5 max-w-[220px]">
                              <span className="font-mono text-[11px] text-slate-600 truncate" title={w.usdtAddress}>
                                {w.usdtAddress}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCopy(w.usdtAddress, "Payout Address")}
                                className="text-slate-400 hover:text-slate-900 cursor-pointer"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-slate-500 text-[11px]">
                            {new Date(w.createdAt).toLocaleDateString()} {new Date(w.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="py-4 pl-4 text-right">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                              w.status === "APPROVED"
                                ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                                : w.status === "REJECTED"
                                ? "text-red-700 bg-red-50 border-red-200"
                                : "text-amber-700 bg-amber-50 border-amber-200"
                            }`}>
                              {w.status === "APPROVED" ? (
                                <><CheckCircle2 className="w-3 h-3 text-emerald-600" /> Completed</>
                              ) : w.status === "REJECTED" ? (
                                <><X className="w-3 h-3 text-red-600" /> Rejected</>
                              ) : (
                                <><Clock className="w-3 h-3 text-amber-600" /> In Review</>
                              )}
                            </span>
                            {w.rejectionReason && (
                              <div className="text-[10px] text-red-600 mt-1 italic text-right">
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
                <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50 space-y-3">
                  <ArrowDownToLine className="w-10 h-10 text-slate-300 mx-auto" />
                  <div>
                    <h4 className="text-sm font-black uppercase text-slate-700">No Withdrawal Requests</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Withdraw unspent wallet balance to your USDT address anytime (Min $200).</p>
                  </div>
                  <button
                    onClick={() => {
                      setWithdrawError("");
                      setSubmittedWithdrawal(null);
                      setShowWithdrawModal(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-black uppercase tracking-wider hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
                  >
                    <ArrowDownToLine className="w-3.5 h-3.5" /> Request Withdrawal
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
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
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 md:p-8 overflow-hidden shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-600 via-primary to-teal-500" />
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-emerald-600" /> Deposit USDT
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">Direct blockchain payment with 0% foreign transaction fees</p>
                </div>
                <button
                  onClick={resetDepositModal}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {depositStep === 1 && (
                <div className="space-y-6">
                  {/* Step 1: Network Selection */}
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2.5">
                      1. Select Blockchain Network
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                      {MANUAL_PAYMENT_NETWORKS.map((net) => (
                        <button
                          key={net.id}
                          type="button"
                          onClick={() => setSelectedNetwork(net)}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            selectedNetwork.id === net.id
                              ? "border-emerald-500 bg-emerald-50 text-slate-900 shadow-md"
                              : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
                          }`}
                        >
                          <div className="text-xs font-black uppercase">{net.name}</div>
                          <div className="text-[9px] font-bold text-emerald-600 mt-1">{net.badge}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 2: Amount input */}
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                      2. Payment Amount (USDT)
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type="number"
                          min={minDeposit}
                          value={depositAmount}
                          onChange={(e) => setDepositAmount(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm outline-none focus:border-primary/50 font-bold"
                          placeholder="Enter amount"
                        />
                        <span className="absolute right-4 top-3 text-xs font-black uppercase text-emerald-600">USDT</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(depositAmount, "Payment Amount")}
                        className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider transition-colors shrink-0 cursor-pointer"
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
                          className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                            depositAmount === String(val)
                              ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                              : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                          }`}
                        >
                          ${val}
                        </button>
                      ))}
                    </div>

                    <p className="text-[9px] text-slate-400 mt-1.5">
                      {isFirstDeposit
                        ? `First topup: minimum $${MIN_DEPOSIT_FIRST}. Zero commission — the full amount is credited to your main wallet.`
                        : `Minimum topup: $${MIN_DEPOSIT_NEXT}. Zero commission — the full amount is credited to your main wallet.`}
                    </p>
                  </div>

                  {/* Warning banner */}
                  <div className="flex items-start gap-2.5 text-xs text-amber-700 bg-amber-50 p-3.5 rounded-xl border border-amber-200 font-semibold">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                    <p>Send USDT only on the selected <strong>{selectedNetwork.name}</strong> network.</p>
                  </div>

                  {/* Receiving Address & QR Code */}
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-4">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      <div className="p-3 bg-white rounded-2xl border border-slate-200 shrink-0 shadow-lg">
                        <QRCodeSVG value={selectedNetwork.address} size={130} level="H" includeMargin={false} />
                      </div>

                      <div className="space-y-3 flex-1 min-w-0 w-full">
                        <div>
                          <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">
                            Send exactly:
                          </div>
                          <div className="text-2xl font-black text-slate-900 tracking-tight">
                            {depositAmount || "0"} USDT
                          </div>
                          <div className="text-[9px] text-slate-400 mt-0.5">
                            You'll be credited: ${(Number(depositAmount) || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} — full credit, 0% fee
                          </div>
                        </div>

                        <div>
                          <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">
                            Receiving Address:
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-[11px] font-mono text-emerald-700 break-all flex-1">
                              {selectedNetwork.address}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleCopy(selectedNetwork.address, "Receiving Address")}
                              className="p-2.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 transition-colors cursor-pointer shrink-0"
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
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-widest transition-colors shadow-lg shadow-emerald-600/20 cursor-pointer"
                  >
                    Already made the payment? Submit Proof <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {depositStep === 2 && (
                <form onSubmit={handleSubmitPaymentProof} className="space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <button
                      type="button"
                      onClick={() => setDepositStep(1)}
                      className="text-xs text-emerald-600 font-bold uppercase hover:underline cursor-pointer"
                    >
                      ← Back to Details
                    </button>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      Network: {selectedNetwork.name}
                    </span>
                  </div>

                  <h4 className="text-base font-black uppercase tracking-tight text-slate-900">Submit Payment Proof</h4>

                  {/* TXID Input */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        Transaction Hash / TXID <span className="text-red-500">*</span>
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
                        className="text-[10px] font-bold text-emerald-600 hover:underline cursor-pointer"
                      >
                        Paste from Clipboard
                      </button>
                    </div>
                    <input
                      type="text"
                      value={txHash}
                      onChange={(e) => setTxHash(e.target.value)}
                      placeholder="0x..."
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-xs font-mono outline-none focus:border-primary/50"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      {selectedNetwork.id === "tron" ? "Tron hex format, 64 characters (no 0x prefix)" : "EVM hex format starting with 0x (66 characters)"}
                    </p>
                  </div>

                  {/* Payment Screenshot File Upload */}
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                      Payment Screenshot Proof <span className="text-red-500">*</span>
                    </label>

                    {screenshotBase64 ? (
                      <div className="relative rounded-xl border border-emerald-200 bg-emerald-50 p-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <img src={screenshotBase64} alt="Preview" className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0" />
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-900 truncate">{screenshotFileName || "screenshot.png"}</div>
                            <div className="text-[9px] text-emerald-600 font-bold uppercase mt-0.5 flex items-center gap-1">
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
                          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors cursor-pointer shrink-0"
                          title="Remove image"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center p-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer text-center">
                        <Upload className="w-7 h-7 text-emerald-600 mb-2" />
                        <span className="text-xs font-bold text-slate-900">Click to Upload Payment Screenshot</span>
                        <span className="text-[10px] text-slate-500 mt-1">PNG, JPG or WEBP (Max size 5MB)</span>
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
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                      Optional Payment Note
                    </label>
                    <textarea
                      value={paymentNote}
                      onChange={(e) => setPaymentNote(e.target.value)}
                      placeholder="Add any specific comments regarding your transfer..."
                      rows={2}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 outline-none focus:border-primary/50"
                    />
                  </div>

                  {paymentError && (
                    <div className="text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">
                      {paymentError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmittingProof}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-widest transition-colors shadow-lg shadow-emerald-600/20 cursor-pointer disabled:opacity-50"
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
                  <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-600 shadow-md">
                    <Clock className="w-8 h-8" />
                  </div>

                  <div>
                    <h4 className="text-lg font-black uppercase tracking-tight text-slate-900">Payment Proof Submitted</h4>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed max-w-md mx-auto">
                      Payment proof submitted successfully. Your deposit is pending administrative clearance and will be credited to your balance shortly.
                    </p>
                  </div>

                  {submittedPayment && (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left text-xs space-y-2 font-mono">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Order ID:</span>
                        <span className="text-slate-900 font-bold">{submittedPayment.orderId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Status:</span>
                        <span className="text-amber-600 font-bold uppercase">{submittedPayment.status}</span>
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={resetDepositModal}
                    className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
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
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 md:p-8 overflow-hidden shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-600 via-primary to-teal-500" />

              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 flex items-center gap-2">
                    <ArrowDownToLine className="w-5 h-5 text-emerald-600" /> Withdraw USDT
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">Withdraw available balance to your TRON or EVM USDT address</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Available balance summary */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 flex items-center justify-between mb-5">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Available Balance</span>
                <span className="text-xl font-black text-slate-900 tabular-nums">
                  ${walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })} USDT
                </span>
              </div>

              {walletBalance < MIN_WITHDRAWAL ? (
                <div className="flex items-start gap-2.5 text-xs text-amber-700 bg-amber-50 p-4 rounded-xl border border-amber-200 font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                  <p>
                    Your available balance is below the <strong>${MIN_WITHDRAWAL} minimum withdrawal</strong>. You can add more funds or allocate remaining balance to active campaigns.
                  </p>
                </div>
              ) : submittedWithdrawal ? (
                <div className="text-center py-6 space-y-6">
                  <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-600 shadow-md">
                    <Clock className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black uppercase tracking-tight text-slate-900">Withdrawal Request Submitted</h4>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed max-w-md mx-auto">
                      Your withdrawal is pending administrator review. You'll receive ${Number(submittedWithdrawal.amount || withdrawAmount).toLocaleString()} USDT at your address once dispatched.
                    </p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left text-xs space-y-2 font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Request ID:</span>
                      <span className="text-slate-900 font-bold">{submittedWithdrawal.requestId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Status:</span>
                      <span className="text-amber-600 font-bold uppercase">{submittedWithdrawal.status}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowWithdrawModal(false);
                      setSubmittedWithdrawal(null);
                    }}
                    className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Done & Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleWithdraw} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                      Withdrawal Amount (USDT) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                      <input
                        type="number"
                        min={MIN_WITHDRAWAL}
                        max={walletBalance}
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        placeholder={`Min $${MIN_WITHDRAWAL}`}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 text-slate-900 text-sm font-black outline-none focus:border-primary/50"
                        required
                      />
                    </div>
                    <p className="text-[9px] text-slate-400 mt-1">Minimum withdrawal: ${MIN_WITHDRAWAL} USDT.</p>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                      Your USDT Receiving Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={usdtAddress}
                      onChange={(e) => setUsdtAddress(e.target.value)}
                      placeholder="e.g. TRON (T...) or EVM (0x...)"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-xs font-mono outline-none focus:border-primary/50"
                      required
                    />
                    <p className="text-[9px] text-slate-400 mt-1">TRON (TRC20) or EVM (BSC/ETH) supported.</p>
                  </div>

                  {withdrawError && (
                    <div className="text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">
                      {withdrawError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmittingWithdraw}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-widest transition-all shadow-md cursor-pointer disabled:opacity-50"
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
