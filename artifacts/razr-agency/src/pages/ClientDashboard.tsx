import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import ClientLayout from "@/components/layout/ClientLayout";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import {
  Wallet,
  ShieldCheck,
  PlusCircle,
  Copy,
  ArrowUpRight,
  TrendingUp,
  Activity,
  History,
  Building,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Loader2,
  ExternalLink,
  Upload,
  FileImage,
  Trash2,
  X,
  Clock,
  ArrowDownToLine
} from "lucide-react";
import { SiTelegram, SiMeta, SiGoogleads, SiTiktok } from "react-icons/si";
import { PAYMENT_CONFIG, MANUAL_PAYMENT_NETWORKS } from "@/config/payment";
import { apiFetch } from "@/lib/api";

const TELEGRAM_SUPPORT_URL = PAYMENT_CONFIG.telegramSupportUrl;

export default function ClientDashboard() {
  const [, setLocation] = useLocation();
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();

  const [applications, setApplications] = useState<any[]>([]);
  const [myPayments, setMyPayments] = useState<any[]>([]);
  const [isLoadingApps, setIsLoadingApps] = useState(true);
  const [appsError, setAppsError] = useState("");
  const [paymentsError, setPaymentsError] = useState("");

  // Deposit Modal State
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositStep, setDepositStep] = useState(1); // 1: Pay & Instructions, 2: Submit Proof Form, 3: Submitted Confirmation

  // Load Fund Modal State
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [loadTarget, setLoadTarget] = useState<any | null>(null);
  const [loadAmount, setLoadAmount] = useState("100");
  const [isLoadingLoad, setIsLoadingLoad] = useState(false);

  // Payment Form State
  const [selectedNetwork, setSelectedNetwork] = useState(MANUAL_PAYMENT_NETWORKS[0]);
  const [depositAmount, setDepositAmount] = useState("500");
  const [txHash, setTxHash] = useState("");
  const [screenshotBase64, setScreenshotBase64] = useState<string | null>(null);
  const [screenshotFileName, setScreenshotFileName] = useState<string>("");
  const [paymentNote, setPaymentNote] = useState("");
  const [isSubmittingProof, setIsSubmittingProof] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [submittedPayment, setSubmittedPayment] = useState<any>(null);
  const [isLoadingPayments, setIsLoadingPayments] = useState(true);

  // Withdraw Modal State
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("200");
  const [usdtAddress, setUsdtAddress] = useState("");
  const [isSubmittingWithdraw, setIsSubmittingWithdraw] = useState(false);
  const [withdrawError, setWithdrawError] = useState("");
  const [submittedWithdrawal, setSubmittedWithdrawal] = useState<any>(null);
  const [myWithdrawals, setMyWithdrawals] = useState<any[]>([]);
  const [isLoadingWithdrawals, setIsLoadingWithdrawals] = useState(true);

  const MIN_WITHDRAWAL = 200;

  const fetchMyWithdrawals = async () => {
    setIsLoadingWithdrawals(true);
    try {
      const data = await apiFetch<any[]>("/api/withdrawals/my");
      setMyWithdrawals(data || []);
    } catch {
      setMyWithdrawals([]);
    } finally {
      setIsLoadingWithdrawals(false);
    }
  };

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

  const fetchApplications = async () => {
    setIsLoadingApps(true);
    setAppsError("");
    try {
      const data = await apiFetch<any[]>("/api/applications");
      setApplications(data || []);
    } catch (e: any) {
      setAppsError(e.message || "Failed to load applications.");
    } finally {
      setIsLoadingApps(false);
    }
  };

  // Silent auto-refresh so status updates appear live without reloading
  useEffect(() => {
    const id = setInterval(() => {
      apiFetch<any[]>("/api/applications")
        .then((data) => setApplications(data || []))
        .catch(() => {});
    }, 30000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    // Load applications
    fetchApplications();

    // Provisioned ad accounts come from the authenticated profile (/api/me)
    // Load user manual payment verification history
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

    // Validate file type
    const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Invalid File Type",
        description: "Please upload a PNG, JPG, or WEBP screenshot.",
      });
      return;
    }

    // Validate file size (max 5MB)
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
        description: "Please enter a valid top-up amount. Deposits are commission-free — full credit, no fees.",
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
      fetchMyPayments();
      await refreshUser();
      toast({
        title: "Proof Submitted!",
        description: "Payment proof submitted successfully. Your payment is pending verification.",
      });
    } catch (err: any) {
      setPaymentError(err.message || "Network error.");
    } finally {
      setIsSubmittingProof(false);
    }
  };

  const resetModal = () => {
    setShowDepositModal(false);
    setDepositStep(1);
    setTxHash("");
    setScreenshotBase64(null);
    setScreenshotFileName("");
    setPaymentNote("");
    setPaymentError("");
    setSubmittedPayment(null);
  };

  const openLoadModal = (acc: any) => {
    setLoadTarget(acc);
    setLoadAmount("100");
    setShowLoadModal(true);
  };

  const openWithdrawModal = () => {
    setWithdrawAmount("200");
    setUsdtAddress("");
    setWithdrawError("");
    setSubmittedWithdrawal(null);
    setShowWithdrawModal(true);
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();

    const amt = Number(withdrawAmount);
    if (!amt || amt <= 0) {
      setWithdrawError("Please enter a valid withdrawal amount.");
      return;
    }

    const availableBalance = user?.balance ?? 0;
    if (availableBalance < MIN_WITHDRAWAL) {
      setWithdrawError("Your available balance is below the $200 minimum withdrawal. You can add more funds, then apply for a refund.");
      return;
    }
    if (amt < MIN_WITHDRAWAL) {
      setWithdrawError(`Minimum withdrawal amount is $${MIN_WITHDRAWAL}. You can add more funds, then apply for a refund.`);
      return;
    }
    if (amt > availableBalance) {
      setWithdrawError(`Insufficient available balance. Your available balance is $${availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}.`);
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
        description: `$${amt} USDT withdrawal submitted for approval.`,
      });
    } catch (err: any) {
      setWithdrawError(err.message || "Could not submit withdrawal request.");
    } finally {
      setIsSubmittingWithdraw(false);
    }
  };

  const handleLoadFunds = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loadTarget) return;

    const amt = Number(loadAmount);
    if (!amt || amt <= 0) {
      toast({ variant: "destructive", title: "Invalid Amount", description: "Please enter a valid load amount." });
      return;
    }

    setIsLoadingLoad(true);
    try {
      const res = await apiFetch<any>(`/api/accounts/${loadTarget.dbId}/load`, {
        method: "POST",
        body: JSON.stringify({ amount: amt }),
      });
      toast({
        title: "Balance Loaded",
        description: `$${res.amount} loaded into ${loadTarget.name || loadTarget.platform}. $${res.commission} service fee (2%) — total $${res.total} deducted from main wallet.`,
      });
      setShowLoadModal(false);
      await refreshUser();
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "Load Failed",
        description: e.message || "Could not load balance into this account.",
      });
    } finally {
      setIsLoadingLoad(false);
    }
  };

  const activeApp = applications.find(
    (a) => !["APPROVED", "REJECTED", "CANCELLED"].includes(a.status)
  ) || applications[0];

  const adAccounts = user?.adAccounts ?? [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
      case "PAID":
        return "text-emerald-600 border-emerald-200 bg-emerald-50";
      case "REJECTED":
        return "text-red-600 border-red-200 bg-red-50";
      case "PENDING_VERIFICATION":
      case "UNDER_REVIEW":
        return "text-amber-600 border-amber-200 bg-amber-50";
      default:
        return "text-slate-600 border-slate-200 bg-slate-100";
    }
  };

  const getStatusPercentage = (status: string) => {
    switch (status) {
      case "DRAFT": return 15;
      case "SUBMITTED": return 35;
      case "UNDER_REVIEW": return 60;
      case "INFORMATION_REQUIRED":
      case "DOCUMENTS_REQUIRED": return 75;
      case "APPROVED": return 100;
      default: return 10;
    }
  };

  const getNextStep = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "Complete the form and submit — review starts right after submission.";
      case "SUBMITTED":
        return "Application received. Admin review starts within 24 hrs — live updates appear here.";
      case "UNDER_REVIEW":
        return "Compliance checks in progress. Approval typically takes 24–48 hrs.";
      case "INFORMATION_REQUIRED":
      case "DOCUMENTS_REQUIRED":
        return "Action required — check the reviewer note and message thread.";
      case "APPROVED":
        return "Approved! Top up your ad account to activate it and get BM access.";
      case "REJECTED":
        return "Declined — check the reviewer note or contact support.";
      default:
        return "Status update pending.";
    }
  };

  const timeAgo = (iso?: string) => {
    if (!iso) return "just now";
    const mins = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins} min${mins > 1 ? "s" : ""} ago`;
    const hrs = Math.round(mins / 60);
    if (hrs < 24) return `${hrs} hr${hrs > 1 ? "s" : ""} ago`;
    const days = Math.round(hrs / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  return (
    <ClientLayout>
      {/* Top Banner / Welcome Header */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-r from-emerald-50 via-white to-slate-50 p-8 mb-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-bold uppercase tracking-widest mb-3">
              <Building className="w-3.5 h-3.5" /> Client Operations Cockpit
            </div>
            <h1 className="text-3xl font-black tracking-tight uppercase text-slate-900">
              Welcome back, <span className="text-primary">{user?.username}</span>
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              {user?.companyName} · Telegram: @{user?.telegramHandle}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setShowDepositModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-widest transition-all duration-300 shadow-[0_4px_20px_rgba(5,150,105,0.25)] cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" /> Add Funds (USDT)
            </button>

            <button
              onClick={openWithdrawModal}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-900 text-xs font-black uppercase tracking-widest transition-all border border-slate-200 cursor-pointer"
            >
              <ArrowDownToLine className="w-4 h-4" /> Withdraw
            </button>

            <Link href="/app/application">
              <a className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-900 text-xs font-black uppercase tracking-widest transition-all border border-slate-200">
                Apply New Account <ArrowUpRight className="w-4 h-4" />
              </a>
            </Link>
          </div>
        </div>
      </div>

      {/* Grid Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Wallet balance */}
        <div className="relative group rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-lg shadow-slate-200/60 p-6">
          <div className="absolute top-4 right-4 w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
            <Wallet className="w-5 h-5" />
          </div>
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Available Ad Balance</div>
          <div className="text-3xl font-black text-slate-900 tabular-nums">${(user?.balance ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold mt-4">
            <TrendingUp className="w-3.5 h-3.5" /> 100% Secure Cryptographical Storage
          </div>
        </div>

        {/* Ad accounts count */}
        <div className="relative group rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-lg shadow-slate-200/60 p-6">
          <div className="absolute top-4 right-4 w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Active Accounts</div>
          <div className="text-3xl font-black text-slate-900 tabular-nums">
            {adAccounts.filter((a: any) => a.status === "ACTIVE").length || 0}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold mt-4">
            <Activity className="w-3.5 h-3.5" /> Platform provision status
          </div>
        </div>

        {/* Live Application Tracker card */}
        <div className="relative group rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-lg shadow-slate-200/60 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              Live Application Status {applications.length > 0 && (
                <span className="ml-1 text-primary">· {applications.length} account{applications.length > 1 ? "s" : ""}</span>
              )}
            </div>
            <span className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider text-emerald-600">
              <span className="relative flex w-1.5 h-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full w-1.5 h-1.5 bg-emerald-500" />
              </span>
              LIVE
            </span>
          </div>
          {appsError ? (
            <div>
              <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-2.5">
                {appsError}
              </div>
              <button
                onClick={fetchApplications}
                className="mt-2 text-[10px] font-black uppercase tracking-wider text-primary hover:underline cursor-pointer"
              >
                Retry
              </button>
            </div>
          ) : isLoadingApps ? (
            <div className="flex items-center justify-center h-12">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
            </div>
          ) : activeApp ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                  {activeApp.publicId}
                </span>
                <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${getStatusColor(activeApp.status)}`}>
                  {activeApp.status}
                </span>
              </div>
              <div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-600 to-teal-500 rounded-full transition-all duration-500"
                    style={{ width: `${getStatusPercentage(activeApp.status)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1.5">
                  <span>Progress</span>
                  <span>{getStatusPercentage(activeApp.status)}%</span>
                </div>
              </div>
              <div className="text-[9px] text-slate-500 font-semibold flex items-start gap-1.5">
                <Activity className="w-3 h-3 mt-0.5 text-primary shrink-0" />
                <span>{getNextStep(activeApp.status)}</span>
              </div>
              <div className="text-[9px] text-slate-400">
                Last update: {timeAgo(activeApp.updatedAt)}
              </div>
            </div>
          ) : (
            <div>
              <div className="text-sm font-bold text-slate-700">No active application.</div>
              <Link href="/app/application">
                <a className="inline-flex items-center gap-1.5 text-xs text-primary font-bold hover:underline mt-4">
                  Apply Now <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        {/* LEFT: Ad accounts & Applications */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 p-6">
            <h2 className="text-lg font-black uppercase tracking-tight text-slate-900 mb-6">Your Provisioned Ad Accounts</h2>
            {adAccounts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {adAccounts.map((acc: any) => {
                  const getPlatformIcon = (platform: string) => {
                    const l = platform.toLowerCase();
                    if (l.includes("meta") || l.includes("facebook")) return <SiMeta className="w-5 h-5 text-[#1877F2]" />;
                    if (l.includes("google") || l.includes("youtube")) return <SiGoogleads className="w-5 h-5 text-yellow-500" />;
                    if (l.includes("tiktok")) return <SiTiktok className="w-5 h-5 text-slate-900" />;
                    return <Building className="w-5 h-5 text-primary" />;
                  };

                  return (
                    <div key={acc.id} className="rounded-xl border border-slate-200 bg-slate-50 p-5 hover:border-slate-300 transition-colors flex flex-col">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
                          {getPlatformIcon(acc.platform)}
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          acc.status === "ACTIVE"
                            ? "text-emerald-600 border-emerald-200 bg-emerald-50"
                            : acc.status === "APPROVED"
                            ? "text-emerald-700 border-emerald-200 bg-emerald-50"
                            : "text-amber-600 border-amber-200 bg-amber-50"
                        }`}>
                          {acc.status === "APPROVED" ? "APPROVED" : acc.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">
                        {acc.name ? (
                          <span className="text-slate-900">{acc.name}</span>
                        ) : (
                          acc.platform
                        )}
                      </div>
                      <div className="text-sm font-mono font-bold text-slate-900 mt-1 selection:bg-primary/30">
                        {acc.accountId || "Provisioning ID..."}
                      </div>

                      {acc.status === "ACTIVE" && acc.businessPortfolioId && (
                        <div className="mt-1.5 inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-700 w-fit">
                          <ShieldCheck className="w-3 h-3" /> BM: {acc.businessPortfolioId}
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-3 text-[10px] text-slate-500 font-bold">
                        <span>Daily Limit: {acc.spendLimit || "$5,000"}</span>
                        <span className="text-emerald-700">
                          Balance: <strong className="text-emerald-700">${(Number(acc.balance) || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
                        </span>
                      </div>

                      {acc.status === "APPROVED" && Number(acc.balance || 0) < 100 && (
                        <div className="mt-2 text-[9px] text-slate-500 font-semibold">
                          Topup a minimum of <strong>$100</strong> to get Business Manager access assigned.
                        </div>
                      )}

                      {acc.status === "APPROVED" && (
                        <div className="mt-2 text-[9px] text-slate-500 font-semibold flex items-start gap-1.5">
                          <ShieldCheck className="w-3 h-3 mt-0.5 text-emerald-600 shrink-0" />
                          <span>Topup unlocks BM access + account activation. 100% refund if BM isn't assigned within 48 hrs.</span>
                        </div>
                      )}

                      {(acc.status === "ACTIVE" || acc.status === "APPROVED") && (
                        <button
                          onClick={() => openLoadModal(acc)}
                          className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-widest transition-colors cursor-pointer shadow-[0_4px_15px_rgba(5,150,105,0.2)]"
                        >
                          <Wallet className="w-3.5 h-3.5" /> {acc.status === "APPROVED" && Number(acc.balance || 0) < 100 ? "Topup & Get BM Access" : "Load Fund"}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl">
                <Building className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                <p className="text-xs text-slate-500">No provisioned agency ad accounts yet.</p>
                <Link href="/app/application">
                  <a className="inline-flex items-center gap-1.5 text-xs text-primary font-bold hover:underline mt-3">
                    Submit Application <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: VIP Support & Deposit Verification Logs */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Support channel */}
          <div className="rounded-2xl border border-slate-200 bg-[#229ED9]/5 p-6 relative overflow-hidden group">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#229ED9]/10 border border-[#229ED9]/30 flex items-center justify-center text-[#229ED9]">
                <SiTelegram className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase text-slate-900 tracking-wider">VIP Support Desk</h3>
                <span className="text-[9px] font-bold text-[#229ED9] uppercase tracking-widest">Active online</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Contact our team directly on Telegram at <strong className="text-slate-900">@RazrMarketing</strong> to request priority review or query your deposit verification.
            </p>
            <a
              href={TELEGRAM_SUPPORT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#229ED9] hover:bg-[#1a8bc2] text-white text-xs font-black uppercase tracking-widest transition-colors cursor-pointer"
            >
              Open Telegram Support <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* User Submitted Manual Payment Logs */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 p-6">
            <div className="flex items-center gap-2 mb-4 text-slate-500">
              <History className="w-4 h-4" />
              <span className="text-xs font-black uppercase tracking-wider">Manual Payment Verification Requests</span>
            </div>
            {paymentsError ? (
              <div>
                <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-2.5">
                  {paymentsError}
                </div>
                <button
                  onClick={fetchMyPayments}
                  className="mt-2 text-[10px] font-black uppercase tracking-wider text-primary hover:underline cursor-pointer"
                >
                  Retry
                </button>
              </div>
            ) : isLoadingPayments ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
              </div>
            ) : myPayments.length > 0 ? (
              <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
                {myPayments.map((p: any) => (
                  <div key={p.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="font-bold text-slate-900">${p.amount} USDT</div>
                      <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${
                        p.status === "PAID"
                          ? "text-emerald-600 bg-emerald-50 border-emerald-200"
                          : p.status === "REJECTED"
                          ? "text-red-600 bg-red-50 border-red-200"
                          : "text-amber-600 bg-amber-50 border-amber-200"
                      }`}>
                        {p.status === "PENDING_VERIFICATION" ? "PENDING VERIFICATION" : p.status}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 flex justify-between">
                      <span className="uppercase font-mono font-bold text-emerald-600">{p.network}</span>
                      <span>{new Date(p.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="font-mono text-[9px] text-slate-600 truncate">
                      TXID: {p.txHash}
                    </div>
                    {p.rejectionReason && (
                      <div className="text-[9px] text-red-600 italic">
                        Reason: {p.rejectionReason}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-6">No payment verification requests submitted yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* MANUAL USDT PAYMENT MODAL */}
      <AnimatePresence>
        {showDepositModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={resetModal}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 md:p-8 overflow-hidden shadow-2xl shadow-slate-200/60 z-10 max-h-[90vh] overflow-y-auto"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 via-primary to-teal-500" />
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-emerald-600" /> Pay with USDT
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">Manual USDT payment verification system</p>
                </div>
                <button
                  onClick={resetModal}
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
                      1. Select EVM Blockchain Network
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                      {MANUAL_PAYMENT_NETWORKS.map((net) => (
                        <button
                          key={net.id}
                          type="button"
                          onClick={() => setSelectedNetwork(net)}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            selectedNetwork.id === net.id
                              ? "border-emerald-500 bg-emerald-50 text-slate-900 shadow-lg shadow-emerald-100"
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
                          min={1}
                          value={depositAmount}
                          onChange={(e) => setDepositAmount(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm outline-none focus:border-primary/50 font-bold"
                          placeholder="Enter amount"
                        />
                        <span className="absolute right-4 top-3 text-xs font-black uppercase text-emerald-600">USDT</span>
                      </div>
                      <button
                        onClick={() => handleCopy(depositAmount, "Payment Amount")}
                        className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider transition-colors shrink-0 cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5 inline mr-1" /> Copy Amount
                      </button>
                    </div>
                    <p className="text-[9px] text-slate-400 mt-1.5">
                      Zero commission on deposits — the full amount is credited to your main wallet. No fees, no deductions.
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
                            You'll be credited: ${(Number(depositAmount) || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} — full amount, no commission
                          </div>
                        </div>

                        <div>
                          <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">
                            Receiving Address:
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-[11px] font-mono text-emerald-700 break-all flex-1 selection:bg-emerald-500/30">
                              {selectedNetwork.address}
                            </div>
                            <button
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
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                      Transaction Hash / TXID <span className="text-red-500">*</span>
                    </label>
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
                              <CheckCircle className="w-3 h-3" /> Image Uploaded & Verified
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
                  <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-600 shadow-[0_0_20px_rgba(217,119,6,0.15)]">
                    <Clock className="w-8 h-8" />
                  </div>

                  <div>
                    <h4 className="text-lg font-black uppercase tracking-tight text-slate-900">Payment Proof Submitted</h4>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed max-w-md mx-auto">
                      Payment proof submitted successfully. Your payment is pending verification by an administrator.
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
                    onClick={resetModal}
                    className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Done & Close
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Load Fund Modal */}
      <AnimatePresence>
        {showLoadModal && loadTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setShowLoadModal(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 md:p-8 overflow-hidden shadow-2xl shadow-slate-200/60 z-10"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 to-teal-500" />
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight text-slate-900 flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-emerald-600" /> Load Fund
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    {loadTarget.name || loadTarget.platform} · <span className="font-mono">{loadTarget.accountId}</span>
                  </p>
                </div>
                <button
                  onClick={() => setShowLoadModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleLoadFunds} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                    Amount to Load (USD)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      min={1}
                      value={loadAmount}
                      onChange={(e) => setLoadAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 text-slate-900 text-sm font-black outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                  <p className="text-[9px] text-slate-400 mt-1.5">
                    {loadTarget.status === "APPROVED"
                      ? `Minimum topup $100 required. Once topped up, an administrator will assign Business Manager access and activate the account.`
                      : `Loaded from your main wallet. Includes a 2% service fee added on top.`}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold">Amount loaded</span>
                    <span className="text-slate-900 font-black">${Number(loadAmount) || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-bold">Service fee (2%)</span>
                    <span className="text-slate-900 font-black">${(Number(loadAmount) * 0.02).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-200">
                    <span className="text-slate-500 font-bold">Deducted from main wallet</span>
                    <span className="text-emerald-700 font-black">${(Number(loadAmount) * 1.02).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-200">
                    <span className="text-slate-500 font-bold">Main wallet available</span>
                    <span className="text-slate-900 font-black">
                      ${(user?.balance ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {loadTarget.status === "APPROVED" && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-emerald-700">
                      <ShieldCheck className="w-4 h-4" /> What happens after topup
                    </div>
                    <ul className="text-[10px] text-slate-600 space-y-1.5">
                      <li><span className="font-black">1.</span> Funds credited instantly to your ad account</li>
                      <li><span className="font-black">2.</span> Admin assigns your Business Manager access (within 24 hrs)</li>
                      <li><span className="font-black">3.</span> Account fully activated for ad campaigns</li>
                    </ul>
                    <div className="text-[9px] font-black text-emerald-700">
                      Full refund if BM access is not assigned within 48 hrs.
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoadingLoad}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-widest transition-all shadow-[0_4px_20px_rgba(5,150,105,0.25)] cursor-pointer disabled:opacity-50"
                >
                  {isLoadingLoad ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Loading Funds...</>
                  ) : (
                    <><ShieldCheck className="w-4 h-4" /> Confirm Load</>
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Withdraw Modal */}
      <AnimatePresence>
        {showWithdrawModal && (
          <div className="fixed inset-0 z-[75] flex items-center justify-center px-4">
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
              className="relative w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 md:p-8 overflow-hidden shadow-2xl shadow-slate-200/60 z-10 max-h-[90vh] overflow-y-auto"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 via-primary to-teal-500" />

              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 flex items-center gap-2">
                    <ArrowDownToLine className="w-5 h-5 text-emerald-600" /> Withdraw USDT
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">Withdraw your available balance to your USDT wallet</p>
                </div>
                <button
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
                  ${(user?.balance ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>

              {(user?.balance ?? 0) < MIN_WITHDRAWAL ? (
                <div className="flex items-start gap-2.5 text-xs text-amber-700 bg-amber-50 p-4 rounded-xl border border-amber-200 font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                  <p>
                    Your available balance is below the <strong>${MIN_WITHDRAWAL} minimum withdrawal</strong>. You can add
                    more funds, then apply for a refund.
                  </p>
                </div>
              ) : submittedWithdrawal ? (
                <div className="text-center py-6 space-y-6">
                  <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-600 shadow-[0_0_20px_rgba(217,119,6,0.15)]">
                    <Clock className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black uppercase tracking-tight text-slate-900">Withdrawal Request Submitted</h4>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed max-w-md mx-auto">
                      Your withdrawal is pending administrator approval. You'll receive ${Number(submittedWithdrawal.amount || withdrawAmount).toLocaleString()} USDT at your address once approved.
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
                    onClick={() => setShowWithdrawModal(false)}
                    className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Done & Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleWithdraw} className="space-y-5">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                      Withdrawal Amount (USDT)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                      <input
                        type="number"
                        min={MIN_WITHDRAWAL}
                        step="0.01"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-16 py-3.5 text-slate-900 text-sm font-black outline-none focus:border-primary/50 transition-colors"
                        placeholder={`Minimum $${MIN_WITHDRAWAL}`}
                      />
                      <span className="absolute right-4 top-3 text-xs font-black uppercase text-emerald-600">USDT</span>
                    </div>
                    <p className="text-[9px] text-slate-400 mt-1.5">
                      Minimum withdrawal: ${MIN_WITHDRAWAL} USDT.
                    </p>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                      Your USDT Payout Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={usdtAddress}
                      onChange={(e) => setUsdtAddress(e.target.value)}
                      placeholder="T... (TRON) or 0x... (EVM)"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 text-xs font-mono outline-none focus:border-primary/50 transition-colors"
                    />
                    <p className="text-[9px] text-slate-400 mt-1.5">
                      Funds will be sent to this address once the withdrawal is approved.
                    </p>
                  </div>

                  {withdrawError && (
                    <div className="flex items-start gap-2.5 text-xs text-red-600 bg-red-50 p-3.5 rounded-xl border border-red-200 font-semibold">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                      <p>{withdrawError}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmittingWithdraw}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-widest transition-all shadow-[0_4px_20px_rgba(5,150,105,0.25)] cursor-pointer disabled:opacity-50"
                  >
                    {isSubmittingWithdraw ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Submitting Request...</>
                    ) : (
                      <><ShieldCheck className="w-4 h-4" /> Request Withdrawal</>
                    )}
                  </button>
                </form>
              )}

              {/* Withdrawal history */}
              <div className="mt-6 pt-5 border-t border-slate-200">
                <div className="flex items-center gap-2 mb-3 text-slate-500">
                  <History className="w-4 h-4" />
                  <span className="text-xs font-black uppercase tracking-wider">Withdrawal History</span>
                </div>
                {isLoadingWithdrawals ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  </div>
                ) : myWithdrawals.length > 0 ? (
                  <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                    {myWithdrawals.map((w: any) => (
                      <div key={w.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <div className="font-bold text-slate-900">${Number(w.amount).toLocaleString()} USDT</div>
                          <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${
                            w.status === "APPROVED"
                              ? "text-emerald-600 bg-emerald-50 border-emerald-200"
                              : w.status === "REJECTED"
                              ? "text-red-600 bg-red-50 border-red-200"
                              : "text-amber-600 bg-amber-50 border-amber-200"
                          }`}>
                            {w.status}
                          </span>
                        </div>
                        <div className="font-mono text-[9px] text-slate-600 truncate">
                          {w.usdtAddress}
                        </div>
                        <div className="text-[9px] text-slate-500 flex justify-between">
                          <span className="font-mono">{w.requestId}</span>
                          <span>{new Date(w.createdAt).toLocaleDateString()}</span>
                        </div>
                        {w.rejectionReason && (
                          <div className="text-[9px] text-red-600 italic">Reason: {w.rejectionReason}</div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 text-center py-4">No withdrawal requests yet.</p>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ClientLayout>
  );
}
