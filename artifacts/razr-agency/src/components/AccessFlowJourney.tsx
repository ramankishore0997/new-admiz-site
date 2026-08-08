import { motion } from "framer-motion";
import { Send, FileSearch, Rocket, TrendingUp } from "lucide-react";

const STEPS = [
  {
    n: "01",
    icon: Send,
    title: "Request",
    desc: "Tell us your spend, niche, and goals on Telegram. Takes 3 minutes — no forms, no email tag.",
    time: "Step 1 • 3 min",
    color: "from-primary to-teal-500",
  },
  {
    n: "02",
    icon: FileSearch,
    title: "Review",
    desc: "Compliance check + tier matching. We assign the right agency BM for your vertical and volume.",
    time: "Step 2 • Under 1 hr",
    color: "from-emerald-600 to-teal-600",
  },
  {
    n: "03",
    icon: Rocket,
    title: "Activation",
    desc: "BM connected, billing set, team access granted, replacement guarantee active. Launch-ready.",
    time: "Step 3 • Same day",
    color: "from-emerald-500 to-teal-500",
  },
  {
    n: "04",
    icon: TrendingUp,
    title: "Scale",
    desc: "Uncapped daily spend, dedicated manager on standby, lifetime account replacement. Run.",
    time: "Step 4 • Forever",
    color: "from-amber-500 to-orange-500",
  },
];

export default function AccessFlowJourney() {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-background border-y border-slate-200">
      <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-primary/[0.06] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[400px] bg-emerald-500/[0.05] rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-14 md:mb-20"
        >
          <div className="text-[10px] font-black uppercase tracking-[0.25em] text-primary mb-3">Access Flow</div>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.95] mb-4">
            From request to <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">live spend.</span>
          </h2>
          <p className="text-base md:text-lg text-slate-600 leading-relaxed">
            Most clients are running campaigns within 4 hours of first message. Here's the exact path.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative max-w-6xl mx-auto">
          {/* Desktop connector line */}
          <div className="hidden lg:block absolute top-[68px] left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent pointer-events-none" />
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            className="hidden lg:block absolute top-[68px] left-[10%] right-[10%] h-px bg-gradient-to-r from-primary via-teal-500 to-emerald-500 origin-left pointer-events-none"
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6, delay: i * 0.12 }}
                  className="relative group"
                >
                  {/* Card */}
                  <div className="card-premium tap-spring relative h-full p-5 md:p-6 rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60 overflow-hidden group-hover:border-primary/40 group-hover:shadow-xl group-hover:shadow-emerald-100/50">
                    {/* Hover glow */}
                    <div className={`absolute -inset-1 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-15 blur-2xl transition-opacity duration-500 pointer-events-none`} />

                    <div className="relative">
                      {/* Icon orb */}
                      <div className="relative mb-5">
                        <div className={`absolute inset-0 bg-gradient-to-br ${step.color} blur-xl opacity-30 rounded-full`} />
                        <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg shadow-slate-900/10`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        {/* Step number floating */}
                        <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full border border-slate-200 bg-white text-[10px] font-black tracking-wider text-slate-700 shadow-sm">
                          {step.n}
                        </div>
                      </div>

                      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1.5">{step.time}</div>
                      <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-2">{step.title}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
