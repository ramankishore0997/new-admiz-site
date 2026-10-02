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
    <section className="relative py-16 md:py-24 z-10 bg-black text-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/30 bg-violet-950/40 backdrop-blur mb-6 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
              <Video className="w-3 h-3 text-cyan-300" />
              <span className="text-[10px] font-black tracking-[0.2em] bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent uppercase">Free Strategy Call</span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-[0.95] mb-5 text-white">
              Talk to a <br />
              <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">scaling expert.</span>
            </h2>

            <p className="text-base md:text-lg text-zinc-300 leading-relaxed mb-7">
              Pick a 15-minute slot in UK / GMT time. We'll review your current spend, account setup, and recommend the right tier — <span className="text-cyan-300 font-bold">no pitch, no pressure.</span>
            </p>

            <ul className="space-y-2.5">
              {[
                "Free 15-min consultation",
                "Account audit & spend analysis",
                "Custom tier recommendation",
                "No sales pressure — just clarity",
              ].map((b, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-zinc-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-7">
            <div className="relative">
              <div className="relative rounded-3xl border border-zinc-800 bg-[#060608] shadow-2xl p-6 md:p-8 overflow-hidden">
                <div className="flex items-start justify-between mb-6 gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-cyan-400" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent">Pick a Time (GMT / London)</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter leading-tight text-white">
                      Available this week
                    </h3>
                  </div>
                  <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-950 border border-violet-500/40 shrink-0">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-400" />
                    </span>
                    <span className="text-[9px] font-black tracking-wider text-cyan-300 uppercase">Team online</span>
                  </div>
                </div>

                <div className="space-y-5 mb-7">
                  {grouped.map(([day, daySlots]) => (
                    <div key={day}>
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2.5 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
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
                                  ? "border-cyan-400 bg-gradient-to-r from-violet-600/30 to-cyan-500/30 text-white shadow-lg shadow-violet-500/25 scale-[1.02]"
                                  : "border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-violet-500/40 hover:bg-violet-950/20 hover:text-white"
                              }`}
                            >
                              <span className="flex items-center justify-center gap-1.5">
                                <Clock className={`w-3 h-3 ${isActive ? "text-cyan-300" : "text-zinc-500"}`} />
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
                  className={`group relative w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all ${
                    selected
                      ? "bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white hover:opacity-95 hover:scale-[1.01] shadow-lg shadow-violet-500/30"
                      : "bg-[#0A0A0F] text-white border border-zinc-800 hover:border-violet-500/60 hover:bg-zinc-900"
                  }`}
                >
                  <SiTelegram className="text-lg text-[#229ED9]" />
                  {selected ? "Confirm Booking via Telegram" : "Book Call via Telegram"}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </a>

                {selectedSlot && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 flex items-center justify-center gap-2 text-xs text-zinc-300"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    Selected: <span className="text-white font-bold">{selectedSlot.dayLabel}, {selectedSlot.timeLabel}</span>
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
