import { motion } from "framer-motion";
import { ShieldCheck, FileText, Headphones, Globe } from "lucide-react";

const PAY_METHODS = ["FPS", "Bank Transfer", "Cards", "USDT / Crypto"];

export default function HongKongTrustStrip() {
  return (
    <section className="relative z-10 py-10 md:py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="relative rounded-2xl md:rounded-3xl border border-slate-200 bg-white backdrop-blur-xl overflow-hidden shadow-lg shadow-slate-200/60"
        >
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 md:gap-10 items-center p-5 md:p-7">
            {/* LEFT — Hong Kong HQ badge */}
            <div className="flex items-center gap-4">
              <div className="relative shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-2xl overflow-hidden border border-slate-300 shadow-[0_10px_30px_-10px_rgba(15,23,42,0.15)]">
                <div className="absolute inset-0 bg-[#DE2910] flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-7 h-7 md:w-8 md:h-8 text-white" fill="currentColor" aria-hidden="true">
                    <path d="M12 2.5l.9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9z" />
                    <path d="M4.5 8l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z" />
                    <path d="M19.5 8l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z" />
                    <path d="M6 17l.6 1.7 1.7.6-1.7.6L6 21.6l-.6-1.7-1.7-.6 1.7-.6z" />
                    <path d="M18 17l.6 1.7 1.7.6-1.7.6L18 21.6l-.6-1.7-1.7-.6 1.7-.6z" />
                  </svg>
                </div>
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-black uppercase tracking-[0.25em] text-primary mb-1">Hong Kong HQ</div>
                <div className="text-base md:text-lg font-black uppercase tracking-tight leading-tight">
                  Trusted by <span className="text-primary">5,000+</span> Advertisers Worldwide
                </div>
                <div className="text-xs text-slate-500 mt-0.5">Global supply · Multi-currency billing · 24/7 support</div>
              </div>
            </div>

            {/* RIGHT — Payment + trust strip */}
            <div className="flex flex-col gap-4 md:items-end">
              <div className="flex flex-wrap gap-2 md:justify-end">
                {PAY_METHODS.map((m) => (
                  <span
                    key={m}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-700"
                  >
                    <Globe className="w-3 h-3 text-emerald-600" />
                    {m}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 md:gap-5 md:justify-end text-[10px] md:text-xs text-slate-600 font-bold uppercase tracking-wider">
                <span className="inline-flex items-center gap-1.5">
                  <FileText className="w-3 h-3 text-emerald-600" /> Worldwide Delivery
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" /> Secure Payment
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Headphones className="w-3 h-3 text-emerald-600" /> English + Global Support
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
