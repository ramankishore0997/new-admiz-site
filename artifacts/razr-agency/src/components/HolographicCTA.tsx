import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { buildWaLink } from "@/lib/whatsapp";

export default function HolographicCTA() {
  return (
    <section className="py-16 relative z-10 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="relative rounded-[2.5rem] p-[1.5px] overflow-hidden group">
          {/* animated gradient border */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_0deg,#059669_60deg,#14b8a6_120deg,transparent_180deg,#059669_240deg,#0d9488_300deg,transparent_360deg)]"
          />

          <div className="relative rounded-[2.4rem] bg-white overflow-hidden shadow-xl shadow-slate-200/60">
            {/* moving light bars */}
            <motion.div
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 left-0 w-[40%] h-px bg-gradient-to-r from-transparent via-primary to-transparent"
            />
            <motion.div
              animate={{ x: ["100%", "-100%"] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute bottom-0 right-0 w-[40%] h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent"
            />

            {/* radial glow blobs */}
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-emerald-500/20 blur-[100px]"
            />
            <motion.div
              animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-teal-500/20 blur-[100px]"
            />

            {/* grid overlay */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(15,23,42,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.12) 1px, transparent 1px)",
                backgroundSize: "50px 50px",
              }}
            />

            <div className="relative p-7 sm:p-10 md:p-20 lg:p-28 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 backdrop-blur mb-5 md:mb-8">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <span className="text-[10px] font-black tracking-[0.2em] text-primary uppercase">Premium Infrastructure</span>
                </div>
                <h2 className="text-[2.25rem] sm:text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-5 md:mb-6">
                  Stop settling.<br />
                  <span className="text-slate-900">
                    Start scaling.
                  </span>
                </h2>
                <p className="text-base md:text-lg text-slate-600 max-w-md leading-relaxed">
                  Join 500+ advertisers running uncapped budgets on agency-tier Meta &amp; Google accounts.
                </p>
              </div>

              <div className="shrink-0 flex flex-col gap-3 md:gap-4 w-full md:w-auto">
                <a
                  href={buildWaLink("general", { source: "final-cta" })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/btn relative inline-flex items-center justify-center gap-3 px-8 md:px-10 py-4 md:py-5 rounded-full bg-emerald-600 text-white font-black text-sm uppercase tracking-widest overflow-hidden hover:bg-emerald-700 transition-colors duration-300"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
                  <span className="relative">Chat on Telegram</span>
                  <ArrowRight className="relative w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 md:px-10 py-4 md:py-5 rounded-full border border-slate-300 text-slate-700 font-black text-sm uppercase tracking-widest hover:bg-slate-50 transition-colors"
                >
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
