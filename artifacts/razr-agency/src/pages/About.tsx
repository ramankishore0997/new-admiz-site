import PageWrapper from "@/components/layout/PageWrapper";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Sparkles, Eye, Zap, Heart, Building2, TrendingUp, Award, Globe2 } from "lucide-react";
import SpotlightCard from "@/components/ui/SpotlightCard";

const TIMELINE = [
  { year: "2021", title: "The Idea", body: "Founders hit the same $500/day wall everyone does. Realized infrastructure — not strategy — was the bottleneck." },
  { year: "2022", title: "First Network", body: "Partnered with a tier-1 Meta agency. Quietly tested with 12 power users across crypto, DTC, and mobile apps." },
  { year: "2023", title: "Expansion", body: "Added Google Ads agency accounts. Scaled to 150+ clients. Lifetime replacement policy formalized." },
  { year: "2024", title: "Global Reach", body: "Operations across 40+ countries. 500+ active advertisers running uncapped budgets daily." },
  { year: "2025", title: "Premium Tier", body: "Launched Lifetime Access with same-day activation and dedicated success managers. Industry-leading 12-min support response." },
];

const VALUES = [
  { icon: Eye, title: "Radical Transparency", body: "Inspect the account before you pay. No black boxes, no marketing fluff.", tone: "aurora" as const },
  { icon: Zap, title: "Speed as a Feature", body: "Same-day activation. 12-minute support. Delays cost money in media buying.", tone: "cyan" as const },
  { icon: Heart, title: "Long-Term Partnership", body: "We don't sell accounts — we provide ongoing scaling infrastructure.", tone: "sunset" as const },
];

const STATS = [
  { icon: Building2, value: 500, suffix: "+", label: "Active Clients", color: "from-violet-400 to-indigo-300" },
  { icon: TrendingUp, value: 15, suffix: "M", label: "Monthly Spend ($)", color: "from-cyan-300 to-teal-300" },
  { icon: Globe2, value: 40, suffix: "+", label: "Countries", color: "from-pink-400 to-amber-300" },
  { icon: Award, value: 98, suffix: "%", label: "Retention Rate", color: "from-emerald-300 to-cyan-300" },
];

function AnimatedCounter({ value, suffix, color }: { value: number; suffix: string; color: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start: number | null = null;
    const duration = 1800;
    const tick = (t: number) => {
      if (start === null) start = t;
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.floor(eased * value));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, value]);

  return (
    <div ref={ref} className={`text-5xl md:text-6xl font-black tabular-nums bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
      {count}
      <span>{suffix}</span>
    </div>
  );
}

export default function About() {
  return (
    <PageWrapper>
      {/* Hero / Editorial Quote */}
      <section className="pt-28 pb-16 relative bg-black text-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-violet-500/30 bg-[#0A0515] backdrop-blur mb-6 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[10px] font-black tracking-[0.2em] bg-gradient-to-r from-violet-300 via-cyan-300 to-emerald-300 bg-clip-text text-transparent uppercase">Our Story</span>
            </div>
          </motion.div>

          <div className="relative pl-6 md:pl-12 border-l-4 border-cyan-400 mb-16">
            <h1 className="text-4xl md:text-6xl lg:text-[4.5rem] font-serif italic leading-[1.05] text-white">
              "We started <span className="not-italic font-black bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">Razr Marketing</span> because we lived the frustration ourselves."
            </h1>
            <p className="mt-6 text-sm uppercase tracking-[0.2em] text-zinc-400 font-bold">— Founding team, 2021</p>
          </div>

          {/* Two column intro */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7">
              <h2 className="text-3xl font-bold mb-6 uppercase tracking-tight text-white">The Infrastructure Gap</h2>
              <div className="space-y-5 text-lg text-zinc-300 leading-relaxed">
                <p>
                  Built by media buyers who spent years running aggressive campaigns. We hit the same walls everyone does: random $50 daily limits, arbitrary restrictions, and campaigns stalling just as they became profitable.
                </p>
                <p>
                  Headquartered in <strong className="text-white font-semibold">London, United Kingdom</strong>, we operate as a global infrastructure provider — supplying agency-grade advertising accounts to clients in 40+ countries across Europe, North America, the Middle East, and Asia.
                </p>
                <p>
                  The problem wasn't our strategy or creatives. The problem was <strong className="text-cyan-300 font-semibold">infrastructure</strong>. Standard self-serve Business Managers are built for local bakeries, not performance marketers spending 5-figures a day.
                </p>
                <p>
                  Agency ad accounts aren't a &quot;hack&quot; — they're the professional-grade infrastructure that large global agencies use every day. We built Razr Marketing to democratize that access.
                </p>
              </div>
            </div>

            {/* Mission card */}
            <div className="lg:col-span-5">
              <div className="relative group h-full">
                <div className="relative rounded-3xl border border-zinc-800 bg-[#060608] shadow-2xl backdrop-blur-xl p-8 md:p-10 overflow-hidden h-full flex flex-col justify-between">
                  <motion.div
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
                    className="absolute top-0 left-0 w-1/3 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                  />
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent mb-4">Our Mission</div>
                    <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-tight mb-6 text-white">
                      If you have the budget and the strategy, the platform shouldn't hold you back.
                    </h3>
                  </div>
                  <div className="flex items-center gap-3 pt-6 border-t border-zinc-800">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                    <span className="text-xs uppercase tracking-wider text-zinc-400 font-bold">Built for operators who scale</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Animated Stats */}
      <section className="py-16 relative bg-black text-white border-y border-zinc-900">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="h-full"
                >
                  <SpotlightCard tone="aurora" className="p-6 md:p-8 h-full flex flex-col justify-between bg-[#060608] border-zinc-800">
                    <Icon className="w-6 h-6 text-cyan-300 mb-4" />
                    <AnimatedCounter value={s.value} suffix={s.suffix} color={s.color} />
                    <div className="text-xs font-black uppercase tracking-wider text-zinc-400 mt-2">{s.label}</div>
                  </SpotlightCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Company Journey Timeline */}
      <section className="py-16 relative bg-black text-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <div className="text-[10px] font-black uppercase tracking-[0.25em] bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent mb-3">Our Journey</div>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white">
              From idea <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">to global infrastructure.</span>
            </h2>
          </div>

          <div className="relative">
            {/* center line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px md:-translate-x-1/2 bg-gradient-to-b from-violet-600 via-cyan-500 to-emerald-500 opacity-40" />

            <div className="flex flex-col gap-10">
              {TIMELINE.map((t, i) => {
                const left = i % 2 === 0;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: left ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6 }}
                    className={`relative pl-16 md:pl-0 md:grid md:grid-cols-2 md:gap-10 items-center ${left ? "" : "md:[&>*:first-child]:order-2"}`}
                  >
                    {/* Node */}
                    <div className="absolute left-6 md:left-1/2 top-6 md:-translate-x-1/2 z-10">
                      <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-cyan-500 blur-md scale-150 opacity-60" />
                        <div className="relative w-4 h-4 rounded-full bg-cyan-400 border-2 border-black shadow-[0_0_15px_rgba(6,182,212,0.8)]" />
                      </div>
                    </div>

                    <div className={`${left ? "md:text-right md:pr-10" : "md:pl-10"} ${left ? "" : "md:col-start-2"}`}>
                      <div className="text-5xl md:text-6xl font-black text-zinc-700/60 leading-none mb-1">{t.year}</div>
                    </div>
                    <div className={`${left ? "" : "md:col-start-1 md:row-start-1 md:pr-10 md:text-right"}`}>
                      <SpotlightCard tone="aurora" className="p-6 bg-[#060608] border-zinc-800">
                        <h3 className="text-xl font-black uppercase tracking-tight mb-2 text-white">{t.title}</h3>
                        <p className="text-sm text-zinc-300 leading-relaxed">{t.body}</p>
                      </SpotlightCard>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 relative bg-black text-white border-t border-zinc-900">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-10">
            <div className="text-[10px] font-black uppercase tracking-[0.25em] bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent mb-3">Core Values</div>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white">What we stand for.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {VALUES.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="h-full"
                >
                  <SpotlightCard tone={v.tone} className="p-8 h-full flex flex-col justify-between bg-[#060608] border-zinc-800">
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400 mb-4">0{i + 1}</div>
                      <div className="w-14 h-14 rounded-2xl border border-violet-500/30 bg-violet-950/40 backdrop-blur flex items-center justify-center mb-5 text-cyan-300">
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-2xl font-black uppercase tracking-tight mb-3 text-white">{v.title}</h3>
                      <p className="text-zinc-300 leading-relaxed">{v.body}</p>
                    </div>
                  </SpotlightCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Corporate Entity & Governance Section */}
      <section className="py-16 pb-24 relative bg-black text-white border-t border-zinc-900">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="rounded-3xl border border-zinc-800 bg-[#060608] p-8 md:p-12 shadow-2xl backdrop-blur-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/60 border border-violet-500/30 text-cyan-300 text-[10px] font-black uppercase tracking-widest">
                  🏢 Global Headquarters &amp; Corporate Entity
                </div>
                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white">
                  Institutional Reliability Powered by United Kingdom Standards
                </h2>
                <p className="text-sm md:text-base text-zinc-300 leading-relaxed">
                  <strong className="text-white">RAZR Global Media International Limited</strong> is incorporated in England and Wales under the UK Companies Act 2006 (Company No. 14829104). 
                  Our international corporate structure ensures our clients benefit from institutional-grade contracts, multi-sig escrow capital protection, and direct Tier-1 agency agreements with global advertising networks.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono">
                  <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800">
                    <div className="text-[9px] text-zinc-400 uppercase font-sans font-bold">Entity Type</div>
                    <div className="text-white font-bold mt-0.5">Private Limited (Ltd)</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800">
                    <div className="text-[9px] text-zinc-400 uppercase font-sans font-bold">Registry Number</div>
                    <div className="text-cyan-400 font-bold mt-0.5">UK No: 14829104</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 col-span-2 sm:col-span-1">
                    <div className="text-[9px] text-zinc-400 uppercase font-sans font-bold">Head Office</div>
                    <div className="text-white font-bold mt-0.5">City of London</div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 bg-zinc-950 rounded-2xl border border-zinc-800 p-6 space-y-3 shadow-xl">
                <div className="text-xs font-black uppercase tracking-wider text-white flex items-center justify-between">
                  <span>Registered Corporate Address</span>
                  <span className="text-cyan-400 font-mono text-[10px]">ACTIVE</span>
                </div>
                <div className="text-xs font-mono text-zinc-300 leading-relaxed bg-black p-4 rounded-xl border border-zinc-800">
                  RAZR Global Media International Limited<br />
                  30 St Mary Axe (The Gherkin)<br />
                  City of London, London EC3A 8EP<br />
                  United Kingdom
                </div>
                <div className="pt-2 text-[10px] text-zinc-400 flex flex-col gap-1">
                  <div><strong className="text-zinc-200">Legal Inquiries:</strong> legal@razr.marketing</div>
                  <div><strong className="text-zinc-200">Corporate Governance:</strong> compliance@razr.marketing</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
