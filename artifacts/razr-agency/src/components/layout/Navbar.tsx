import { Link, useLocation } from "wouter";
import { motion, AnimatePresence, useScroll, useSpring, useMotionValue, useTransform } from "framer-motion";
import { useState, useEffect, useRef, type MouseEvent } from "react";
import { Menu, X, ArrowRight, Home, Sparkles, Layers, Workflow, Building2, HelpCircle, MessageCircle, Briefcase, Megaphone, Lock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

import RazrLogo from "@/components/RazrLogo";

const navLinks = [
  { name: "Features", href: "/features", icon: Sparkles },
  { name: "Solutions", href: "/solutions", icon: Layers },
  { name: "Agency Lines", href: "/agency-accounts", icon: Briefcase },
  { name: "Process", href: "/how-it-works", icon: Workflow },
  { name: "Contact", href: "/contact", icon: MessageCircle },
];

// ─────────── Multi-Color Magnetic CTA Button ───────────
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

  const targetPath = user ? "/app/dashboard" : "/login";

  return (
    <motion.a
      ref={ref}
      href={targetPath}
      onClick={(e) => { e.preventDefault(); setLocation(targetPath); }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x, y }}
      className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-violet-600 via-cyan-500 to-emerald-500 text-white text-xs font-black uppercase tracking-widest overflow-hidden group cursor-pointer shadow-[0_0_25px_rgba(139,92,246,0.35)] hover:shadow-[0_0_35px_rgba(6,182,212,0.5)] transition-all"
    >
      <motion.span
        aria-hidden
        className="absolute inset-y-0 -left-full w-1/2 bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-12"
        animate={{ x: ["0%", "300%"] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.5 }}
      />
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
        ...navLinks,
        { name: "Dashboard", href: "/app/dashboard", icon: Briefcase },
      ]
    : [
        ...navLinks,
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
    ([x, y]) => `radial-gradient(220px circle at ${x}px ${y}px, rgba(139,92,246,0.25), transparent 70%)`
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
      {/* Multi-Color Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-violet-500 via-cyan-400 to-emerald-400 z-[60] origin-left shadow-[0_0_12px_rgba(6,182,212,0.8)]"
        style={{ scaleX }}
      />

      {/* Floating Deep Pitch Black Navbar */}
      <div
        className="fixed left-0 right-0 z-50 flex justify-center pointer-events-none transition-all duration-500"
        style={{ top: isScrolled ? "12px" : "18px" }}
      >
        <motion.header
          ref={navRef}
          onMouseMove={onNavMove}
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={`pointer-events-auto relative rounded-full border backdrop-blur-2xl transition-all duration-700 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] ${
            isScrolled
              ? "bg-black/95 border-zinc-800 px-3 py-2 scale-[0.96] shadow-[0_15px_40px_-10px_rgba(0,0,0,0.9),0_0_0_1px_rgba(139,92,246,0.3)_inset]"
              : "bg-black/90 border-zinc-800/90 px-4 py-2.5 shadow-[0_12px_35px_-12px_rgba(0,0,0,0.85)]"
          }`}
        >
          {/* Mouse spotlight overlay */}
          <motion.div
            aria-hidden
            className="absolute inset-0 rounded-full pointer-events-none opacity-50"
            style={{ background: spotMask }}
          />

          <div className="relative flex items-center gap-2">
            {/* Multi-Color Logo */}
            <Link href="/" className="flex items-center pl-2 pr-3 group">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <RazrLogo size={36} />
              </motion.div>
            </Link>

            {/* Divider */}
            <div className="hidden md:block w-px h-6 bg-zinc-800" />

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
                        className="absolute inset-0 rounded-full bg-zinc-850"
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      />
                    )}
                    {/* Active pill with multi-color border & glow */}
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-600/25 via-cyan-500/20 to-emerald-500/25 border border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                        transition={{ type: "spring", stiffness: 300, damping: 28 }}
                      />
                    )}
                    <span className={`relative transition-colors ${isActive ? "bg-gradient-to-r from-violet-300 via-cyan-300 to-emerald-300 bg-clip-text text-transparent font-extrabold" : "text-zinc-400 hover:text-white"}`}>
                      {link.name}
                    </span>
                  </Link>
                );
              })}
            </nav>

            {/* Divider */}
            <div className="hidden md:block w-px h-6 bg-zinc-800 ml-1" />

            {/* Multi-Color CTA */}
            <div className="hidden md:flex items-center pl-2 pr-1">
              <MagneticCTA />
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              className="md:hidden relative w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:bg-zinc-800 transition-colors"
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
            className="md:hidden fixed inset-0 z-40 bg-black/98 backdrop-blur-2xl pt-24 px-6 pb-8 overflow-y-auto text-white"
          >
            <div className="relative max-w-md mx-auto">
              <div className="text-[10px] font-black tracking-[0.25em] text-zinc-500 uppercase mb-6">Navigate</div>
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
                            ? "border-cyan-500/50 bg-gradient-to-r from-violet-600/20 via-cyan-500/20 to-emerald-500/20 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
                            : "border-zinc-800/90 bg-[#060608] hover:border-zinc-700 hover:bg-zinc-950"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isActive ? "bg-violet-600/30 text-cyan-300 shadow-md" : "bg-zinc-900 text-zinc-400 group-hover:text-white"}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className={`text-base font-black uppercase tracking-tight ${isActive ? "bg-gradient-to-r from-violet-300 via-cyan-300 to-emerald-300 bg-clip-text text-transparent" : "text-zinc-300"}`}>
                            {link.name}
                          </span>
                        </div>
                        <ArrowRight className={`w-4 h-4 transition-all ${isActive ? "text-cyan-300" : "text-zinc-500 group-hover:translate-x-1 group-hover:text-zinc-300"}`} />
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Mobile CTA */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
                <Link
                  href={user ? "/app/dashboard" : "/login"}
                  onClick={() => setOpen(false)}
                  className="relative block group rounded-2xl overflow-hidden"
                >
                  <div className="relative bg-gradient-to-r from-violet-600 via-cyan-500 to-emerald-500 text-white py-5 text-center text-sm font-black uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-violet-600/40">
                    {user ? "Dashboard" : "Get Access"} <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
                <div className="mt-5 flex items-center justify-center gap-2 text-xs text-zinc-500">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-400" />
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
