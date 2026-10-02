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
  ArrowLeft,
  Layers,
  Zap,
  Globe,
  Building,
  Check,
  Copy,
  Compass,
  Briefcase,
  ChevronRight
} from "lucide-react";
import { SiMeta, SiGoogleads, SiTiktok } from "react-icons/si";
import { PAYMENT_CONFIG } from "@/config/payment";
import { apiFetch } from "@/lib/api";
import { ACCOUNT_COUNTRIES, ACCOUNT_CURRENCIES } from "@/lib/countries-currencies";
import SearchableSelect from "@/components/ui/SearchableSelect";
import BmGuideModal from "@/components/onboarding/BmGuideModal";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

const TELEGRAM_SUPPORT_URL = PAYMENT_CONFIG.telegramSupportUrl || "https://t.me/RazrMarketing";

const BUSINESS_NICHES = [
  {
    id: "ecommerce",
    name: "E-Commerce & Dropshipping",
    emoji: "🛍️",
    desc: "Shopify stores, DTC brands, physical products",
    recommendedHat: "WHITE" as const,
    note: "Optimal long-term brand scaling & rock-solid ad line stability"
  },
  {
    id: "saas_info",
    name: "SaaS & Info Products",
    emoji: "📱",
    desc: "Software, apps, digital courses, coaching, education",
    recommendedHat: "WHITE" as const,
    note: "Policy-cleared high spend stability for digital brands"
  },
  {
    id: "nutra",
    name: "Nutra & Supplements",
    emoji: "💊",
    desc: "Health, skincare, dietary supplements, wellness",
    recommendedHat: "GREY" as const,
    note: "Warm historical spend accounts with fast replacements"
  },
  {
    id: "gaming_casino",
    name: "Casino, Betting & Gaming",
    emoji: "🎰",
    desc: "iGaming, sports betting, sweepstakes, casino",
    recommendedHat: "BLACK" as const,
    note: "Unlimited replacements with uncapped aggressive spend scaling"
  },
  {
    id: "crypto_forex",
    name: "Crypto, Trading & Forex",
    emoji: "💰",
    desc: "Exchanges, signals, trading tools, financial leads",
    recommendedHat: "BLACK" as const,
    note: "Instant line replenishment & zero daily spend ceiling"
  },
  {
    id: "leadgen",
    name: "Lead Gen & Real Estate",
    emoji: "🏘️",
    desc: "Mortgage, solar, insurance, local services, B2B",
    recommendedHat: "GREY" as const,
    note: "High auction authority with institutional routing"
  },
  {
    id: "other",
    name: "Other / Multi-Vertical",
    emoji: "🌐",
    desc: "General marketing campaigns & custom media buying",
    recommendedHat: "WHITE" as const,
    note: "Flexible Tier-1 agency setup"
  }
];

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

  // 3-Step Wizard Navigation
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3>(1);
  const [selectedNiche, setSelectedNiche] = useState<string>("ecommerce");

  // Apply form state
  const [applyPlatform, setApplyPlatform] = useState("meta");
  const [applyBmId, setApplyBmId] = useState("");
  const [applyGmail, setApplyGmail] = useState("");
  const [applyAccountName, setApplyAccountName] = useState("");
  const [applyWebsiteUrl, setApplyWebsiteUrl] = useState("");
  const [applyCountry, setApplyCountry] = useState("United States");
  const [applyCurrency, setApplyCurrency] = useState("USD");
  const [applyHatType, setApplyHatType] = useState<"BLACK" | "GREY" | "WHITE">("WHITE");
  const [applyAppCount, setApplyAppCount] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBmGuide, setShowBmGuide] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

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
      styles: "border-purple-500/40 bg-[#0c0a14] text-white shadow-xl hover:border-purple-500/60",
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
      styles: "border-amber-500/40 bg-[#120e06] text-amber-200 shadow-xl hover:border-amber-500/60",
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
      styles: "border-emerald-500/40 bg-[#06120e] text-emerald-200 shadow-xl hover:border-emerald-500/60",
      badgeStyles: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
    },
  };

  // Chat message input
  const [chatMessage, setChatMessage] = useState("");
  const [isSendingMsg, setIsSendingMsg] = useState(false);

  // Handle Niche Selection & Auto-Recommend Hat Type
  const handleSelectNiche = (nicheId: string) => {
    setSelectedNiche(nicheId);
    const niche = BUSINESS_NICHES.find((n) => n.id === nicheId);
    if (niche) {
      setApplyHatType(niche.recommendedHat);
      toast({
        title: `${niche.emoji} ${niche.name} Selected`,
        description: `Auto-selected ${niche.recommendedHat} Hat for ${niche.note.toLowerCase()}.`,
      });
    }
  };

  // Load active application and details
  const loadData = async () => {
    setLoadError("");
    try {
      const list = await apiFetch<any[]>("/api/applications");
      setApplications(list || []);
      if (Array.isArray(list) && list.length > 0) {
        const chosen =
          list.find((a) => ["DRAFT", "INFORMATION_REQUIRED", "DOCUMENTS_REQUIRED"].includes(a.status)) || list[0];
        await selectApplication(chosen.id);
      } else {
        setApplication(null);
        setTimeline([]);
        setMessages([]);
      }
    } catch (e: any) {
      // If no token or network error, avoid crashing UI
      if (e?.status !== 401) {
        setLoadError(e.message || "Failed to load your applications.");
      }
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
      if (reqs.hatType && (reqs.hatType === "BLACK" || reqs.hatType === "GREY" || reqs.hatType === "WHITE")) {
        setApplyHatType(reqs.hatType);
      }
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
    setLoadError("");
    try {
      const newApp = await apiFetch<any>("/api/applications", { method: "POST" });
      const list = await apiFetch<any[]>("/api/applications");
      setApplications(list || []);
      await selectApplication(newApp.id);
      setWizardStep(1);
      setIsLoading(false);
    } catch (e: any) {
      // Create local draft fallback so user is never blocked
      const localDraft = {
        id: Date.now(),
        userId: user?.id || 1,
        status: "DRAFT",
        advertisingInfo: { platform: "Meta Ads (Facebook/IG)" },
        accountRequirements: {
          businessManagerId: "",
          gmail: "",
          accountName: "",
          country: "United States",
          currency: "USD",
          hatType: "WHITE",
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setApplication(localDraft);
      setApplications((prev) => [localDraft, ...prev.filter((a) => a.id !== localDraft.id)]);
      setWizardStep(1);
      setIsLoading(false);
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
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-violet-500/30 bg-violet-500/10 text-[9px] font-black uppercase tracking-widest text-cyan-300 hover:bg-violet-500/20 transition-all cursor-pointer hover:scale-105"
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
    if (!applyHatType) return "Please choose a hat tier (Black, Grey or White).";
    return null;
  };

  const handleSaveDraft = async () => {
    if (!application) return;
    try {
      await apiFetch(`/api/applications/${application.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          personalInfo: { fullName: user?.username || "", email: user?.email || "" },
          businessInfo: { websiteUrl: applyWebsiteUrl.trim() || undefined },
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
              businessInfo: { websiteUrl: applyWebsiteUrl.trim() || undefined },
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
    const isBmIdValid = applyPlatform === "meta" && /^\d{14,18}$/.test(applyBmId.trim());

    return (
      <ClientLayout>
        <div className="max-w-4xl mx-auto relative z-10 pb-20">
          {/* Stepper Header */}
          <div className="mb-8 pb-6 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/60 border border-violet-500/30 text-cyan-300 text-xs font-black uppercase tracking-widest mb-2">
                <Compass className="w-3.5 h-3.5 text-cyan-400" /> Interactive Setup Wizard
              </div>
              <h1 className="text-3xl font-black uppercase tracking-tight text-white">
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
              Save Draft
            </button>
          </div>

          {renderAccountBar()}

          {/* 3-Step Guided Navigation Header */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { step: 1, label: "Platform & Niche", sub: "Auto-Recommender" },
              { step: 2, label: "Account Specs & BM ID", sub: "Setup & Direct Link" },
              { step: 3, label: "Review & Launch", sub: "Virtual Agency Card" },
            ].map(({ step, label, sub }) => {
              const isActive = wizardStep === step;
              const isPast = wizardStep > step;
              return (
                <button
                  key={step}
                  type="button"
                  onClick={() => setWizardStep(step as 1 | 2 | 3)}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                    isActive
                      ? "bg-violet-950/40 border-cyan-400 text-white shadow-lg shadow-violet-500/10 ring-1 ring-cyan-500/50"
                      : isPast
                      ? "bg-black/60 border-zinc-800 hover:border-zinc-700 text-zinc-300"
                      : "bg-[#060608] border-zinc-800/80 text-zinc-500"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                      isPast
                        ? "bg-emerald-500 text-black"
                        : isActive
                        ? "bg-gradient-to-r from-violet-600 to-cyan-500 text-white"
                        : "bg-zinc-800 text-zinc-400"
                    }`}>
                      {isPast ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : step}
                    </span>
                    <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-400">Step 0{step}</span>
                  </div>
                  <div className="text-xs font-black uppercase tracking-wider text-white">{label}</div>
                  <div className="text-[10px] text-cyan-300 font-medium">{sub}</div>
                </button>
              );
            })}
          </div>

          {/* STEP 1: Platform & Niche Auto-Recommender */}
          {wizardStep === 1 && (
            <SpotlightCard tone="violet-cyan" className="p-6 md:p-8 rounded-3xl backdrop-blur-xl shadow-2xl space-y-8">
              {/* Platform Selector */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" /> 1. Select Advertising Network *
                  </label>
                  <span className="text-[10px] text-zinc-400 font-medium">Whitelisted Agency Direct Lines</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: "meta", name: "Meta Ads", icon: SiMeta, sub: "Facebook & Instagram Agency Pool", color: "text-[#1877F2]" },
                    { id: "google", name: "Google Ads", icon: SiGoogleads, sub: "Search, YouTube & PMax MCC", color: "text-amber-400" },
                    { id: "tiktok", name: "TikTok Ads", icon: SiTiktok, sub: "TikTok Global Agency Pool", color: "text-white" },
                  ].map((p) => {
                    const isSelected = applyPlatform === p.id;
                    const Icon = p.icon;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setApplyPlatform(p.id)}
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                          isSelected
                            ? "border-cyan-400 bg-gradient-to-b from-violet-950/60 to-black text-white ring-1 ring-cyan-500/50 shadow-xl"
                            : "border-zinc-800 bg-black/60 hover:border-zinc-700 text-zinc-300"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Icon className={`w-6 h-6 ${p.color}`} />
                          {isSelected && <BadgeCheck className="w-5 h-5 text-cyan-400" />}
                        </div>
                        <div className="text-sm font-black uppercase text-white tracking-wide">{p.name}</div>
                        <div className="text-[10px] text-zinc-400 mt-0.5">{p.sub}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Niche Auto-Recommender */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-cyan-400" /> 2. What is Your Business Niche? (Auto-Recommender)
                  </label>
                  <span className="text-[10px] text-cyan-300 font-bold">Auto-picks optimal hat tier</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {BUSINESS_NICHES.map((niche) => {
                    const isSelected = selectedNiche === niche.id;
                    return (
                      <button
                        key={niche.id}
                        type="button"
                        onClick={() => handleSelectNiche(niche.id)}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? "border-violet-500 bg-violet-950/50 text-white ring-1 ring-violet-500/50 shadow-lg"
                            : "border-zinc-800 bg-black/60 hover:border-zinc-700 text-zinc-300"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-base">{niche.emoji}</span>
                          <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                            niche.recommendedHat === "BLACK"
                              ? "bg-purple-500/10 border-purple-500/40 text-purple-300"
                              : niche.recommendedHat === "GREY"
                              ? "bg-amber-500/10 border-amber-500/40 text-amber-300"
                              : "bg-emerald-500/10 border-emerald-500/40 text-emerald-300"
                          }`}>
                            {niche.recommendedHat} Hat
                          </span>
                        </div>
                        <div className="text-xs font-bold text-white">{niche.name}</div>
                        <div className="text-[10px] text-zinc-400 leading-tight mt-0.5">{niche.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Hat Type Selector */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-cyan-400" /> 3. Confirmed Hat Tier
                  </label>
                  <span className="text-[10px] text-zinc-400">All tiers include 100% free replacements</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(Object.keys(HAT_FEATURES) as Array<"BLACK" | "GREY" | "WHITE">).map((key) => {
                    const hat = HAT_FEATURES[key];
                    const isSelected = applyHatType === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setApplyHatType(key)}
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative ${
                          isSelected
                            ? `${hat.styles} ring-2 ring-cyan-400 shadow-xl`
                            : "border-zinc-800 bg-black/60 hover:border-zinc-700 text-zinc-400"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`text-xs font-black uppercase tracking-wider ${isSelected ? "text-white" : "text-zinc-300"}`}>
                            {hat.emoji} {hat.title}
                          </span>
                          {isSelected && <BadgeCheck className="w-4 h-4 text-cyan-400" />}
                        </div>
                        <p className="text-[10px] text-zinc-400 leading-snug mb-2">{hat.desc}</p>
                        <span className={`inline-block text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${hat.badgeStyles}`}>
                          {hat.badge}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="px-5 py-3 rounded-xl border border-zinc-800 hover:bg-zinc-900 text-xs font-black uppercase tracking-wider text-zinc-300 cursor-pointer"
                >
                  Save Draft
                </button>
                <button
                  type="button"
                  onClick={() => setWizardStep(2)}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-95 hover:scale-105 text-white text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-violet-600/30 cursor-pointer"
                >
                  Continue to Step 2: Specs <ArrowRight className="w-4 h-4 text-cyan-300" />
                </button>
              </div>
            </SpotlightCard>
          )}

          {/* STEP 2: Account Specs & BM ID Helper */}
          {wizardStep === 2 && (
            <SpotlightCard tone="cyber" className="p-6 md:p-8 rounded-3xl backdrop-blur-xl shadow-2xl space-y-8">
              {/* Meta Business Manager ID Helper & Input */}
              {applyPlatform === "meta" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                      <SiMeta className="w-4 h-4 text-[#1877F2]" /> Meta Business Manager ID (BM ID) *
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowBmGuide(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-violet-500/10 border border-violet-500/30 text-cyan-300 text-[10px] font-black uppercase tracking-wider hover:bg-violet-500/20 transition-all cursor-pointer"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-cyan-400" /> Where to Find BM ID? (Visual Guide)
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      value={applyBmId}
                      onChange={(e) => setApplyBmId(e.target.value)}
                      placeholder="e.g. 4920491029302 (15–16 digits)"
                      className={`w-full bg-black border rounded-2xl px-4 py-3.5 text-white text-xs outline-none transition-colors placeholder:text-zinc-600 ${
                        isBmIdValid ? "border-emerald-500/60 focus:border-emerald-400" : "border-zinc-800 focus:border-cyan-500/50"
                      }`}
                    />
                    {isBmIdValid && (
                      <div className="absolute right-3.5 top-3.5 text-emerald-400 flex items-center gap-1 text-[10px] font-black">
                        <CheckCircle2 className="w-4 h-4" /> Valid BM ID Format
                      </div>
                    )}
                  </div>

                  {/* Inline 2-Step Quick Helper */}
                  <div className="p-4 rounded-2xl bg-black/80 border border-zinc-800 text-xs space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-zinc-300 flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 text-cyan-400" /> Quick 2-Step BM ID Retrieval:
                      </span>
                      <a
                        href="https://business.facebook.com/settings/info"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-cyan-400 hover:underline"
                      >
                        Open Facebook BM Info ↗
                      </a>
                    </div>
                    <ol className="list-decimal list-inside space-y-1 text-zinc-400 text-[11px] leading-relaxed">
                      <li>Go to <strong className="text-zinc-200">business.facebook.com/settings/info</strong> (Business Info).</li>
                      <li>Under <strong className="text-zinc-200">Business Account Info</strong>, copy your 15–16 digit <strong className="text-cyan-300">Business Account ID</strong>.</li>
                    </ol>
                  </div>
                </div>
              )}

              {/* Google Ads Email */}
              {applyPlatform === "google" && (
                <div className="space-y-2">
                  <label className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <SiGoogleads className="w-4 h-4 text-yellow-400" /> Gmail for Google Ads Line *
                  </label>
                  <input
                    type="email"
                    value={applyGmail}
                    onChange={(e) => setApplyGmail(e.target.value)}
                    placeholder="yourgmail@gmail.com"
                    className="w-full bg-black border border-zinc-800 rounded-2xl px-4 py-3.5 text-white text-xs outline-none focus:border-cyan-500/50 transition-colors placeholder:text-zinc-600"
                  />
                  <p className="text-[10px] text-zinc-400">
                    Your Google Premier MCC invitation will be sent to this Gmail address for 1-click admin access.
                  </p>
                </div>
              )}

              {/* TikTok Email/Handle */}
              {applyPlatform === "tiktok" && (
                <div className="space-y-2">
                  <label className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <SiTiktok className="w-4 h-4 text-white" /> TikTok Business Center Email / Handle *
                  </label>
                  <input
                    type="text"
                    value={applyGmail}
                    onChange={(e) => setApplyGmail(e.target.value)}
                    placeholder="tiktok-bc-email@domain.com"
                    className="w-full bg-black border border-zinc-800 rounded-2xl px-4 py-3.5 text-white text-xs outline-none focus:border-cyan-500/50 transition-colors placeholder:text-zinc-600"
                  />
                  <p className="text-[10px] text-zinc-400">
                    Your TikTok agency partner share will be routed to your TikTok Business Center.
                  </p>
                </div>
              )}

              {/* Account Display Name & Website */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-white uppercase tracking-wider">Account Label / Brand Name (Optional)</label>
                  <input
                    type="text"
                    value={applyAccountName}
                    onChange={(e) => setApplyAccountName(e.target.value)}
                    placeholder="e.g. Apex Scaling #01"
                    className="w-full bg-black border border-zinc-800 rounded-2xl px-4 py-3 text-white text-xs outline-none focus:border-cyan-500/50 transition-colors placeholder:text-zinc-600"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-white uppercase tracking-wider">Landing Page / Store URL (Optional)</label>
                  <input
                    type="url"
                    value={applyWebsiteUrl}
                    onChange={(e) => setApplyWebsiteUrl(e.target.value)}
                    placeholder="https://yourstore.com"
                    className="w-full bg-black border border-zinc-800 rounded-2xl px-4 py-3 text-white text-xs outline-none focus:border-cyan-500/50 transition-colors placeholder:text-zinc-600"
                  />
                </div>
              </div>

              {/* Country & Currency Dropdowns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-white uppercase tracking-wider">Account Country Jurisdiction *</label>
                  <SearchableSelect
                    value={applyCountry}
                    onChange={setApplyCountry}
                    options={ACCOUNT_COUNTRIES.map((c) => ({ value: c, label: c }))}
                    placeholder="Search country..."
                    buttonClassName="text-xs bg-black border-zinc-800 py-3 rounded-2xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-white uppercase tracking-wider">Billing Currency *</label>
                  <SearchableSelect
                    value={applyCurrency}
                    onChange={setApplyCurrency}
                    options={ACCOUNT_CURRENCIES.map((c) => ({ value: c.split(" — ")[0], label: c }))}
                    placeholder="Search currency..."
                    buttonClassName="text-xs bg-black border-zinc-800 py-3 rounded-2xl"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setWizardStep(1)}
                  className="inline-flex items-center gap-1.5 px-5 py-3 rounded-xl border border-zinc-800 hover:bg-zinc-900 text-xs font-black uppercase tracking-wider text-zinc-300 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Step 1
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const invalid = validateApplyForm();
                    if (invalid) {
                      toast({ variant: "destructive", title: "Missing Required Details", description: invalid });
                      return;
                    }
                    setWizardStep(3);
                  }}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-95 hover:scale-105 text-white text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-violet-600/30 cursor-pointer"
                >
                  Review & Preview Line <ArrowRight className="w-4 h-4 text-cyan-300" />
                </button>
              </div>
            </SpotlightCard>
          )}

          {/* STEP 3: Review & 1-Click Launch (Live Virtual Agency Card) */}
          {wizardStep === 3 && (
            <SpotlightCard tone="emerald" className="p-6 md:p-8 rounded-3xl backdrop-blur-xl shadow-2xl space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight text-white">
                    Step 3: Review & <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">Instant Launch</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">Confirm your parameters before sending to the provisioning queue.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setWizardStep(2)}
                  className="text-xs font-bold text-cyan-400 hover:underline cursor-pointer"
                >
                  Edit Specs
                </button>
              </div>

              {/* LIVE VIRTUAL AGENCY AD ACCOUNT CARD PREVIEW */}
              <div className="relative rounded-3xl border border-violet-500/40 bg-gradient-to-br from-[#0c0a1a] via-black to-[#06120e] p-6 shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-cyan-400 to-emerald-400" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-cyan-400 shrink-0 shadow-lg">
                      {applyPlatform === "meta" ? <SiMeta className="w-7 h-7 text-[#1877F2]" /> : applyPlatform === "google" ? <SiGoogleads className="w-7 h-7 text-yellow-400" /> : <SiTiktok className="w-7 h-7 text-white" />}
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-[9px] font-black uppercase tracking-widest mb-1">
                        <Sparkles className="w-3 h-3 text-cyan-400" /> Ready to Provision
                      </div>
                      <h4 className="text-xl font-black uppercase tracking-tight text-white">
                        {applyAccountName || `${platName} Line #01`}
                      </h4>
                      <p className="text-xs text-zinc-400 font-mono">
                        {applyPlatform === "meta" ? `BM ID: ${applyBmId || "Not set"}` : `Gmail: ${applyGmail || "Not set"}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 shrink-0">
                    <span className="px-3 py-1.5 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-black uppercase tracking-wider">
                      {applyHatType} Hat Tier
                    </span>
                  </div>
                </div>
              </div>



              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setWizardStep(2)}
                  className="inline-flex items-center gap-1.5 px-5 py-3 rounded-xl border border-zinc-800 hover:bg-zinc-900 text-xs font-black uppercase tracking-wider text-zinc-300 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" /> Edit Details
                </button>

                <button
                  onClick={handleSubmitApplication}
                  disabled={isSubmitting || (user ? walletBalance < applyAppCount * 10 : false)}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white text-xs font-black uppercase tracking-widest hover:opacity-95 hover:scale-105 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-xl shadow-violet-600/30 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      Submitting to Queue...
                    </>
                  ) : (
                    <>
                      Submit & Launch {applyAppCount} Line{applyAppCount > 1 ? "s" : ""} <CheckCircle className="w-4 h-4 text-cyan-300" />
                    </>
                  )}
                </button>
              </div>
            </SpotlightCard>
          )}
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
          Priority Line Status <ExternalLink className="w-4 h-4 text-cyan-200" />
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
