import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ArrowRight, HelpCircle } from "lucide-react";
import { Link } from "wouter";

const QS = [
  { q: "How fast can I get activated?", a: "Under 60 minutes for verified clients. Most setups are live and spending within the same business day." },
  { q: "What's the actual daily spend limit?", a: "There is none on our agency accounts. We've tested up to $50k/day on single accounts without throttling. Scale as fast as your offer allows." },
  { q: "What if my account gets restricted?", a: "Lifetime free replacement. We swap the account, transfer balance where technically possible, and restore your campaigns. Zero questions, zero fees." },
  { q: "Which verticals are accepted?", a: "E-commerce, lead gen, SaaS, info products, crypto, nutra, gambling. Both whitehat and blackhat structures available." },
  { q: "What's included in support?", a: "Direct Telegram access to our internal media buyers. 12-minute average response. Real humans, not a ticketing system." },
];

export default function FaqPreview() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-20 relative z-10">
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="container mx-auto px-4 max-w-7xl relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left header */}
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <div className="text-[10px] font-black uppercase tracking-[0.25em] text-primary mb-3 flex items-center gap-2">
              <HelpCircle className="w-3 h-3" /> Quick Answers
            </div>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.95] mb-6">
              Questions, <br />
              <span className="font-light italic text-slate-500">answered.</span>
            </h2>
            <p className="text-slate-500 mb-8 leading-relaxed max-w-md">
              The 5 things most advertisers want to know before they commit. For the full list, see our complete FAQ.
            </p>
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-slate-300 bg-white text-sm font-black uppercase tracking-widest text-slate-900 hover:bg-slate-50 hover:border-slate-400 transition-all group"
            >
              See All FAQ
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
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
                  className={`relative group rounded-2xl border overflow-hidden transition-all duration-500 ${
                    isOpen
                      ? "border-primary/30 bg-emerald-50/50 shadow-lg shadow-emerald-100/40"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  {isOpen && (
                    <motion.div
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                      className="absolute top-0 left-0 w-1/3 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
                    />
                  )}
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <span className={`text-[10px] font-black tracking-widest tabular-nums ${isOpen ? "text-primary" : "text-slate-400"}`}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className={`text-base md:text-lg font-bold tracking-tight ${isOpen ? "text-slate-900" : "text-slate-800"}`}>
                        {item.q}
                      </span>
                    </div>
                    <motion.div
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.3 }}
                      className={`w-8 h-8 shrink-0 rounded-full border flex items-center justify-center transition-colors ${
                        isOpen ? "bg-primary/20 border-primary/40 text-primary" : "bg-slate-100 border-slate-200 text-slate-600"
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
                        <div className="px-6 pb-6 pl-[3.75rem] text-slate-600 leading-relaxed">
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
