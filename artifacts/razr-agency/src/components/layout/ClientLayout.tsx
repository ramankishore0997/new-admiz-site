import { useState } from "react";
import { Link, useLocation } from "wouter";
import RazrLogo from "@/components/RazrLogo";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  Bell,
  HelpCircle,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles,
  ChevronRight,
  Zap,
  BookOpen,
  ShieldCheck,
  Building2,
  ShoppingBag,
  Wallet,
  ExternalLink
} from "lucide-react";
import { SiTelegram } from "react-icons/si";
import ClientGuideDrawer from "@/components/onboarding/ClientGuideDrawer";
import { PAYMENT_CONFIG } from "@/config/payment";

const TELEGRAM_SUPPORT_URL = PAYMENT_CONFIG.telegramSupportUrl || "https://t.me/RazrMarketing";

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
    <div className="flex flex-col h-full bg-white border-r border-slate-200 p-5 relative">
      {/* Glow effect */}
      <div className="absolute top-10 left-10 w-24 h-24 bg-emerald-200/40 rounded-full blur-2xl pointer-events-none" />

      {/* Brand logo */}
      <div className="flex items-center gap-3 mb-6 pb-5 border-b border-slate-200 relative z-10">
        <Link href="/">
          <RazrLogo size={32} />
        </Link>
      </div>

      {/* Menu sections */}
      <nav className="flex-1 space-y-6 relative z-10 overflow-y-auto pr-1">
        {CLIENT_MENU_SECTIONS.map((section) => (
          <div key={section.title} className="space-y-1.5">
            <div className="px-3 text-[9px] font-black uppercase tracking-widest text-slate-400">
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
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? "text-emerald-600" : "text-slate-400"}`} />
                      <span>{item.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {item.badge && (
                        <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {item.badge}
                        </span>
                      )}
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-emerald-600" />}
                    </div>
                  </a>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* 24/7 Dedicated Telegram Concierge Card */}
      <div className="my-2 p-3.5 rounded-2xl bg-gradient-to-br from-[#229ED9]/15 to-[#229ED9]/5 border border-[#229ED9]/30 text-slate-900 space-y-2 relative z-10 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#229ED9] flex items-center gap-1.5">
            <SiTelegram className="w-3.5 h-3.5" /> Telegram Concierge
          </span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </div>
        <p className="text-[11px] text-slate-600 font-medium leading-snug">
          Need instant limit increases, fast deposit approvals or emergency support?
        </p>
        <a
          href={TELEGRAM_SUPPORT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#229ED9] hover:bg-[#1a8bc2] text-white text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
        >
          <SiTelegram className="w-3 h-3" /> Message on Telegram
        </a>
      </div>

      {/* Quick Setup Guide Card */}
      <div className="my-2 p-3.5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white space-y-2 relative z-10 shadow-lg shadow-slate-900/10">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Quick Guide
          </span>
          <span className="text-[9px] text-slate-400 font-bold">4 Steps</span>
        </div>
        <p className="text-[11px] text-slate-300 font-medium leading-snug">
          Need step-by-step guidance on applying, deposits & BM setup?
        </p>
        <button
          type="button"
          onClick={() => {
            setIsGuideOpen(true);
            setIsMobileOpen(false);
          }}
          className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
        >
          <HelpCircle className="w-3.5 h-3.5" /> Open Step Guide
        </button>
      </div>

      {/* Bottom Profile / Logout */}
      <div className="pt-4 border-t border-slate-200 space-y-4 relative z-10">
        {user && (
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-xs font-black text-white shadow-md">
              {user.username.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 truncate">{user.username}</div>
              <div className="text-[9px] text-slate-500 truncate">{user.email}</div>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
        >
          <LogOut className="w-4 h-4 text-red-500" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row relative">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 sticky top-0 z-40">
        <Link href="/" className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="Razr Marketing"
            style={{ height: 48, width: "auto" }}
            className="object-contain"
          />
          <span className="text-sm font-black tracking-widest text-slate-900">RAZR</span>
        </Link>
        <div className="flex items-center gap-2">
          <a
            href={TELEGRAM_SUPPORT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#229ED9] text-white text-[10px] font-bold"
          >
            <SiTelegram className="w-3.5 h-3.5" />
            <span>Support</span>
          </a>
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 rounded bg-slate-100 border border-slate-200 text-slate-700"
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
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
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
                className="absolute top-4 right-[-48px] p-2.5 rounded-full bg-white border border-slate-200 text-slate-700 shadow-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 min-h-screen relative p-6 md:p-8 overflow-y-auto">
        {children}
      </main>

      {/* Global Interactive Platform Guide Drawer */}
      <ClientGuideDrawer
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}
