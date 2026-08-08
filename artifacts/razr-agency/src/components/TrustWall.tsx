import { motion } from "framer-motion";
import { Users, Headphones, Building2, Zap, ShieldCheck, Globe2, Award, Sparkles } from "lucide-react";

const ITEMS = [
  { icon: Users, label: "500+ Active Accounts" },
  { icon: Headphones, label: "24/7 Live Support" },
  { icon: Building2, label: "Agency-Level Access" },
  { icon: Zap, label: "1-Hour Activation" },
  { icon: ShieldCheck, label: "Verified Access" },
  { icon: Globe2, label: "Global Coverage" },
  { icon: Award, label: "Top-Rated Provider" },
  { icon: Sparkles, label: "Premium Infrastructure" },
];

export default function TrustWall() {
  return (
    <section className="relative w-full overflow-hidden py-14 border-y border-slate-200 bg-gradient-to-b from-background via-slate-50 to-background">
      <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      <motion.div
        className="flex whitespace-nowrap items-center gap-10 md:gap-14"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 40 }}
      >
        {[...ITEMS, ...ITEMS, ...ITEMS].map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              className="flex items-center gap-3 px-6 py-3 rounded-full border border-slate-200 bg-white shadow-sm shrink-0 hover:border-primary/40 hover:bg-primary/[0.04] transition-colors"
            >
              <Icon className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold uppercase tracking-wider text-slate-800">{item.label}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
            </div>
          );
        })}
      </motion.div>
    </section>
  );
}
