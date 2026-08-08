import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, X, ArrowRight } from "lucide-react";
import { buildWaLink } from "@/lib/whatsapp";
import { msUntilSundayMidnightHKT, formatCountdown } from "@/lib/hkt-time";

const DISMISS_KEY = "razr_topbar_dismissed_at";
const DISMISS_TTL_HOURS = 12;
const BAR_HEIGHT_PX = 40;

// Slots-left model is decoupled from viewer timezone: it follows the HKT weekday.
function computeSlotsLeft(): number {
  const hktWeekdayStr = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Hong_Kong", weekday: "short" }).format(new Date());
  const hktHourStr = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Hong_Kong", hour: "2-digit", hour12: false }).format(new Date());
  const weekdayMap: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  const day = weekdayMap[hktWeekdayStr] ?? 1;
  const hour = Number(hktHourStr) || 0;
  const base = [8, 9, 6, 4, 3, 2, 1][day] ?? 5;
  const decay = hour >= 18 ? 1 : 0;
  return Math.max(1, base - decay);
}

export default function StickyUrgencyBar() {
  const [visible, setVisible] = useState(false);
  const [slots, setSlots] = useState(() => computeSlotsLeft());
  const [countdown, setCountdown] = useState(() => formatCountdown(msUntilSundayMidnightHKT()));

  useEffect(() => {
    try {
      const dismissedAt = localStorage.getItem(DISMISS_KEY);
      if (dismissedAt) {
        const elapsedHours = (Date.now() - Number(dismissedAt)) / (1000 * 60 * 60);
        if (elapsedHours < DISMISS_TTL_HOURS) return;
      }
    } catch {
      // storage unavailable — show anyway
    }
    setVisible(true);
  }, []);

  useEffect(() => {
    if (!visible) {
      document.documentElement.style.setProperty("--topbar-h", "0px");
      return;
    }
    document.documentElement.style.setProperty("--topbar-h", `${BAR_HEIGHT_PX}px`);
    return () => {
      document.documentElement.style.setProperty("--topbar-h", "0px");
    };
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const id = setInterval(() => {
      setSlots(computeSlotsLeft());
      setCountdown(formatCountdown(msUntilSundayMidnightHKT()));
    }, 30_000);
    return () => clearInterval(id);
  }, [visible]);

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      // ignore
    }
    setVisible(false);
  };

  const critical = slots <= 3;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -BAR_HEIGHT_PX, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -BAR_HEIGHT_PX, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className={`fixed top-0 left-0 right-0 z-[55] h-10 flex items-center justify-center px-3 sm:px-6 backdrop-blur-xl border-b ${
            critical
              ? "bg-gradient-to-r from-amber-100 via-red-100 to-amber-100 border-amber-300"
              : "bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-emerald-200"
          }`}
          role="status"
          aria-live="polite"
        >
          {/* Animated shimmer */}
          <motion.span
            aria-hidden
            className="absolute inset-y-0 -left-full w-1/3 bg-gradient-to-r from-transparent via-slate-200 to-transparent skew-x-12 pointer-events-none"
            animate={{ x: ["0%", "400%"] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
          />

          <div className="relative flex items-center gap-2 sm:gap-4 text-[10px] sm:text-xs font-bold tracking-wider uppercase text-slate-900 min-w-0">
            <span className={`relative flex h-2 w-2 shrink-0 ${critical ? "" : ""}`}>
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${critical ? "bg-amber-500" : "bg-primary"}`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${critical ? "bg-amber-500" : "bg-primary"}`} />
            </span>

            <span className="hidden sm:inline-flex items-center gap-1.5">
              <Flame className={`w-3 h-3 ${critical ? "text-amber-600" : "text-primary"}`} />
              <span className={critical ? "text-amber-600" : "text-primary"}>{slots}</span>
              <span className="text-slate-700">slot{slots === 1 ? "" : "s"} left this week</span>
            </span>

            <span className="sm:hidden text-slate-900 truncate">
              <span className={critical ? "text-amber-600" : "text-primary"}>{slots}</span> slots left · {countdown}
            </span>

            <span className="hidden sm:inline text-slate-400">·</span>

            <span className="hidden sm:inline text-slate-700">
              Onboarding closes in <span className="text-slate-900 tabular-nums font-black">{countdown}</span>
            </span>

            <a
              href={buildWaLink("urgency-slot", { source: "sticky-topbar" })}
              target="_blank"
              rel="noopener noreferrer"
              className={`group hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-black text-[10px] tracking-widest uppercase shrink-0 transition-all ${
                critical
                  ? "bg-amber-500 text-white hover:bg-amber-600"
                  : "bg-emerald-600 text-white hover:bg-emerald-700"
              }`}
            >
              Claim slot
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>

          <button
            onClick={dismiss}
            aria-label="Dismiss banner"
            className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
