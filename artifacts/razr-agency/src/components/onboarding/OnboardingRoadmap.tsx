import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  FileText,
  Clock,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ShieldCheck,
  PlusCircle,
  HelpCircle,
  PlayCircle
} from "lucide-react";

interface OnboardingRoadmapProps {
  walletBalance: number;
  hasPayments: boolean;
  applications: any[];
  onOpenDeposit: () => void;
  onOpenGuide?: () => void;
}

export default function OnboardingRoadmap({
  walletBalance,
  hasPayments,
  applications,
  onOpenDeposit,
  onOpenGuide
}: OnboardingRoadmapProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Step Completion Logic
  const isStep1Done = walletBalance > 0 || hasPayments;
  const isStep2Done = applications.length > 0;
  const approvedApp = applications.find((a) => a.status === "APPROVED");
  const isStep3Done = !!approvedApp;
  const isStep4Done = isStep3Done && applications.some((a) => a.bmAccessGranted);

  // Calculate overall progress percentage
  let completedSteps = 0;
  if (isStep1Done) completedSteps++;
  if (isStep2Done) completedSteps++;
  if (isStep3Done) completedSteps++;
  if (isStep4Done) completedSteps++;

  const progressPct = Math.round((completedSteps / 4) * 100);

  // Determine current active step (1 to 4)
  const currentStep = !isStep1Done ? 1 : !isStep2Done ? 2 : !isStep3Done ? 3 : 4;

  const STEPS = [
    {
      num: 1,
      title: "Deposit USDT Funds",
      desc: isStep1Done
        ? `Completed ($${walletBalance.toFixed(2)} USDT available in wallet)`
        : "Top up your main wallet with USDT (TRC20/BEP20). Balance is 100% usable for ad spend.",
      isDone: isStep1Done,
      isActive: currentStep === 1,
      action: !isStep1Done ? (
        <button
          type="button"
          onClick={onOpenDeposit}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5" /> Deposit Funds
        </button>
      ) : null,
    },
    {
      num: 2,
      title: "Apply for Ad Account",
      desc: isStep2Done
        ? `Application Submitted (${applications[0]?.platform || "Meta Ads"})`
        : "Submit your ad account specs (platform, timezone, website URL, and BM ID).",
      isDone: isStep2Done,
      isActive: currentStep === 2,
      action: !isStep2Done ? (
        <Link href="/app/application">
          <a className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer">
            <FileText className="w-3.5 h-3.5" /> Apply for Account
          </a>
        </Link>
      ) : null,
    },
    {
      num: 3,
      title: "Fast Whitelist & Review",
      desc: isStep3Done
        ? "Compliance Approved & Ad Account Whitelisted"
        : isStep2Done
        ? "Our team is reviewing your compliance specs (Avg. 15–30 mins)."
        : "Compliance clearance & agency line allocation by admin team.",
      isDone: isStep3Done,
      isActive: currentStep === 3,
      action: isStep2Done && !isStep3Done ? (
        <Link href="/app/application">
          <a className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" style={{ animationDuration: "8s" }} /> Track Review
          </a>
        </Link>
      ) : null,
    },
    {
      num: 4,
      title: "Accept Access & Scale",
      desc: isStep4Done
        ? "Access active! Your agency lines are running without spend caps."
        : "Accept the admin invite link in your Business Manager and launch campaigns.",
      isDone: isStep4Done,
      isActive: currentStep === 4,
      action: isStep3Done && !isStep4Done ? (
        <Link href="/app/application">
          <a className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider shadow-md">
            Claim Account Access <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </Link>
      ) : null,
    },
  ];

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm space-y-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-black uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Onboarding Roadmap
            </span>
            <span className="text-xs font-bold text-slate-500">
              {completedSteps} of 4 Completed ({progressPct}%)
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-slate-900">
            How to Get Your Ad Account <span className="text-emerald-600">& Start Scaling</span>
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Follow these 4 simple steps to provision and launch your agency ad lines.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onOpenGuide && (
            <button
              type="button"
              onClick={onOpenGuide}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-slate-600" /> Step Guide
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 cursor-pointer transition-colors"
            title={isCollapsed ? "Expand Roadmap" : "Collapse Roadmap"}
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative z-10">
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
          />
        </div>
      </div>

      {/* Step Cards Grid */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10 pt-2"
          >
            {STEPS.map((step) => {
              const isCompleted = step.isDone;
              const isCurrent = step.isActive;

              return (
                <div
                  key={step.num}
                  className={`rounded-2xl p-5 flex flex-col justify-between border transition-all ${
                    isCompleted
                      ? "bg-emerald-50/50 border-emerald-200 shadow-xs"
                      : isCurrent
                      ? "bg-white border-slate-900 shadow-md ring-2 ring-slate-900/5"
                      : "bg-slate-50/60 border-slate-200 opacity-80"
                  }`}
                >
                  <div className="space-y-3">
                    {/* Step number badge & status */}
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black ${
                          isCompleted
                            ? "bg-emerald-600 text-white shadow-xs"
                            : isCurrent
                            ? "bg-slate-900 text-white shadow-xs"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : step.num}
                      </div>

                      <span
                        className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          isCompleted
                            ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                            : isCurrent
                            ? "bg-blue-50 text-blue-700 border-blue-200 animate-pulse"
                            : "bg-slate-100 text-slate-500 border-slate-200"
                        }`}
                      >
                        {isCompleted ? "Completed" : isCurrent ? "Active Step" : "Upcoming"}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">
                        {step.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>

                  {step.action && <div className="pt-4 mt-2">{step.action}</div>}
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
