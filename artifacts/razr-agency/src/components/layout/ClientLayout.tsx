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
  ChevronRight
} from "lucide-react";

interface MenuItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
}

const CLIENT_MENU: MenuItem[] = [
  { name: "Overview", href: "/app/dashboard", icon: LayoutDashboard },
  { name: "My Application", href: "/app/application", icon: FileText },
  { name: "Notifications", href: "/app/notifications", icon: Bell },
  { name: "Support Center", href: "/app/support", icon: HelpCircle },
  { name: "Account Profile", href: "/app/account", icon: User },
  { name: "Settings", href: "/app/settings", icon: Settings },
];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setLocation("/login");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 p-6 relative">
      {/* Glow effect */}
      <div className="absolute top-10 left-10 w-24 h-24 bg-emerald-200/40 rounded-full blur-2xl pointer-events-none" />

      {/* Brand logo */}
      <div className="flex items-center gap-3 mb-10 pb-6 border-b border-slate-200 relative z-10">
        <Link href="/">
          <RazrLogo size={32} />
        </Link>
      </div>

      {/* Menu links */}
      <nav className="flex-1 space-y-1.5 relative z-10">
        {CLIENT_MENU.map((item) => {
          const isActive = location === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.name} href={item.href}>
              <a
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-emerald-600" : "text-slate-400"}`} />
                  <span>{item.name}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5" />}
              </a>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile / Logout */}
      <div className="pt-6 border-t border-slate-200 space-y-4 relative z-10">
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
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2 rounded bg-slate-100 border border-slate-200 text-slate-700"
        >
          <Menu className="w-5 h-5" />
        </button>
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
    </div>
  );
}
