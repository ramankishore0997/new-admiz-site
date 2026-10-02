import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ExternalLink,
  Copy,
  CheckCircle2,
  HelpCircle,
  Building,
  Sparkles,
  Info,
  ShieldCheck
} from "lucide-react";
import { SiMeta } from "react-icons/si";
import { useToast } from "@/hooks/use-toast";

interface BmGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BmGuideModal({ isOpen, onClose }: BmGuideModalProps) {
  const { toast } = useToast();

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard.`,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-2xl rounded-3xl border border-zinc-800 bg-[#060608] p-6 md:p-8 overflow-hidden shadow-2xl z-10 space-y-6"
          >
            {/* Top decorative gradient bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-violet-500 via-cyan-400 to-emerald-400" />

            <div className="flex items-start justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-cyan-300 text-[10px] font-black uppercase tracking-wider mb-2">
                  <SiMeta className="w-3.5 h-3.5 text-[#1877F2]" /> Visual Guide
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight text-white">
                  How to Find Your Meta Business Manager <span className="bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent">(BM) ID</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Follow these 3 quick steps to locate your 15–16 digit Meta Business Manager ID.
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 3 Step Walkthrough Cards */}
            <div className="space-y-3.5">
              {/* Step 1 */}
              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-black border border-zinc-800">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-md shadow-violet-500/20">
                  1
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black uppercase text-white tracking-wide">
                      Open Meta Business Settings
                    </h4>
                    <a
                      href="https://business.facebook.com/settings"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-400 hover:underline"
                    >
                      Open Settings <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Log in to your Facebook profile and navigate to <strong className="text-zinc-200">business.facebook.com/settings</strong>.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-black border border-zinc-800">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-black flex items-center justify-center font-black text-sm shrink-0 shadow-md shadow-cyan-500/20">
                  2
                </div>
                <div className="space-y-1 flex-1">
                  <h4 className="text-xs font-black uppercase text-white tracking-wide">
                    Click "Business Info" in Left Sidebar
                  </h4>
                  <p className="text-xs text-zinc-400">
                    Scroll all the way down the left-hand navigation menu and click on <strong className="text-zinc-200">Business Info</strong> (the last menu item).
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-black border border-zinc-800">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-md shadow-purple-500/20">
                  3
                </div>
                <div className="space-y-2 flex-1">
                  <h4 className="text-xs font-black uppercase text-white tracking-wide">
                    Copy Your Business Manager ID
                  </h4>
                  <p className="text-xs text-zinc-400">
                    Under the <strong className="text-zinc-200">Business Manager Info</strong> heading at the top, you will see <strong className="text-zinc-200">Business Manager ID:</strong> followed by a 15–16 digit number.
                  </p>
                  <div className="p-3 rounded-xl bg-[#0c0c10] border border-zinc-800 flex items-center justify-between gap-2">
                    <span className="text-xs font-mono font-bold text-white">
                      Example: <span className="text-cyan-300">102938475619283</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy("102938475619283", "Example BM ID")}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black hover:bg-zinc-800 text-[10px] font-bold text-zinc-300 cursor-pointer transition-colors border border-zinc-800"
                    >
                      <Copy className="w-3 h-3" /> Copy Example
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Pro Tip Callout */}
            <div className="p-3.5 rounded-2xl bg-violet-500/10 border border-violet-500/30 flex items-start gap-3 text-xs text-cyan-200">
              <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white">Don't have a Business Manager yet?</span> You can buy an active institutional Business Manager directly from our <a href="/app/buy-bm" className="underline font-bold text-cyan-300">BM Store</a> starting at $7 USDT with instant delivery.
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-95 hover:scale-105 text-white text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-violet-600/30 cursor-pointer font-black"
              >
                Got It, Thanks!
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
