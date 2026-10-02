import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Clock,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ChevronDown,
  ChevronUp,
  PlusCircle,
  HelpCircle,
} from "lucide-react";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

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
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-95 hover:scale-105 text-white text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-violet-600/30 cursor-pointer"
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
          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black hover:bg-zinc-900 text-white text-xs font-black uppercase tracking-wider transition-all border border-zinc-800 cursor-pointer">
            <FileText className="w-3.5 h-3.5 text-cyan-400" /> Apply for Account
          </span>
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
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-violet-950/60 text-cyan-300 border border-violet-500/30 text-xs font-bold uppercase tracking-wider cursor-pointer">
            <Clock className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: "8s" }} /> Track Review
          </span>
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
          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-95 hover:scale-105 text-white text-xs font-black uppercase tracking-wider shadow-md shadow-violet-600/30 cursor-pointer">
            Claim Account Access <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>
      ) : null,
    },
  ];

  return (
    <SpotlightCard tone="violet-cyan" className="p-6 md:p-8 space-y-6 shadow-2xl backdrop-blur-xl">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-950/60 border border-violet-500/30 text-cyan-300 text-[10px] font-black uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Onboarding Roadmap
            </span>
            <span className="text-xs font-bold text-zinc-400">
              {completedSteps} of 4 Completed ({progressPct}%)
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white">
            How to Get Your Ad Account &{" "}
            <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
              Start Scaling
            </span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Follow these 4 simple steps to provision and launch your agency ad lines.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onOpenGuide && (
            <button
              type="button"
              onClick={onOpenGuide}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-black hover:bg-zinc-900 text-zinc-200 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer border border-zinc-800"
            >
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400" /> Step Guide
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 cursor-pointer transition-colors"
            title={isCollapsed ? "Expand Roadmap" : "Collapse Roadmap"}
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative z-10">
        <div className="w-full bg-black h-2.5 rounded-full overflow-hidden border border-zinc-800">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-violet-500 via-cyan-400 to-emerald-400 rounded-full"
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
                <SpotlightCard
                  key={step.num}
                  tone={isCurrent ? "cyber" : isCompleted ? "emerald" : "default"}
                  className={`p-5 flex flex-col justify-between transition-all ${
                    isCurrent ? "ring-1 ring-cyan-500/40" : ""
                  }`}
                >
                  <div className="space-y-3">
                    {/* Step number badge & status */}
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black ${
                          isCompleted
                            ? "bg-gradient-to-r from-violet-600 to-cyan-500 text-white"
                            : isCurrent
                            ? "bg-cyan-400 text-black ring-2 ring-cyan-500/50"
                            : "bg-zinc-900 text-zinc-500"
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-4 h-4 text-white" /> : step.num}
                      </div>

                      <span
                        className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          isCompleted
                            ? "bg-emerald-950/60 text-emerald-400 border-emerald-500/30"
                            : isCurrent
                            ? "bg-violet-950/60 text-cyan-300 border-violet-500/30 animate-pulse"
                            : "bg-black text-zinc-600 border-zinc-800"
                        }`}
                      >
                        {isCompleted ? "Completed" : isCurrent ? "Active Step" : "Upcoming"}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-black uppercase tracking-tight text-white">
                        {step.title}
                      </h3>
                      <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>

                  {step.action && <div className="pt-4 mt-2">{step.action}</div>}
                </SpotlightCard>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </SpotlightCard>
  );
}
