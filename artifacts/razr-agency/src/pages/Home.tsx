import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import PageWrapper from "@/components/layout/PageWrapper";
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  Chip,
  Accordion,
  AccordionItem
} from "@heroui/react";
import {
  Zap,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Wallet,
  Activity,
  DollarSign,
  Layers,
  ShoppingBag,
  Building,
  HelpCircle,
  Lock,
  Headphones,
  FileCheck
} from "lucide-react";
import { SiMeta, SiGoogleads, SiTiktok } from "react-icons/si";

export default function Home() {
  const [selectedPlatform, setSelectedPlatform] = useState("meta");
  const [monthlySpend, setMonthlySpend] = useState(25000);

  // FX Savings calculation (Traditional agency / card ~4% vs 0% crypto)
  const fxSavings = Math.round(monthlySpend * 0.04);
  const potentialCashback = Math.round(monthlySpend * 0.015);

  const PLATFORMS = [
    {
      id: "meta",
      name: "Meta Ads (FB & IG)",
      icon: SiMeta,
      color: "#1877F2",
      badge: "Highest Volume",
      description: "Direct Whitelisted Agency Business Managers & Ad Accounts with unmetered daily spend ceilings.",
      features: [
        "Uncapped / $50k+ Daily Spend Threshold",
        "Direct Admin Role Invitation Link",
        "Multi-Pixel & Domain Sharing Enabled",
        "Fast-Track Creative Approval Pipeline",
        "Instant Replacement Protection Guarantee"
      ],
      ctaLink: "/app/application?platform=meta",
      priceTag: "Instant Clearance"
    },
    {
      id: "google",
      name: "Google Ads (Search & YT)",
      icon: SiGoogleads,
      color: "#4285F4",
      badge: "High Intent",
      description: "Premium Tier-1 Google MCC Agency Child Accounts ready for Search, YouTube & Performance Max campaigns.",
      features: [
        "Unmetered Daily Budget Allocation",
        "Whitelisted MCC Child Account Provisioning",
        "YouTube & PMax High Delivery Priority",
        "Zero 48h Billing Hold Delays",
        "Rapid Balance Portability on Suspension"
      ],
      ctaLink: "/app/application?platform=google",
      priceTag: "Instant Clearance"
    },
    {
      id: "tiktok",
      name: "TikTok Ads (BC)",
      icon: SiTiktok,
      color: "#FE2C55",
      badge: "Viral Scaling",
      description: "Enterprise TikTok Business Center lines engineered for rapid spark ads scaling and high-ROAS viral campaigns.",
      features: [
        "Uncapped Daily Spend Limit Ceiling",
        "Global Geographic Target Whitelisting",
        "Dedicated TikTok Agency Rep Escalation",
        "Spark Ads & Creator Marketplace Binding",
        "0% Foreign Transaction Currency Surcharge"
      ],
      ctaLink: "/app/application?platform=tiktok",
      priceTag: "Instant Clearance"
    }
  ];

  const FAQS = [
    {
      q: "How fast will I receive my Agency Ad Account or Business Manager?",
      a: "Once your application is submitted or your BM order is placed, your dedicated admin invite link is dispatched within 15 to 45 minutes directly inside your client dashboard vault."
    },
    {
      q: "How does funding work? Are there foreign transaction fees?",
      a: "You top up your central portal wallet with USDT (TRC20 or BEP20) with 0% foreign transaction fees. You can allocate funds into your ad accounts on demand with a low tiered service fee (1.5% - 3%)."
    },
    {
      q: "What happens if an ad account is flagged or suspended?",
      a: "All accounts include our Replacement Guarantee SLA. If an account is suspended without policy violation, 100% of your unspent balance is immediately transferred to a fresh replacement account with zero downtime."
    },
    {
      q: "Can I buy standalone Business Managers without an active ad account application?",
      a: "Yes! Our BM Marketplace allows you to buy BM3, Reinstated, and Enterprise Business Managers starting at $3 USDT with instant admin invite links and direct crypto checkout."
    },
    {
      q: "Do you require credit cards or bank transfers?",
      a: "No. All settlements are executed in USDT cryptocurrency, ensuring total privacy, zero bank FX markup, and instant 24/7 liquidity."
    }
  ];

  return (
    <PageWrapper>
      <div className="space-y-24 md:space-y-32 pb-24 overflow-hidden">
        
        {/* ========================================================= */}
        {/* HERO SECTION — HeroUI High-Impact Architecture */}
        {/* ========================================================= */}
        <section className="relative pt-6 md:pt-14 px-4 max-w-7xl mx-auto">
          {/* Ambient Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[900px] h-[350px] bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="text-center space-y-6 max-w-4xl mx-auto">
            {/* Top Chip Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center"
            >
              <Chip
                variant="shadow"
                color="success"
                size="md"
                className="font-black uppercase tracking-wider px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 backdrop-blur-md"
                startContent={<span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
              >
                ✦ TIER-1 AGENCY INFRASTRUCTURE
              </Chip>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-[1.05]"
            >
              Scale Media Spend With{" "}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                Uncapped Agency Lines
              </span>{" "}
              & 0% FX Fees
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed"
            >
              Deploy whitelisted Meta, Google & TikTok agency accounts in 15 minutes. Uncapped daily spend, direct admin invite links, and seamless USDT crypto settlement.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-4 pt-2"
            >
              <Link href="/signup">
                <Button
                  size="lg"
                  color="success"
                  variant="shadow"
                  className="px-8 py-6 font-black uppercase tracking-wider text-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-xl shadow-emerald-500/30 cursor-pointer"
                  endContent={<ArrowRight className="w-4 h-4" />}
                >
                  Apply for Agency Account
                </Button>
              </Link>

              <Link href="/app/buy-bm">
                <Button
                  size="lg"
                  variant="bordered"
                  className="px-8 py-6 font-black uppercase tracking-wider text-sm border-white/20 hover:border-white/40 text-white bg-white/5 backdrop-blur-md cursor-pointer"
                  startContent={<ShoppingBag className="w-4 h-4 text-emerald-400" />}
                >
                  Buy Business Manager ($3+)
                </Button>
              </Link>
            </motion.div>

            {/* Trust Strip Metrics */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-6 md:gap-12 pt-6 text-xs text-slate-400 font-bold uppercase tracking-wider"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Replacement SLA</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-teal-400" />
                <span>$0 Daily Spend Limit</span>
              </div>
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-cyan-400" />
                <span>0% Foreign Exchange Fees</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>~15 Min Fast-Track Setup</span>
              </div>
            </motion.div>
          </div>

          {/* Interactive Hero Dashboard Preview Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="mt-14 max-w-5xl mx-auto"
          >
            <Card
              className="bg-slate-900/90 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-slate-950/80 rounded-3xl p-6 md:p-8 overflow-hidden relative"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500" />

              {/* Header Bar of Mock Dashboard */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Live Agency Portfolio Status
                    </div>
                    <div className="text-lg font-black uppercase text-white flex items-center gap-2">
                      Enterprise Production Gateway <Chip size="sm" color="success" variant="flat" className="text-[10px] font-bold">ONLINE</Chip>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-right">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Settlement Currency</div>
                    <div className="text-sm font-black text-emerald-400 font-mono">USDT (TRC20 & BEP20)</div>
                  </div>
                </div>
              </div>

              {/* 3 Metric Columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 py-6">
                <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center justify-between">
                    <span>Daily Spend Capacity</span>
                    <Zap className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="text-3xl font-black text-white font-mono">$50,000+ / day</div>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase block">Uncapped Tier-1 Priority</span>
                </div>

                <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center justify-between">
                    <span>Replacement Guarantee</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                  </div>
                  <div className="text-3xl font-black text-white font-mono">100% Covered</div>
                  <span className="text-[10px] text-teal-400 font-bold uppercase block">Instant Balance Porting</span>
                </div>

                <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center justify-between">
                    <span>Telegram VIP Support</span>
                    <Headphones className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                  <div className="text-3xl font-black text-white font-mono">&lt; 12 Mins</div>
                  <span className="text-[10px] text-cyan-400 font-bold uppercase block">Direct Human Operations Desk</span>
                </div>
              </div>

              {/* Live Platform Status Badges */}
              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ready Channels:</span>
                  <Chip startContent={<SiMeta className="w-3.5 h-3.5 text-[#1877F2]" />} variant="flat" className="bg-white/5 text-white text-xs font-bold">
                    Meta Ads
                  </Chip>
                  <Chip startContent={<SiGoogleads className="w-3.5 h-3.5 text-[#4285F4]" />} variant="flat" className="bg-white/5 text-white text-xs font-bold">
                    Google Ads
                  </Chip>
                  <Chip startContent={<SiTiktok className="w-3.5 h-3.5 text-[#FE2C55]" />} variant="flat" className="bg-white/5 text-white text-xs font-bold">
                    TikTok Ads
                  </Chip>
                </div>

                <Link href="/app/dashboard">
                  <Button size="sm" color="success" variant="flat" className="font-bold text-xs">
                    View Live Portal <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>
        </section>


        {/* ========================================================= */}
        {/* SECTION 2 — HEROUI PLATFORM MATRIX & TABS */}
        {/* ========================================================= */}
        <section className="px-4 max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <Chip color="success" variant="dot" className="text-xs font-bold uppercase tracking-wider border-emerald-500/30 text-emerald-400">
              Multi-Channel Deployment
            </Chip>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white">
              Agency Lines For All Major Ad Networks
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Whitelisted agency accounts optimized for aggressive scaling, custom pixel integrations, and zero foreign transaction fees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            {PLATFORMS.map((plat) => {
              const Icon = plat.icon;
              return (
                <Card
                  key={plat.id}
                  isHoverable
                  className="bg-slate-900/70 backdrop-blur-xl border border-white/10 hover:border-emerald-500/40 transition-all rounded-3xl p-6 flex flex-col justify-between shadow-xl"
                >
                  <CardHeader className="flex flex-col items-start gap-3 p-0">
                    <div className="flex items-center justify-between w-full">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                        <Icon className="w-6 h-6" style={{ color: plat.color }} />
                      </div>
                      <Chip color="success" variant="flat" size="sm" className="text-[10px] font-black uppercase">
                        {plat.badge}
                      </Chip>
                    </div>
                    <div>
                      <h3 className="text-xl font-black uppercase tracking-tight text-white mt-2">
                        {plat.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {plat.description}
                      </p>
                    </div>
                  </CardHeader>

                  <CardContent className="py-6 px-0 space-y-2.5">
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Included Infrastructure
                    </div>
                    {plat.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </CardContent>

                  <CardFooter className="pt-4 border-t border-white/10 p-0 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Onboarding</div>
                      <div className="text-sm font-black text-emerald-400 font-mono">15-45 Mins</div>
                    </div>

                    <Link href={plat.ctaLink}>
                      <Button
                        size="md"
                        color="success"
                        variant="flat"
                        className="font-black uppercase text-xs cursor-pointer"
                        endContent={<ArrowUpRight className="w-3.5 h-3.5" />}
                      >
                        Apply Line
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </section>


        {/* ========================================================= */}
        {/* SECTION 3 — HEROUI COMPARISON GRID (OLD VS RAZR AGENCY) */}
        {/* ========================================================= */}
        <section className="px-4 max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <Chip color="danger" variant="dot" className="text-xs font-bold uppercase tracking-wider border-red-500/30 text-red-400">
              The Scaling Bottleneck
            </Chip>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white">
              Personal Ad Accounts vs Tier-1 Agency Infrastructure
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Why high-spending e-commerce and lead-gen brands migrate their entire media budget to our agency accounts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {/* Standard Personal / Freelancer Accounts */}
            <Card className="bg-red-950/20 backdrop-blur-xl border border-red-500/20 rounded-3xl p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/30">
                  <XCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight text-white">
                    Standard Personal & Direct Accounts
                  </h3>
                  <div className="text-xs text-red-400 font-bold uppercase">Severe Growth Friction</div>
                </div>
              </div>

              <div className="space-y-4 text-xs text-slate-300">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
                  <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-bold">$50 - $500 Daily Spend Limits</strong>
                    Artificial spending caps throttle scaling and kill winning creative momentum before learning phase finishes.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
                  <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-bold">Unannounced Account Freezes</strong>
                    Algorithmic suspensions freeze your working balance for 14-30 days with no replacement or human appeal.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
                  <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-bold">3% to 6% Foreign Bank FX Surcharges</strong>
                    Hidden card conversion fees drain thousands in profitability every single billing cycle.
                  </div>
                </div>
              </div>
            </Card>

            {/* Our Tier-1 Agency Accounts */}
            <Card className="bg-emerald-950/20 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-6 md:p-8 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight text-white">
                    Razr Agency Tier-1 Infrastructure
                  </h3>
                  <div className="text-xs text-emerald-400 font-bold uppercase">Zero-Cap Enterprise Speed</div>
                </div>
              </div>

              <div className="space-y-4 text-xs text-slate-300">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-bold">Uncapped Daily Spending Power</strong>
                    Scale campaigns from $500 to $50,000+/day smoothly with high delivery priority in the ad auction.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-bold">100% Replacement SLA Guarantee</strong>
                    Suspension protection ports remaining balances to a freshly provisioned account immediately.
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-bold">0% Foreign Transaction Markups (USDT)</strong>
                    Deposit and liquidate funds freely in USDT with precision accounting and zero bank card surcharges.
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>


        {/* ========================================================= */}
        {/* SECTION 4 — HEROUI INTERACTIVE FX SAVINGS CALCULATOR */}
        {/* ========================================================= */}
        <section className="px-4 max-w-5xl mx-auto">
          <Card className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="space-y-4 flex-1">
                <Chip color="success" variant="flat" size="sm" className="font-bold uppercase tracking-wider">
                  Liquidity & FX Profitability
                </Chip>
                <h3 className="text-2xl md:text-3xl font-black uppercase text-white tracking-tight">
                  Calculate Your FX Savings With Crypto Settlement
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed max-w-md">
                  Traditional credit cards impose 3.5% to 5.5% international cross-border conversion fees. With Razr Agency USDT funding, you retain 100% of your capital.
                </p>

                {/* Spend Presets */}
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">Estimated Monthly Ad Spend</label>
                  <div className="flex flex-wrap gap-2">
                    {[5000, 10000, 25000, 50000, 100000].map((amt) => (
                      <Button
                        key={amt}
                        size="sm"
                        variant={monthlySpend === amt ? "solid" : "bordered"}
                        color={monthlySpend === amt ? "success" : "default"}
                        onClick={() => setMonthlySpend(amt)}
                        className="font-mono font-bold text-xs"
                      >
                        ${amt.toLocaleString()}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Result Box */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center space-y-4 shrink-0 w-full md:w-80">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Annual FX Surcharges Saved
                  </div>
                  <div className="text-3xl md:text-4xl font-black text-emerald-400 font-mono mt-1">
                    ${(fxSavings * 12).toLocaleString()} <span className="text-xs text-slate-400 font-bold">/ yr</span>
                  </div>
                </div>

                <div className="h-px bg-white/10 w-full my-3" />

                <div className="text-left text-xs space-y-2 text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Monthly Spend:</span>
                    <span className="font-mono font-bold text-white">${monthlySpend.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Traditional Bank FX (4%):</span>
                    <span className="font-mono text-red-400 font-bold">-${fxSavings.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>Razr Agency FX Markup:</span>
                    <span>$0.00 (0%)</span>
                  </div>
                </div>

                <Link href="/signup">
                  <Button size="md" color="success" className="w-full font-black uppercase text-xs cursor-pointer">
                    Claim 0% FX Lines
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </section>


        {/* ========================================================= */}
        {/* SECTION 5 — HEROUI ACCORDION FAQ */}
        {/* ========================================================= */}
        <section className="px-4 max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <Chip color="success" variant="dot" className="text-xs font-bold uppercase tracking-wider border-emerald-500/30 text-emerald-400">
              Clear & Transparent Answers
            </Chip>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-400">
              Everything you need to know about our agency accounts, Business Managers, and onboarding workflow.
            </p>
          </div>

          <Accordion
            variant="splitted"
            className="gap-3"
            itemClasses={{
              base: "bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-lg rounded-2xl px-4",
              title: "text-white font-bold text-sm uppercase tracking-wider",
              content: "text-xs text-slate-300 leading-relaxed pb-4 font-normal"
            }}
          >
            {FAQS.map((faq, idx) => (
              <AccordionItem key={idx} aria-label={faq.q} title={faq.q}>
                {faq.a}
              </AccordionItem>
            ))}
          </Accordion>
        </section>


        {/* ========================================================= */}
        {/* SECTION 6 — FINAL HEROUI CONVERSION CTA BANNER */}
        {/* ========================================================= */}
        <section className="px-4 max-w-6xl mx-auto">
          <Card className="bg-gradient-to-r from-emerald-950/60 via-slate-900/90 to-slate-900/90 border border-emerald-500/30 p-8 md:p-14 rounded-3xl text-center space-y-6 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-2xl mx-auto space-y-4 relative z-10">
              <Chip color="success" variant="shadow" className="font-black uppercase text-xs px-3 py-1">
                ⚡ Instant VIP Provisioning
              </Chip>
              
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white leading-tight">
                Ready to Uncap Your Advertising Potential?
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed">
                Join high-performing e-commerce stores, affiliate teams, and lead generators deploying media through our Tier-1 agency infrastructure.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <Link href="/signup">
                  <Button
                    size="lg"
                    color="success"
                    variant="shadow"
                    className="px-8 py-6 font-black uppercase tracking-wider text-sm bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 cursor-pointer shadow-xl shadow-emerald-500/30"
                    endContent={<ArrowRight className="w-4 h-4" />}
                  >
                    Open Client Portal
                  </Button>
                </Link>

                <Link href="/app/buy-bm">
                  <Button
                    size="lg"
                    variant="bordered"
                    className="px-8 py-6 font-black uppercase tracking-wider text-sm text-white border-white/20 hover:border-white/40 cursor-pointer bg-white/5 backdrop-blur-md"
                  >
                    Explore BM Marketplace ($3+)
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </section>

      </div>
    </PageWrapper>
  );
}
