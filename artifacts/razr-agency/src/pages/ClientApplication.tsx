import { useState, useEffect } from "react";
import ClientLayout from "@/components/layout/ClientLayout";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {
  FileText,
  Sparkles,
  CheckCircle,
  ExternalLink,
  MessageSquare,
  AlertCircle,
  Send,
  Loader2,
  Wallet
} from "lucide-react";
import { PAYMENT_CONFIG } from "@/config/payment";
import { apiFetch } from "@/lib/api";

const TELEGRAM_SUPPORT_URL = PAYMENT_CONFIG.telegramSupportUrl;

export default function ClientApplication() {
  const { user } = useAuth();
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "text-amber-600 bg-amber-50 border-amber-200";
      case "SUBMITTED":
        return "text-slate-600 bg-slate-100 border-slate-200";
      case "UNDER_REVIEW":
        return "text-amber-600 bg-amber-50 border-amber-200";
      case "APPROVED":
        return "text-emerald-600 bg-emerald-50 border-emerald-200";
      case "INFORMATION_REQUIRED":
      case "DOCUMENTS_REQUIRED":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-slate-400 bg-slate-50 border-slate-200";
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
  const [applyHatType, setApplyHatType] = useState<"" | "BLACK" | "GREY" | "WHITE">("");

  const HAT_FEATURES: Record<"BLACK" | "GREY" | "WHITE", { title: string; emoji: string; desc: string; badge: string; features: string[]; styles: string }> = {
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
      styles: "border-slate-900 bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-[0_10px_40px_-10px_rgba(2,6,23,0.55)]",
    },
    GREY: {
      title: "Grey Hat",
      emoji: "🌫️",
      desc: "The power tier — stable, flexible and built to print.",
      badge: "FREE REPLACEMENTS",
      features: [
        "Semi-verified accounts with instant spend approval",
        "Unlimited free replacements on every single account",
        "Smooth, steady scaling with zero friction",
        "Warm accounts with prior spending history",
        "Round-the-clock Telegram priority support",
      ],
      styles: "border-amber-400 bg-gradient-to-br from-amber-100 to-amber-50 text-amber-900 shadow-[0_10px_40px_-10px_rgba(245,158,11,0.4)]",
    },
    WHITE: {
      title: "White Hat",
      emoji: "⚪",
      desc: "The premium tier — fully verified, built to last forever.",
      badge: "UNLIMITED REPLACEMENTS",
      features: [
        "100% verified, policy-perfect accounts",
        "Unlimited free replacements — your campaigns never stop",
        "Maximum stability for long-term brand dominance",
        "Bank-grade account history & full spend limits",
        "Priority VIP support channel on Telegram",
      ],
      styles: "border-emerald-400 bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-900 shadow-[0_10px_40px_-10px_rgba(5,150,105,0.4)]",
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
        // Prefer an editable application, otherwise fall back to the first one
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

      // Timeline and messages are separate endpoints
      const [tlData, msgData] = await Promise.all([
        apiFetch<any[]>(`/api/applications/${detail.id}/timeline`).catch(() => []),
        apiFetch<any[]>(`/api/applications/${detail.id}/messages`).catch(() => []),
      ]);
      setTimeline(tlData || []);
      setMessages(msgData || []);

      // Prepopulate draft fields
      const advertising = detail.advertisingInfo || {};
      const reqs = detail.accountRequirements || {};

      const platRaw = String(advertising.platform || "");
      setApplyPlatform(platRaw.includes("Google") ? "google" : platRaw.includes("TikTok") ? "tiktok" : "meta");
      setApplyBmId(reqs.businessManagerId || "");
      setApplyGmail(reqs.gmail || "");
      setApplyHatType((reqs.hatType as "" | "BLACK" | "GREY" | "WHITE") || "");
    } catch (e: any) {
      setLoadError(e.message || "Failed to load this application.");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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

  // Account switcher bar — clients can hold multiple ad accounts from one main wallet
  const renderAccountBar = () => {
    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
            My Ad Accounts ({applications.length})
          </span>
          <button
            onClick={handleStartApplication}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/30 bg-primary/5 text-[9px] font-black uppercase tracking-widest text-primary hover:bg-primary/10 transition-colors cursor-pointer"
          >
            + New Account
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {applications.map((app) => (
            <button
              key={app.id}
              onClick={() => selectApplication(app.id)}
              className={`px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-wider transition-colors cursor-pointer ${
                app.id === application?.id
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"
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
    try {
      // First save draft
      await handleSaveDraft();
      // Then submit (backend charges the $10 application fee)
      await apiFetch(`/api/applications/${application.id}/submit`, { method: "POST" });

      toast({
        title: "Application Submitted",
        description: "Your account request is in review — unlimited free replacements included on every account.",
      });
      await loadData();
    } catch (e: any) {
      toast({ variant: "destructive", title: "Submission Failed", description: e.message || "Could not submit application." });
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
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </ClientLayout>
    );
  }

  // 1. Initial State: No Application
  if (!application) {
    return (
      <ClientLayout>
        <div className="max-w-2xl mx-auto text-center py-20 relative z-10">
          <div className="absolute inset-0 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary shadow-xl shadow-slate-200/60">
            <FileText className="w-8 h-8" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-[9px] font-black tracking-widest text-primary uppercase">Onboarding Queue</span>
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tight text-slate-900 mb-4">Unlock Unlimited Ad Accounts</h2>
          <p className="text-sm text-slate-600 mb-8 max-w-md mx-auto leading-relaxed">
            Verified agency ad accounts on Meta, Google & TikTok — provisioned in minutes with unlimited free replacements.
            One wallet, unlimited accounts. Scale across every network with priority pipelines.
          </p>

          {loadError && (
            <div className="max-w-md mx-auto mb-6 text-left">
              <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">
                {loadError}
              </div>
              <button
                onClick={loadData}
                className="mt-2 text-[10px] font-black uppercase tracking-wider text-primary hover:underline cursor-pointer"
              >
                Retry
              </button>
            </div>
          )}

          <button
            onClick={handleStartApplication}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-emerald-600 text-white text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Initializing...</>
            ) : (
              <>Start Compliance Onboarding</>
            )}
          </button>
        </div>
      </ClientLayout>
    );
  }

  // 2. State: In Draft or Needs Revisions (Client Stepper Edit Mode)
  const isDraftMode =
    application.status === "DRAFT" ||
    application.status === "INFORMATION_REQUIRED" ||
    application.status === "DOCUMENTS_REQUIRED";

  if (isDraftMode) {
    return (
      <ClientLayout>
        <div className="max-w-3xl mx-auto relative z-10 pb-20">
          {/* Stepper Header */}
          <div className="mb-10 pb-6 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900">Ad Account Application</h1>
              <p className="text-xs text-slate-500 mt-1">Application ID: {application.publicId} ({application.status})</p>
            </div>
            <button
              onClick={handleSaveDraft}
              className="px-4 py-2 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 rounded-lg text-[10px] font-black uppercase tracking-wider text-slate-700 transition-colors cursor-pointer"
            >
              Save Progress
            </button>
          </div>

          {renderAccountBar()}

          {/* Simple apply form */}
          <div className="rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 p-8 mb-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-emerald-600/40 to-teal-500/40" />

            <div className="space-y-6">
              {/* Platform selection */}
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="text-base font-black uppercase text-slate-900 tracking-wider">Ad Account Details</h3>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Select Platform *</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "meta", name: "Meta Ads", color: "text-emerald-600 border-emerald-200 bg-emerald-50" },
                    { id: "google", name: "Google Ads", color: "text-[#FBBC05] border-[#FBBC05]/20 bg-[#FBBC05]/5" },
                    { id: "tiktok", name: "TikTok Ads", color: "text-[#EE1D52] border-[#EE1D52]/20 bg-[#EE1D52]/5" },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setApplyPlatform(p.id)}
                      className={`p-3 rounded-xl border text-center transition-all text-[10px] font-bold cursor-pointer ${
                        applyPlatform === p.id ? `${p.color} border-current` : "border-slate-200 bg-white hover:border-slate-300 text-slate-600"
                      }`}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>

              {applyPlatform === "meta" && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Meta Business Manager ID (BM ID) *</label>
                  <input
                    type="text"
                    value={applyBmId}
                    onChange={(e) => setApplyBmId(e.target.value)}
                    placeholder="e.g. 4920491029302"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-xs outline-none focus:border-primary/50 transition-colors"
                  />
                  <span className="text-[9px] text-slate-400">The BM ID your ad account will be granted under.</span>
                </div>
              )}

              {applyPlatform === "google" && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Gmail for the Ad Account *</label>
                  <input
                    type="email"
                    value={applyGmail}
                    onChange={(e) => setApplyGmail(e.target.value)}
                    placeholder="yourgmail@gmail.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-xs outline-none focus:border-primary/50 transition-colors"
                  />
                  <span className="text-[9px] text-slate-400">Your Google Ads account will be created on this Gmail.</span>
                </div>
              )}

              {/* Hat type */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Choose Hat Type *</label>
                <div className="grid grid-cols-1 gap-2">
                  {(Object.keys(HAT_FEATURES) as Array<"BLACK" | "GREY" | "WHITE">).map((key) => {
                    const hat = HAT_FEATURES[key];
                    const isSelected = applyHatType === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setApplyHatType(key)}
                        className={`text-left rounded-xl border p-4 transition-all cursor-pointer ${
                          isSelected ? `${hat.styles} border-current shadow-lg` : "border-slate-200 bg-white hover:border-slate-300 text-slate-700"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`text-xs font-black uppercase tracking-wider ${isSelected ? "" : "text-slate-900"}`}>
                            {hat.emoji} {hat.title}
                          </span>
                          <span
                            className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                              isSelected
                                ? "border-current opacity-90 bg-white/10"
                                : "border-emerald-300 bg-emerald-50 text-emerald-700"
                            }`}
                          >
                            {hat.badge}
                          </span>
                        </div>
                        <span className={`block text-[10px] font-semibold mb-1.5 ${isSelected ? "opacity-90" : "text-slate-600"}`}>{hat.desc}</span>
                        <ul className={`space-y-0.5 ${isSelected ? "opacity-90" : "text-slate-500"}`}>
                          {hat.features.map((f) => (
                            <li key={f} className="text-[10px] flex items-start gap-1">
                              <span className="shrink-0">•</span> {f}
                            </li>
                          ))}
                        </ul>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs text-primary flex items-start gap-2.5">
                <Wallet className="w-4 h-4 shrink-0 mt-0.5" />
                <p>
                  <strong>Application fee: $10 per ad account</strong> — includes{" "}
                  <strong>UNLIMITED FREE REPLACEMENTS</strong> on every account, forever. Deducted from your
                  main-wallet balance when you submit. Current balance:{" "}
                  <strong>${(user?.balance ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>{" "}
                  — deposits are commission-free, credited in full.
                </p>
              </div>

              {user && (user.balance ?? 0) < 10 && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs flex items-start gap-2.5 text-red-600">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>
                    Your wallet balance is too low to unlock this account. Top up first —{" "}
                    <strong>zero commission, full credit</strong> — then submit instantly.
                  </p>
                </div>
              )}

              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs flex items-start gap-2.5 text-amber-600">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>
                  Please verify all submitted details. Once you click Submit, your application will freeze edits until reviewed.
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={handleSaveDraft}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-black uppercase tracking-wider text-slate-600 transition-colors cursor-pointer"
            >
              Save Draft
            </button>

            <button
              onClick={handleSubmitApplication}
              disabled={user ? (user.balance ?? 0) < 10 : false}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-emerald-600 text-white text-xs font-black uppercase tracking-wider hover:bg-emerald-700 disabled:opacity-30 disabled:pointer-events-none transition-colors shadow-lg shadow-emerald-600/20 cursor-pointer"
            >
              Submit & Unlock Account <CheckCircle className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </ClientLayout>
    );
  }

  // 3. State: Submitted, Review, Approved (Review cockpit)
  return (
    <ClientLayout>
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Onboarding Header */}
      <div className="mb-10 pb-6 border-b border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-slate-200 bg-slate-100 text-slate-500">
              {application.publicId}
            </span>
            <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${getStatusColor(application.status)}`}>
              {application.status}
            </span>
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900">Compliance Cockpit</h1>
          <p className="text-xs text-slate-500 mt-1">Submitted on {application.submittedAt ? new Date(application.submittedAt).toLocaleString() : "Date pending"}</p>
        </div>

        <a
          href={TELEGRAM_SUPPORT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#229ED9] hover:bg-[#1a8bc2] text-white text-xs font-black uppercase tracking-widest transition-colors cursor-pointer"
        >
          Priority Review Link <ExternalLink className="w-4.5 h-4.5" />
        </a>
      </div>

      {renderAccountBar()}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        {/* LEFT: Documents & Timeline status */}
        <div className="lg:col-span-8 space-y-6">
          {/* Rejection Alert */}
          {application.rejectionReason && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-600 text-xs flex gap-3 items-start">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-black uppercase tracking-wider mb-1">Reviewer Note: Action Required</h4>
                <p>{application.rejectionReason}</p>
              </div>
            </div>
          )}

          {/* Interactive timeline logs */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 p-6">
            <h2 className="text-base font-black uppercase tracking-tight text-slate-900 mb-4">Application History Log</h2>
            <div className="space-y-4">
              {timeline.map((event) => (
                <div key={event.id} className="flex gap-4 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <div>
                    <div className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <span>{event.event}</span>
                      <span className="text-[8px] text-slate-400 normal-case font-normal">
                        {new Date(event.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Real-time support chat thread */}
        <div className="lg:col-span-4">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 overflow-hidden flex flex-col h-[520px]">
            <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">Compliance Message Thread</h3>
                <span className="text-[9px] text-emerald-600">Response queue active</span>
              </div>
              <MessageSquare className="w-4 h-4 text-slate-400" />
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
                          ? "bg-slate-100 text-slate-700 border border-slate-200 rounded-tl-none"
                          : "bg-emerald-600 text-white rounded-tr-none shadow-[0_4px_15px_rgba(5,150,105,0.25)]"
                      }`}>
                        {msg.message}
                      </div>
                      <span className="text-[8px] text-slate-400 mt-1 font-mono">
                        {isAdmin ? "Compliance Agent" : "You"} · {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="h-full flex items-center justify-center text-center p-6 text-slate-400 text-xs">
                  <div>
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <span>No communication messages on this thread yet. Send a note below.</span>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendChatMessage} className="p-4 border-t border-slate-200 bg-slate-50 flex gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Type reply or comment..."
                className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-900 outline-none focus:border-primary/50 transition-colors"
              />
              <button
                type="submit"
                disabled={isSendingMsg || !chatMessage.trim()}
                className="w-10 h-10 rounded-xl bg-emerald-600 disabled:opacity-30 disabled:pointer-events-none text-white flex items-center justify-center shrink-0 shadow cursor-pointer"
              >
                {isSendingMsg ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}
