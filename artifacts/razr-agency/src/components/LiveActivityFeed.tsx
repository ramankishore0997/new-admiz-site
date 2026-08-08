import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Zap, Headphones, Shield, TrendingUp, Globe2 } from "lucide-react";

type Event = {
  icon: typeof CheckCircle2;
  title: string;
  meta: string;
  color: string;
};

const EVENTS: Event[] = [
  { icon: CheckCircle2, title: "Lifetime Access activated", meta: "Hong Kong advertiser • 2 min ago", color: "text-emerald-600" },
  { icon: Zap, title: "BM delivered", meta: "Singapore agency • 6 min ago", color: "text-primary" },
  { icon: Headphones, title: "Support session joined", meta: "London brand • 9 min ago", color: "text-emerald-600" },
  { icon: Shield, title: "Account replaced", meta: "Lifetime guarantee • 14 min ago", color: "text-emerald-600" },
  { icon: TrendingUp, title: "Spend cap unlocked", meta: "$50k/day live • 22 min ago", color: "text-amber-600" },
  { icon: Globe2, title: "Onboarding complete", meta: "Dubai advertiser • 31 min ago", color: "text-emerald-600" },
  { icon: CheckCircle2, title: "Lifetime Access granted", meta: "New York advertiser • 38 min ago", color: "text-emerald-600" },
  { icon: Zap, title: "Google Ads MCC linked", meta: "Kowloon agency • 47 min ago", color: "text-primary" },
];

export default function LiveActivityFeed() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Wait until loading screen fades + user is engaged (3.5s)
    const showTimer = setTimeout(() => setVisible(true), 3500);
    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % EVENTS.length);
    }, 5200);
    return () => clearInterval(interval);
  }, [visible]);

  if (!visible) return null;

  const event = EVENTS[index];
  const Icon = event.icon;

  return (
    <div
      className="fixed bottom-24 left-4 md:bottom-24 md:left-6 z-30 pointer-events-none w-[calc(100vw-2rem)] sm:w-auto max-w-[300px]"
      aria-hidden="true"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.96 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto"
        >
          <div className="relative">
            {/* glow */}
            <div className="absolute -inset-1 bg-primary/20 blur-xl rounded-2xl opacity-50" />

            <div className="relative flex items-center gap-3 px-3.5 py-3 rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/70">
              <div className={`shrink-0 w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center ${event.color}`}>
                <Icon className="w-4 h-4" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-bold text-slate-900 truncate">{event.title}</span>
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="text-[10.5px] uppercase tracking-wider text-slate-500 mt-0.5 truncate">{event.meta}</div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
