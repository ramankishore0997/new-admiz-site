import { motion } from "framer-motion";
import { TrendingUp, MousePointerClick, Wallet, ShieldCheck } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip } from "recharts";

const DATA = [
  { d: "Mon", spend: 4200, roas: 3.1 },
  { d: "Tue", spend: 5100, roas: 3.6 },
  { d: "Wed", spend: 4800, roas: 3.4 },
  { d: "Thu", spend: 6400, roas: 4.1 },
  { d: "Fri", spend: 7200, roas: 4.4 },
  { d: "Sat", spend: 8900, roas: 4.8 },
  { d: "Sun", spend: 12480, roas: 4.6 },
];

function ChartTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white/95 backdrop-blur-xl px-3 py-2 shadow-xl shadow-slate-200/60">
      <div className="text-[9px] font-black uppercase tracking-wider text-slate-400">{p.d}</div>
      <div className="text-xs font-black text-slate-900">${p.spend.toLocaleString()}</div>
      <div className="text-[9px] font-bold text-emerald-600">ROAS {p.roas}x</div>
    </div>
  );
}

export default function HeroDashboardMock() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* ambient glow behind card */}
      <div
        aria-hidden
        className="absolute w-[380px] h-[380px] rounded-full blur-[90px] opacity-50"
        style={{ background: "radial-gradient(closest-side, rgba(5,150,105,0.35), transparent 70%)" }}
      />

      {/* main glass dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 40, rotateX: 8 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md rounded-[1.8rem] p-px bg-gradient-to-br from-emerald-300/60 via-slate-200/40 to-teal-300/60 shadow-[0_40px_120px_-30px_rgba(5,150,105,0.35)]"
      >
        <div className="relative rounded-[calc(1.8rem-1px)] bg-white/70 backdrop-blur-2xl overflow-hidden">
          {/* top sheen */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

          {/* header */}
          <div className="flex items-center justify-between px-5 pt-4 pb-3">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
              </div>
            </div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Campaign Performance</div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              <span className="text-[9px] font-black uppercase tracking-wider text-emerald-700">Live</span>
            </div>
          </div>

          {/* chart */}
          <div className="px-4">
            <ResponsiveContainer width="100%" height={170}>
              <AreaChart data={DATA} margin={{ top: 6, right: 4, left: 4, bottom: 0 }}>
                <defs>
                  <linearGradient id="heroSpend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#059669" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#059669" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 6" stroke="rgba(15,23,42,0.06)" vertical={false} />
                <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "#94a3b8", fontWeight: 700 }} dy={6} />
                <YAxis hide domain={[0, 14000]} />
                <Tooltip content={<ChartTooltip />} cursor={{ stroke: "rgba(5,150,105,0.25)", strokeWidth: 1.5 }} />
                <Area type="monotone" dataKey="spend" stroke="#059669" strokeWidth={2.5} fill="url(#heroSpend)" activeDot={{ r: 4, strokeWidth: 2, stroke: "#fff", fill: "#059669" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* stats row */}
          <div className="grid grid-cols-3 gap-2 px-4 pb-4 pt-2">
            {[
              { Icon: TrendingUp, label: "ROAS", value: "4.6x", accent: "text-emerald-600" },
              { Icon: MousePointerClick, label: "Clicks", value: "128.4k", accent: "text-teal-600" },
              { Icon: Wallet, label: "Spend", value: "$12.4k", accent: "text-slate-900" },
            ].map((s) => {
              const Icon = s.Icon;
              return (
                <div key={s.label} className="rounded-2xl border border-slate-200/70 bg-white/80 backdrop-blur-xl px-3 py-2.5 shadow-sm">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon className="w-3 h-3 text-primary" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">{s.label}</span>
                  </div>
                  <div className={`text-base font-black tabular-nums leading-none ${s.accent}`}>{s.value}</div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* floating chip — ROAS lift */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1, ease: [0.16, 1, 0.3, 1] }}
        className="absolute -left-4 md:-left-10 top-14 float-soft"
      >
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl border border-white/70 bg-white/80 backdrop-blur-2xl shadow-[0_20px_50px_-20px_rgba(5,150,105,0.4)]">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-black text-slate-900 leading-none">+312%</div>
            <div className="text-[8px] font-black uppercase tracking-widest text-slate-400 mt-1">ROAS Lift</div>
          </div>
        </div>
      </motion.div>

      {/* floating chip — verified */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute -right-3 md:-right-8 bottom-12 float-soft"
      >
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl border border-white/70 bg-white/80 backdrop-blur-2xl shadow-[0_20px_50px_-20px_rgba(5,150,105,0.4)]">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-black text-slate-900 leading-none">Agency Verified</div>
            <div className="text-[8px] font-black uppercase tracking-widest text-slate-400 mt-1">Tier-1 Network</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
