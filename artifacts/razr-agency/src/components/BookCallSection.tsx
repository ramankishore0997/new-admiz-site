import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight, CheckCircle2, Video } from "lucide-react";
import { SiTelegram } from "react-icons/si";
import { buildWaLink } from "@/lib/whatsapp";
import { generateHktSlots, type HktSlot } from "@/lib/hkt-time";

export default function BookCallSection() {
  const slots = useMemo(() => generateHktSlots(), []);
  const [selected, setSelected] = useState<string | null>(null);

  const grouped = useMemo(() => {
    const map = new Map<string, HktSlot[]>();
    for (const s of slots) {
      const list = map.get(s.dayLabel) ?? [];
      list.push(s);
      map.set(s.dayLabel, list);
    }
    return Array.from(map.entries());
  }, [slots]);

  const selectedSlot = slots.find((s) => s.iso === selected);
  const waHref = selectedSlot
    ? buildWaLink("book-call", { slot: `${selectedSlot.dayLabel}, ${selectedSlot.timeLabel}`, source: "book-call-section" })
    : buildWaLink("book-call", { source: "book-call-section" });

  return (
    <section className="relative py-16 md:py-24 z-10">
      <div className="absolute top-32 left-1/3 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 backdrop-blur mb-6">
              <Video className="w-3 h-3 text-primary" />
              <span className="text-[10px] font-black tracking-[0.2em] text-primary uppercase">Free Strategy Call</span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-[0.95] mb-5">
              Talk to a <br />
              <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">scaling expert.</span>
            </h2>

            <p className="text-base md:text-lg text-slate-600 leading-relaxed mb-7">
              Pick a 15-minute slot in HKT. We'll review your current spend, account setup, and recommend the right tier — no pitch, no pressure.
            </p>

            <ul className="space-y-2.5">
              {[
                "Free 15-min consultation",
                "Account audit & spend analysis",
                "Custom tier recommendation",
                "No sales pressure — just clarity",
              ].map((b, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-7">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-br from-primary/20 via-emerald-500/15 to-teal-500/15 rounded-3xl blur-2xl opacity-60 pointer-events-none" />

              <div className="relative rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 p-6 md:p-8 overflow-hidden">
                <motion.div
                  aria-hidden
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute top-0 left-0 w-1/3 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
                />

                <div className="flex items-start justify-between mb-6 gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Pick a Time (HKT)</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter leading-tight">
                      Available this week
                    </h3>
                  </div>
                  <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 shrink-0">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                    </span>
                    <span className="text-[9px] font-black tracking-wider text-emerald-700 uppercase">Team online</span>
                  </div>
                </div>

                <div className="space-y-5 mb-7">
                  {grouped.map(([day, daySlots]) => (
                    <div key={day}>
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2.5 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                        {day}
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {daySlots.map((s) => {
                          const isActive = selected === s.iso;
                          return (
                            <button
                              key={s.iso}
                              onClick={() => setSelected(s.iso)}
                              className={`relative px-3 py-3 rounded-xl border text-sm font-bold transition-all ${
                                isActive
                                  ? "border-primary bg-primary/15 text-slate-900 shadow-lg shadow-emerald-100/60 scale-[1.02]"
                                  : "border-slate-200 bg-slate-50 text-slate-800 hover:border-primary/40 hover:bg-primary/5 hover:text-slate-900"
                              }`}
                            >
                              <span className="flex items-center justify-center gap-1.5">
                                <Clock className={`w-3 h-3 ${isActive ? "text-primary" : "text-slate-500"}`} />
                                {s.timeLabel}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group relative w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
                    selected
                      ? "bg-emerald-600 text-white hover:scale-[1.01] shadow-lg shadow-emerald-600/25"
                      : "bg-white text-slate-900 border border-slate-200 hover:bg-emerald-600 hover:text-white"
                  }`}
                >
                  <SiTelegram className="text-lg" />
                  {selected ? "Confirm Booking via Telegram" : "Book Call via Telegram"}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </a>

                {selectedSlot && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-600"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Selected: <span className="text-slate-900 font-bold">{selectedSlot.dayLabel}, {selectedSlot.timeLabel}</span>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
