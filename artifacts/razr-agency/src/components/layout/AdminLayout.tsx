import { useState } from "react";
import { Link, useLocation } from "wouter";
import RazrLogo from "@/components/RazrLogo";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ClipboardList,
  Server,
  FileDown,
  Users,
  HelpCircle,
  Bell,
  History,
  Settings,
  LogOut,
  Menu,
  X,
  DollarSign,
  ChevronRight,
  MessageCircle,
  ShoppingBag
} from "lucide-react";

interface MenuItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
}

const ADMIN_MENU: MenuItem[] = [
  { name: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "BM Orders", href: "/admin/bm-orders", icon: ShoppingBag },
  { name: "Live Chat", href: "/admin/live-chat", icon: MessageCircle },
  { name: "Payments Approval", href: "/admin/payments", icon: DollarSign },
  { name: "Applications", href: "/admin/applications", icon: ClipboardList },
  { name: "Ad Accounts", href: "/admin/accounts", icon: Server },
  { name: "Client Docs", href: "/admin/documents", icon: FileDown },
  { name: "User Directory", href: "/admin/users", icon: Users },
  { name: "Support Tickets", href: "/admin/support", icon: HelpCircle },
  { name: "Notifications", href: "/admin/notifications", icon: Bell },
  { name: "Audit Trail", href: "/admin/audit-log", icon: History },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setLocation("/admin/login");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#060608] border-r border-zinc-800/80 p-6 relative">
      {/* Glow effect */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Brand logo */}
      <div className="flex items-center gap-3 mb-8 pb-5 border-b border-zinc-800/80 relative z-10">
        <Link href="/" className="flex items-center gap-2">
          <RazrLogo size={32} />
          <span className="text-[10px] font-black uppercase tracking-widest text-cyan-300 bg-violet-500/10 border border-violet-500/30 px-2.5 py-0.5 rounded-full ml-1">
            Ops
          </span>
        </Link>
      </div>

      {/* Menu links */}
      <nav className="flex-1 space-y-1.5 relative z-10 overflow-y-auto pr-1">
        {ADMIN_MENU.map((item) => {
          const isActive = location === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.name} href={item.href}>
              <span
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-violet-600/20 to-cyan-600/20 text-white border border-violet-500/40 shadow-lg shadow-violet-500/10"
                    : "text-zinc-400 hover:text-white hover:bg-black/60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-cyan-300" : "text-zinc-500"}`} />
                  <span>{item.name}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-cyan-300" />}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile / Logout */}
      <div className="pt-5 border-t border-zinc-800 space-y-4 relative z-10">
        {user && (
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-violet-600/30 to-cyan-600/30 border border-violet-500/40 flex items-center justify-center text-xs font-black text-cyan-300">
              {user.username.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">{user.username}</div>
              <div className="text-[8px] font-black uppercase tracking-widest text-cyan-400 mt-0.5">{user.role}</div>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-rose-400 hover:bg-rose-950/30 hover:text-rose-300 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-rose-400" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row relative">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-[#060608] border-b border-zinc-800 sticky top-0 z-40">
        <Link href="/" className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="Razr Marketing"
            style={{ height: 44, width: "auto" }}
            className="object-contain drop-shadow"
          />
          <span className="text-sm font-black tracking-widest text-white">RAZR OPS</span>
        </Link>
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2 rounded-xl bg-black border border-zinc-800 text-zinc-300 hover:text-white cursor-pointer"
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
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
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
                className="absolute top-4 right-[-48px] p-2.5 rounded-full bg-[#060608] border border-zinc-800 text-white shadow-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 min-h-screen relative p-6 md:p-8 overflow-y-auto bg-black">
        {children}
      </main>
    </div>
  );
}
