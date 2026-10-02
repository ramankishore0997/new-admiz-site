import { useState, useEffect } from "react";
import ClientLayout from "@/components/layout/ClientLayout";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {
  FileText,
  Sparkles,
  CheckCircle,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  AlertCircle,
  Send,
  Loader2,
  Wallet,
  ShieldCheck,
  CircleDollarSign,
  TrendingUp,
  BadgeCheck,
  HelpCircle,
  Info,
  ArrowRight,
  Layers,
  Zap,
  Globe
} from "lucide-react";
import { PAYMENT_CONFIG } from "@/config/payment";
import { apiFetch } from "@/lib/api";
import { ACCOUNT_COUNTRIES, ACCOUNT_CURRENCIES } from "@/lib/countries-currencies";
import SearchableSelect from "@/components/ui/SearchableSelect";
import BmGuideModal from "@/components/onboarding/BmGuideModal";

const TELEGRAM_SUPPORT_URL = PAYMENT_CONFIG.telegramSupportUrl;

export default function ClientApplication() {
  const { user } = useAuth();
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "text-amber-400 bg-amber-500/10 border-amber-500/30";
      case "SUBMITTED":
        return "text-cyan-300 bg-cyan-500/10 border-cyan-500/30";
      case "UNDER_REVIEW":
        return "text-violet-400 bg-violet-500/10 border-violet-500/30";
      case "APPROVED":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
      case "INFORMATION_REQUIRED":
      case "DOCUMENTS_REQUIRED":
        return "text-rose-400 bg-rose-500/10 border-rose-500/30";
      default:
        return "text-zinc-400 bg-zinc-900 border-zinc-800";
    }
  };

  const [applications, setApplications] = useState<any[]>([]);
  const [application, setApplication] = useState<any | null>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // Simple apply form state
  const [applyPlatform, setApplyPlatform] = useState("meta");
  const [applyBmId, setApplyBmId] = useState("");
  const [applyGmail, setApplyGmail] = useState("");
  const [applyAccountName, setApplyAccountName] = useState("");
  const [applyCountry, setApplyCountry] = useState("United States");
  const [applyCurrency, setApplyCurrency] = useState("USD");
  const [applyHatType, setApplyHatType] = useState<"" | "BLACK" | "GREY" | "WHITE">("");
  const [applyAppCount, setApplyAppCount] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBmGuide, setShowBmGuide] = useState(false);

  const walletBalance = Number(user?.balance ?? 0);

  // Auto-fill applyAppCount based on user's wallet balance ($10/app, up to 5 max)
  useEffect(() => {
    if (user) {
      const calculated = Math.max(1, Math.min(5, Math.floor(walletBalance / 10)));
      setApplyAppCount(calculated);
    }
  }, [walletBalance, user]);

  const HAT_FEATURES: Record<"BLACK" | "GREY" | "WHITE", { title: string; emoji: string; desc: string; badge: string; features: string[]; styles: string; badgeStyles: string }> = {
    BLACK: {
      title: "Black Hat",
      emoji: "⚫",
      desc: "The elite tier for aggressive media buyers. Zero limits, maximum scale.",
      badge: "UNLIMITED REPLACEMENTS",
      features: [
        "Crypto, casino, nutra, gambling & every high-risk vertical allowed",
        "Unlimited free replacements — new account re-provisioned instantly, every time",
        "Aggressive scaling with zero daily-spend ceilings",
        "Priority provisioning queue — accounts ready in minutes",
        "Dedicated compliance manager on Telegram 24/7",
      ],
      styles: "border-purple-500/30 bg-[#0c0a14] text-white shadow-xl hover:border-purple-500/50",
      badgeStyles: "border-purple-500/40 bg-purple-500/10 text-purple-300",
    },
    GREY: {
      title: "Grey Hat",
      emoji: "🌫️",
      desc: "The power tier — stable, flexible and built to print.",
      badge: "FREE REPLACEMENTS",
      features: [
        "High-trust institutional accounts with instant spend approval",
        "Unlimited free replacements on every single account",
        "Smooth, steady scaling with zero friction",
        "Warm accounts with prior spending history",
        "Round-the-clock Telegram priority support",
      ],
      styles: "border-amber-500/30 bg-[#120e06] text-amber-200 shadow-xl hover:border-amber-500/50",
      badgeStyles: "border-amber-500/40 bg-amber-500/10 text-amber-300",
    },
    WHITE: {
      title: "White Hat",
      emoji: "⚪",
      desc: "The premium tier — policy-perfect, built to last forever.",
      badge: "UNLIMITED REPLACEMENTS",
      features: [
        "100% policy-cleared, resilient agency accounts",
        "Unlimited free replacements — your campaigns never stop",
        "Maximum stability for long-term brand dominance",
        "Bank-grade account history & full spend limits",
        "Priority VIP support channel on Telegram",
      ],
      styles: "border-emerald-500/30 bg-[#06120e] text-emerald-200 shadow-xl hover:border-emerald-500/50",
      badgeStyles: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
    },
  };

  // Chat message input
  const [chatMessage, setChatMessage] = useState("");
  const [isSendingMsg, setIsSendingMsg] = useState(false);

  // Load active application and details
  const loadData = async () => {
    setLoadError("");
    try {
      const list = await apiFetch<any[]>("/api/applications");
      setApplications(list);
      if (list.length > 0) {
        const chosen =
          list.find((a) => ["DRAFT", "INFORMATION_REQUIRED", "DOCUMENTS_REQUIRED"].includes(a.status)) || list[0];
        await selectApplication(chosen.id);
      } else {
        setApplication(null);
        setTimeline([]);
        setMessages([]);
      }
    } catch (e: any) {
      setLoadError(e.message || "Failed to load your applications.");
    } finally {
      setIsLoading(false);
    }
  };

  const selectApplication = async (appId: number) => {
    setLoadError("");
    try {
      const detail = await apiFetch<any>(`/api/applications/${appId}`);
      setApplication(detail);

      const [tlData, msgData] = await Promise.all([
        apiFetch<any[]>(`/api/applications/${detail.id}/timeline`).catch(() => []),
        apiFetch<any[]>(`/api/applications/${detail.id}/messages`).catch(() => []),
      ]);
      setTimeline(tlData || []);
      setMessages(msgData || []);

      const advertising = detail.advertisingInfo || {};
      const reqs = detail.accountRequirements || {};

      const platRaw = String(advertising.platform || "");
      setApplyPlatform(platRaw.includes("Google") ? "google" : platRaw.includes("TikTok") ? "tiktok" : "meta");
      setApplyBmId(reqs.businessManagerId || "");
      setApplyGmail(reqs.gmail || "");
      setApplyAccountName(reqs.accountName || "");
      setApplyCountry(reqs.country || "United States");
      setApplyCurrency(reqs.currency || "USD");
      setApplyHatType((reqs.hatType as "" | "BLACK" | "GREY" | "WHITE") || "");
    } catch (e: any) {
      setLoadError(e.message || "Failed to load this application.");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!application?.id) return;
    const id = setInterval(() => {
      apiFetch<any[]>(`/api/applications/${application.id}/timeline`)
        .then((data) => setTimeline(data || []))
        .catch(() => {});
      apiFetch<any[]>(`/api/applications/${application.id}/messages`)
        .then((data) => setMessages(data || []))
        .catch(() => {});
    }, 30000);
    return () => clearInterval(id);
  }, [application?.id]);

  const JOURNEY_STEPS = ["Submitted", "Under Review", "Approved", "Topup & Activate"];

  const getJourneyIndex = (status: string) => {
    switch (status) {
      case "SUBMITTED": return 0;
      case "UNDER_REVIEW":
      case "INFORMATION_REQUIRED":
      case "DOCUMENTS_REQUIRED": return 1;
      case "APPROVED": return 2;
      case "ACTIVE": return 3;
      default: return -1;
    }
  };

  const handleStartApplication = async () => {
    setIsLoading(true);
    try {
      const newApp = await apiFetch<any>("/api/applications", { method: "POST" });
      const list = await apiFetch<any[]>("/api/applications");
      setApplications(list);
      await selectApplication(newApp.id);
      setIsLoading(false);
    } catch (e: any) {
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Failed to Start Application",
        description: e.message || "Could not initialize your onboarding application.",
      });
    }
  };

  const platName =
    applyPlatform === "meta"
      ? "Meta Ads (Facebook/IG)"
      : applyPlatform === "google"
      ? "Google Ads (YouTube/PMax)"
      : applyPlatform === "tiktok"
      ? "TikTok Ads"
      : "Other Ads Platform";

  const renderAccountBar = () => {
    return (
      <div className="mb-6 bg-[#060608] border border-zinc-800/80 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
            My Ad Accounts ({applications.length})
          </span>
          <button
            onClick={handleStartApplication}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-violet-500/30 bg-violet-500/10 text-[9px] font-black uppercase tracking-widest text-violet-300 hover:bg-violet-500/20 transition-all cursor-pointer hover:scale-105"
          >
            + New Account
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {applications.map((app) => (
            <button
              key={app.id}
              onClick={() => selectApplication(app.id)}
              className={`px-3.5 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                app.id === application?.id
                  ? "border-violet-500 bg-gradient-to-r from-violet-600/20 to-cyan-600/20 text-white shadow-lg shadow-violet-500/10"
                  : "border-zinc-800 bg-black/60 text-zinc-400 hover:border-zinc-700 hover:text-white"
              }`}
            >
              #{String(app.publicId || app.id).slice(-6)} · {app.status.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const validateApplyForm = (): string | null => {
    if (applyPlatform === "meta" && !applyBmId.trim()) return "Please enter your Meta Business Manager ID.";
    if (applyPlatform === "google" && !applyGmail.trim()) return "Please enter the Gmail for your Google Ads account.";
    if (!applyHatType) return "Please choose a hat type (Black, Grey or White).";
    return null;
  };

  const handleSaveDraft = async () => {
    if (!application) return;
    try {
      await apiFetch(`/api/applications/${application.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          personalInfo: { fullName: user?.username || "", email: user?.email || "" },
          businessInfo: {},
          advertisingInfo: { platform: platName },
          accountRequirements: {
            hatType: applyHatType || undefined,
            businessManagerId: applyPlatform === "meta" ? applyBmId.trim() || undefined : undefined,
            gmail: applyPlatform === "google" ? applyGmail.trim() || undefined : undefined,
            accountName: applyAccountName.trim() || undefined,
            country: applyCountry,
            currency: applyCurrency,
          },
        }),
      });
      toast({
        title: "Draft Saved",
        description: "Your application details were saved successfully.",
      });
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "Autosave Failed",
        description: e.message || "Could not save draft changes.",
      });
    }
  };

  const handleSubmitApplication = async () => {
    if (!application) return;
    const invalid = validateApplyForm();
    if (invalid) {
      toast({ variant: "destructive", title: "Missing Details", description: invalid });
      return;
    }

    const requiredFee = applyAppCount * 10;
    if (walletBalance < requiredFee) {
      toast({
        variant: "destructive",
        title: "Insufficient Balance",
        description: `You have selected ${applyAppCount} application${applyAppCount > 1 ? "s" : ""} which requires $${requiredFee}. Your current balance is $${walletBalance.toFixed(2)}.`,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await handleSaveDraft();
      await apiFetch(`/api/applications/${application.id}/submit`, { method: "POST" });

      if (applyAppCount > 1) {
        for (let i = 2; i <= applyAppCount; i++) {
          const extraApp = await apiFetch<any>("/api/applications", { method: "POST" });
          await apiFetch(`/api/applications/${extraApp.id}`, {
            method: "PATCH",
            body: JSON.stringify({
              personalInfo: { fullName: user?.username || "", email: user?.email || "" },
              businessInfo: {},
              advertisingInfo: { platform: platName },
              accountRequirements: {
                hatType: applyHatType || undefined,
                businessManagerId: applyPlatform === "meta" ? applyBmId.trim() || undefined : undefined,
                gmail: applyPlatform === "google" ? applyGmail.trim() || undefined : undefined,
                accountName: applyAccountName ? `${applyAccountName.trim()} #${i}` : undefined,
                country: applyCountry,
                currency: applyCurrency,
              },
            }),
          });
          await apiFetch(`/api/applications/${extraApp.id}/submit`, { method: "POST" });
        }
      }

      toast({
        title: "Applications Submitted",
        description: `Successfully submitted ${applyAppCount} account application${applyAppCount > 1 ? "s" : ""} — unlimited free replacements included on every account!`,
      });
      await loadData();
    } catch (e: any) {
      toast({ variant: "destructive", title: "Submission Failed", description: e.message || "Could not submit application." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || !application) return;

    setIsSendingMsg(true);
    try {
      await apiFetch(`/api/applications/${application.id}/messages`, {
        method: "POST",
        body: JSON.stringify({ message: chatMessage }),
      });
      setChatMessage("");
      await loadData();
    } catch (e: any) {
      toast({ variant: "destructive", title: "Message Not Sent", description: e.message || "Could not send your message." });
    } finally {
      setIsSendingMsg(false);
    }
  };

  if (isLoading) {
    return (
      <ClientLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
        </div>
      </ClientLayout>
    );
  }

  // 1. Initial State: No Application
  if (!application) {
    return (
      <ClientLayout>
        <div className="max-w-2xl mx-auto text-center py-20 relative z-10">
          <div className="absolute inset-0 bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />
          <div className="w-16 h-16 bg-[#060608] border border-violet-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6 text-cyan-400 shadow-xl shadow-violet-500/10">
            <FileText className="w-8 h-8" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span className="text-[9px] font-black tracking-widest uppercase bg-gradient-to-r from-violet-300 to-cyan-300 bg-clip-text text-transparent">
              Onboarding Queue
            </span>
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-4">
            Unlock Unlimited <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">Ad Accounts</span>
          </h2>
          <p className="text-sm text-zinc-300 mb-8 max-w-md mx-auto leading-relaxed">
            High-trust agency ad accounts on Meta, Google & TikTok — provisioned in minutes with unlimited free replacements.
            One wallet, unlimited accounts. Scale across every network with priority pipelines.
          </p>

          {loadError && (
            <div className="max-w-md mx-auto mb-6 text-left">
              <div className="text-xs text-rose-300 bg-rose-500/10 border border-rose-500/30 rounded-xl p-3">
                {loadError}
              </div>
              <button
                onClick={loadData}
                className="mt-2 text-[10px] font-black uppercase tracking-wider text-cyan-400 hover:underline cursor-pointer"
              >
                Retry
              </button>
            </div>
          )}

          <button
            onClick={handleStartApplication}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white text-xs font-black uppercase tracking-widest hover:opacity-95 hover:scale-105 transition-all shadow-lg shadow-violet-600/30 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <><Loader2 className="w-4 h-4 animate-spin text-white" /> Initializing...</>
            ) : (
              <>Start Compliance Onboarding <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </div>

        <BmGuideModal
          isOpen={showBmGuide}
          onClose={() => setShowBmGuide(false)}
        />
      </ClientLayout>
    );
  }

  // 2. State: In Draft or Needs Revisions
  const isDraftMode =
    application.status === "DRAFT" ||
    application.status === "INFORMATION_REQUIRED" ||
    application.status === "DOCUMENTS_REQUIRED";

  if (isDraftMode) {
    return (
      <ClientLayout>
        <div className="max-w-3xl mx-auto relative z-10 pb-20">
          {/* Stepper Header */}
          <div className="mb-8 pb-6 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tight text-white">
                Ad Account <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">Application</span>
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-1.5">
                <p className="text-xs text-zinc-400">
                  Application ID: <span className="font-mono font-bold text-cyan-300">{application.publicId}</span> ({application.status})
                </p>

                <div className="inline-flex items-center gap-1.5 bg-[#060608] border border-zinc-800 rounded-lg px-2.5 py-1 text-xs">
                  <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Accounts:</span>
                  <div className="flex items-center gap-0.5 bg-black rounded-md border border-zinc-800 p-0.5">
                    {[1, 2, 3, 4, 5].map((num) => {
                      const isSelected = applyAppCount === num;
                      const isAffordable = walletBalance >= num * 10;
                      return (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setApplyAppCount(num)}
                          className={`w-5 h-5 rounded text-[10px] font-black transition-all cursor-pointer flex items-center justify-center ${
                            isSelected
                              ? "bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-xs"
                              : isAffordable
                              ? "text-zinc-300 hover:bg-zinc-800"
                              : "text-zinc-600 hover:bg-black"
                          }`}
                          title={
                            isAffordable
                              ? `${num} Account${num > 1 ? "s" : ""} ($${num * 10} from wallet)`
                              : `Requires $${num * 10} wallet balance (Current: $${walletBalance.toFixed(2)})`
                          }
                        >
                          {num}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={handleSaveDraft}
              className="px-4 py-2 border border-zinc-800 hover:border-zinc-700 bg-[#060608] hover:bg-zinc-900 rounded-xl text-[10px] font-black uppercase tracking-wider text-zinc-300 transition-all cursor-pointer self-start sm:self-auto hover:text-white"
            >
              Save Progress
            </button>
          </div>

          {renderAccountBar()}

          {/* Pricing & Benefits */}
          <div className="rounded-3xl border border-zinc-800 bg-[#060608] shadow-2xl p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-black uppercase tracking-wider text-white">
                Before You Apply — <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">What's Included</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Benefits */}
              <div className="rounded-2xl border border-zinc-800/80 bg-black/60 p-4">
                <div className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-2.5">Benefits</div>
                <ul className="space-y-2">
                  {[
                    "Unlimited free replacements — lifetime, every account",
                    "Business Manager access assigned on your topup",
                    "Live status tracking from submit to activation",
                    "100% refund if BM isn't assigned within 48 hrs",
                    "Dedicated Telegram support 24/7",
                  ].map((b) => (
                    <li key={b} className="text-[10px] text-zinc-300 flex items-start gap-1.5">
                      <CheckCircle className="w-3 h-3 mt-0.5 text-emerald-400 shrink-0" /> {b}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Minimum deposits */}
              <div className="rounded-2xl border border-zinc-800/80 bg-black/60 p-4">
                <div className="text-[10px] font-black uppercase tracking-widest text-cyan-400 mb-2.5">Minimum Deposits</div>
                <ul className="space-y-2">
                  <li className="text-[10px] text-zinc-300 flex items-start gap-1.5">
                    <CircleDollarSign className="w-3 h-3 mt-0.5 text-cyan-400 shrink-0" />
                    <span><strong className="text-white">$10</strong> first topup — full credit, 0% fee</span>
                  </li>
                  <li className="text-[10px] text-zinc-300 flex items-start gap-1.5">
                    <CircleDollarSign className="w-3 h-3 mt-0.5 text-cyan-400 shrink-0" />
                    <span><strong className="text-white">$50</strong> every topup after that — 0% fee</span>
                  </li>
                  <li className="text-[10px] text-zinc-300 flex items-start gap-1.5">
                    <CircleDollarSign className="w-3 h-3 mt-0.5 text-cyan-400 shrink-0" />
                    <span><strong className="text-white">$50</strong> ad-account topup — unlocks BM access</span>
                  </li>
                  <li className="text-[10px] text-zinc-300 flex items-start gap-1.5">
                    <CircleDollarSign className="w-3 h-3 mt-0.5 text-cyan-400 shrink-0" />
                    <span><strong className="text-white">$10</strong> application fee per ad account</span>
                  </li>
                </ul>
              </div>

              {/* Fee tiers */}
              <div className="rounded-2xl border border-zinc-800/80 bg-black/60 p-4">
                <div className="text-[10px] font-black uppercase tracking-widest text-violet-400 mb-2.5">Ad-Account Topup Fees</div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-[#0c0c10] px-3 py-2">
                    <span className="text-[10px] font-bold text-zinc-300">Below $100</span>
                    <span className="text-[10px] font-black text-cyan-300">3%</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-[#0c0c10] px-3 py-2">
                    <span className="text-[10px] font-bold text-zinc-300">$100 – $1,000</span>
                    <span className="text-[10px] font-black text-cyan-300">2%</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-[#0c0c10] px-3 py-2">
                    <span className="text-[10px] font-bold text-zinc-300">Above $1,000</span>
                    <span className="text-[10px] font-black text-emerald-400">1.5%</span>
                  </div>
                </div>
                <div className="mt-2.5 text-[9px] text-zinc-400 font-semibold flex items-start gap-1">
                  <BadgeCheck className="w-3 h-3 mt-0.5 text-violet-400 shrink-0" />
                  Wallet deposits are always commission-free — credited in full.
                </div>
              </div>
            </div>
          </div>

          {/* Simple apply form */}
          <div className="rounded-3xl border border-zinc-800 bg-[#060608] shadow-2xl p-8 mb-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500 via-cyan-400 to-emerald-400" />

            <div className="space-y-6">
              {/* Form title */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-base font-black uppercase text-white tracking-wider">
                    Ad Account <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">Details</span>
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowBmGuide(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-300 text-[10px] font-black uppercase tracking-wider hover:bg-violet-500/20 transition-all cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-cyan-400" /> Meta BM Guide
                </button>
              </div>

              {/* Interactive Step Guide Bar */}
              <div className="p-4 rounded-2xl bg-black border border-zinc-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-cyan-400" /> Application Checklist & Setup Guide
                  </span>
                  <span className="text-[10px] font-bold text-zinc-400">Fast 2-Min Process</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-[11px]">
                  <div className={`p-2 rounded-xl border flex items-center gap-2 ${applyPlatform ? "bg-violet-500/10 border-violet-500/30 text-violet-200 font-bold" : "bg-[#060608] border-zinc-800 text-zinc-600"}`}>
                    <CheckCircle2 className={`w-3.5 h-3.5 ${applyPlatform ? "text-cyan-400" : "text-zinc-600"}`} />
                    <span>1. Pick Platform</span>
                  </div>
                  <div className={`p-2 rounded-xl border flex items-center gap-2 ${(applyPlatform === "meta" && applyBmId) || (applyPlatform === "google" && applyGmail) || applyPlatform === "tiktok" ? "bg-violet-500/10 border-violet-500/30 text-violet-200 font-bold" : "bg-[#060608] border-zinc-800 text-zinc-600"}`}>
                    <CheckCircle2 className={`w-3.5 h-3.5 ${(applyPlatform === "meta" && applyBmId) || (applyPlatform === "google" && applyGmail) || applyPlatform === "tiktok" ? "text-cyan-400" : "text-zinc-600"}`} />
                    <span>2. Enter {applyPlatform === "meta" ? "BM ID" : applyPlatform === "google" ? "Gmail" : "Handle"}</span>
                  </div>
                  <div className={`p-2 rounded-xl border flex items-center gap-2 ${applyHatType ? "bg-violet-500/10 border-violet-500/30 text-violet-200 font-bold" : "bg-[#060608] border-zinc-800 text-zinc-600"}`}>
                    <CheckCircle2 className={`w-3.5 h-3.5 ${applyHatType ? "text-cyan-400" : "text-zinc-600"}`} />
                    <span>3. Choose Hat Tier</span>
                  </div>
                  <div className={`p-2 rounded-xl border flex items-center gap-2 ${walletBalance >= applyAppCount * 10 ? "bg-violet-500/10 border-violet-500/30 text-violet-200 font-bold" : "bg-[#060608] border-zinc-800 text-zinc-600"}`}>
                    <CheckCircle2 className={`w-3.5 h-3.5 ${walletBalance >= applyAppCount * 10 ? "text-cyan-400" : "text-zinc-600"}`} />
                    <span>4. Submit ($10/app)</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Select Platform *</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "meta", name: "Meta Ads", color: "text-cyan-300 border-cyan-500/40 bg-cyan-500/10" },
                    { id: "google", name: "Google Ads", color: "text-amber-300 border-amber-500/40 bg-amber-500/10" },
                    { id: "tiktok", name: "TikTok Ads", color: "text-pink-300 border-pink-500/40 bg-pink-500/10" },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setApplyPlatform(p.id)}
                      className={`p-3 rounded-xl border text-center transition-all text-[10px] font-black cursor-pointer ${
                        applyPlatform === p.id ? `${p.color} border-current shadow-md` : "border-zinc-800 bg-black hover:border-zinc-700 text-zinc-400"
                      }`}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>

              {applyPlatform === "meta" && (
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Meta Business Manager ID (BM ID) *</label>
                    <button
                      type="button"
                      onClick={() => setShowBmGuide(true)}
                      className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-cyan-400 hover:underline cursor-pointer"
                    >
                      <HelpCircle className="w-3 h-3" /> Where to find BM ID? (Guide)
                    </button>
                  </div>
                  <input
                    type="text"
                    value={applyBmId}
                    onChange={(e) => setApplyBmId(e.target.value)}
                    placeholder="e.g. 4920491029302"
                    className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs outline-none focus:border-cyan-500/50 transition-colors placeholder:text-zinc-600"
                  />
                  <span className="text-[9px] text-zinc-500">The BM ID your ad account will be granted under.</span>
                </div>
              )}

              {applyPlatform === "google" && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Gmail for the Ad Account *</label>
                  <input
                    type="email"
                    value={applyGmail}
                    onChange={(e) => setApplyGmail(e.target.value)}
                    placeholder="yourgmail@gmail.com"
                    className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs outline-none focus:border-cyan-500/50 transition-colors placeholder:text-zinc-600"
                  />
                  <span className="text-[9px] text-zinc-500">Your Google Ads account will be created on this Gmail.</span>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Account Name (Optional)</label>
                <input
                  type="text"
                  value={applyAccountName}
                  onChange={(e) => setApplyAccountName(e.target.value)}
                  placeholder="e.g. Scale Account 1"
                  className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs outline-none focus:border-cyan-500/50 transition-colors placeholder:text-zinc-600"
                />
                <span className="text-[9px] text-zinc-500">Give your ad account your own name — it will appear in your dashboard.</span>
              </div>

              {/* Account country + currency */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Account Country *</label>
                  <SearchableSelect
                    value={applyCountry}
                    onChange={setApplyCountry}
                    options={ACCOUNT_COUNTRIES.map((c) => ({ value: c, label: c }))}
                    placeholder="Search country..."
                    buttonClassName="text-xs bg-black border-zinc-800"
                  />
                  <span className="text-[9px] text-zinc-500">The country your ad account will be registered in.</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Account Currency *</label>
                  <SearchableSelect
                    value={applyCurrency}
                    onChange={setApplyCurrency}
                    options={ACCOUNT_CURRENCIES.map((c) => ({ value: c.split(" — ")[0], label: c }))}
                    placeholder="Search currency..."
                    buttonClassName="text-xs bg-black border-zinc-800"
                  />
                  <span className="text-[9px] text-zinc-500">Billing currency for your ad account.</span>
                </div>
              </div>

              {/* Hat type */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Choose Hat Type *</label>
                <div className="grid grid-cols-1 gap-2.5">
                  {(Object.keys(HAT_FEATURES) as Array<"BLACK" | "GREY" | "WHITE">).map((key) => {
                    const hat = HAT_FEATURES[key];
                    const isSelected = applyHatType === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setApplyHatType(key)}
                        className={`text-left rounded-2xl border p-4 transition-all cursor-pointer ${
                          isSelected ? `${hat.styles} ring-1 ring-violet-500 shadow-xl` : "border-zinc-800 bg-black/60 hover:border-zinc-700 text-zinc-300"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`text-xs font-black uppercase tracking-wider ${isSelected ? "" : "text-white"}`}>
                            {hat.emoji} {hat.title}
                          </span>
                          <span
                            className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${hat.badgeStyles}`}
                          >
                            {hat.badge}
                          </span>
                        </div>
                        <span className={`block text-[10px] font-semibold mb-1.5 ${isSelected ? "opacity-95" : "text-zinc-400"}`}>{hat.desc}</span>
                        <ul className={`space-y-1 ${isSelected ? "opacity-95" : "text-zinc-400"}`}>
                          {hat.features.map((f) => (
                            <li key={f} className="text-[10px] flex items-start gap-1.5">
                              <span className="shrink-0 text-cyan-400">•</span> {f}
                            </li>
                          ))}
                        </ul>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-2xl border border-violet-500/30 bg-violet-500/10 p-4 text-xs text-violet-200 flex items-start gap-2.5">
                <Wallet className="w-4 h-4 shrink-0 mt-0.5 text-cyan-400" />
                <p>
                  <strong>Application fee: $10 per ad account</strong> — includes{" "}
                  <strong>UNLIMITED FREE REPLACEMENTS</strong> on every account, forever. Deducted from your
                  main-wallet balance when you submit. Current balance:{" "}
                  <strong className="text-white">${(user?.balance ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>{" "}
                  — deposits are commission-free, credited in full.
                </p>
              </div>

              {user && walletBalance < applyAppCount * 10 && (
                <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs flex items-start gap-2.5 text-rose-300">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                  <p>
                    Your wallet balance is too low to unlock this account. Top up first —{" "}
                    <strong className="text-white">zero commission, full credit</strong> — then submit instantly.
                  </p>
                </div>
              )}

              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs flex items-start gap-2.5 text-amber-200">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                <p>
                  Please check and confirm all submitted details. Once you click Submit, your application will freeze edits until reviewed.
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={handleSaveDraft}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-zinc-800 hover:bg-zinc-900 text-xs font-black uppercase tracking-wider text-zinc-300 transition-colors cursor-pointer disabled:opacity-50"
            >
              Save Draft
            </button>

            <button
              onClick={handleSubmitApplication}
              disabled={isSubmitting || (user ? walletBalance < applyAppCount * 10 : false)}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white text-xs font-black uppercase tracking-wider hover:opacity-95 hover:scale-105 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-lg shadow-violet-600/30 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit & Unlock Account <CheckCircle className="w-4 h-4 text-cyan-300" />
                </>
              )}
            </button>
          </div>
        </div>

        <BmGuideModal
          isOpen={showBmGuide}
          onClose={() => setShowBmGuide(false)}
        />
      </ClientLayout>
    );
  }

  // 3. State: Submitted, Review, Approved (Review cockpit)
  return (
    <ClientLayout>
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Onboarding Header */}
      <div className="mb-10 pb-6 border-b border-zinc-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded border border-zinc-800 bg-[#060608] text-cyan-300">
              {application.publicId}
            </span>
            <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getStatusColor(application.status)}`}>
              {application.status}
            </span>
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white">
            Compliance <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">Cockpit</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">Submitted on {application.submittedAt ? new Date(application.submittedAt).toLocaleString() : "Date pending"}</p>
        </div>

        <a
          href={TELEGRAM_SUPPORT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white text-xs font-black uppercase tracking-widest hover:opacity-95 hover:scale-105 transition-all cursor-pointer shadow-lg shadow-violet-600/30"
        >
          Priority Review Link <ExternalLink className="w-4 h-4 text-cyan-200" />
        </a>
      </div>

      {renderAccountBar()}

      {getJourneyIndex(application.status) >= 0 && (
        <div className="relative z-10 mb-8 rounded-3xl border border-zinc-800 bg-[#060608] shadow-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-black uppercase tracking-widest text-white">
              Application <span className="bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent">Journey</span>
            </h2>
            <span className="text-[9px] text-zinc-400">
              Step {getJourneyIndex(application.status) + 1} of {JOURNEY_STEPS.length}
            </span>
          </div>
          <div className="flex items-center">
            {JOURNEY_STEPS.map((step, i) => {
              const current = getJourneyIndex(application.status);
              const done = i < current;
              const active = i === current;
              return (
                <div key={step} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-1.5 min-w-0">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-colors ${
                      done
                        ? "bg-gradient-to-r from-violet-600 to-cyan-500 border-cyan-400 text-white"
                        : active
                        ? "bg-black border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/20"
                        : "bg-[#060608] border-zinc-800 text-zinc-600"
                    }`}>
                      {done ? <CheckCircle className="w-4 h-4 text-white" /> : <span className="text-[10px] font-black">{i + 1}</span>}
                    </div>
                    <span className={`text-[8px] font-black uppercase tracking-wider text-center ${
                      active ? "text-cyan-300" : done ? "text-zinc-300" : "text-zinc-600"
                    }`}>
                      {step}
                    </span>
                  </div>
                  {i < JOURNEY_STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 mb-4 rounded-full ${i < current ? "bg-gradient-to-r from-violet-500 to-cyan-400" : "bg-zinc-800"}`} />
                  )}
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-[10px] text-zinc-400 font-semibold flex items-start gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 mt-0.5 text-cyan-400 shrink-0" />
            <span>
              {application.status === "ACTIVE"
                ? "Your account is fully active. Happy campaigning!"
                : application.status === "APPROVED"
                ? "Approved! Top up your ad account (min $50) to get Business Manager access assigned."
                : application.status === "INFORMATION_REQUIRED" || application.status === "DOCUMENTS_REQUIRED"
                ? "Our reviewer needs more details — check the note below and reply in the message thread."
                : "Our team is working on your application. Updates appear here automatically."}
            </span>
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        {/* LEFT: Documents & Timeline status */}
        <div className="lg:col-span-8 space-y-6">
          {/* Rejection Alert */}
          {application.rejectionReason && (
            <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-5 text-rose-300 text-xs flex gap-3 items-start">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <div>
                <h4 className="font-black uppercase tracking-wider mb-1 text-white">Reviewer Note: Action Required</h4>
                <p>{application.rejectionReason}</p>
              </div>
            </div>
          )}

          {/* Interactive timeline logs */}
          <div className="rounded-3xl border border-zinc-800 bg-[#060608] shadow-2xl p-6">
            <h2 className="text-base font-black uppercase tracking-tight text-white mb-4">
              Application <span className="bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent">History Log</span>
            </h2>
            {timeline.length > 0 ? (
              <div className="space-y-4">
                {timeline.map((event) => (
                  <div key={event.id} className="flex gap-4 items-start">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 shrink-0 shadow-sm shadow-cyan-400/50" />
                    <div>
                      <div className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                        <span>{event.event}</span>
                        <span className="text-[8px] text-zinc-500 normal-case font-normal">
                          {new Date(event.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-zinc-800 bg-black/60 p-5 text-center">
                <p className="text-xs text-zinc-400 font-semibold">
                  No activity yet.
                </p>
                <p className="text-[10px] text-zinc-500 mt-1">
                  {application.status === "DRAFT"
                    ? "Complete and submit your application to start the review process."
                    : "Updates will appear here automatically as your application progresses."}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Real-time support chat thread */}
        <div className="lg:col-span-4">
          <div className="rounded-3xl border border-zinc-800 bg-[#060608] shadow-2xl overflow-hidden flex flex-col h-[520px]">
            <div className="bg-black border-b border-zinc-800 p-4 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-white">
                  Compliance <span className="bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent">Message Thread</span>
                </h3>
                <span className="text-[9px] text-cyan-400">Response queue active</span>
              </div>
              <MessageSquare className="w-4 h-4 text-zinc-400" />
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.length > 0 ? (
                messages.map((msg) => {
                  const isAdmin = msg.senderId !== user?.id;
                  return (
                    <div key={msg.id} className={`flex flex-col ${isAdmin ? "items-start" : "items-end"}`}>
                      <div className={`rounded-2xl px-4 py-2.5 text-xs max-w-[80%] leading-relaxed ${
                        isAdmin
                          ? "bg-zinc-950 text-zinc-300 border border-zinc-800 rounded-tl-none"
                          : "bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-medium rounded-tr-none shadow-md shadow-violet-500/20"
                      }`}>
                        {msg.message}
                      </div>
                      <span className="text-[8px] text-zinc-500 mt-1 font-mono">
                        {isAdmin ? "Compliance Agent" : "You"} · {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="h-full flex items-center justify-center text-center p-6 text-zinc-500 text-xs">
                  <div>
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 text-zinc-600" />
                    <span>No communication messages on this thread yet. Send a note below.</span>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendChatMessage} className="p-4 border-t border-zinc-800 bg-black flex gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Type reply or comment..."
                className="flex-1 bg-[#060608] border border-zinc-800 rounded-xl px-4 py-2 text-xs text-white placeholder:text-zinc-600 outline-none focus:border-cyan-500/50 transition-colors"
              />
              <button
                type="submit"
                disabled={isSendingMsg || !chatMessage.trim()}
                className="w-10 h-10 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-95 disabled:opacity-30 disabled:pointer-events-none text-white flex items-center justify-center shrink-0 shadow cursor-pointer font-black"
              >
                {isSendingMsg ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </form>
          </div>
        </div>
      </div>

      <BmGuideModal
        isOpen={showBmGuide}
        onClose={() => setShowBmGuide(false)}
      />
    </ClientLayout>
  );
}
