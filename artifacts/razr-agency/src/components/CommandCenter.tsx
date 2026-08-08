import { motion } from "framer-motion";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";
import { useEffect, useState } from "react";
import { ArrowUpRight, Activity, DollarSign, Target, TrendingUp } from "lucide-react";

const baseData = [
  { time: "00:00", spend: 1200 },
  { time: "04:00", spend: 1800 },
  { time: "08:00", spend: 4500 },
  { time: "12:00", spend: 9200 },
  { time: "16:00", spend: 15400 },
  { time: "20:00", spend: 22100 },
  { time: "24:00", spend: 28500 },
];

const FEED = [
  { time: "now", text: "CBO - Broad - US scaling +18%", color: "text-primary" },
  { time: "2s", text: "New conversion: $89.40 ROAS", color: "text-emerald-600" },
  { time: "8s", text: "Retargeting DPA refresh complete", color: "text-slate-700" },
  { time: "14s", text: "Advantage+ exited learning phase", color: "text-amber-600" },
  { time: "21s", text: "Daily budget increased: $4k → $6k", color: "text-primary" },
];

export default function CommandCenter({ className = "" }: { className?: string }) {
  const [spend, setSpend] = useState(28500);
  const [roas, setRoas] = useState(3.24);
  const [convs, setConvs] = useState(1842);
  const [data, setData] = useState(baseData);
  const [feedIdx, setFeedIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setSpend((s) => s + Math.floor(Math.random() * 60) + 10);
      setRoas((r) => +(r + (Math.random() - 0.45) * 0.04).toFixed(2));
      setConvs((c) => c + Math.floor(Math.random() * 3));
      setData((d) => {
        const last = d[d.length - 1].spend;
        const next = last + Math.floor(Math.random() * 800) + 100;
        return [...d.slice(1), { time: "live", spend: next }];
      });
    }, 1800);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setFeedIdx((i) => (i + 1) % FEED.length), 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={`w-full max-w-3xl rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50/60">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          </div>
          <span className="ml-4 text-xs font-medium text-muted-foreground uppercase tracking-widest">BM: Atlas Global</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          <span className="text-xs text-slate-700">Live</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <motion.div key={spend} initial={{ opacity: 0.7 }} animate={{ opacity: 1 }} className="p-2.5 sm:p-4 rounded-lg bg-slate-50 border border-slate-200 relative overflow-hidden">
            <div className="flex items-center gap-1 sm:gap-1.5 mb-1">
              <DollarSign className="w-3 h-3 text-slate-500 shrink-0" />
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-wider truncate">Spend</div>
            </div>
            <div className="text-base sm:text-2xl font-bold text-slate-900 tabular-nums truncate">${spend.toLocaleString()}</div>
            <div className="text-[9px] sm:text-[10px] text-emerald-600 flex items-center gap-0.5 mt-1">
              <ArrowUpRight className="w-3 h-3 shrink-0" /> +12.4%
            </div>
          </motion.div>
          <div className="p-2.5 sm:p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-1 sm:gap-1.5 mb-1">
              <Target className="w-3 h-3 text-slate-500 shrink-0" />
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-wider">ROAS</div>
            </div>
            <div className="text-base sm:text-2xl font-bold text-primary tabular-nums">{roas.toFixed(2)}x</div>
            <div className="text-[9px] sm:text-[10px] text-emerald-600 flex items-center gap-0.5 mt-1">
              <ArrowUpRight className="w-3 h-3 shrink-0" /> Live
            </div>
          </div>
          <div className="p-2.5 sm:p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-1 sm:gap-1.5 mb-1">
              <TrendingUp className="w-3 h-3 text-slate-500 shrink-0" />
              <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-wider truncate">Conv.</div>
            </div>
            <div className="text-base sm:text-2xl font-bold text-slate-900 tabular-nums truncate">{convs.toLocaleString()}</div>
            <div className="text-[9px] sm:text-[10px] text-slate-500 mt-1">No limit</div>
          </div>
        </div>

        {/* Chart */}
        <div className="h-36 sm:h-44 w-full p-3 sm:p-4 rounded-lg bg-slate-50 border border-slate-200 relative">
          <div className="absolute top-4 left-4 z-10 text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Velocity · Live</div>
          <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
            </span>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">Streaming</span>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip contentStyle={{ backgroundColor: "#ffffff", border: "1px solid rgba(226,232,240,1)", fontSize: 11 }} itemStyle={{ color: "#0f172a" }} />
              <Area type="monotone" dataKey="spend" stroke="hsl(160, 84%, 39%)" strokeWidth={2} fillOpacity={1} fill="url(#colorSpend)" isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Live Activity Feed */}
        <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
          <div className="flex items-center gap-1.5 mb-2.5">
            <Activity className="w-3 h-3 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Live Activity</span>
          </div>
          <div className="space-y-1.5 h-16 overflow-hidden relative">
            {FEED.map((f, i) => {
              const offset = (i - feedIdx + FEED.length) % FEED.length;
              return (
                <motion.div
                  key={i}
                  animate={{ y: -offset * 22, opacity: offset === 0 ? 1 : 0.4 - offset * 0.1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="absolute top-0 left-0 right-0 flex items-center gap-2 text-[11px]"
                >
                  <span className="text-slate-400 tabular-nums shrink-0 w-8">{f.time}</span>
                  <span className={`w-1 h-1 rounded-full bg-current ${f.color} shrink-0`} />
                  <span className={`${f.color} font-medium`}>{f.text}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
