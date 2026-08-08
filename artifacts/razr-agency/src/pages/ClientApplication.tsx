import { useState, useEffect } from "react";
import ClientLayout from "@/components/layout/ClientLayout";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {
  FileText,
  User,
  Building,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  ExternalLink,
  MessageSquare,
  AlertCircle,
  Send,
  Loader2,
  Wallet
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PAYMENT_CONFIG } from "@/config/payment";

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

  const [application, setApplication] = useState<any | null>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Stepper state
  const [step, setStep] = useState(1); // 1: Personal, 2: Business, 3: Advertising, 4: Review

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [country, setCountry] = useState("");

  const [businessName, setBusinessName] = useState("");
  const [regCountry, setRegCountry] = useState("");
  const [businessWebsite, setBusinessWebsite] = useState("");
  const [businessModel, setBusinessModel] = useState("E-commerce");
  const [vertical, setVertical] = useState("");

  const [platform, setPlatform] = useState("Meta Ads (Facebook/IG)");
  const [expectedSpend, setExpectedSpend] = useState("$1,000 - $5,000 / day");
  const [existingAccountId, setExistingAccountId] = useState("");

  // Chat message input
  const [chatMessage, setChatMessage] = useState("");
  const [isSendingMsg, setIsSendingMsg] = useState(false);

  // Load active application and details
  const loadData = async () => {
    try {
      const res = await fetch("/api/applications");
      if (!res.ok) throw new Error();
      const list = await res.json();
      if (list.length > 0) {
        // Load detailed application (API returns the flat application row)
        const appRes = await fetch(`/api/applications/${list[0].id}`);
        if (appRes.ok) {
          const detail = await appRes.json();
          setApplication(detail);

          // Timeline and messages are separate endpoints
          const [tlRes, msgRes] = await Promise.all([
            fetch(`/api/applications/${detail.id}/timeline`),
            fetch(`/api/applications/${detail.id}/messages`),
          ]);
          setTimeline(tlRes.ok ? await tlRes.json() : []);
          setMessages(msgRes.ok ? await msgRes.json() : []);

          // Prepopulate draft fields
          const personal = detail.personalInfo || {};
          const business = detail.businessInfo || {};
          const advertising = detail.advertisingInfo || {};

          setFullName(personal.fullName || user?.username || "");
          setJobTitle(personal.jobTitle || "");
          setBusinessEmail(personal.businessEmail || user?.email || "");
          setPhoneNumber(personal.phoneNumber || "");
          setCountry(personal.country || "");

          setBusinessName(business.businessName || user?.companyName || "");
          setRegCountry(business.regCountry || "");
          setBusinessWebsite(business.businessWebsite || "");
          setBusinessModel(business.businessModel || "E-commerce");
          setVertical(business.vertical || "");

          setPlatform(advertising.platform || "Meta Ads (Facebook/IG)");
          setExpectedSpend(advertising.expectedSpend || "$1,000 - $5,000 / day");
          setExistingAccountId(advertising.existingAccountId || "");
        }
      }
      setIsLoading(false);
    } catch {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStartApplication = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        await loadData();
      }
    } catch {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!application) return;
    try {
      await fetch(`/api/applications/${application.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personalInfo: { fullName, jobTitle, businessEmail, phoneNumber, country },
          businessInfo: { businessName, regCountry, businessWebsite, businessModel, vertical },
          advertisingInfo: { platform, expectedSpend, existingAccountId },
        }),
      });
      toast({
        title: "Draft Saved",
        description: "Your application revisions were saved successfully.",
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Autosave Failed",
        description: "Could not save draft changes.",
      });
    }
  };

  const handleNextStep = async () => {
    // Auto-save draft on step transition
    await handleSaveDraft();
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const handlePrevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmitApplication = async () => {
    if (!application) return;
    try {
      // First save draft
      await handleSaveDraft();
      // Then submit (backend charges the $10 application fee)
      const res = await fetch(`/api/applications/${application.id}/submit`, {
        method: "POST",
      });

      if (res.ok) {
        toast({
          title: "Application Submitted",
          description: "Our team is reviewing your request. The $10 application fee was deducted from your ledger.",
        });
        await loadData();
      } else {
        const err = await res.json();
        toast({ variant: "destructive", title: "Submission Failed", description: err.error || "Could not submit application." });
      }
    } catch {
      toast({ variant: "destructive", title: "Submission Failed" });
    }
  };

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || !application) return;

    setIsSendingMsg(true);
    try {
      const res = await fetch(`/api/applications/${application.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: chatMessage }),
      });
      if (res.ok) {
        setChatMessage("");
        await loadData();
      }
    } catch {
      toast({ variant: "destructive", title: "Message not sent" });
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
          <h2 className="text-3xl font-black uppercase tracking-tight text-slate-900 mb-4">Apply for Agency Ad Account</h2>
          <p className="text-sm text-slate-600 mb-8 max-w-md mx-auto leading-relaxed">
            Gain premium agency meta, google and tiktok ad account provisions with priority scaling pipelines. Start your compliance onboarding checklist.
          </p>
          <button
            onClick={handleStartApplication}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-emerald-600 text-white text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20 cursor-pointer"
          >
            Start Compliance Onboarding
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

          {/* Stepper Progress bar */}
          <div className="grid grid-cols-4 gap-3 mb-8">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="space-y-2">
                <div className={`h-1 rounded-full transition-all duration-300 ${s <= step ? "bg-primary" : "bg-slate-200"}`} />
                <span className={`hidden sm:block text-[9px] font-black uppercase tracking-wider ${s === step ? "text-primary" : "text-slate-400"}`}>
                  {s === 1 && "Personal"}
                  {s === 2 && "Business"}
                  {s === 3 && "Advertising"}
                  {s === 4 && "Review"}
                </span>
              </div>
            ))}
          </div>

          {/* Stepper Content Panel */}
          <div className="rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 p-8 mb-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-emerald-600/40 to-teal-500/40" />

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <User className="w-5 h-5 text-primary" />
                    <h3 className="text-base font-black uppercase text-slate-900 tracking-wider">Step 1: Contact Information</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Full Name</label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-xs outline-none focus:border-primary/50 transition-colors"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Job Title</label>
                      <input
                        type="text"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        placeholder="e.g. Media Buyer / Director"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-xs outline-none focus:border-primary/50 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Business Email</label>
                      <input
                        type="email"
                        value={businessEmail}
                        onChange={(e) => setBusinessEmail(e.target.value)}
                        placeholder="name@company.com"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-xs outline-none focus:border-primary/50 transition-colors"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Direct Phone Number</label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+1 (555) 019-2834"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-xs outline-none focus:border-primary/50 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Residential Country</label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="e.g. United States"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-xs outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Building className="w-5 h-5 text-primary" />
                    <h3 className="text-base font-black uppercase text-slate-900 tracking-wider">Step 2: Business Profile</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Legal Entity Name</label>
                      <input
                        type="text"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="Acme Commerce LLC"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-xs outline-none focus:border-primary/50 transition-colors"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Registration Country</label>
                      <input
                        type="text"
                        value={regCountry}
                        onChange={(e) => setRegCountry(e.target.value)}
                        placeholder="e.g. United Kingdom"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-xs outline-none focus:border-primary/50 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Business Website URL</label>
                      <input
                        type="url"
                        value={businessWebsite}
                        onChange={(e) => setBusinessWebsite(e.target.value)}
                        placeholder="https://acmecommerce.com"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-xs outline-none focus:border-primary/50 transition-colors"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Business Model</label>
                      <select
                        value={businessModel}
                        onChange={(e) => setBusinessModel(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-xs outline-none focus:border-primary/50 transition-colors"
                      >
                        <option>E-commerce</option>
                        <option>Lead Generation</option>
                        <option>SaaS / Product</option>
                        <option>Mobile App Onboarding</option>
                        <option>Info Products / Course</option>
                        <option>Agency / Client Work</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Niche / Advertising Vertical</label>
                    <input
                      type="text"
                      value={vertical}
                      onChange={(e) => setVertical(e.target.value)}
                      placeholder="e.g. Health Supplements, Apparel, Real Estate"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-xs outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <h3 className="text-base font-black uppercase text-slate-900 tracking-wider">Step 3: Account & Media Needs</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Primary Platform</label>
                      <select
                        value={platform}
                        onChange={(e) => setPlatform(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-xs outline-none focus:border-primary/50 transition-colors"
                      >
                        <option>Meta Ads (Facebook/IG)</option>
                        <option>Google Ads (YouTube/PMax)</option>
                        <option>TikTok Ads</option>
                        <option>Other Network</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Expected Daily Budget</label>
                      <select
                        value={expectedSpend}
                        onChange={(e) => setExpectedSpend(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-xs outline-none focus:border-primary/50 transition-colors"
                      >
                        <option>$100 - $500 / day</option>
                        <option>$500 - $1,000 / day</option>
                        <option>$1,000 - $5,000 / day</option>
                        <option>$5,000 - $10,000 / day</option>
                        <option>$10,000+ / day</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Existing Business Portfolio / Account ID (Optional)</label>
                    <input
                      type="text"
                      value={existingAccountId}
                      onChange={(e) => setExistingAccountId(e.target.value)}
                      placeholder="e.g. Portfolio ID 4920491029302"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-xs outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <h3 className="text-base font-black uppercase text-slate-900 tracking-wider">Step 4: Review & Submit</h3>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-4 text-xs">
                    <div className="grid grid-cols-2 gap-4 border-b border-slate-200 pb-3">
                      <div>
                        <span className="text-slate-500 block">Contact Name</span>
                        <span className="text-slate-900 font-bold">{fullName || "—"}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Business Email</span>
                        <span className="text-slate-900 font-bold">{businessEmail || "—"}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 border-b border-slate-200 pb-3">
                      <div>
                        <span className="text-slate-500 block">Company Name</span>
                        <span className="text-slate-900 font-bold">{businessName || "—"}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Business Website</span>
                        <span className="text-slate-900 font-bold">{businessWebsite || "—"}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-slate-500 block">Ad Platform</span>
                        <span className="text-slate-900 font-bold">{platform}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Budget Tier</span>
                        <span className="text-slate-900 font-bold">{expectedSpend}</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs text-primary flex items-start gap-2.5">
                    <Wallet className="w-4 h-4 shrink-0 mt-0.5" />
                    <p>
                      <strong>Application fee: $10 per ad account</strong> — includes unlimited free replacements.
                      The fee is deducted from your ledger balance when you submit. Current balance:{" "}
                      <strong>${(user?.balance ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
                      {" "}(minimum top-up is $100, 2% commission applies to deposits).
                    </p>
                  </div>

                  {user && (user.balance ?? 0) < 10 && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs flex items-start gap-2.5 text-red-600">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <p>
                        Insufficient balance for the $10 application fee. Please top up at least $100 (2% commission applies)
                        before submitting.
                      </p>
                    </div>
                  )}

                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs flex items-start gap-2.5 text-amber-600">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <p>
                      Please verify all submitted details. Once you click Submit, your onboarding application will freeze edits until reviewed.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Stepper Navigation buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevStep}
              disabled={step === 1}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-slate-200 disabled:opacity-30 disabled:pointer-events-none hover:bg-slate-100 text-xs font-black uppercase tracking-wider text-slate-600 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>

            {step < 4 ? (
              <button
                onClick={handleNextStep}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary hover:bg-primary/90 text-white text-xs font-black uppercase tracking-wider transition-colors shadow-lg shadow-primary/10 cursor-pointer"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmitApplication}
                disabled={user ? (user.balance ?? 0) < 10 : false}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-emerald-600 text-white text-xs font-black uppercase tracking-wider hover:bg-emerald-700 disabled:opacity-30 disabled:pointer-events-none transition-colors shadow-lg shadow-emerald-600/20 cursor-pointer"
              >
                Submit Application (Fee: $10) <CheckCircle className="w-4 h-4 text-white" />
              </button>
            )}
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
