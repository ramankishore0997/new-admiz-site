import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { TrendingUp, Activity, Zap, Target } from "lucide-react";
import SpotlightCard from "@/components/ui/SpotlightCard";

const METRICS = [
  { Icon: TrendingUp, label: "Avg ROAS lift", from: 1.8, to: 4.6, suffix: "x", color: "from-primary to-teal-500" },
  { Icon: Activity, label: "Account uptime", from: 30, to: 99.2, suffix: "%", color: "from-emerald-500 to-teal-500" },
  { Icon: Zap, label: "Time to scale", from: 14, to: 1, suffix: " day", color: "from-amber-500 to-orange-500", invert: true },
  { Icon: Target, label: "CPA reduction", from: 0, to: 42, suffix: "%", color: "from-emerald-600 to-teal-600" },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const dur = 1800;
    let start: number | null = null;
    const tick = (t: number) => {
      if (start === null) start = t;
      const p = Math.min((t - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(eased * value);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, value]);
  const display = value < 10 ? n.toFixed(1) : Math.floor(n).toLocaleString();
  return <span ref={ref}>{display}{suffix}</span>;
}

export default function GrowthMetrics() {
  return (
    <section className="py-20 relative z-10">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="container mx-auto px-4 max-w-7xl relative">
        <div className="flex items-end justify-between gap-8 flex-wrap mb-12">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.25em] text-primary mb-3">Growth Metrics</div>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.95]">
              Numbers that <br />
              <span className="font-light italic text-slate-500">don't lie.</span>
            </h2>
          </div>
          <p className="text-slate-500 max-w-md">
            Aggregated results across 1,200+ active advertisers in the last 12 months. Real campaigns, real budgets.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {METRICS.map((m, i) => {
            const Icon = m.Icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="h-full"
              >
                <SpotlightCard tone="emerald" className="tap-spring h-full p-7">
                  <div className={`absolute -top-16 -right-16 w-44 h-44 bg-gradient-to-br ${m.color} rounded-full blur-3xl opacity-15 group-hover:opacity-40 transition-opacity duration-500`} />
                <div className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${m.invert ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-primary/15 text-primary border border-primary/30"}`}>
                      {m.invert ? "↓ Faster" : "↑ Better"}
                    </div>
                  </div>
                  <div className="text-4xl md:text-5xl font-black text-slate-900 tabular-nums mb-2 leading-none">
                    <Counter value={m.to} suffix={m.suffix} />
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-5">{m.label}</div>

                  {/* before vs after mini bars */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                      <span className="w-10">Before</span>
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} whileInView={{ width: "28%" }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.4 }} className="h-full bg-slate-300 rounded-full" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-slate-900 font-bold">
                      <span className="w-10">After</span>
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} whileInView={{ width: "92%" }} viewport={{ once: true }} transition={{ duration: 1.2, delay: 0.6 }} className={`h-full bg-gradient-to-r ${m.color} rounded-full`} />
                      </div>
                    </div>
                  </div>
                </div>
                </SpotlightCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
