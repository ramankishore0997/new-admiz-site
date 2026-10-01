import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SiTelegram } from "react-icons/si";
import { X, Zap, ShieldCheck, DollarSign, ExternalLink, Headphones, ArrowRight } from "lucide-react";
import { PAYMENT_CONFIG } from "@/config/payment";

const TELEGRAM_URL = PAYMENT_CONFIG.telegramSupportUrl || "https://t.me/RazrMarketing";

export default function TelegramFloatingButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Expanded Quick Help Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-3 w-80 rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/15 overflow-hidden text-slate-900"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#229ED9] to-[#0088cc] p-4 text-white relative">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-3.5 right-3.5 p-1 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/90">
                  Dedicated VIP Concierge
                </span>
              </div>
              <h4 className="text-sm font-black uppercase tracking-tight">Razr Telegram Support</h4>
              <p className="text-[11px] text-white/80 mt-0.5">Average reply time under 5 minutes</p>
            </div>

            {/* Quick Actions List */}
            <div className="p-3 space-y-1.5 bg-slate-50/50">
              <a
                href={TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-xl bg-white hover:bg-emerald-50 border border-slate-200/80 hover:border-emerald-200 transition-all text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-700">Raise Ad Spend Limits</div>
                    <div className="text-[10px] text-slate-500">Instant limit boost & uncapped scaling</div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
              </a>

              <a
                href={TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-xl bg-white hover:bg-cyan-50 border border-slate-200/80 hover:border-cyan-200 transition-all text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-cyan-100 flex items-center justify-center text-cyan-600">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-cyan-700">Fast Deposit Clearance</div>
                    <div className="text-[10px] text-slate-500">Immediate USDT confirmation & balance load</div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-600 group-hover:translate-x-0.5 transition-transform" />
              </a>

              <a
                href={TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-xl bg-white hover:bg-purple-50 border border-slate-200/80 hover:border-purple-200 transition-all text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-purple-700">Instant Asset Replacement</div>
                    <div className="text-[10px] text-slate-500">&lt;15 min balance migration & fresh BM</div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>

            {/* Bottom Direct Button */}
            <div className="p-3 border-t border-slate-200 bg-white">
              <a
                href={TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#229ED9] hover:bg-[#1a8bc2] text-white text-xs font-black uppercase tracking-wider transition-colors shadow-sm"
              >
                <SiTelegram className="w-4 h-4" />
                <span>Open Direct Telegram Line</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Floating Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#229ED9] hover:bg-[#1b8ec3] text-white shadow-xl shadow-[#229ED9]/30 hover:shadow-2xl hover:shadow-[#229ED9]/40 transition-all duration-300 group cursor-pointer border border-white/20 hover:scale-105 active:scale-95"
        aria-label="Open Telegram Support"
      >
        <div className="relative">
          <SiTelegram className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
          </span>
        </div>
        <div className="flex flex-col text-left">
          <span className="text-xs font-black uppercase tracking-wider leading-tight">Telegram Support</span>
          <span className="text-[9px] text-cyan-100 font-medium leading-none">Online · Avg &lt; 5m</span>
        </div>
      </button>
    </div>
  );
}
