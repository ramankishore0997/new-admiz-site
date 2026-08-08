import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift, Clock, ArrowRight, CheckCircle2 } from "lucide-react";
import { SiTelegram } from "react-icons/si";
import { buildWaLink } from "@/lib/whatsapp";

const SHOWN_KEY = "razr_exit_intent_shown_at";
const SUPPRESS_HOURS = 24;
const ACTIVATION_DELAY_MS = 12_000;

export default function ExitIntentPopup() {
  const [open, setOpen] = useState(false);
  const [armed, setArmed] = useState(false);
  const firedRef = useRef(false); // one-shot guard for this page load
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  // Arm after delay if not recently suppressed
  useEffect(() => {
    try {
      const shownAt = localStorage.getItem(SHOWN_KEY);
      if (shownAt) {
        const hours = (Date.now() - Number(shownAt)) / (1000 * 60 * 60);
        if (hours < SUPPRESS_HOURS) {
          firedRef.current = true; // pre-suppress for this session too
          return;
        }
      }
    } catch {
      // storage unavailable — still arm
    }
    const t = setTimeout(() => setArmed(true), ACTIVATION_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  // Trigger listeners
  useEffect(() => {
    if (!armed || firedRef.current) return;

    const trigger = () => {
      if (firedRef.current) return;
      firedRef.current = true; // one-shot — no re-trigger this session
      setOpen(true);
      try {
        localStorage.setItem(SHOWN_KEY, String(Date.now()));
      } catch {
        // ignore
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      if (e.relatedTarget) return;
      if (e.clientY > 8) return;
      trigger();
    };

    let lastScrollY = window.scrollY;
    const onScroll = () => {
      const curr = window.scrollY;
      if (curr < 200 && lastScrollY - curr > 350) trigger();
      lastScrollY = curr;
    };

    document.addEventListener("mouseout", onMouseOut);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      document.removeEventListener("mouseout", onMouseOut);
      window.removeEventListener("scroll", onScroll);
    };
  }, [armed]);

  // Modal a11y: focus trap, escape, scroll lock, focus restore
  useEffect(() => {
    if (!open) return;

    lastFocusedRef.current = (document.activeElement as HTMLElement) ?? null;

    // Lock body scroll
    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;
    const scrollbarW = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarW > 0) document.body.style.paddingRight = `${scrollbarW}px`;

    // Initial focus on close button (least pushy)
    requestAnimationFrame(() => closeBtnRef.current?.focus());

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const root = dialogRef.current;
      if (!root) return;
      const focusables = root.querySelectorAll<HTMLElement>(
        'a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"]),input:not([disabled]),select:not([disabled]),textarea:not([disabled])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
      lastFocusedRef.current?.focus?.();
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-labelledby="exit-popup-title"
        >
          <motion.div
            ref={dialogRef}
            initial={{ scale: 0.92, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: 20, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl"
          >
            <div className="absolute -inset-1 bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 rounded-3xl blur-2xl opacity-50 pointer-events-none" />

            <div className="relative rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/60 backdrop-blur-2xl p-7 md:p-10 overflow-hidden">
              <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

              <button
                ref={closeBtnRef}
                onClick={close}
                aria-label="Close popup"
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors z-10"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="relative">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-400/60 bg-amber-50 mb-5">
                  <Gift className="w-3.5 h-3.5 text-amber-600" />
                  <span className="text-[10px] font-black tracking-[0.2em] text-amber-700 uppercase">
                    Wait — Exclusive Offer
                  </span>
                </div>

                <h2 id="exit-popup-title" className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-[0.95] mb-4 text-slate-900">
                  Don't leave <span className="font-light italic text-slate-600">empty-handed.</span>
                </h2>

                <p className="text-base text-slate-700 leading-relaxed mb-6">
                  Claim a <span className="text-slate-900 font-black">priority onboarding slot</span> this week — skip the waitlist, get activated same-day, and lock your account before slots fill up.
                </p>

                <ul className="space-y-2.5 mb-7">
                  {[
                    "Priority onboarding slot — skip the waitlist",
                    "Same-day activation guaranteed",
                    "Free 15-min onboarding call with our team",
                  ].map((b, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={buildWaLink("exit-discount", { source: "exit-intent-popup" })}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={close}
                    className="group relative inline-flex items-center justify-center gap-2 flex-1 px-6 py-4 rounded-2xl bg-emerald-600 text-white font-black text-sm uppercase tracking-widest hover:scale-[1.02] transition-transform shadow-[0_10px_40px_rgba(5,150,105,0.3)]"
                  >
                    <SiTelegram className="text-xl" />
                    Claim My Slot
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                  <button
                    onClick={close}
                    className="px-6 py-4 rounded-2xl border border-slate-300 text-slate-600 text-xs font-bold uppercase tracking-widest hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  >
                    No thanks
                  </button>
                </div>

                <div className="mt-5 flex items-center justify-center gap-2 text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                  <Clock className="w-3 h-3" />
                  Offer expires Sunday 11:59 PM HKT
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
