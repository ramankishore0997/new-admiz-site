import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Home, Layers, Compass, Megaphone, MessageCircle, HelpCircle } from "lucide-react";
import { useState } from "react";

const ITEMS = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Layers, label: "Features", href: "/features" },
  { icon: Compass, label: "Solutions", href: "/solutions" },
  { icon: Megaphone, label: "Run Ads", href: "/advertise" },
  { icon: HelpCircle, label: "FAQ", href: "/faq" },
  { icon: MessageCircle, label: "Contact", href: "/contact" },
];

export default function GlassDock() {
  const [location] = useLocation();
  const [hover, setHover] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 hidden md:block pointer-events-none"
    >
      <div className="relative pointer-events-auto">
        {/* outer glow */}
        <div className="absolute -inset-3 bg-primary/10 blur-2xl rounded-full opacity-60" />
        {/* dock */}
        <div className="relative flex items-end gap-1.5 px-3 py-2.5 rounded-2xl border border-slate-200 bg-white/90 backdrop-blur-2xl shadow-xl shadow-slate-200/60">
          {ITEMS.map((item, i) => {
            const Icon = item.icon;
            const active = location === item.href;
            const isHover = hover === i;
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  animate={{
                    scale: isHover ? 1.35 : hover !== null && Math.abs(hover - i) === 1 ? 1.15 : 1,
                    y: isHover ? -8 : 0,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`relative group cursor-pointer p-3 rounded-xl transition-colors ${
                    active ? "bg-primary/10" : "hover:bg-slate-100"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${active ? "text-primary" : "text-slate-600 group-hover:text-slate-900"}`} />
                  {active && (
                    <motion.div
                      layoutId="dock-active-dot"
                      className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-1 h-1 rounded-full bg-primary shadow-[0_0_8px_rgba(5,150,105,0.35)]"
                    />
                  )}
                  {isHover && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-900 whitespace-nowrap shadow-lg shadow-slate-200/60"
                    >
                      {item.label}
                    </motion.div>
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
