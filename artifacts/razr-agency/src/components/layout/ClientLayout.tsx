import { useState } from "react";
import { Link, useLocation } from "wouter";
import RazrLogo from "@/components/RazrLogo";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  HelpCircle,
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles,
  ChevronRight,
  BookOpen,
  ShieldCheck,
  ShoppingBag,
  Wallet,
  Headphones
} from "lucide-react";
import { SiTelegram, SiWhatsapp } from "react-icons/si";
import ClientGuideDrawer from "@/components/onboarding/ClientGuideDrawer";
import MobileGlassDock from "@/components/layout/MobileGlassDock";
import DimensionalField from "@/components/ui/dimensional-field";
import { PAYMENT_CONFIG } from "@/config/payment";

const TELEGRAM_SUPPORT_URL = PAYMENT_CONFIG.telegramSupportUrl || "https://t.me/RazrMarketing";
const WHATSAPP_SUPPORT_URL = PAYMENT_CONFIG.whatsappSupportUrl || "https://wa.me/447473951923?text=Hello%20Razr%20Support,%20I%20need%20assistance";

interface MenuItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  badge?: string;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

const CLIENT_MENU_SECTIONS: MenuSection[] = [
  {
    title: "Core Operations",
    items: [
      { name: "Dashboard", href: "/app/dashboard", icon: LayoutDashboard },
      { name: "Wallet & Funds", href: "/app/wallet", icon: Wallet, badge: "USDT" },
      { name: "My Ad Accounts", href: "/app/application", icon: FileText, badge: "Instant" },
      { name: "Buy Business Manager", href: "/app/buy-bm", icon: ShoppingBag, badge: "Store" },
    ],
  },
  {
    title: "Resources & Help",
    items: [
      { name: "Scaling Playbook", href: "/app/playbook", icon: BookOpen },
      { name: "SLA Guarantee", href: "/app/guarantee", icon: ShieldCheck, badge: "100%" },
      { name: "Support Center", href: "/app/support", icon: HelpCircle },
      { name: "Account Settings", href: "/app/settings", icon: Settings },
    ],
  },
];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setLocation("/login");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#060608] border-r border-zinc-800 p-5 relative">
      {/* Glow effect */}
      <div className="absolute top-10 left-10 w-24 h-24 bg-violet-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Brand logo */}
      <div className="flex items-center gap-3 mb-6 pb-5 border-b border-zinc-800/80 relative z-10">
        <Link href="/">
          <RazrLogo size={32} />
        </Link>
      </div>

      {/* Menu sections */}
      <nav className="flex-1 space-y-6 relative z-10 overflow-y-auto pr-1">
        {CLIENT_MENU_SECTIONS.map((section) => (
          <div key={section.title} className="space-y-1.5">
            <div className="px-3 text-[9px] font-black uppercase tracking-widest bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent">
              {section.title}
            </div>
            {section.items.map((item) => {
              const isActive = location === item.href;
              const Icon = item.icon;
              return (
                <Link key={item.name} href={item.href}>
                  <a
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-violet-600/20 via-indigo-600/20 to-cyan-500/20 text-white border border-violet-500/40 shadow-sm"
                        : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? "text-cyan-400" : "text-zinc-500"}`} />
                      <span>{item.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {item.badge && (
                        <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-violet-950/60 text-cyan-300 border border-violet-500/30">
                          {item.badge}
                        </span>
                      )}
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />}
                    </div>
                  </a>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* 24/7 Dedicated Concierge Support Card */}
      <div className="my-2 p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-white space-y-2.5 relative z-10 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent flex items-center gap-1.5">
            <Headphones className="w-3.5 h-3.5 text-cyan-400" /> 24/7 Live Concierge
          </span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </div>
        <p className="text-[11px] text-zinc-400 font-medium leading-snug">
          Instant limit boosts, deposit approvals & account setup.
        </p>
        <div className="grid grid-cols-2 gap-1.5 pt-0.5">
          <a
            href={TELEGRAM_SUPPORT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-95 text-white text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer"
          >
            <SiTelegram className="w-3.5 h-3.5" /> Telegram
          </a>
          <a
            href={WHATSAPP_SUPPORT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-white text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer"
          >
            <SiWhatsapp className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp
          </a>
        </div>
      </div>

      {/* Quick Setup Guide Card */}
      <div className="my-2 p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-white space-y-2 relative z-10">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-pink-400 to-amber-300 bg-clip-text text-transparent flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-300" /> Quick Guide
          </span>
          <span className="text-[9px] text-zinc-500 font-bold">4 Steps</span>
        </div>
        <button
          type="button"
          onClick={() => {
            setIsGuideOpen(true);
            setIsMobileOpen(false);
          }}
          className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#060608] hover:bg-zinc-900 text-white text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer border border-zinc-800"
        >
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" /> Open Step Guide
        </button>
      </div>

      {/* Bottom Profile / Logout */}
      <div className="pt-4 border-t border-zinc-800 space-y-4 relative z-10">
        {user && (
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-xs font-black text-cyan-400">
              {user.username.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">{user.username}</div>
              <div className="text-[9px] text-zinc-500 truncate">{user.email}</div>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-rose-400 hover:bg-rose-950/30 hover:text-rose-300 transition-colors"
        >
          <LogOut className="w-4 h-4 text-rose-400" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-foreground flex flex-col md:flex-row relative">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-[#060608] border-b border-zinc-800 sticky top-0 z-40">
        <Link href="/" className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="Razr Marketing"
            style={{ height: 44, width: "auto" }}
            className="object-contain drop-shadow"
          />
          <span className="text-sm font-black tracking-widest text-white">RAZR</span>
        </Link>
        <div className="flex items-center gap-2">
          <a
            href={TELEGRAM_SUPPORT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-[10px] font-bold"
            title="Telegram Support"
          >
            <SiTelegram className="w-3.5 h-3.5" />
          </a>
          <a
            href={WHATSAPP_SUPPORT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-[10px] font-bold"
            title="WhatsApp Support"
          >
            <SiWhatsapp className="w-3.5 h-3.5 text-emerald-400" />
          </a>
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Sidebar - Desktop */}
      <aside className="hidden md:block w-64 shrink-0 h-screen sticky top-0 overflow-y-auto">
        <SidebarContent />
      </aside>

      {/* Sidebar - Mobile Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-64 h-full"
            >
              <SidebarContent />
              <button
                onClick={() => setIsMobileOpen(false)}
                className="absolute top-4 right-[-48px] p-2.5 rounded-full bg-zinc-900 border border-zinc-800 text-white shadow-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content Area with Vanguard Dimensional Architecture Field Background */}
      <main className="flex-1 min-w-0 min-h-screen relative p-6 md:p-8 pb-24 md:pb-8 overflow-y-auto bg-[#050608]">
        {/* Full-Screen Dimensional Three.js WebGL Architecture */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-75">
          <DimensionalField className="w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050608]/70 via-[#050608]/40 to-[#050608]/85 pointer-events-none" />
        </div>

        <div className="relative z-10">{children}</div>
      </main>

      {/* Mobile Floating iOS Glass Dock */}
      <MobileGlassDock />

      {/* Global Interactive Platform Guide Drawer */}
      <ClientGuideDrawer
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}
