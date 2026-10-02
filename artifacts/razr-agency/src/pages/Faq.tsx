import PageWrapper from "@/components/layout/PageWrapper";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Sparkles, MessageCircle, Search, HelpCircle, Zap, TrendingUp, RefreshCw, Layers } from "lucide-react";

const CAT_ICONS: Record<string, typeof Zap> = {
  Activation: Zap,
  Support: MessageCircle,
  Scaling: TrendingUp,
  Replacements: RefreshCw,
  Platforms: Layers,
  All: HelpCircle,
};

const faqs = [
  { cat: "Activation", q: "How long does activation take?", a: "Lifetime Access is activated same-day — typically within 60 minutes of confirmation. Message us on Telegram right after setup and we'll send credentials." },
  { cat: "Activation", q: "Do I need my own Business Manager?", a: "No, we provide the account within our enterprise Business Manager and grant you admin/employee access as required. You retain full operational control." },
  { cat: "Activation", q: "Can I use my existing cards?", a: "Yes, you can attach your own payment methods. We also offer pre-warmed agency lines for an additional layer of stability." },
  { cat: "Support", q: "What happens if I get restricted?", a: "Every Lifetime Access plan includes free lifetime replacement. If your account is restricted, we replace it free — and transfer remaining balance where technically possible. New account assigned within 24 hours." },
  { cat: "Support", q: "How fast do you respond?", a: "Our Telegram support typically responds in under 12 minutes during business hours, and within a few hours off-hours." },
  { cat: "Scaling", q: "What are the daily spending limits?", a: "Lifetime Access accounts typically start with no daily limit or a very high tier ($10K+ / HK$80K+) from Day 1 — no warmup, no caps." },
  { cat: "Scaling", q: "Can I run crypto / nutra / specialized niches?", a: "Yes — we provide both specialized and standard accounts on Meta and Google. High-velocity verticals like crypto, nutra, and aggressive D2C offers are fully supported on our infrastructure." },
  { cat: "Platforms", q: "Do you only provide Meta accounts?", a: "No — we provide both Meta (Facebook & Instagram) and Google Ads agency accounts. Same premium quality, same lifetime replacement guarantee, same unlimited spend from day 1." },
  { cat: "Replacements", q: "How does balance transfer work?", a: "If an account goes down, we assist in transferring unspent funds to your replacement account. Process typically completes within 24 hours." },
];

const categories = ["All", "Activation", "Support", "Scaling", "Platforms", "Replacements"];

export default function Faq() {
  const [activeCat, setActiveCat] = useState("All");
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [search, setSearch] = useState("");

  const filtered = faqs
    .filter((f) => (activeCat === "All" ? true : f.cat === activeCat))
    .filter((f) => (search ? (f.q + f.a).toLowerCase().includes(search.toLowerCase()) : true));

  return (
    <PageWrapper>
      {/* Floating background glow */}
      <div className="absolute top-40 left-1/4 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      <section className="pt-28 pb-16 relative bg-black">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-violet-500/30 bg-violet-950/40 backdrop-blur mb-6">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[10px] font-black tracking-[0.2em] bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent uppercase">Help Center</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-6 leading-[0.9] text-white">
              Questions, <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">answered.</span>
            </h1>
            <p className="text-xl text-zinc-300 max-w-2xl mx-auto">
              Everything you need to know before scaling on premium agency infrastructure.
            </p>

            {/* Search */}
            <div className="relative max-w-xl mx-auto mt-10">
              <div className="absolute inset-0 bg-violet-500/20 blur-xl rounded-full opacity-30" />
              <div className="relative flex items-center gap-3 px-6 py-4 rounded-full border border-zinc-800 bg-[#060608] shadow-2xl backdrop-blur-xl focus-within:border-violet-500/60 transition-colors">
                <Search className="w-5 h-5 text-zinc-400 shrink-0" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search questions..."
                  className="flex-1 bg-transparent outline-none text-white placeholder:text-zinc-500 text-sm"
                />
                <kbd className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider text-zinc-400 px-2 py-1 rounded border border-zinc-800 bg-zinc-950/60">ESC</kbd>
              </div>
            </div>
          </motion.div>

          {/* Category Tabs */}
          <div className="flex md:flex-wrap md:justify-center gap-2 mb-12 overflow-x-auto -mx-4 px-4 pb-2 md:mx-0 md:px-0 md:pb-0 md:overflow-visible snap-x snap-mandatory scrollbar-none">
            {categories.map((c) => {
              const Icon = CAT_ICONS[c] || HelpCircle;
              const active = activeCat === c;
              return (
                <motion.button
                  key={c}
                  onClick={() => { setActiveCat(c); setOpenIdx(null); }}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  className={`relative shrink-0 snap-start flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all ${
                    active
                      ? "bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white font-black shadow-lg shadow-violet-600/25"
                      : "border border-zinc-800 bg-zinc-950/80 text-zinc-400 hover:text-white hover:border-zinc-700"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {c}
                </motion.button>
              );
            })}
          </div>

          {/* FAQ Glass Cards */}
          <div className="flex flex-col gap-3.5 max-w-4xl mx-auto">
            <AnimatePresence mode="popLayout">
              {filtered.map((faq, i) => {
                const Icon = CAT_ICONS[faq.cat];
                const isOpen = openIdx === i;
                return (
                  <motion.div
                    key={faq.q}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.35, delay: i * 0.04 }}
                    className="group relative"
                  >
                    <div className={`absolute -inset-0.5 bg-gradient-to-r from-violet-500/30 via-cyan-500/20 to-emerald-500/20 rounded-2xl blur transition-opacity duration-500 ${isOpen ? "opacity-60" : "opacity-0 group-hover:opacity-40"}`} />

                    <div className={`relative rounded-2xl border bg-[#060608] shadow-2xl backdrop-blur-xl overflow-hidden transition-colors ${isOpen ? "border-violet-500/40" : "border-zinc-800/80 group-hover:border-zinc-700"}`}>
                      <button
                        onClick={() => setOpenIdx(isOpen ? null : i)}
                        className="w-full text-left px-6 md:px-8 py-6 flex items-center gap-5"
                      >
                        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 transition-colors ${isOpen ? "border-violet-500/40 bg-violet-500/20 text-cyan-400" : "border-zinc-800 bg-black/60 text-zinc-400"}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] font-black uppercase tracking-[0.2em] bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent mb-1">{faq.cat}</div>
                          <div className={`text-lg md:text-xl font-bold tracking-tight transition-colors ${isOpen ? "text-white" : "text-zinc-200 group-hover:text-white"}`}>{faq.q}</div>
                        </div>
                        <motion.div
                          animate={{ rotate: isOpen ? 45 : 0 }}
                          transition={{ type: "spring", stiffness: 200, damping: 20 }}
                          className={`w-10 h-10 rounded-full border flex items-center justify-center shrink-0 transition-colors ${isOpen ? "border-violet-500/40 bg-violet-500/20 text-cyan-400" : "border-zinc-800 text-zinc-400"}`}
                        >
                          <Plus className="w-4 h-4" />
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
                            <div className="px-6 md:px-8 pb-6 pl-[5.25rem] md:pl-[5.5rem]">
                              <div className="h-px w-full bg-gradient-to-r from-violet-500/30 via-zinc-800 to-transparent mb-5" />
                              <p className="text-base text-zinc-300 leading-relaxed">{faq.a}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filtered.length === 0 && (
              <div className="text-center py-16 text-zinc-400">No questions match your search.</div>
            )}
          </div>

          {/* Still need help */}
          <div className="mt-16 max-w-4xl mx-auto relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 rounded-3xl blur opacity-30" />
            <div className="relative rounded-3xl border border-zinc-800/80 bg-[#060608] shadow-2xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
              <motion.div
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 left-0 w-1/3 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
              />
              <div>
                <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-2 text-white">
                  Still have <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">questions?</span>
                </h3>
                <p className="text-sm text-zinc-400">Talk to our team — average response 12 minutes.</p>
              </div>
              <a
                href="https://t.me/RazrMarketing"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-full bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white font-black text-sm uppercase tracking-widest hover:opacity-95 hover:scale-[1.02] transition-all shadow-xl shadow-violet-600/25 shrink-0"
              >
                Chat on Telegram
              </a>
            </div>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
