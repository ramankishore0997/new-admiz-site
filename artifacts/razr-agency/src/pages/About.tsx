import PageWrapper from "@/components/layout/PageWrapper";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Sparkles, Eye, Zap, Heart, Building2, TrendingUp, Award, Globe2 } from "lucide-react";

const TIMELINE = [
  { year: "2021", title: "The Idea", body: "Founders hit the same $500/day wall everyone does. Realized infrastructure — not strategy — was the bottleneck." },
  { year: "2022", title: "First Network", body: "Partnered with a tier-1 Meta agency. Quietly tested with 12 power users across crypto, DTC, and mobile apps." },
  { year: "2023", title: "Expansion", body: "Added Google Ads agency accounts. Scaled to 150+ clients. Lifetime replacement policy formalized." },
  { year: "2024", title: "Global Reach", body: "Operations across 40+ countries. 500+ active advertisers running uncapped budgets daily." },
  { year: "2025", title: "Premium Tier", body: "Launched Lifetime Access with same-day activation and dedicated success managers. Industry-leading 12-min support response." },
];

const VALUES = [
  { icon: Eye, title: "Radical Transparency", body: "See the account before you pay. No black boxes, no marketing fluff." },
  { icon: Zap, title: "Speed as a Feature", body: "Same-day activation. 12-minute support. Delays cost money in media buying." },
  { icon: Heart, title: "Long-Term Partnership", body: "We don't sell accounts — we provide ongoing scaling infrastructure." },
];

const STATS = [
  { icon: Building2, value: 500, suffix: "+", label: "Active Clients" },
  { icon: TrendingUp, value: 15, suffix: "M", label: "Monthly Spend ($)" },
  { icon: Globe2, value: 40, suffix: "+", label: "Countries" },
  { icon: Award, value: 98, suffix: "%", label: "Retention Rate" },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
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
    <div ref={ref} className="text-5xl md:text-6xl font-black tabular-nums">
      {count}
      <span className="text-primary">{suffix}</span>
    </div>
  );
}

export default function About() {
  return (
    <PageWrapper>
      {/* Ambient glow */}
      <div className="absolute top-32 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[60%] right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Hero / Editorial Quote */}
      <section className="pt-28 pb-16 relative">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 backdrop-blur mb-6">
              <Sparkles className="w-3 h-3 text-primary" />
              <span className="text-[10px] font-black tracking-[0.2em] text-primary uppercase">Our Story</span>
            </div>
          </motion.div>

          <div className="relative pl-6 md:pl-12 border-l-4 border-primary mb-16">
            <h1 className="text-4xl md:text-6xl lg:text-[4.5rem] font-serif italic leading-[1.05] text-slate-800">
              "We started <span className="not-italic font-black text-primary">Razr Marketing</span> because we lived the frustration ourselves."
            </h1>
            <p className="mt-6 text-sm uppercase tracking-[0.2em] text-slate-500 font-bold">— Founding team, 2021</p>
          </div>

          {/* Two column intro */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7">
              <h2 className="text-3xl font-bold mb-6 uppercase tracking-tight">The Infrastructure Gap</h2>
              <div className="space-y-5 text-lg text-slate-600 leading-relaxed">
                <p>
                  Built by media buyers who spent years running aggressive campaigns. We hit the same walls everyone does: random $50 daily limits, arbitrary restrictions, and campaigns stalling just as they became profitable.
                </p>
                <p>
                  Headquartered in <strong className="text-slate-900 font-normal">Hong Kong</strong>, we operate as a global infrastructure provider — supplying agency-grade advertising accounts to clients in 40+ countries across Asia, Europe, the Middle East, and the Americas.
                </p>
                <p>
                  The problem wasn't our strategy or creatives. The problem was <strong className="text-slate-900 font-normal">infrastructure</strong>. Standard self-serve Business Managers are built for local bakeries, not performance marketers spending 5-figures a day.
                </p>
                <p>
                  Agency ad accounts aren't a &quot;hack&quot; — they're the professional-grade infrastructure that large global agencies use every day. We built Razr Marketing to democratize that access.
                </p>
              </div>
            </div>

            {/* Mission card */}
            <div className="lg:col-span-5">
              <div className="relative group h-full">
                <div className="absolute -inset-0.5 bg-gradient-to-br from-primary/40 via-emerald-500/30 to-teal-500/30 rounded-3xl blur opacity-50 group-hover:opacity-80 transition-opacity duration-500" />
                <div className="relative rounded-3xl border border-slate-200 bg-white shadow-xl shadow-emerald-100/50 p-8 md:p-10 overflow-hidden h-full">
                  <motion.div
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
                    className="absolute top-0 left-0 w-1/3 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
                  />
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-4">Our Mission</div>
                  <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-tight mb-6">
                    If you have the budget and the strategy, the platform shouldn't hold you back.
                  </h3>
                  <div className="flex items-center gap-3 pt-6 border-t border-slate-200">
                    <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(5,150,105,0.6)]" />
                    <span className="text-xs uppercase tracking-wider text-slate-500">Built for operators who scale</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Animated Stats */}
      <section className="py-16 relative">
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
                  className="relative group rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60 p-6 md:p-8 overflow-hidden"
                >
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <Icon className="relative w-6 h-6 text-primary mb-4" />
                  <AnimatedCounter value={s.value} suffix={s.suffix} />
                  <div className="text-xs font-black uppercase tracking-wider text-slate-500 mt-2">{s.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Company Journey Timeline */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-3">Our Journey</div>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
              From idea <span className="font-light italic text-slate-500">to global infrastructure.</span>
            </h2>
          </div>

          <div className="relative">
            {/* center line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px md:-translate-x-1/2 bg-gradient-to-b from-emerald-600 via-emerald-500 to-teal-500 opacity-40" />

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
                        <div className="absolute inset-0 rounded-full bg-primary blur-md scale-150 opacity-60" />
                        <div className="relative w-4 h-4 rounded-full bg-primary border-2 border-background shadow-[0_0_15px_rgba(5,150,105,0.5)]" />
                      </div>
                    </div>

                    <div className={`${left ? "md:text-right md:pr-10" : "md:pl-10"} ${left ? "" : "md:col-start-2"}`}>
                      <div className="text-5xl md:text-6xl font-black text-slate-900/10 leading-none mb-1">{t.year}</div>
                    </div>
                    <div className={`${left ? "" : "md:col-start-1 md:row-start-1 md:pr-10 md:text-right"}`}>
                      <div className="relative group rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60 p-6 hover:border-slate-300 transition-colors">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <h3 className="text-xl font-black uppercase tracking-tight mb-2">{t.title}</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">{t.body}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-10">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-3">Core Values</div>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">What we stand for.</h2>
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
                  whileHover={{ y: -6 }}
                  className="relative group rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60 p-8 overflow-hidden"
                >
                  <div className="absolute -top-16 -right-16 w-40 h-40 bg-primary/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-4">0{i + 1}</div>
                    <div className="w-14 h-14 rounded-2xl border border-primary/30 bg-primary/10 backdrop-blur flex items-center justify-center mb-5">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-2xl font-black uppercase tracking-tight mb-3">{v.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{v.body}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
