import React from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, Wallet, FileText, ShoppingBag, Headphones } from "lucide-react";

export default function MobileGlassDock() {
  const [location] = useLocation();

  const DOCK_ITEMS = [
    { name: "Dashboard", href: "/app/dashboard", icon: LayoutDashboard },
    { name: "Wallet", href: "/app/wallet", icon: Wallet },
    { name: "Apply", href: "/app/application", icon: FileText },
    { name: "BM Store", href: "/app/buy-bm", icon: ShoppingBag },
    { name: "Support", href: "/app/support", icon: Headphones },
  ];

  return (
    <div className="md:hidden fixed bottom-4 left-4 right-4 z-40">
      <div className="mx-auto max-w-sm rounded-3xl border border-violet-500/30 bg-black/85 backdrop-blur-xl p-2 shadow-[0_10px_35px_rgba(0,0,0,0.8)] flex items-center justify-around">
        {DOCK_ITEMS.map((item) => {
          const isActive = location === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.name} href={item.href}>
              <a
                className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-violet-600/30 to-cyan-500/30 text-cyan-300 border border-violet-500/40 shadow-sm scale-105"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-cyan-400" : "text-zinc-400"}`} />
                <span className="text-[9px] font-black uppercase tracking-wider">{item.name}</span>
              </a>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
