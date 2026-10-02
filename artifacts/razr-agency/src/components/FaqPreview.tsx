import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ArrowRight, HelpCircle } from "lucide-react";
import { Link } from "wouter";

const QS = [
  { q: "How fast can I get activated?", a: "Under 60 minutes for approved clients. Most setups are live and spending within the same business day." },
  { q: "What's the actual daily spend limit?", a: "There is none on our agency accounts. We've tested up to $50k/day on single accounts without throttling. Scale as fast as your offer allows." },
  { q: "What if my account gets restricted?", a: "Lifetime free replacement. We swap the account, transfer balance where technically possible, and restore your campaigns. Zero questions, zero fees." },
  { q: "Which verticals are accepted?", a: "E-commerce, lead gen, SaaS, info products, crypto, nutra, gambling. Both whitehat and specialized structures available." },
  { q: "What's included in support?", a: "Direct Telegram access to our internal media buyers. 12-minute average response. Real humans, not a ticketing system." },
];

export default function FaqPreview() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-20 relative z-10 bg-transparent text-white">
      <div className="container mx-auto px-4 max-w-7xl relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left header */}
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <div className="text-[10px] font-black uppercase tracking-[0.25em] bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent mb-3 flex items-center gap-2">
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400" /> Quick Answers
            </div>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.95] mb-6 text-white">
              Questions, <br />
              <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">answered.</span>
            </h2>
            <p className="text-zinc-400 mb-8 leading-relaxed max-w-md">
              The 5 things most advertisers want to know before they commit. For the full list, see our complete FAQ.
            </p>
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-zinc-800 bg-[#0A0A0F] text-sm font-black uppercase tracking-widest text-white hover:border-cyan-500 hover:bg-zinc-900 transition-all group shadow-md"
            >
              See All FAQ
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-cyan-400" />
            </Link>
          </div>

          {/* Right accordion */}
          <div className="lg:col-span-7 space-y-3">
            {QS.map((item, i) => {
              const isOpen = open === i;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className={`relative group rounded-2xl border overflow-hidden transition-all duration-300 ${
                    isOpen
                      ? "border-cyan-500/40 bg-[#060608] shadow-xl shadow-cyan-500/5"
                      : "border-zinc-800 bg-zinc-950/80 hover:border-zinc-700"
                  }`}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <span className={`text-[11px] font-black tracking-widest tabular-nums ${isOpen ? "text-cyan-400" : "text-zinc-500"}`}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className={`text-base md:text-lg font-bold tracking-tight ${isOpen ? "text-white" : "text-zinc-200"}`}>
                        {item.q}
                      </span>
                    </div>
                    <motion.div
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.3 }}
                      className={`w-8 h-8 shrink-0 rounded-full border flex items-center justify-center transition-colors ${
                        isOpen ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-400 shadow-sm" : "bg-zinc-900 border-zinc-800 text-zinc-400"
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </motion.div>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pl-[3.75rem] text-zinc-300 leading-relaxed text-sm">
                          {item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
