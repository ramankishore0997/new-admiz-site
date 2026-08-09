import { Link, useLocation } from "wouter";
import { motion, AnimatePresence, useScroll, useSpring, useMotionValue, useTransform } from "framer-motion";
import { useState, useEffect, useRef, type MouseEvent } from "react";
import { Menu, X, ArrowRight, Home, Sparkles, Layers, Workflow, Building2, HelpCircle, MessageCircle, Briefcase, Megaphone, Lock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

import RazrLogo from "@/components/RazrLogo";

const navLinks = [
  { name: "Home", href: "/", icon: Home },
  { name: "Features", href: "/features", icon: Sparkles },
  { name: "Solutions", href: "/solutions", icon: Layers },
  { name: "Accounts", href: "/agency-accounts", icon: Briefcase },
  { name: "Process", href: "/how-it-works", icon: Workflow },
  { name: "Run Ads", href: "/advertise", icon: Megaphone },
  { name: "About", href: "/about", icon: Building2 },
  { name: "FAQ", href: "/faq", icon: HelpCircle },
  { name: "Contact", href: "/contact", icon: MessageCircle },
];

// ─────────── Magnetic CTA Button ───────────
function MagneticCTA() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const ref = useRef<HTMLAnchorElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 220, damping: 18 });
  const y = useSpring(my, { stiffness: 220, damping: 18 });

  const onMove = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - (r.left + r.width / 2)) * 0.25);
    my.set((e.clientY - (r.top + r.height / 2)) * 0.25);
  };
  const onLeave = () => { mx.set(0); my.set(0); };

  const targetPath = user ? "/app/dashboard" : "/apply-agency";

  return (
    <motion.a
      ref={ref}
      href={targetPath}
      onClick={(e) => { e.preventDefault(); setLocation(targetPath); }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x, y }}
      className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 text-white text-xs font-black uppercase tracking-widest overflow-hidden group cursor-pointer shadow-lg shadow-emerald-600/25"
    >
      <motion.span
        aria-hidden
        className="absolute inset-y-0 -left-full w-1/2 bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-12"
        animate={{ x: ["0%", "300%"] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.5 }}
      />
      <span className="absolute inset-0 bg-gradient-to-r from-emerald-700 via-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <span className="relative">{user ? "Dashboard" : "Get Access"}</span>
      <ArrowRight className="relative w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
    </motion.a>
  );
}

export default function Navbar() {
  const { user } = useAuth();
  const [location] = useLocation();

  const dynamicLinks = user
    ? [
        ...navLinks.filter((l) => l.name !== "Contact" && l.name !== "Run Ads"),
        { name: "Dashboard", href: "/app/dashboard", icon: Briefcase },
      ]
    : [
        ...navLinks.filter((l) => l.name !== "Run Ads"),
        { name: "Login", href: "/login", icon: Lock },
      ];
  const [isScrolled, setIsScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const spotX = useMotionValue(0);
  const spotY = useMotionValue(0);
  const spotXs = useSpring(spotX, { stiffness: 120, damping: 20 });
  const spotYs = useSpring(spotY, { stiffness: 120, damping: 20 });
  const spotMask = useTransform(
    [spotXs, spotYs],
    ([x, y]) => `radial-gradient(220px circle at ${x}px ${y}px, rgba(5,150,105,0.10), transparent 70%)`
  );

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location]);

  const onNavMove = (e: MouseEvent<HTMLElement>) => {
    if (!navRef.current) return;
    const r = navRef.current.getBoundingClientRect();
    spotX.set(e.clientX - r.left);
    spotY.set(e.clientY - r.top);
  };

  return (
    <>
      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-600 via-emerald-400 to-teal-400 z-[60] origin-left"
        style={{ scaleX }}
      />

      {/* Floating Glass Navbar */}
      <div
        className="fixed left-0 right-0 z-50 flex justify-center pointer-events-none transition-all duration-500"
        style={{ top: `calc(var(--topbar-h, 0px) + ${isScrolled ? "12px" : "20px"})` }}
      >
        <motion.header
          ref={navRef}
          onMouseMove={onNavMove}
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={`pointer-events-auto relative rounded-full border backdrop-blur-xl transition-all duration-700 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] ${
            isScrolled
              ? "bg-white/95 border-slate-200 px-3 py-2 scale-[0.96] shadow-[0_12px_40px_-12px_rgba(15,23,42,0.18),0_0_0_1px_rgba(5,150,105,0.08)_inset]"
              : "bg-white/80 border-slate-200/80 px-4 py-2.5 shadow-[0_10px_35px_-15px_rgba(15,23,42,0.15)]"
          }`}
        >
          {/* Mouse spotlight overlay */}
          <motion.div
            aria-hidden
            className="absolute inset-0 rounded-full pointer-events-none opacity-60"
            style={{ background: spotMask }}
          />
          {/* Soft inner ring */}
          <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-slate-900/5 pointer-events-none" />

          <div className="relative flex items-center gap-2">
            {/* Logo */}
            <Link href="/" className="flex items-center pl-2 pr-3 group">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <RazrLogo size={36} />
              </motion.div>
            </Link>

            {/* Divider */}
            <div className="hidden md:block w-px h-6 bg-slate-200" />

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-0.5">
              {dynamicLinks.map((link) => {
                const isActive = location === link.href;
                const isHovered = hovered === link.name;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onMouseEnter={() => setHovered(link.name)}
                    onMouseLeave={() => setHovered(null)}
                    className="relative px-3.5 lg:px-4 py-2 text-[11px] lg:text-xs font-bold tracking-[0.12em] uppercase rounded-full transition-colors"
                  >
                    {/* Hover background */}
                    {isHovered && !isActive && (
                      <motion.span
                        layoutId="nav-hover"
                        className="absolute inset-0 rounded-full bg-slate-100"
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      />
                    )}
                    {/* Active pill */}
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-full bg-emerald-50 border border-emerald-200 shadow-sm"
                        transition={{ type: "spring", stiffness: 300, damping: 28 }}
                      />
                    )}
                    <span className={`relative transition-colors ${isActive ? "text-emerald-700" : "text-slate-500 hover:text-slate-900"}`}>
                      {link.name}
                    </span>
                  </Link>
                );
              })}
            </nav>

            {/* Divider */}
            <div className="hidden md:block w-px h-6 bg-slate-200 ml-1" />

            {/* Status + CTA */}
            <div className="hidden md:flex items-center gap-3 pl-2 pr-1">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                </span>
                <span className="text-[9px] font-black tracking-wider text-emerald-700 uppercase">Hong Kong · Global Supply</span>
              </div>
              <MagneticCTA />
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              className="md:hidden relative w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-200 transition-colors"
            >
              {open ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </motion.header>
      </div>

      {/* Mobile Full-Screen Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed inset-0 z-40 bg-white/98 backdrop-blur-2xl pt-24 px-6 pb-8 overflow-y-auto"
          >
            {/* Ambient glows */}
            <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-emerald-200/40 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-teal-200/40 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative max-w-md mx-auto">
              <div className="text-[10px] font-black tracking-[0.25em] text-slate-400 uppercase mb-6">Navigate</div>
              {/* Mobile Nav */}
              <nav className="flex flex-col gap-2 mb-8">
                {dynamicLinks.map((link, i) => {
                  const Icon = link.icon;
                  const isActive = location === link.href;
                  return (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.05 + i * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={`relative group flex items-center justify-between px-5 py-4 rounded-2xl border transition-all overflow-hidden ${
                          isActive
                            ? "border-emerald-200 bg-emerald-50"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500 group-hover:text-slate-700"}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className={`text-base font-black uppercase tracking-tight ${isActive ? "text-emerald-700" : "text-slate-800"}`}>
                            {link.name}
                          </span>
                        </div>
                        <ArrowRight className={`w-4 h-4 transition-all ${isActive ? "text-emerald-600" : "text-slate-300 group-hover:translate-x-1 group-hover:text-slate-500"}`} />
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Mobile CTA */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
                <Link
                  href={user ? "/app/dashboard" : "/apply-agency"}
                  onClick={() => setOpen(false)}
                  className="relative block group rounded-2xl overflow-hidden"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 rounded-2xl blur opacity-60" />
                  <div className="relative bg-emerald-600 text-white py-5 text-center text-sm font-black uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center gap-3">
                    {user ? "Dashboard" : "Get Access"} <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
                <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-500">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                  </span>
                  Team online · Avg response 12 min
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
