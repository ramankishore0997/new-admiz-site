import { useState, useEffect } from "react";
import ClientLayout from "@/components/layout/ClientLayout";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  ShieldCheck,
  CheckCircle2,
  Building,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  Globe2,
  Lock,
  Layers,
  Sparkles,
  HelpCircle,
  ExternalLink,
  Flame,
  Award,
  Sliders,
  DollarSign,
  Search,
  Check,
  X,
  Clock,
  Gauge,
  BarChart3,
  Percent,
  RefreshCw,
  Activity
} from "lucide-react";
import { SiMeta, SiGoogleads, SiTiktok } from "react-icons/si";

interface AccountTier {
  id: string;
  platform: string;
  name: string;
  icon: any;
  iconColor: string;
  badge: string;
  trustScore: string;
  spendLimit: string;
  inventoryCount: number;
  bmType: string;
  region: string;
  taxRate: string;
  handoverTime: string;
  avgApprovalTime: string;
  cpmAdvantage: string;
  features: string[];
  allowedVerticals: string[];
  restrictedVerticals: string[];
}

const ACCOUNT_TIERS: AccountTier[] = [
  {
    id: "meta-enterprise",
    platform: "Meta Ads",
    name: "Meta Tier-1 Enterprise Line (Facebook & Instagram)",
    icon: SiMeta,
    iconColor: "text-[#1877F2]",
    badge: "Most Popular · Tier-1 Partner",
    trustScore: "99.4/100 (VIP Auction Bracket)",
    spendLimit: "$5,000/day to Uncapped",
    inventoryCount: 14,
    bmType: "UK / US Tier-1 Enterprise BM",
    region: "Worldwide Targeting (0% Ad Tax)",
    taxRate: "0% (Zero Billing Tax)",
    handoverTime: "2 to 4 Hours",
    avgApprovalTime: "5–15 Minutes",
    cpmAdvantage: "35%–52% Lower than Personal BM",
    features: [
      "Direct Line-of-Credit with zero arbitrary spend caps from Day 1",
      "Shared via Meta Partner Business Manager invite directly to your team",
      "Unlimited Pixel, Domain & Custom Conversion API bindings",
      "High-trust Agency ASN IP pool preventing automated risk triggers",
      "100% Unspent Balance Auto-Transfer guarantee if line resets",
      "Direct human Meta Agency Partner Escalation desk for appeals"
    ],
    allowedVerticals: [
      "E-Commerce & High-Volume DTC Brands",
      "Dropshipping & Global COD (Cash on Delivery)",
      "High-Ticket Lead Generation & Real Estate",
      "Crypto, Web3 & FinTech Trading (Approved Lines)",
      "Nutra, Skincare & Dietary Health Supplements",
      "Mobile Apps, Utilities & Gaming",
      "Info-Products, Coaching & Education"
    ],
    restrictedVerticals: [
      "Illegal goods or counterfeit products",
      "Malicious phishing or malware pages"
    ]
  },
  {
    id: "google-premier",
    platform: "Google Ads",
    name: "Google Premier Agency MCC Line",
    icon: SiGoogleads,
    iconColor: "text-amber-400",
    badge: "High-Volume Scaling",
    trustScore: "98.9/100 (Premier MCC Approved)",
    spendLimit: "Uncapped Monthly Invoiced Credit",
    inventoryCount: 8,
    bmType: "Aged Premier Partner MCC (Enterprise Invoicing)",
    region: "Global 190+ Countries (Search, YouTube, PMax, Display)",
    taxRate: "0% (Zero Billing Tax)",
    handoverTime: "2 to 6 Hours",
    avgApprovalTime: "10–30 Minutes",
    cpmAdvantage: "30%–45% Lower CPC & High Search Impression Share",
    features: [
      "Aged Agency MCC Line with instant invoice billing (Zero card decline bans)",
      "Pre-warmed trust score for zero suspicious payment suspensions",
      "YouTube Ads, Search, Display, Discovery, and Performance Max enabled",
      "Multi-currency support (USD / EUR / GBP) with 0% foreign exchange penalty",
      "Automated conversion tracking approval and Tag Manager integration",
      "Immediate replacement in case of unexpected algorithm policy flags"
    ],
    allowedVerticals: [
      "Search Arbitrage & High-Volume PPC Scale",
      "E-Commerce & Omni-Channel Retail Scaling",
      "SaaS, B2B Enterprise & Technology",
      "Nutra, Dietary Supplements & Wellness",
      "Crypto Exchanges, FinTech & Trading Prop Firms",
      "Local Services, Solar & Insurance Lead Gen"
    ],
    restrictedVerticals: [
      "Cloaked blackhat scams",
      "Unlicensed prescription pharmaceuticals"
    ]
  },
  {
    id: "tiktok-agency",
    platform: "TikTok Ads",
    name: "TikTok for Business Agency Account",
    icon: SiTiktok,
    iconColor: "text-cyan-400",
    badge: "Rapid Scale & Virality",
    trustScore: "99.1/100 (Direct TikTok Approved)",
    spendLimit: "$10,000/day to Unlimited",
    inventoryCount: 6,
    bmType: "TikTok Agency Business Center (Global Geo)",
    region: "Worldwide (US, UK, EU, GCC, LATAM, APAC)",
    taxRate: "0% (Zero VAT/Tax)",
    handoverTime: "2 to 4 Hours",
    avgApprovalTime: "5–20 Minutes",
    cpmAdvantage: "40%–60% Cheaper Video CPMs vs Self-Serve",
    features: [
      "Worldwide Targeting without local business registration geo-blocking",
      "0% VAT / Ad Tax on all campaigns globally",
      "Spark Ads & Creator Marketplace direct account integration",
      "Higher video view velocity & rapid algorithmic learning phase clearance",
      "Direct Business Center access invite with multi-member role permissions",
      "Instant agency balance credit top-up via USDT / Wire / Card"
    ],
    allowedVerticals: [
      "TikTok Shop & Viral DTC Brands",
      "Mobile Apps, Casual & Web3 Games",
      "E-Commerce & High-Conversion Dropshipping",
      "Lead Gen & High-Ticket Webinar Offers",
      "Digital Media, EdTech & Content Creators"
    ],
    restrictedVerticals: [
      "Adult content & non-compliant creatives",
      "Misleading claim angles"
    ]
  }
];

interface VerticalSpec {
  id: string;
  name: string;
  category: "ecom" | "leadgen" | "crypto" | "nutra" | "apps" | "info";
  status: "100% Pre-Approved" | "Approved Line" | "Specialized Protocol";
  badgeColor: string;
  bestPlatform: string;
  cpmRange: string;
  roasExpectation: string;
  approvalSpeed: string;
  scalingMethod: string;
  highlights: string[];
}

const VERTICAL_SPECS: VerticalSpec[] = [
  {
    id: "v-ecom",
    name: "E-Commerce, DTC & Dropshipping",
    category: "ecom",
    status: "100% Pre-Approved",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    bestPlatform: "Meta ASC + TikTok Shop + Google PMax",
    cpmRange: "$8 - $18 (US/EU Broad)",
    roasExpectation: "3.2x – 5.8x ROAS",
    approvalSpeed: "< 10 Minutes",
    scalingMethod: "Advantage+ Shopping + CBO horizontal scaling to $20k/day",
    highlights: [
      "Zero payment method review hold loops",
      "Instant catalog sync & dynamic retargeting",
      "Pre-warmed pixel data preservation across scaling phases"
    ]
  },
  {
    id: "v-leadgen",
    name: "B2B, Local, Solar & High-Ticket Lead Gen",
    category: "leadgen",
    status: "100% Pre-Approved",
    badgeColor: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
    bestPlatform: "Meta Instant Forms + Google Search PPC",
    cpmRange: "$12 - $24",
    roasExpectation: "Cost-Per-Lead reduced by 38%",
    approvalSpeed: "< 15 Minutes",
    scalingMethod: "CBO Multi-Angle Instant Forms with Webhook CAPI integration",
    highlights: [
      "Instant form approvals with 0 lead throttling",
      "Pristine domain reputation ensures high inboxing/landing delivery",
      "Uncapped daily lead volume capture without budget ceilings"
    ]
  },
  {
    id: "v-crypto",
    name: "Crypto, Web3, FinTech & Prop Trading",
    category: "crypto",
    status: "Approved Line",
    badgeColor: "bg-violet-500/10 text-violet-300 border-violet-500/30",
    bestPlatform: "Meta Enterprise Line + Google Search Tier-1",
    cpmRange: "$18 - $35",
    roasExpectation: "3.5x - 6.0x Volume Scale",
    approvalSpeed: "15–30 Minutes",
    scalingMethod: "Compliant bridge pre-landers & approved financial line tags",
    highlights: [
      "Pre-cleared agency lines with regulatory exemption tags",
      "Bypasses automated 'Financial Products & Services' restriction bots",
      "Dedicated rep channel for complex fintech compliance reviews"
    ]
  },
  {
    id: "v-nutra",
    name: "Nutra, Skincare & Health Supplements",
    category: "nutra",
    status: "Specialized Protocol",
    badgeColor: "bg-purple-500/10 text-purple-300 border-purple-500/30",
    bestPlatform: "Meta Agency Line + TikTok Spark Ads",
    cpmRange: "$14 - $28",
    roasExpectation: "2.8x - 4.5x Stable ROAS",
    approvalSpeed: "10–25 Minutes",
    scalingMethod: "Multi-angle advertorials with compliant claim frameworks",
    highlights: [
      "High-trust agency BM prevents health policy automated strikes",
      "Clean pixel clustering allows multi-product line testing",
      "Fast replacement fallback protects continuous cash-flow"
    ]
  },
  {
    id: "v-apps",
    name: "Mobile Apps, SaaS & Casual Gaming",
    category: "apps",
    status: "100% Pre-Approved",
    badgeColor: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
    bestPlatform: "Google App Campaigns (UAC) + TikTok Business",
    cpmRange: "$0.40 - $2.50 (CPI)",
    roasExpectation: "High LTV / Low CPI",
    approvalSpeed: "< 10 Minutes",
    scalingMethod: "Deep-link SKAdNetwork & automated creative optimization",
    highlights: [
      "Pre-linked App Store & Google Play Developer IDs",
      "Zero app installation velocity caps",
      "Tier-1 global geo delivery optimization"
    ]
  },
  {
    id: "v-info",
    name: "Info-Products, Coaching & Education",
    category: "info",
    status: "100% Pre-Approved",
    badgeColor: "bg-amber-500/10 text-amber-300 border-amber-500/30",
    bestPlatform: "Meta Ads + YouTube Ads MCC",
    cpmRange: "$10 - $22",
    roasExpectation: "3.0x - 7.2x Front-End ROAS",
    approvalSpeed: "< 15 Minutes",
    scalingMethod: "VSL / Webinar funnel scaling with high-retention video CDN",
    highlights: [
      "Pre-warmed video ad delivery engine for ultra-low 3-second play costs",
      "Compliant income disclaimer frameworks pre-tested",
      "Massive scaling capacity for live masterclass & launch weeks"
    ]
  }
];

export default function ClientSpecs() {
  const [activeTab, setActiveTab] = useState("all");
  const [activeVerticalCategory, setActiveVerticalCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Interactive Calculator State
  const [monthlyBudget, setMonthlyBudget] = useState(10000);
  const [currentCpm, setCurrentCpm] = useState(25);

  // Math Calculations: Agency accounts save ~40% on CPMs due to VIP auction score
  const estimatedAgencyCpm = Math.round(currentCpm * 0.60 * 10) / 10;
  const currentImpressions = Math.round((monthlyBudget / currentCpm) * 1000);
  const agencyImpressions = Math.round((monthlyBudget / estimatedAgencyCpm) * 1000);
  const extraImpressions = agencyImpressions - currentImpressions;
  const estimatedCashSaved = Math.round(monthlyBudget * 0.40);

  const filteredTiers = activeTab === "all"
    ? ACCOUNT_TIERS
    : ACCOUNT_TIERS.filter((t) => t.platform.toLowerCase().includes(activeTab.toLowerCase()));

  const filteredVerticals = VERTICAL_SPECS.filter((v) => {
    const matchesCategory = activeVerticalCategory === "all" || v.category === activeVerticalCategory;
    const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.scalingMethod.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Real-time dynamic stock fluctuation & auto-restock simulation engine
  const [stock, setStock] = useState({
    meta: 14,
    google: 8,
    tiktok: 6,
  });

  const [stockDeltas, setStockDeltas] = useState<{
    meta?: { value: number; key: number };
    google?: { value: number; key: number };
    tiktok?: { value: number; key: number };
  }>({});

  const [recentEvents, setRecentEvents] = useState<
    Array<{ id: number; text: string; time: string; type: "claim" | "restock" }>
  >([
    { id: 1, text: "Meta Tier-1 Line allocated to High-Scale Partner (US/COD)", time: "Just now", type: "claim" },
    { id: 2, text: "RAZR Vault: +3 Google Premier MCC Lines approved & ingested", time: "2m ago", type: "restock" },
    { id: 3, text: "TikTok Agency Line allocated to DTC Scale Brand", time: "4m ago", type: "claim" },
  ]);

  useEffect(() => {
    const platforms: Array<"meta" | "google" | "tiktok"> = ["meta", "google", "tiktok"];
    const platformLabels: Record<"meta" | "google" | "tiktok", string> = {
      meta: "Meta Tier-1 Line",
      google: "Google Premier MCC",
      tiktok: "TikTok Business Line",
    };
    const bounds = {
      meta: { min: 9, max: 18 },
      google: { min: 5, max: 12 },
      tiktok: { min: 3, max: 9 },
    };

    const interval = setInterval(() => {
      const chosen = platforms[Math.floor(Math.random() * platforms.length)];
      const currentVal = stock[chosen];
      const bound = bounds[chosen];

      const isLow = currentVal <= bound.min + 1;
      const isHigh = currentVal >= bound.max - 1;

      let delta = -1;
      let eventType: "claim" | "restock" = "claim";
      let eventText = "";

      if (isLow || (!isHigh && Math.random() < 0.40)) {
        const addAmount = Math.floor(Math.random() * 2) + 2; // +2 or +3
        delta = Math.min(addAmount, bound.max - currentVal);
        if (delta <= 0) delta = 2;
        eventType = "restock";
        eventText = `RAZR Vault: +${delta} ${platformLabels[chosen]} approved & added to ready inventory`;
      } else {
        delta = -1;
        eventType = "claim";
        const clientTypes = ["Scale Partner", "DTC Brand", "Lead Gen Firm", "E-Com Team", "FinTech Client"];
        const randomClient = clientTypes[Math.floor(Math.random() * clientTypes.length)];
        eventText = `${platformLabels[chosen]} allocated & dispatched to ${randomClient}`;
      }

      setStock((prev) => {
        const nextVal = Math.max(bound.min, Math.min(bound.max, prev[chosen] + delta));
        return {
          ...prev,
          [chosen]: nextVal,
        };
      });

      setStockDeltas((prev) => ({
        ...prev,
        [chosen]: { value: delta, key: Date.now() },
      }));

      setRecentEvents((prev) => [
        {
          id: Date.now(),
          text: eventText,
          time: "Just now",
          type: eventType,
        },
        ...prev.slice(0, 2),
      ]);
    }, 7500);

    return () => clearInterval(interval);
  }, [stock]);

  return (
    <ClientLayout>
      <div className="space-y-10">
        {/* Header Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-[#060608] p-8 md:p-10 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-cyan-300 text-xs font-bold uppercase tracking-widest mb-3 shadow-sm">
                <Zap className="w-3.5 h-3.5 text-cyan-400" /> Institutional Ad Infrastructure
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white">
                Agency Account Specs &{" "}
                <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
                  3x–5x ROAS Delivery
                </span>
              </h1>
              <p className="text-sm text-zinc-300 mt-2 max-w-2xl leading-relaxed">
                Every ad vertical runs with high stability on our approved agency lines. Discover why our Tier-1 accounts deliver <span className="font-bold text-cyan-300">30%–50% cheaper CPMs</span>, instant 5-minute ad approvals, and uncapped daily scaling.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link href="/app/application">
                <span className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-95 hover:scale-105 text-white text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-violet-600/30 cursor-pointer">
                  Request Allocation <ArrowUpRight className="w-4 h-4" />
                </span>
              </Link>
              <Link href="/app/playbook">
                <span className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-black hover:bg-zinc-900 text-white border border-zinc-800 text-xs font-black uppercase tracking-widest transition-all cursor-pointer">
                  Scaling Playbook
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Live Inventory Status Bar */}
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Meta Tier-1 Card */}
            <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-[#060608] p-5 shadow-xl flex items-center justify-between hover:border-violet-500/40 transition-all">
              <div>
                <div className="flex items-center gap-2">
                  <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Meta Tier-1 Line</div>
                  <AnimatePresence mode="wait">
                    {stockDeltas.meta && (
                      <motion.span
                        key={stockDeltas.meta.key}
                        initial={{ opacity: 0, y: -6, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${
                          stockDeltas.meta.value > 0
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : "bg-amber-500/10 text-amber-300 border-amber-500/30"
                        }`}
                      >
                        {stockDeltas.meta.value > 0 ? `+${stockDeltas.meta.value} Restocked` : `${stockDeltas.meta.value} Allocated`}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={stock.meta}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.25 }}
                      className="text-2xl font-black text-cyan-300 font-mono inline-block"
                    >
                      {stock.meta}
                    </motion.span>
                  </AnimatePresence>
                  <span className="text-2xl font-black text-white">Ready</span>
                </div>
                <div className="text-[10px] font-bold text-cyan-400 mt-1 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" /> Handover: 2–4 hrs · Uncapped
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-[#1877F2] shrink-0">
                <SiMeta className="w-6 h-6" />
              </div>
            </div>

            {/* Google Premier MCC Card */}
            <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-[#060608] p-5 shadow-xl flex items-center justify-between hover:border-amber-500/40 transition-all">
              <div>
                <div className="flex items-center gap-2">
                  <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Google Premier MCC</div>
                  <AnimatePresence mode="wait">
                    {stockDeltas.google && (
                      <motion.span
                        key={stockDeltas.google.key}
                        initial={{ opacity: 0, y: -6, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${
                          stockDeltas.google.value > 0
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : "bg-amber-500/10 text-amber-300 border-amber-500/30"
                        }`}
                      >
                        {stockDeltas.google.value > 0 ? `+${stockDeltas.google.value} Restocked` : `${stockDeltas.google.value} Allocated`}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={stock.google}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.25 }}
                      className="text-2xl font-black text-amber-300 font-mono inline-block"
                    >
                      {stock.google}
                    </motion.span>
                  </AnimatePresence>
                  <span className="text-2xl font-black text-white">Ready</span>
                </div>
                <div className="text-[10px] font-bold text-amber-300 mt-1 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" /> Handover: 2–6 hrs · Invoiced
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <SiGoogleads className="w-6 h-6" />
              </div>
            </div>

            {/* TikTok Business Line Card */}
            <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-[#060608] p-5 shadow-xl flex items-center justify-between hover:border-pink-500/40 transition-all">
              <div>
                <div className="flex items-center gap-2">
                  <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">TikTok Business Line</div>
                  <AnimatePresence mode="wait">
                    {stockDeltas.tiktok && (
                      <motion.span
                        key={stockDeltas.tiktok.key}
                        initial={{ opacity: 0, y: -6, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${
                          stockDeltas.tiktok.value > 0
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : "bg-amber-500/10 text-amber-300 border-amber-500/30"
                        }`}
                      >
                        {stockDeltas.tiktok.value > 0 ? `+${stockDeltas.tiktok.value} Restocked` : `${stockDeltas.tiktok.value} Allocated`}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={stock.tiktok}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.25 }}
                      className="text-2xl font-black text-pink-300 font-mono inline-block"
                    >
                      {stock.tiktok}
                    </motion.span>
                  </AnimatePresence>
                  <span className="text-2xl font-black text-white">Ready</span>
                </div>
                <div className="text-[10px] font-bold text-pink-400 mt-1 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" /> Handover: 2–4 hrs · Worldwide
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 shrink-0">
                <SiTiktok className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Live Inventory Activity Dispatch Ticker */}
          <div className="rounded-xl border border-zinc-800 bg-black/80 px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400" /> Live Vault Activity Stream:
              </span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={recentEvents[0]?.id || "feed"}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.3 }}
                  className="text-xs font-semibold text-zinc-300 truncate max-w-md md:max-w-xl"
                >
                  {recentEvents[0]?.text}
                </motion.span>
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-2 shrink-0 text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
              <RefreshCw className="w-3 h-3 text-cyan-400 animate-spin" style={{ animationDuration: "12s" }} /> Auto-syncing with UK &amp; US Vault
            </div>
          </div>
        </div>

        {/* SECTION 1: BENCHMARK ENGINE */}
        <div className="rounded-3xl border border-zinc-800 bg-[#060608] text-white p-8 md:p-10 shadow-2xl space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-cyan-400">
                <Award className="w-4 h-4" /> The Performance Benchmark
              </div>
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white mt-1">
                Why Campaigns Win on{" "}
                <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
                  RAZR Tier-1 Agency Accounts
                </span>
              </h2>
              <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
                Standard ad accounts compete in low-tier auction buckets with heavy bot traffic and risk penalties. Our agency lines operate in Meta & Google's highest priority bracket.
              </p>
            </div>
            <div className="px-4 py-2 rounded-xl bg-violet-500/10 border border-violet-500/30 text-cyan-300 text-xs font-bold shrink-0">
              ⚡ 99.4% Algorithm Trust Score
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-black/70 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">CPM Pricing</span>
                <span className="text-xs font-bold text-cyan-300">-40% Cheaper</span>
              </div>
              <div className="text-2xl font-black text-white font-mono">$11.40 <span className="text-xs font-normal text-zinc-600 line-through">$24.80</span></div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Whitelisted agency accounts bypass the Facebook "Risk Auction Penalty", lowering cost per thousand impressions by up to 50%.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-black/70 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Ad Review Time</span>
                <span className="text-xs font-bold text-emerald-400">Fast Auto-Pass</span>
              </div>
              <div className="text-2xl font-black text-white font-mono">5–15 Mins <span className="text-xs font-normal text-zinc-600 line-through">24–48h</span></div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Automated instant approvals directly through agency VIP queue. Test new creatives and launch offers without waiting all day.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-black/70 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Audience Quality</span>
                <span className="text-xs font-bold text-violet-300">Tier-1 Buyers</span>
              </div>
              <div className="text-2xl font-black text-white font-mono">VIP CDN <span className="text-xs font-normal text-zinc-600">Top 15%</span></div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Agency lines receive priority ad distribution to high-intent converting buyers rather than click-farm and bot segments.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-black/70 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Daily Spend Cap</span>
                <span className="text-xs font-bold text-cyan-300">Day 1 Velocity</span>
              </div>
              <div className="text-2xl font-black text-white font-mono">Uncapped <span className="text-xs font-normal text-zinc-600 line-through">$50/day</span></div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Scale straight to $5,000 to $20,000+/day on day one. Zero arbitrary spending ceilings or artificial throttling.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 2: INTERACTIVE CALCULATOR */}
        <div className="rounded-3xl border border-zinc-800 bg-[#060608] shadow-2xl p-6 md:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-zinc-800">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-cyan-400">
                <Gauge className="w-4 h-4" /> Interactive ROAS & Cost Simulator
              </div>
              <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white mt-1">
                Estimate Your Performance Boost &{" "}
                <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
                  CPM Savings
                </span>
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Calculate how many extra high-intent impressions and cost savings you unlock with RAZR Agency Tier-1 lines.
              </p>
            </div>

            {/* Sliders Input */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-2xl bg-black border border-zinc-800">
                <div className="flex justify-between text-xs font-bold text-zinc-300 mb-1.5">
                  <span className="uppercase text-[10px] text-zinc-500">Monthly Spend:</span>
                  <span className="font-mono text-cyan-300">${monthlyBudget.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="100000"
                  step="1000"
                  value={monthlyBudget}
                  onChange={(e) => setMonthlyBudget(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-black border border-zinc-800">
                <div className="flex justify-between text-xs font-bold text-zinc-300 mb-1.5">
                  <span className="uppercase text-[10px] text-zinc-500">Current Average CPM:</span>
                  <span className="font-mono text-white">${currentCpm}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  step="1"
                  value={currentCpm}
                  onChange={(e) => setCurrentCpm(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 text-center">
            <div className="p-4 rounded-2xl bg-black border border-zinc-800">
              <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Optimized Agency CPM</div>
              <div className="text-2xl font-black text-cyan-300 mt-1 font-mono">${estimatedAgencyCpm}</div>
              <div className="text-[10px] font-bold text-cyan-400 mt-1">~40% Lower Cost</div>
            </div>

            <div className="p-4 rounded-2xl bg-black border border-zinc-800">
              <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Extra Impressions Unlocked</div>
              <div className="text-2xl font-black text-white mt-1 font-mono">+{extraImpressions.toLocaleString()}</div>
              <div className="text-[10px] font-bold text-cyan-400 mt-1">More Reach with Same Budget</div>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-600/20 to-cyan-600/20 border border-violet-500/40">
              <div className="text-[10px] font-black uppercase tracking-widest text-cyan-300">Direct Ad Spend Value Saved</div>
              <div className="text-2xl font-black text-cyan-300 mt-1 font-mono">${estimatedCashSaved.toLocaleString()} / mo</div>
              <div className="text-[10px] font-bold text-cyan-400 mt-1">Reinvest in Scaling</div>
            </div>

            <div className="p-4 rounded-2xl bg-black border border-zinc-800">
              <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Expected ROAS Multiplier</div>
              <div className="text-2xl font-black text-white mt-1 font-mono">1.4x – 2.2x Lift</div>
              <div className="text-[10px] font-bold text-zinc-400 mt-1">Higher Conversion Yield</div>
            </div>
          </div>
        </div>

        {/* SECTION 3: UNIVERSAL VERTICAL MASTER MATRIX */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-cyan-400">
                <Globe2 className="w-4 h-4" /> Universal Compatibility Matrix
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tight text-white mt-1">
                Every Ad Vertical{" "}
                <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
                  Supported & Approved
                </span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Select your ad category below to see real-world benchmarks, recommended platforms, and scaling protocols.
              </p>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: "all", label: "All Niches" },
                { id: "ecom", label: "E-Com / DTC" },
                { id: "leadgen", label: "Lead Gen" },
                { id: "crypto", label: "Crypto / Web3" },
                { id: "nutra", label: "Nutra / Health" },
                { id: "apps", label: "Apps / Games" },
                { id: "info", label: "Info-Products" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveVerticalCategory(cat.id as any)}
                  className={"px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer " +
                    (activeVerticalCategory === cat.id
                      ? "bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-black shadow-md shadow-violet-500/20"
                      : "bg-black text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-800")}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Vertical Spec Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredVerticals.map((vert) => (
              <motion.div
                key={vert.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl border border-zinc-800 bg-[#060608] p-6 shadow-2xl hover:border-violet-500/40 transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-black text-white text-base uppercase tracking-tight">
                      {vert.name}
                    </h3>
                    <span className={"px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border shrink-0 " + vert.badgeColor}>
                      {vert.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div className="p-2.5 rounded-xl bg-black border border-zinc-800">
                      <div className="text-[9px] font-black uppercase text-zinc-500">Typical CPM</div>
                      <div className="font-mono font-bold text-white mt-0.5">{vert.cpmRange}</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-black border border-zinc-800">
                      <div className="text-[9px] font-black uppercase text-zinc-500">Expected ROAS / CPL</div>
                      <div className="font-mono font-bold text-cyan-300 mt-0.5">{vert.roasExpectation}</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-black border border-zinc-800 col-span-2">
                      <div className="text-[9px] font-black uppercase text-zinc-500">Optimal Platform Combination</div>
                      <div className="font-bold text-zinc-300 mt-0.5">{vert.bestPlatform}</div>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Key Execution Advantages</div>
                    {vert.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-zinc-400">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
                  <div className="text-[10px] text-zinc-400 font-bold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" /> Ad Approval: {vert.approvalSpeed}
                  </div>
                  <Link href="/app/application">
                    <span className="text-xs font-black text-cyan-400 hover:text-cyan-300 uppercase flex items-center gap-1 cursor-pointer">
                      Deploy Line <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* SECTION 4: DETAILED PLATFORM ACCOUNT TIERS */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-3">
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight text-white">
                Core Account Infrastructure Specifications
              </h2>
              <p className="text-xs text-zinc-400">Full technical breakdown of our Tier-1 lines across Meta, Google, and TikTok.</p>
            </div>
            {/* Filter Tabs */}
            <div className="flex items-center gap-2">
              {["all", "meta", "google", "tiktok"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={"px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer " +
                    (activeTab === tab
                      ? "bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-black shadow-md shadow-violet-500/20"
                      : "bg-[#060608] text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-800")}
                >
                  {tab === "all" ? "All Platforms" : tab.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {filteredTiers.map((tier) => {
              const Icon = tier.icon;
              return (
                <motion.div
                  key={tier.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-3xl border border-zinc-800 bg-[#060608] shadow-2xl p-6 md:p-8 overflow-hidden"
                >
                  {/* Top Title & Badge */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-black border border-zinc-800 flex items-center justify-center shrink-0 shadow-sm">
                        <Icon className={"w-8 h-8 " + tier.iconColor} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-lg md:text-xl font-black uppercase tracking-tight text-white">
                            {tier.name}
                          </h2>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-cyan-300 bg-violet-500/10 px-2.5 py-0.5 rounded-full border border-violet-500/30">
                            <Sparkles className="w-3 h-3 text-cyan-400" /> {tier.badge}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-cyan-300 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
                            <Gauge className="w-3 h-3 text-cyan-400" /> Trust Score: {tier.trustScore}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-300 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Vault Stock: {
                              tier.id.includes("meta") ? stock.meta : tier.id.includes("google") ? stock.google : stock.tiktok
                            } Ready
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-left md:text-right">
                        <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Daily Spend Capacity</div>
                        <div className="text-base font-black text-cyan-300 font-mono">{tier.spendLimit}</div>
                      </div>
                      <Link href="/app/application">
                        <span className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-95 hover:scale-105 text-white text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-violet-600/30 cursor-pointer">
                          Request Allocation
                        </span>
                      </Link>
                    </div>
                  </div>

                  {/* Key Technical Specs Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 py-6 border-b border-zinc-800 text-xs">
                    <div className="p-3.5 rounded-xl bg-black border border-zinc-800">
                      <div className="text-[9px] font-black uppercase tracking-widest text-zinc-500">BM / Account Infrastructure</div>
                      <div className="font-bold text-white mt-1">{tier.bmType}</div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-black border border-zinc-800">
                      <div className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Targeting & Geo</div>
                      <div className="font-bold text-white mt-1">{tier.region}</div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-black border border-zinc-800">
                      <div className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Billing & VAT Tax</div>
                      <div className="font-bold text-emerald-400 mt-1">{tier.taxRate}</div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-black border border-zinc-800">
                      <div className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Guaranteed Handover SLA</div>
                      <div className="font-bold text-white mt-1">{tier.handoverTime}</div>
                    </div>
                  </div>

                  {/* Features & Verticals Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-6">
                    {/* Features List */}
                    <div className="md:col-span-6 space-y-3">
                      <div className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-cyan-400" /> Platform Features & Capabilities
                      </div>
                      <div className="space-y-2">
                        {tier.features.map((feat, idx) => (
                          <div key={idx} className="flex items-start gap-2.5 text-xs text-zinc-400">
                            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Verticals */}
                    <div className="md:col-span-6 space-y-4">
                      <div>
                        <div className="text-xs font-black uppercase tracking-wider text-white mb-2.5 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Whitelisted Accepted Verticals
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {tier.allowedVerticals.map((vert, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold"
                            >
                              ✓ {vert}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-zinc-800">
                        <div className="text-[11px] font-black uppercase tracking-wider text-zinc-500 mb-1.5">
                          Strictly Prohibited
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {tier.restrictedVerticals.map((res, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[9px] font-semibold"
                            >
                              ✕ {res}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom Trust Guarantee Note */}
        <div className="rounded-3xl border border-zinc-800 bg-[#060608] p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400 shadow-xl">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-7 h-7 text-cyan-400 shrink-0" />
            <div>
              <div className="font-bold text-white uppercase">100% Guaranteed Tier-1 Enterprise Allocation</div>
              <div>Every account issued is fully pre-warmed, approved, and backed by our United Kingdom Agency Service Level Agreement.</div>
            </div>
          </div>
          <Link href="/app/guarantee">
            <span className="text-cyan-400 font-black uppercase hover:underline shrink-0 flex items-center gap-1 cursor-pointer">
              Read SLA Contract →
            </span>
          </Link>
        </div>
      </div>
    </ClientLayout>
  );
}
