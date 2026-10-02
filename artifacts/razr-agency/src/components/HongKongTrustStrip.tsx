import { motion } from "framer-motion";
import { ShieldCheck, FileText, Headphones, Globe } from "lucide-react";

const PAY_METHODS = ["FPS", "Bank Wire", "Corporate Cards", "USDT / Crypto"];

export default function HongKongTrustStrip() {
  return (
    <section className="relative z-10 py-10 md:py-12 bg-black">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="relative rounded-2xl md:rounded-3xl border border-zinc-800 bg-[#060608] backdrop-blur-xl overflow-hidden shadow-2xl"
        >
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-violet-500/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 md:gap-10 items-center p-5 md:p-7">
            {/* LEFT — United Kingdom HQ badge */}
            <div className="flex items-center gap-4">
              <div className="relative shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-2xl overflow-hidden border border-zinc-700 shadow-xl bg-black flex items-center justify-center text-cyan-400">
                <Globe className="w-7 h-7 md:w-8 md:h-8" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-400 mb-1">United Kingdom HQ</div>
                <div className="text-base md:text-lg font-black uppercase tracking-tight leading-tight text-white">
                  Trusted by <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">5,000+</span> Advertisers Worldwide
                </div>
                <div className="text-xs text-zinc-400 mt-0.5">Global supply · Multi-currency lines · 24/7 dedicated desk</div>
              </div>
            </div>

            {/* RIGHT — Payment + trust strip */}
            <div className="flex flex-col gap-4 md:items-end">
              <div className="flex flex-wrap gap-2 md:justify-end">
                {PAY_METHODS.map((m) => (
                  <span
                    key={m}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-zinc-800 bg-black text-[10px] md:text-xs font-bold uppercase tracking-wider text-zinc-300"
                  >
                    <Globe className="w-3 h-3 text-cyan-400" />
                    {m}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 md:gap-5 md:justify-end text-[10px] md:text-xs text-zinc-400 font-bold uppercase tracking-wider">
                <span className="inline-flex items-center gap-1.5">
                  <FileText className="w-3 h-3 text-violet-400" /> Worldwide Delivery
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-cyan-400" /> Secure Settlement
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Headphones className="w-3 h-3 text-emerald-400" /> 24/7 Concierge Desk
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
