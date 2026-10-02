import { useState } from "react";
import ClientLayout from "@/components/layout/ClientLayout";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  ShieldCheck,
  Zap,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Flame,
  Layers,
  Sparkles,
  Sliders,
  DollarSign,
  Award,
  Target,
  BarChart2,
  Clock,
  Cpu,
  RefreshCw,
  ShoppingBag,
  Users,
  Coins,
  HeartPulse,
  Smartphone,
  GraduationCap
} from "lucide-react";

interface NicheStrategy {
  id: string;
  name: string;
  icon: any;
  platformCombo: string;
  scalingGoal: string;
  warmupDays: string;
  adStructure: string;
  complianceRule: string;
  stepByStep: string[];
}

const NICHE_STRATEGIES: NicheStrategy[] = [
  {
    id: "ecom",
    name: "E-Commerce & DTC Scaling",
    icon: ShoppingBag,
    platformCombo: "Meta ASC + TikTok Shop + Google PMax",
    scalingGoal: "$1,000 to $25,000+/day",
    warmupDays: "2 to 3 Days",
    adStructure: "Advantage+ Shopping Campaign (ASC) + 3 Dynamic Creative Tests (DCT)",
    complianceRule: "Clear refund policy in footer + valid return address + HTTPS domain",
    stepByStep: [
      "Bind Meta Pixel + CAPI with server-side gateway on Day 1.",
      "Launch 1 DCT (Dynamic Creative Test) with 3 hooks, 2 bodies, 2 CTAs at $100/day.",
      "Identify the winning hook, duplicate into an Advantage+ Shopping (ASC) campaign.",
      "Scale ASC budget by 40% every 6 hours during peak purchase windows."
    ]
  },
  {
    id: "leadgen",
    name: "High-Ticket Lead Generation",
    icon: Users,
    platformCombo: "Meta Instant Forms + Google Search Intent",
    scalingGoal: "100 to 1,000+ Qualified Leads/day",
    warmupDays: "1 to 2 Days",
    adStructure: "CBO Multi-Angle with Custom Instant Form & Conditional Logic",
    complianceRule: "Required opt-in consent checkbox + explicit privacy disclosure",
    stepByStep: [
      "Connect CRM webhook via Zapier/Make to capture lead events instantly.",
      "Launch Meta Instant Form campaign with Higher Intent (Review Step) enabled.",
      "Add Google Search Exact-Match campaign for brand and high-intent intent keywords.",
      "Scale CBO budget directly with 0 lead velocity limits."
    ]
  },
  {
    id: "crypto",
    name: "Crypto, Web3 & FinTech",
    icon: Coins,
    platformCombo: "Approved Meta Enterprise Line + Google Search MCC",
    scalingGoal: "$5,000 to $50,000+/day",
    warmupDays: "2 Days",
    adStructure: "Pre-cleared Educational / Analytical Video Hooks into Approved Pre-Landers",
    complianceRule: "Financial risk disclaimer + educational framing (No guaranteed return claims)",
    stepByStep: [
      "Deploy on our dedicated Approved Financial Agency Line.",
      "Use educational / technological angle creatives (e.g. platform features, ecosystem metrics).",
      "Bridge landing page configured with standard financial disclaimer footer.",
      "Direct human rep escalation on standby for instant ad-copy approval."
    ]
  },
  {
    id: "nutra",
    name: "Nutra, Skincare & Health",
    icon: HeartPulse,
    platformCombo: "Meta Tier-1 Line + TikTok Spark UGC",
    scalingGoal: "$2,000 to $20,000+/day",
    warmupDays: "3 Days",
    adStructure: "UGC Video Hooks + Clean Advertorial Bridge Page + Multi-Pixel Cluster",
    complianceRule: "No misleading before/after body zoom; focus on ingredients & lifestyle",
    stepByStep: [
      "Utilize creator UGC (User Generated Content) with authentic testimonial delivery.",
      "Route traffic through high-speed advertorial landing page.",
      "Cluster fallback pixels to preserve conversion learning across accounts.",
      "Scale ad sets horizontally across broad Tier-1 demographic interests."
    ]
  },
  {
    id: "apps",
    name: "Mobile Apps & Gaming",
    icon: Smartphone,
    platformCombo: "Google App Campaigns (UAC) + TikTok Business",
    scalingGoal: "10,000+ Daily Installs (Low CPI)",
    warmupDays: "1 Day",
    adStructure: "Universal App Campaign with 20 Video Assets & Deep-Link SDK",
    complianceRule: "Accurate gameplay footage + age rating compliance",
    stepByStep: [
      "Link Google Play / Apple App Store ID directly into agency account.",
      "Upload 20 varied aspect-ratio video assets (9:16, 16:9, 1:1).",
      "Let Google machine learning optimize for Target Cost Per Install (tCPI).",
      "Scale budget aggressively with 0 install volume caps."
    ]
  },
  {
    id: "info",
    name: "Info-Products & Coaching",
    icon: GraduationCap,
    platformCombo: "Meta CBO + YouTube In-Stream Ads",
    scalingGoal: "$3,000 to $30,000+/day",
    warmupDays: "2 Days",
    adStructure: "Long-Form VSL / Masterclass Registration Funnel with CAPI",
    complianceRule: "Average results disclaimer + authentic case study attribution",
    stepByStep: [
      "Deploy 3 video hooks addressing specific target audience pain-points.",
      "Direct to free masterclass / case study breakdown landing page.",
      "Retarget 50%+ video viewers with direct application / calendar booking ads.",
      "Ramp CBO budget to uncapped daily spend during launch windows."
    ]
  }
];

export default function ClientPlaybook() {
  const [targetBudget, setTargetBudget] = useState(2500);
  const [targetRoas, setTargetRoas] = useState(3.5);
  const [activeNicheTab, setActiveNicheTab] = useState("ecom");

  // Dynamic Warmup Schedule
  const day1 = Math.round(targetBudget * 0.15);
  const day2 = Math.round(targetBudget * 0.35);
  const day3 = Math.round(targetBudget * 0.65);
  const day4 = targetBudget;
  const day5Plus = Math.round(targetBudget * 1.5);

  // Projected Monthly Revenue
  const projectedMonthlySpend = targetBudget * 30;
  const projectedRevenue = Math.round(projectedMonthlySpend * targetRoas);
  const projectedProfit = projectedRevenue - projectedMonthlySpend;

  const currentNiche = NICHE_STRATEGIES.find((n) => n.id === activeNicheTab) || NICHE_STRATEGIES[0];

  return (
    <ClientLayout>
      <div className="space-y-10">
        {/* Header Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-[#060608] p-8 md:p-10 shadow-2xl backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-cyan-300 text-xs font-bold uppercase tracking-widest mb-3 shadow-sm">
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" /> Institutional Media Buying Blueprint
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white">
                Agency Scaling Playbook &{" "}
                <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
                  Anti-Ban Warmup
                </span>
              </h1>
              <p className="text-sm text-zinc-300 mt-2 max-w-2xl leading-relaxed">
                Step-by-step master strategies to run <span className="font-bold text-cyan-300">every type of ad profitably</span>, safely scale budgets from $100 to $25,000+/day, and leverage high agency trust scores for maximum ROAS.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link href="/app/specs">
                <span className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-black hover:bg-zinc-900 text-white border border-zinc-800 text-xs font-black uppercase tracking-widest transition-all cursor-pointer">
                  Account Specs
                </span>
              </Link>
              <Link href="/app/guarantee">
                <span className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-95 hover:scale-105 text-white text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-violet-600/30 cursor-pointer">
                  View SLA Guarantee <ArrowUpRight className="w-4 h-4" />
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* SECTION 1: THE AUCTION QUALITY & CPM FORMULA */}
        <div className="rounded-3xl border border-zinc-800 bg-[#060608] text-white p-8 md:p-10 shadow-2xl space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-cyan-400">
                <Cpu className="w-4 h-4" /> The Auction Engineering Edge
              </div>
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white mt-1">
                How Our Accounts Get Lower CPMs &{" "}
                <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
                  Better Buyers
                </span>
              </h2>
              <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
                Meta & Google auction algorithms decide your CPM and buyer quality based on the official formula:
              </p>
            </div>
            <div className="px-4 py-2 rounded-xl bg-violet-500/10 border border-violet-500/30 text-cyan-300 text-xs font-bold shrink-0 font-mono">
              Total Value = [Bid × Action Rate] + Ad Quality
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
            <div className="p-6 rounded-2xl bg-black/70 border border-zinc-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/20 text-cyan-300 flex items-center justify-center font-bold font-mono">
                01
              </div>
              <h3 className="text-base font-black uppercase text-white tracking-tight">High BM Trust Multiplier</h3>
              <p className="text-zinc-300 leading-relaxed">
                Personal ad accounts start with a neutral or negative risk rating, forcing the algorithm to inflate CPMs by 40%+. Our aged agency accounts have a top-tier 9.9/10 Trust Rating.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-black/70 border border-zinc-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold font-mono">
                02
              </div>
              <h3 className="text-base font-black uppercase text-white tracking-tight">VIP CDN Buyer Allocation</h3>
              <p className="text-zinc-300 leading-relaxed">
                Platforms segment audiences into High-Intent Converters (users who buy frequently) and Scrap Clickers (low intent). Tier-1 agency accounts get first-look access to top converters.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-black/70 border border-zinc-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold font-mono">
                03
              </div>
              <h3 className="text-base font-black uppercase text-white tracking-tight">Zero Daily Spend Caps</h3>
              <p className="text-zinc-300 leading-relaxed">
                When you hit a winning creative, normal accounts throttle spend at $50 or $250/day. Our accounts allow immediate scaling to $10k–$50k/day without hitting artificial ceilings.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 2: NICHE-SPECIFIC MEDIA BUYING BLUEPRINTS */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-cyan-400">
                <Target className="w-4 h-4" /> Specialized Execution Blueprints
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tight text-white mt-1">
                Ad Strategy Blueprints by{" "}
                <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
                  Niche & Vertical
                </span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Select your industry below for step-by-step campaign architecture and compliance recommendations.
              </p>
            </div>

            {/* Niche Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              {NICHE_STRATEGIES.map((strat) => {
                const Icon = strat.icon;
                return (
                  <button
                    key={strat.id}
                    onClick={() => setActiveNicheTab(strat.id)}
                    className={"px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 " +
                      (activeNicheTab === strat.id
                        ? "bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-black shadow-md shadow-violet-500/20"
                        : "bg-black text-zinc-400 hover:bg-zinc-900 hover:text-white border border-zinc-800")}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{strat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Niche Blueprint Card */}
          <motion.div
            key={currentNiche.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-zinc-800 bg-[#060608] p-6 md:p-8 shadow-2xl space-y-6"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-violet-600/20 to-cyan-600/20 border border-violet-500/30 text-cyan-300 flex items-center justify-center shrink-0">
                  <currentNiche.icon className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight text-white">
                    {currentNiche.name} Master Protocol
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold text-zinc-300 uppercase bg-black px-2.5 py-0.5 rounded-full border border-zinc-800">
                      Platforms: {currentNiche.platformCombo}
                    </span>
                    <span className="text-[10px] font-bold text-cyan-300 uppercase bg-violet-500/10 border border-violet-500/30 px-2.5 py-0.5 rounded-full">
                      Target Scale: {currentNiche.scalingGoal}
                    </span>
                  </div>
                </div>
              </div>

              <Link href="/app/application">
                <span className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-95 hover:scale-105 text-white text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-violet-600/30 shrink-0 cursor-pointer">
                  Deploy {currentNiche.name} Line <ArrowUpRight className="w-4 h-4" />
                </span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Campaign Architecture */}
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-black border border-zinc-800 space-y-2">
                  <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Recommended Campaign Structure</div>
                  <div className="text-xs font-bold text-white leading-relaxed">{currentNiche.adStructure}</div>
                </div>

                <div className="p-4 rounded-2xl bg-violet-950/20 border border-violet-500/30 space-y-2">
                  <div className="text-[10px] font-black uppercase tracking-widest text-cyan-400">Compliance & Protection Standard</div>
                  <div className="text-xs font-bold text-zinc-200 leading-relaxed">{currentNiche.complianceRule}</div>
                </div>
              </div>

              {/* Step by Step Execution Ladder */}
              <div className="space-y-2.5">
                <div className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Step-by-Step Execution Sequence
                </div>
                {currentNiche.stepByStep.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-black border border-zinc-800 text-xs text-zinc-300">
                    <span className="w-5 h-5 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* SECTION 3: INTERACTIVE WARMUP CALCULATOR & PROFIT SIMULATOR */}
        <div className="rounded-3xl border border-zinc-800 bg-[#060608] shadow-2xl p-6 md:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-zinc-800">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-cyan-400">
                <Sliders className="w-4 h-4" /> Interactive Ramp & ROI Simulator
              </div>
              <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white mt-1">
                Custom Warmup Schedule &{" "}
                <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
                  Revenue Forecast
                </span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Enter your target daily budget and expected ROAS to generate your customized safety ramp and projected monthly returns.
              </p>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-black border border-zinc-800">
                <div className="flex justify-between text-xs font-bold text-zinc-300 mb-1">
                  <span className="uppercase text-[10px] text-zinc-400">Target Daily Spend:</span>
                  <span className="font-mono text-cyan-300">${targetBudget.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="25000"
                  step="100"
                  value={targetBudget}
                  onChange={(e) => setTargetBudget(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-black border border-zinc-800">
                <div className="flex justify-between text-xs font-bold text-zinc-300 mb-1">
                  <span className="uppercase text-[10px] text-zinc-400">Target ROAS:</span>
                  <span className="font-mono text-cyan-300">{targetRoas}x</span>
                </div>
                <input
                  type="range"
                  min="1.5"
                  max="6.0"
                  step="0.1"
                  value={targetRoas}
                  onChange={(e) => setTargetRoas(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Ramp Schedule Days */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-6 text-center">
            <div className="p-4 rounded-2xl bg-black border border-zinc-800">
              <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Day 1 (Asset Test)</div>
              <div className="text-xl font-black text-white mt-1 font-mono">{"$" + day1}</div>
              <div className="text-[9px] text-cyan-400 font-bold mt-1">Pixel Binding</div>
            </div>
            <div className="p-4 rounded-2xl bg-black border border-zinc-800">
              <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Day 2 (Validation)</div>
              <div className="text-xl font-black text-white mt-1 font-mono">{"$" + day2}</div>
              <div className="text-[9px] text-cyan-400 font-bold mt-1">Ad Set Calibration</div>
            </div>
            <div className="p-4 rounded-2xl bg-black border border-zinc-800">
              <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Day 3 (CBO Scaling)</div>
              <div className="text-xl font-black text-white mt-1 font-mono">{"$" + day3}</div>
              <div className="text-[9px] text-cyan-400 font-bold mt-1">Broad Expansion</div>
            </div>
            <div className="p-4 rounded-2xl bg-violet-950/20 border border-violet-500/30">
              <div className="text-[10px] font-black uppercase tracking-widest text-cyan-400">Day 4 (Target Velocity)</div>
              <div className="text-xl font-black text-cyan-300 mt-1 font-mono">{"$" + day4}</div>
              <div className="text-[9px] text-cyan-400 font-bold mt-1">Full Spend</div>
            </div>
            <div className="p-4 rounded-2xl bg-black border border-zinc-800 text-white col-span-2 sm:col-span-1">
              <div className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Day 5+ (Uncapped)</div>
              <div className="text-xl font-black text-white mt-1 font-mono">{"$" + day5Plus + "+"}</div>
              <div className="text-[9px] text-zinc-400 font-bold mt-1">Horizontal Scale</div>
            </div>
          </div>

          {/* Revenue Forecast Bar */}
          <div className="mt-6 p-5 rounded-2xl bg-black border border-zinc-800 text-white flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <BarChart2 className="w-6 h-6 text-cyan-400 shrink-0" />
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Estimated Monthly Performance (30 Days)</div>
                <div className="text-lg font-black text-white mt-0.5">
                  Spend: <span className="font-mono text-zinc-300">${projectedMonthlySpend.toLocaleString()}</span> ➔ Projected Revenue: <span className="font-mono text-cyan-300">${projectedRevenue.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600/20 to-cyan-600/20 border border-violet-500/40 text-cyan-300 font-mono font-black text-sm shrink-0">
              Est. Profit: +${projectedProfit.toLocaleString()}
            </div>
          </div>
        </div>

        {/* SECTION 4: 4 GOLDEN LONGEVITY RULES */}
        <div className="rounded-3xl border border-zinc-800 bg-[#060608] text-white p-8 md:p-10 space-y-6 shadow-2xl">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-cyan-400" />
            <div>
              <h3 className="text-lg font-black uppercase tracking-tight">
                The 4 Golden Rules of{" "}
                <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
                  Long-Term Longevity
                </span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">Follow these core media buying standards to keep your agency lines running for months without interruption.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-black/70 border border-zinc-800 space-y-1.5">
              <div className="text-cyan-400 font-black uppercase text-[10px]">1. Clean Landing Pages</div>
              <p className="text-zinc-300 leading-relaxed">Ensure privacy policy, terms, and working contact pages exist on all landing page domains.</p>
            </div>

            <div className="p-4 rounded-2xl bg-black/70 border border-zinc-800 space-y-1.5">
              <div className="text-violet-400 font-black uppercase text-[10px]">2. Creative Compliance</div>
              <p className="text-zinc-300 leading-relaxed">Avoid exaggerated before/after images and deceptive clickbait text in headlines.</p>
            </div>

            <div className="p-4 rounded-2xl bg-black/70 border border-zinc-800 space-y-1.5">
              <div className="text-amber-400 font-black uppercase text-[10px]">3. Balance Vigilance</div>
              <p className="text-zinc-300 leading-relaxed">Keep ad account balance funded above $50 to prevent payment threshold failures.</p>
            </div>

            <div className="p-4 rounded-2xl bg-black/70 border border-zinc-800 space-y-1.5">
              <div className="text-emerald-400 font-black uppercase text-[10px]">4. Escalation Line</div>
              <p className="text-zinc-300 leading-relaxed">Message your assigned account executive immediately if an ad creative is rejected.</p>
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}
