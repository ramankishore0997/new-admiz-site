import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageWrapper from "@/components/layout/PageWrapper";
import { useToast } from "@/hooks/use-toast";
import { trackContact, trackLead } from "@/lib/pixel";
import { getAttributionLabel } from "@/lib/utm";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Building,
  Globe,
  DollarSign,
  AlertCircle,
  HelpCircle,
  Copy,
  CheckCircle2,
  Users,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { SiTelegram, SiMeta, SiGoogleads, SiTiktok } from "react-icons/si";
import { ACCOUNT_COUNTRIES, ACCOUNT_CURRENCIES } from "@/lib/countries-currencies";
import SearchableSelect from "@/components/ui/SearchableSelect";
import SpotlightCard from "@/components/ui/SpotlightCard";

const TELEGRAM_URL = "https://t.me/RazrMarketing";

// Options Definitions
const PLATFORMS = [
  { id: "meta", name: "Meta Ads (Facebook/IG)", Icon: SiMeta, color: "text-violet-400 border-violet-500/30 bg-violet-950/40" },
  { id: "google", name: "Google Ads (YouTube/PMax)", Icon: SiGoogleads, color: "text-cyan-400 border-cyan-500/30 bg-cyan-950/40" },
  { id: "tiktok", name: "TikTok Ads", Icon: SiTiktok, color: "text-pink-400 border-pink-500/30 bg-pink-950/40" },
  { id: "other", name: "Other Platforms (Twitter, Native)", Icon: Sparkles, color: "text-amber-300 border-amber-500/30 bg-amber-950/40" },
];

const BUDGETS = [
  { id: "starter", label: "Under $5,000 / mo", range: "< $5k" },
  { id: "growth", label: "$5,000 - $15,000 / mo", range: "$5k - $15k" },
  { id: "scale", label: "$15,000 - $50,000 / mo", range: "$15k - $50k" },
  { id: "whale", label: "Above $50,000 / mo", range: "$50k+" },
];

const NICHES = [
  { id: "ecom", label: "E-Commerce / Dropshipping" },
  { id: "saas", label: "SaaS & Mobile Apps" },
  { id: "leadgen", label: "Lead Generation" },
  { id: "crypto", label: "Crypto / iGaming / Specialized" },
  { id: "infoproducts", label: "Info Products & Coaching" },
  { id: "other", label: "Agency & Other Business" },
];

const BOTTLENECKS = [
  { id: "bans", label: "Frequent account bans / suspensions" },
  { id: "limits", label: "$50/day spend limit restrictions" },
  { id: "pixel", label: "Bad pixel performance / conversion loss" },
  { id: "billing", label: "Payment method decline / billing issues" },
  { id: "support", label: "Slow or unhelpful support from platforms" },
  { id: "scaling", label: "Scaling friction / warmup delays" },
];

export default function ApplyAgencyAccount() {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isCopied, setIsCopied] = useState(false);

  // Form State
  const [company, setCompany] = useState("");
  const [telegram, setTelegram] = useState("");
  const [website, setWebsite] = useState("");
  const [country, setCountry] = useState("United States");
  const [currency, setCurrency] = useState("USD");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [budget, setBudget] = useState("");
  const [niche, setNiche] = useState("");
  const [selectedBottlenecks, setSelectedBottlenecks] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  const togglePlatform = (id: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const toggleBottleneck = (id: string) => {
    setSelectedBottlenecks((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  const formatTelegramHandle = (val: string) => {
    const trimmed = val.trim();
    if (!trimmed) return "";
    return trimmed.startsWith("@") ? trimmed : `@${trimmed}`;
  };

  const getStepValidation = () => {
    if (step === 1) {
      return company.trim().length > 1 && telegram.trim().length > 1;
    }
    if (step === 2) {
      return selectedPlatforms.length > 0 && budget !== "";
    }
    if (step === 3) {
      return niche !== "" && selectedBottlenecks.length > 0;
    }
    return true;
  };

  const handleNext = () => {
    if (getStepValidation()) {
      setStep((s) => s + 1);
    } else {
      toast({
        variant: "destructive",
        title: "Incomplete Fields",
        description: "Please fill in all required fields to proceed.",
      });
    }
  };

  const handleBack = () => {
    setStep((s) => s - 1);
  };

  const generateApplicationSummary = () => {
    const platformsLabel = selectedPlatforms
      .map((p) => PLATFORMS.find((plat) => plat.id === p)?.name || p)
      .join(", ");
    
    const budgetLabel = BUDGETS.find((b) => b.id === budget)?.label || budget;
    const nicheLabel = NICHES.find((n) => n.id === niche)?.label || niche;
    const bottlenecksLabel = selectedBottlenecks
      .map((b) => BOTTLENECKS.find((bot) => bot.id === b)?.label || b)
      .join("\n- ");
    
    const attribution = getAttributionLabel();

    return `🚀 RAZR MARKETING APPLICATION:
------------------------------------------
🏢 Name / Company: ${company}
📱 Telegram Handle: ${formatTelegramHandle(telegram)}
🌐 Website: ${website || "Not provided"}
🌍 Ad Account Country: ${country}
💱 Ad Account Currency: ${currency}

📊 ADVERTISING PARAMETERS:
🔌 Platforms: ${platformsLabel}
💰 Monthly Budget: ${budgetLabel}
🎯 Business Niche: ${nicheLabel}

⚠️ BOTTLENECKS & PAIN POINTS:
- ${bottlenecksLabel}

📝 EXTRA INFO:
${notes || "None"}
${attribution ? `\n[ad source: ${attribution}]` : ""}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    trackContact({ source: "apply_agency_form" });
    trackLead({ intent: "agency-account-application", source: "apply-page" });

    const summaryText = generateApplicationSummary();

    try {
      await navigator.clipboard.writeText(summaryText);
      setIsCopied(true);
      toast({
        title: "Details Copied Successfully!",
        description: "Your application summary was copied to your clipboard. Paste it in Telegram.",
      });
    } catch (err) {
      console.error("Failed to copy text", err);
      toast({
        title: "Application Ready",
        description: "Redirecting to Telegram now to start onboarding.",
      });
    }

    setStep(4);
    
    setTimeout(() => {
      window.open(TELEGRAM_URL, "_blank", "noopener,noreferrer");
    }, 1500);
  };

  const triggerCopyAgain = async () => {
    const summaryText = generateApplicationSummary();
    try {
      await navigator.clipboard.writeText(summaryText);
      setIsCopied(true);
      toast({
        title: "Copied Again!",
        description: "Application details are ready on your clipboard.",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Copy Failed",
        description: "Please manually copy the details or message us directly.",
      });
    }
  };

    return (
    <PageWrapper>
      {/* Background Orbs */}
      <div className="absolute top-24 left-1/4 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />

      <section className="pt-24 pb-20 relative bg-black">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-violet-500/30 bg-violet-950/40 backdrop-blur mb-4"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[10px] font-black tracking-[0.2em] bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent uppercase">Onboarding Portal</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white mb-4"
            >
              Apply for <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">Agency Account</span>
            </motion.h1>
            
            <p className="text-base text-zinc-300 max-w-lg mx-auto">
              Get access to premium, high-spend Meta and Google accounts backed by 24/7 dedicated support.
            </p>
          </div>

          {/* Pricing & Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="relative rounded-2xl border border-zinc-800 bg-[#060608] p-5 shadow-2xl"
            >
              <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent mb-3">
                <DollarSign className="w-3.5 h-3.5 text-cyan-400" /> Minimum Deposit
              </div>
              <ul className="space-y-2 text-xs text-zinc-300">
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <span><strong className="text-white">$10</strong> first topup — full credit, 0% fee</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <span><strong className="text-white">$50</strong> every topup after that — 0% fee</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <span><strong className="text-white">$50</strong> ad-account topup — unlocks BM access + activation</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="relative rounded-2xl border border-zinc-800 bg-[#060608] p-5 shadow-2xl"
            >
              <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-pink-400 to-amber-300 bg-clip-text text-transparent mb-3">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> Topup Fees
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-black/60 px-3 py-2">
                  <span className="text-xs font-bold text-zinc-300">Below $100</span>
                  <span className="text-xs font-black text-amber-400">3%</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-black/60 px-3 py-2">
                  <span className="text-xs font-bold text-zinc-300">$100 – $1,000</span>
                  <span className="text-xs font-black text-amber-400">2%</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-black/60 px-3 py-2">
                  <span className="text-xs font-bold text-zinc-300">Above $1,000</span>
                  <span className="text-xs font-black text-emerald-400">1.5%</span>
                </div>
              </div>
              <p className="text-[10px] text-zinc-400 mt-2.5 font-semibold">
                Wallet deposits are always commission-free — credited in full.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="relative rounded-2xl border border-zinc-800 bg-[#060608] p-5 shadow-2xl"
            >
              <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-emerald-400 to-cyan-300 bg-clip-text text-transparent mb-3">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Included Benefits
              </div>
              <ul className="space-y-2 text-xs text-zinc-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                  <span>Unlimited free replacements — lifetime</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                  <span>BM access assigned on topup — 24 hrs</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                  <span>100% refund if BM isn't assigned in 48 hrs</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                  <span>Live status tracking + 24/7 Telegram support</span>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Form Box */}
          <div className="relative group rounded-3xl overflow-hidden border border-zinc-800 bg-[#060608] p-6 md:p-10 shadow-2xl">
            {/* Top decorative progress line */}
            {step < 4 && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-zinc-800 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-violet-500 via-cyan-400 to-emerald-400"
                  animate={{ width: `${((step - 1) / 2) * 100}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            )}

            {/* Stepper info */}
            {step < 4 && (
              <div className="flex items-center justify-between mb-8 text-xs font-black tracking-widest uppercase text-zinc-400 border-b border-zinc-800 pb-4">
                <span>Step 0{step} / 03</span>
                <span className="bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent font-black">
                  {step === 1 ? "Advertiser details" : step === 2 ? "Campaign setup" : "Scaling friction"}
                </span>
              </div>
            )}

            <AnimatePresence mode="wait">
              {/* STEP 1 */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold text-white uppercase tracking-tight flex items-center gap-2">
                      <Building className="w-5 h-5 text-violet-400" /> Company Profile
                    </h2>
                    <p className="text-sm text-zinc-400">
                      Tell us who you are so we can custom tailor the onboarding structure.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Company / Contact Name *</label>
                      <input
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="e.g. Acme Scaling Corp"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/50 transition-colors placeholder:text-zinc-600"
                      />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center justify-between">
                        <span>Telegram Handle *</span>
                        <span className="text-[10px] text-cyan-400 lowercase tracking-normal font-medium">For instant setup</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-3 text-zinc-500 font-medium">@</span>
                        <input
                          value={telegram.replace(/^@/, "")}
                          onChange={(e) => setTelegram(e.target.value)}
                          placeholder="yourusername"
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-8 pr-4 py-3 text-white outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/50 transition-colors placeholder:text-zinc-600"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center justify-between">
                      <span>Landing Page / URL</span>
                      <span className="text-[10px] text-zinc-500 capitalize tracking-normal font-normal">Optional</span>
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500" />
                      <input
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="e.g. www.myscalebrand.com"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-white outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/50 transition-colors placeholder:text-zinc-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Ad Account Country *</label>
                      <SearchableSelect
                        value={country}
                        onChange={setCountry}
                        options={ACCOUNT_COUNTRIES.map((c) => ({ value: c, label: c }))}
                        placeholder="Search country..."
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Ad Account Currency *</label>
                      <SearchableSelect
                        value={currency}
                        onChange={setCurrency}
                        options={ACCOUNT_CURRENCIES.map((c) => ({ value: c.split(" — ")[0], label: c }))}
                        placeholder="Search currency..."
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-zinc-800">
                    <button
                      onClick={handleNext}
                      disabled={!getStepValidation()}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white text-xs font-black uppercase tracking-wider hover:opacity-95 disabled:opacity-30 disabled:pointer-events-none transition-all duration-300 shadow-lg shadow-violet-600/25 hover:scale-[1.02]"
                    >
                      Next Step <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold text-white uppercase tracking-tight flex items-center gap-2">
                      <Zap className="w-5 h-5 text-cyan-400" /> Traffic & Budgets
                    </h2>
                    <p className="text-sm text-zinc-400">
                      Select which platform and budget scale tier you need.
                    </p>
                  </div>

                  {/* Platforms selection */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Required Platforms *</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {PLATFORMS.map((plat) => {
                        const Icon = plat.Icon;
                        const isSelected = selectedPlatforms.includes(plat.id);
                        return (
                          <button
                            key={plat.id}
                            type="button"
                            onClick={() => togglePlatform(plat.id)}
                            className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all ${
                              isSelected
                                ? `${plat.color} border-violet-400 shadow-lg shadow-violet-500/20`
                                : "border-zinc-800 bg-zinc-950/60 hover:border-zinc-700 text-zinc-300"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Icon className="w-5 h-5 shrink-0" />
                              <span className="text-sm font-semibold">{plat.name}</span>
                            </div>
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                              isSelected ? "bg-gradient-to-r from-violet-500 to-cyan-400 text-black border-cyan-400" : "border-zinc-700"
                            }`}>
                              {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Budgets selection */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Estimated Monthly Spend *</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {BUDGETS.map((b) => {
                        const isSelected = budget === b.id;
                        return (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() => setBudget(b.id)}
                            className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all ${
                              isSelected
                                ? "border-cyan-400 bg-cyan-950/60 text-white shadow-lg shadow-cyan-500/20"
                                : "border-zinc-800 bg-zinc-950/60 hover:border-zinc-700 text-zinc-400 hover:text-white"
                            }`}
                          >
                            <DollarSign className={`w-5 h-5 mb-2 ${isSelected ? "text-cyan-400" : "text-zinc-500"}`} />
                            <span className="text-xs font-black uppercase tracking-wider leading-none mb-1 text-white">{b.range}</span>
                            <span className="text-[9px] text-zinc-400 leading-none">{b.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-zinc-800">
                    <button
                      onClick={handleBack}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 text-xs font-black uppercase tracking-wider transition-all"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Back
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={!getStepValidation()}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white text-xs font-black uppercase tracking-wider hover:opacity-95 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-lg shadow-violet-600/25 hover:scale-[1.02]"
                    >
                      Next Step <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold text-white uppercase tracking-tight flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-amber-400" /> Niche & Challenges
                    </h2>
                    <p className="text-sm text-zinc-400">
                      Let us know what niche you advertise in and the main restrictions you face.
                    </p>
                  </div>

                  {/* Niche selector */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Business Niche *</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {NICHES.map((n) => {
                        const isSelected = niche === n.id;
                        return (
                          <button
                            key={n.id}
                            type="button"
                            onClick={() => setNiche(n.id)}
                            className={`p-3 rounded-xl border text-center text-xs font-semibold transition-all ${
                              isSelected
                                ? "border-pink-400 bg-pink-950/60 text-white shadow-md shadow-pink-500/20"
                                : "border-zinc-800 bg-zinc-950/60 hover:border-zinc-700 text-zinc-300"
                            }`}
                          >
                            {n.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Bottlenecks selector */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Main bottlenecks faced (Select at least one) *</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {BOTTLENECKS.map((b) => {
                        const isSelected = selectedBottlenecks.includes(b.id);
                        return (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() => toggleBottleneck(b.id)}
                            className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all text-xs font-medium ${
                              isSelected
                                ? "border-cyan-400 bg-cyan-950/60 text-white shadow-md shadow-cyan-500/20"
                                : "border-zinc-800 bg-zinc-950/60 hover:border-zinc-700 text-zinc-300"
                            }`}
                          >
                            <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${
                              isSelected ? "bg-cyan-400 border-cyan-400 text-black" : "border-zinc-700"
                            }`}>
                              {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                            <span>{b.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Additional notes */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                      <span>Specific account requirements</span>
                      <span className="text-[10px] text-zinc-500 capitalize tracking-normal font-normal">Optional</span>
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      placeholder="e.g. Require Meta backup BM structure, Google Premier MCC setup, specific domains..."
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/50 transition-colors resize-none text-sm placeholder:text-zinc-600"
                    />
                  </div>

                  <div className="flex justify-between pt-4 border-t border-zinc-800">
                    <button
                      onClick={handleBack}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 text-xs font-black uppercase tracking-wider transition-all"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Back
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={!getStepValidation()}
                      className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-95 text-white text-xs font-black uppercase tracking-wider disabled:opacity-30 disabled:pointer-events-none transition-all shadow-xl shadow-violet-600/25 hover:scale-[1.02]"
                    >
                      Submit & Copy Details <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: SUCCESS PAGE */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="text-center py-8 space-y-8"
                >
                  <div className="w-20 h-20 rounded-full bg-violet-950/60 border border-violet-500/30 flex items-center justify-center mx-auto text-cyan-400 shadow-[0_0_40px_rgba(139,92,246,0.3)]">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>

                  <div className="space-y-3">
                    <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">Application Ready!</h2>
                    <p className="text-sm text-zinc-300 max-w-md mx-auto">
                      We have compiled your details and copied them to your clipboard.
                      Now, message us on Telegram and paste the details to start onboarding.
                    </p>
                  </div>

                  {/* Summary Box */}
                  <div className="relative max-w-md mx-auto rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-left font-mono text-[10px] leading-relaxed text-zinc-300 select-all overflow-y-auto max-h-[160px] custom-scrollbar">
                    <pre className="whitespace-pre-wrap">{generateApplicationSummary()}</pre>
                    <button
                      onClick={triggerCopyAgain}
                      className="absolute right-3 top-3 p-1.5 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 transition-colors text-zinc-300 hover:text-white"
                      title="Copy again"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-sm mx-auto">
                    <a
                      href={TELEGRAM_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white font-black text-xs uppercase tracking-widest hover:opacity-95 hover:scale-[1.02] transition-all shadow-xl shadow-violet-600/25"
                    >
                      <SiTelegram className="w-4 h-4" /> Message on Telegram
                    </a>
                  </div>

                  <p className="text-[10px] text-zinc-500 flex items-center justify-center gap-1.5">
                    <HelpCircle className="w-3 h-3 text-zinc-400" /> Didn't redirect? Message us manually @RazrMarketing
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Core Info Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="rounded-2xl border border-zinc-800 bg-[#060608] p-5 flex items-start gap-3 shadow-xl">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-white mb-1">Secure Setup</h4>
                <p className="text-[11px] text-zinc-400 leading-relaxed">Accounts provisioned on enterprise infrastructure to ensure stability and low ban rate.</p>
              </div>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-[#060608] p-5 flex items-start gap-3 shadow-xl">
              <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-white mb-1">Instant Activation</h4>
                <p className="text-[11px] text-zinc-400 leading-relaxed">Spend instantly. Most accounts provisioned within 60 minutes after details review.</p>
              </div>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-[#060608] p-5 flex items-start gap-3 shadow-xl">
              <Users className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-white mb-1">Agency Support</h4>
                <p className="text-[11px] text-zinc-400 leading-relaxed">Direct 24/7 communications on Telegram with professional media buyers.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
