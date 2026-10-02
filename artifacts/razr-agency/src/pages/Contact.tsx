import { useState, type FormEvent } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import { trackContact, trackLead } from "@/lib/pixel";
import { getAttributionLabel } from "@/lib/utm";
import { motion } from "framer-motion";
import { Sparkles, MessageCircle, Mail, ArrowUpRight, Activity, Clock, Users, Zap, MapPin } from "lucide-react";
import { SiTelegram } from "react-icons/si";
import SpotlightCard from "@/components/ui/SpotlightCard";

const CONTACT_EMAIL = "scale@razr.marketing";
const TELEGRAM_HANDLE = "RazrMarketing";
const TELEGRAM_URL = `https://t.me/${TELEGRAM_HANDLE}`;

export default function Contact() {
  const [name, setName] = useState("");
  const [telegram, setTelegram] = useState("");
  const [goal, setGoal] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    trackContact({ source: "contact_form" });
    trackLead({ intent: "contact-form", source: "contact-page" });

    const attribution = getAttributionLabel();
    const lines = [
      `Hi Razr Marketing — new scaling request`,
      ``,
      `*Name / Company:* ${name || "—"}`,
      `*Telegram:* ${telegram || "—"}`,
      ``,
      `*Goal:*`,
      `${goal || "—"}`,
    ];
    if (attribution) {
      lines.push(``, `[ad source: ${attribution}]`);
    }
    window.open(TELEGRAM_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <PageWrapper>
      <div className="absolute top-32 left-1/4 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      <section className="pt-28 pb-16 relative">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-violet-500/30 bg-violet-950/40 backdrop-blur mb-6">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[10px] font-black tracking-[0.2em] bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent uppercase">Command Center</span>
            </div>
            <h1 className="text-[2.75rem] sm:text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.95] mb-4 text-white">
              Let's <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">connect.</span>
            </h1>
            <p className="text-xl text-zinc-300 max-w-2xl mx-auto">
              Tell us your scaling goal. Our team gets back within minutes — not days.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT: Floating widgets / status */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              {/* Live status widget */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="relative group"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500/30 via-cyan-500/30 to-emerald-500/30 rounded-2xl blur opacity-40 group-hover:opacity-70 transition-opacity" />
                <div className="relative rounded-2xl border border-zinc-800 bg-[#060608] shadow-2xl backdrop-blur-xl p-6 overflow-hidden">
                  <motion.div
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute top-0 left-0 w-1/3 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                  />
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                      </span>
                      <span className="text-sm font-black uppercase tracking-widest bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent">Live · Online</span>
                    </div>
                    <Activity className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                        <Users className="w-3 h-3 text-zinc-400" /> Active
                      </div>
                      <div className="text-2xl font-black text-white tabular-nums">3</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                        <Clock className="w-3 h-3 text-zinc-400" /> Avg
                      </div>
                      <div className="text-2xl font-black bg-gradient-to-r from-emerald-400 to-cyan-300 bg-clip-text text-transparent tabular-nums">12<span className="text-sm text-zinc-400 ml-0.5">min</span></div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                        <Zap className="w-3 h-3 text-zinc-400" /> Today
                      </div>
                      <div className="text-2xl font-black text-white tabular-nums">47</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Telegram */}
              <ContactChannel
                href={TELEGRAM_URL}
                icon={<SiTelegram className="w-6 h-6 text-[#229ED9]" />}
                title="Telegram Direct"
                value={`@${TELEGRAM_HANDLE}`}
                badge="Priority SLA"
                delay={0.15}
                accent="from-violet-500/40 via-cyan-500/30 to-emerald-500/20"
              />

              {/* Department Inquiries */}
              <div className="grid grid-cols-2 gap-3">
                <ContactChannel
                  href="mailto:billing@razr.marketing"
                  icon={<Mail className="w-5 h-5 text-violet-400" />}
                  title="Finance"
                  value="billing@razr.marketing"
                  delay={0.2}
                  accent="from-violet-500/40 to-indigo-500/20"
                />
                <ContactChannel
                  href="mailto:compliance@razr.marketing"
                  icon={<Mail className="w-5 h-5 text-cyan-400" />}
                  title="Compliance"
                  value="compliance@razr.marketing"
                  delay={0.22}
                  accent="from-cyan-500/40 to-emerald-500/20"
                />
              </div>

              {/* United Kingdom Global Headquarters */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="relative rounded-2xl border border-zinc-800 bg-[#060608] shadow-2xl backdrop-blur-xl p-5 overflow-hidden"
              >
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl" />
                <div className="relative flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-violet-950/60 border border-violet-500/30 flex items-center justify-center shrink-0 text-violet-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black uppercase tracking-wider bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">United Kingdom Global Headquarters</span>
                      <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded bg-zinc-900 text-cyan-400 border border-cyan-500/30 font-mono">UK: 14829104</span>
                    </div>
                    <div className="text-xs font-semibold text-zinc-300">RAZR Global Media International Limited</div>
                    <div className="text-[11px] text-zinc-400 leading-relaxed font-mono">
                      30 St Mary Axe (The Gherkin)<br />
                      City of London, London EC3A 8EP, United Kingdom
                    </div>
                    <div className="text-[10px] text-emerald-400 font-bold pt-1">
                      Desk Hours: 08:00 – 22:00 GMT · 24/7 Priority Emergency Coverage
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="relative rounded-2xl border border-zinc-800 bg-[#060608] p-4 overflow-hidden"
              >
                <div className="relative flex items-start gap-3">
                  <MessageCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-black uppercase tracking-wider bg-gradient-to-r from-pink-400 to-amber-300 bg-clip-text text-transparent mb-0.5">Direct Enterprise Liaison</div>
                    <div className="text-[11px] text-zinc-400 leading-relaxed">Speak directly with an assigned Senior Media Director regarding uncapped spend allocations, pixel routing, and multi-network campaigns.</div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* RIGHT: Premium Onboarding Portal CTA */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-7"
            >
              <div className="relative group rounded-3xl overflow-hidden h-full">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-[-200%] bg-[conic-gradient(from_0deg,transparent_0deg,rgba(139,92,246,0.4)_60deg,transparent_120deg,rgba(6,182,212,0.35)_240deg,transparent_300deg)] opacity-30"
                />
                <div className="relative rounded-3xl border border-zinc-800 bg-[#060608] p-8 md:p-12 overflow-hidden flex flex-col justify-center min-h-[460px] shadow-2xl">
                  <motion.div
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute top-0 left-0 w-1/3 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                  />
                  <motion.div
                    animate={{ x: ["200%", "-100%"] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-0 right-0 w-1/3 h-px bg-gradient-to-r from-transparent via-violet-400 to-transparent"
                  />

                  <div className="text-center md:text-left space-y-6">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-950/40 text-cyan-300 text-[10px] font-black uppercase tracking-wider mb-4">
                        ✨ Premier Access
                      </div>
                      <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight leading-tight">
                        <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">Apply for an Agency Ad Account</span>
                      </h2>
                      <p className="text-sm md:text-base text-zinc-300 mt-4 leading-relaxed">
                        Submit your business details and application information. Our team will review your application and update your status directly through your RAZR dashboard.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      <a
                        href="/signup"
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white text-xs font-black uppercase tracking-widest hover:opacity-95 transition-all shadow-xl shadow-violet-600/30 hover:scale-[1.02]"
                      >
                        Apply Now <ArrowUpRight className="w-4 h-4" />
                      </a>
                      <a
                        href="/login"
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-zinc-800 hover:border-violet-500/60 bg-zinc-950/80 hover:bg-violet-950/30 text-white text-xs font-black uppercase tracking-widest transition-all"
                      >
                        Login to Dashboard
                      </a>
                    </div>

                    <div className="pt-6 border-t border-zinc-800 text-xs text-zinc-400 flex items-center justify-center md:justify-start gap-2">
                      <span>Already have an account?</span>
                      <a href="/login" className="bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent hover:underline font-bold transition-colors">
                        Login here
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}

function ContactChannel({
  href, icon, title, value, badge, delay, accent,
}: {
  href: string; icon: React.ReactNode; title: string; value: string;
  badge?: string; delay: number; accent: string;
}) {
  const external = href.startsWith("http");
  return (
    <motion.a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -3 }}
      className="relative group block"
    >
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${accent} rounded-2xl blur opacity-0 group-hover:opacity-60 transition-opacity duration-500`} />
      <div className="relative rounded-2xl border border-zinc-800 bg-[#060608] shadow-2xl backdrop-blur-xl p-5 flex items-center justify-between gap-4 group-hover:border-zinc-700 transition-colors overflow-hidden">
        <div className={`absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br ${accent} rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
        <div className="relative flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl border border-zinc-800 bg-black/60 flex items-center justify-center shrink-0">
            {icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black uppercase tracking-tight text-white">{title}</h3>
              {badge && (
                <span className="text-[9px] font-black uppercase tracking-wider text-cyan-400 px-1.5 py-0.5 rounded border border-cyan-500/30 bg-cyan-950/60">{badge}</span>
              )}
            </div>
            <div className="text-xs text-zinc-400">{value}</div>
          </div>
        </div>
        <ArrowUpRight className="relative w-4 h-4 text-zinc-400 group-hover:text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
      </div>
    </motion.a>
  );
}
