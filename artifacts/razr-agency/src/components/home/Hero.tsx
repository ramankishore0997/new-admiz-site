import React from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, ShieldCheck, Zap, Headphones, CheckCircle2 } from "lucide-react";
import { SiTelegram, SiMeta, SiGoogle, SiTiktok } from "react-icons/si";
import { ShimmerButton } from "@/components/ui/ShimmerButton";
import { MagneticButton } from "@/components/ui/MagneticButton";
import AnimatedGradientBackground from "@/components/ui/animated-gradient-background";

const TELEGRAM_URL = "https://t.me/RazrMarketing";

export default function Hero() {
  return (
    <section className="relative pt-16 pb-20 md:pt-28 md:pb-32 overflow-hidden bg-transparent text-white">
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Multi-Color Live Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-violet-500/40 bg-[#0A0515] mb-6 shadow-[0_0_20px_rgba(139,92,246,0.3)]"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.9)]" />
            </span>
            <span className="text-[11px] font-black uppercase tracking-[0.2em] bg-gradient-to-r from-violet-300 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">
              UK Enterprise Allocation · Direct Tier-1 Lines
            </span>
          </motion.div>

          {/* Multi-Color Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.92] text-white mb-6"
          >
            <span className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              Scale Uncapped.
            </span> <br />
            <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(6,182,212,0.4)]">
              Zero Daily Limits.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto leading-relaxed mb-10"
          >
            Agency-grade <span className="text-cyan-300 font-bold">Meta</span>, <span className="text-amber-300 font-bold">Google</span> &amp; <span className="text-pink-300 font-bold">TikTok</span> advertising infrastructure. Whitelisted ASN IP pools, 0% billing tax, and instant free replacements.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link href="/signup">
              <ShimmerButton className="w-full sm:w-auto">
                <span>Claim Agency Line</span>
                <ArrowRight className="w-4 h-4 text-cyan-300" />
              </ShimmerButton>
            </Link>

            <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer">
              <MagneticButton className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border border-zinc-800 bg-[#0A0A0E] hover:bg-zinc-900 hover:border-violet-500/50 text-white text-xs font-black uppercase tracking-widest gap-2 shadow-md">
                <SiTelegram className="w-4 h-4 text-[#229ED9]" />
                <span className="bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent">Telegram VIP Concierge</span>
              </MagneticButton>
            </a>
          </motion.div>

          {/* Luxury Institutional Trust Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="pt-8 border-t border-zinc-900 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-zinc-400 font-medium"
          >
            <div className="flex items-center gap-2">
              <SiMeta className="w-4 h-4 text-[#1877F2]" />
              <span className="text-zinc-300 font-bold uppercase tracking-wider text-[11px]">Meta Tier-1 Partner</span>
            </div>
            <div className="flex items-center gap-2">
              <SiGoogle className="w-4 h-4 text-[#EA4335]" />
              <span className="text-zinc-300 font-bold uppercase tracking-wider text-[11px]">Google Premier MCC</span>
            </div>
            <div className="flex items-center gap-2">
              <SiTiktok className="w-4 h-4 text-white" />
              <span className="text-zinc-300 font-bold uppercase tracking-wider text-[11px]">TikTok Global Agency</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-zinc-300 font-bold uppercase tracking-wider text-[11px]">100% Capital Insured</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
