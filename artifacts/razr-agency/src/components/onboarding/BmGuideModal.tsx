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
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 md:p-8 overflow-hidden shadow-2xl z-10 space-y-6"
          >
            {/* Top decorative gradient bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-emerald-600 to-teal-500" />

            <div className="flex items-start justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-black uppercase tracking-wider mb-2">
                  <SiMeta className="w-3.5 h-3.5 text-[#1877F2]" /> Visual Guide
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight text-slate-900">
                  How to Find Your Meta Business Manager (BM) ID
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Follow these 3 quick steps to locate your 15–16 digit Meta Business Manager ID.
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 3 Step Walkthrough Cards */}
            <div className="space-y-3.5">
              {/* Step 1 */}
              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-md shadow-blue-600/20">
                  1
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black uppercase text-slate-900 tracking-wide">
                      Open Meta Business Settings
                    </h4>
                    <a
                      href="https://business.facebook.com/settings"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline"
                    >
                      Open Settings <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <p className="text-xs text-slate-600">
                    Log in to your Facebook profile and navigate to <strong>business.facebook.com/settings</strong>.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-md shadow-emerald-600/20">
                  2
                </div>
                <div className="space-y-1 flex-1">
                  <h4 className="text-xs font-black uppercase text-slate-900 tracking-wide">
                    Click "Business Info" in Left Sidebar
                  </h4>
                  <p className="text-xs text-slate-600">
                    Scroll all the way down the left-hand navigation menu and click on <strong>Business Info</strong> (the last menu item).
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-md shadow-teal-600/20">
                  3
                </div>
                <div className="space-y-2 flex-1">
                  <h4 className="text-xs font-black uppercase text-slate-900 tracking-wide">
                    Copy Your Business Manager ID
                  </h4>
                  <p className="text-xs text-slate-600">
                    Under the <strong>Business Manager Info</strong> heading at the top, you will see <strong>Business Manager ID:</strong> followed by a 15–16 digit number.
                  </p>
                  <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-2">
                    <span className="text-xs font-mono font-bold text-slate-900">
                      Example: <span className="text-emerald-600">102938475619283</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy("102938475619283", "Example BM ID")}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[10px] font-bold text-slate-700 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" /> Copy Example
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Pro Tip Callout */}
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
              <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Don't have a Business Manager yet?</span> You can buy an active institutional Business Manager directly from our <a href="/app/buy-bm" className="underline font-bold text-amber-950">BM Store</a> starting at $7 USDT with instant delivery.
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer"
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
