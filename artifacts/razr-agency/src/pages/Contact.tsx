import { useState, type FormEvent } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import { trackContact, trackLead } from "@/lib/pixel";
import { getAttributionLabel } from "@/lib/utm";
import { motion } from "framer-motion";
import { Sparkles, MessageCircle, Mail, ArrowUpRight, Activity, Clock, Users, Zap, MapPin } from "lucide-react";
import { SiTelegram } from "react-icons/si";

const CONTACT_EMAIL = "scale@razr.marketing";
const TELEGRAM_HANDLE = "RazrMarketing";
const TELEGRAM_URL = `https://t.me/${TELEGRAM_HANDLE}`;

export default function Contact() {
  const [name, setName] = useState("");
  const [telegram, setTelegram] = useState("");
  const [goal, setGoal] = useState("");
  const [focus, setFocus] = useState<string | null>(null);

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
    // Open Telegram — user can paste the message manually
    window.open(TELEGRAM_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <PageWrapper>
      <div className="absolute top-32 left-1/4 w-[600px] h-[600px] bg-primary/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      <section className="pt-28 pb-16 relative">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 backdrop-blur mb-6">
              <Sparkles className="w-3 h-3 text-primary" />
              <span className="text-[10px] font-black tracking-[0.2em] text-primary uppercase">Command Center</span>
            </div>
            <h1 className="text-[2.75rem] sm:text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.95] mb-4">
              Let's <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">connect.</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
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
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/30 to-primary/30 rounded-2xl blur opacity-40 group-hover:opacity-70 transition-opacity" />
                <div className="relative rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60 p-6 overflow-hidden">
                  <motion.div
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute top-0 left-0 w-1/3 h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent"
                  />
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 shadow-[0_0_10px_rgba(5,150,105,0.5)]" />
                      </span>
                      <span className="text-sm font-black uppercase tracking-widest text-slate-900">Live · Online</span>
                    </div>
                    <Activity className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-slate-500 mb-1">
                        <Users className="w-3 h-3" /> Active
                      </div>
                      <div className="text-2xl font-black text-slate-900 tabular-nums">3</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-slate-500 mb-1">
                        <Clock className="w-3 h-3" /> Avg
                      </div>
                      <div className="text-2xl font-black text-primary tabular-nums">12<span className="text-sm text-slate-500 ml-0.5">min</span></div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-slate-500 mb-1">
                        <Zap className="w-3 h-3" /> Today
                      </div>
                      <div className="text-2xl font-black text-slate-900 tabular-nums">47</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Telegram */}
              <ContactChannel
                href={TELEGRAM_URL}
                icon={<SiTelegram className="w-6 h-6 text-[#229ED9]" />}
                title="Telegram"
                value={`@${TELEGRAM_HANDLE}`}
                badge="Fastest"
                delay={0.15}
                accent="from-emerald-500/40 to-teal-500/20"
              />

              {/* Email */}
              <ContactChannel
                href={`mailto:${CONTACT_EMAIL}`}
                icon={<Mail className="w-6 h-6 text-primary" />}
                title="Email"
                value={CONTACT_EMAIL}
                delay={0.2}
                accent="from-primary/40 to-emerald-500/20"
              />

              {/* Hong Kong HQ */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="relative rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60 p-5 overflow-hidden"
              >
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />
                <div className="relative flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-black uppercase tracking-wider text-slate-900 mb-1">Hong Kong HQ</div>
                    <div className="text-xs text-slate-600 leading-relaxed">Hong Kong SAR, China — serving advertisers worldwide. Global delivery in every timezone.</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="relative rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60 p-5 mt-2 overflow-hidden"
              >
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />
                <div className="relative flex items-start gap-3">
                  <MessageCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-black uppercase tracking-wider text-slate-900 mb-1">Why message us?</div>
                    <div className="text-xs text-slate-600 leading-relaxed">Talk to a real human about your vertical, budget, and goals — get a custom plan within minutes.</div>
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
              <div className="relative group rounded-3xl overflow-hidden">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-[-200%] bg-[conic-gradient(from_0deg,transparent_0deg,rgba(5,150,105,0.35)_60deg,transparent_120deg,rgba(20,184,166,0.30)_240deg,transparent_300deg)] opacity-20"
                />
                <div className="relative rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 p-8 md:p-12 overflow-hidden flex flex-col justify-center min-h-[460px]">
                  <motion.div
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute top-0 left-0 w-1/3 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
                  />
                  <motion.div
                    animate={{ x: ["200%", "-100%"] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-0 right-0 w-1/3 h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent"
                  />

                  <div className="text-center md:text-left space-y-6">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-wider mb-4">
                        ✨ Premier Access
                      </div>
                      <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-slate-900 leading-tight">
                        Apply for an Agency Ad Account
                      </h2>
                      <p className="text-sm md:text-base text-slate-500 mt-4 leading-relaxed">
                        Submit your business details and application information. Our team will review your application and update your status directly through your RAZR dashboard.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      <a
                        href="/signup"
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-emerald-600 text-white text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/25"
                      >
                        Apply Now <ArrowUpRight className="w-4 h-4" />
                      </a>
                      <a
                        href="/login"
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-900 text-xs font-black uppercase tracking-widest transition-all"
                      >
                        Login to Dashboard
                      </a>
                    </div>

                    <div className="pt-6 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-center md:justify-start gap-2">
                      <span>Already have an account?</span>
                      <a href="/login" className="text-primary hover:underline font-bold transition-colors">
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

function PremiumField({ label, focused, children }: { label: string; focused: boolean; children: React.ReactNode }) {
  return (
    <div className="relative">
      <label className={`block text-[10px] font-black uppercase tracking-[0.2em] mb-2 transition-colors ${focused ? "text-primary" : "text-slate-500"}`}>
        {label}
      </label>
      <div className={`relative rounded-xl border bg-white px-5 py-3.5 transition-all ${focused ? "border-primary/50 bg-primary/[0.04] shadow-[0_0_30px_rgba(5,150,105,0.15)]" : "border-slate-200"}`}>
        {children}
      </div>
    </div>
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
      <div className="relative rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60 p-5 flex items-center justify-between gap-4 group-hover:border-slate-300 transition-colors overflow-hidden">
        <div className={`absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br ${accent} rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
        <div className="relative flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center shrink-0">
            {icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black uppercase tracking-tight text-slate-900">{title}</h3>
              {badge && (
                <span className="text-[9px] font-black uppercase tracking-wider text-primary px-1.5 py-0.5 rounded border border-primary/30 bg-primary/10">{badge}</span>
              )}
            </div>
            <div className="text-xs text-slate-500">{value}</div>
          </div>
        </div>
        <ArrowUpRight className="relative w-4 h-4 text-slate-400 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
      </div>
    </motion.a>
  );
}
