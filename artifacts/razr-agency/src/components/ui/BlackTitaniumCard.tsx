import React from "react";
import { Sparkles, ArrowUpRight, Copy, Check, ExternalLink, Cpu, UserCheck, RefreshCw, Shield } from "lucide-react";
import { SiMeta, SiGoogleads, SiTiktok } from "react-icons/si";
import { BorderBeam } from "./BorderBeam";
import { useToast } from "@/hooks/use-toast";

interface BlackTitaniumCardProps {
  account: {
    id: string | number;
    name?: string;
    platform: string;
    status: string;
    balance?: number | string;
    spendLimit?: string;
    accountId?: string;
    inviteLink?: string;
    businessPortfolioId?: string;
    hatType?: string;
    country?: string;
    currency?: string;
  };
  onLoadFunds?: () => void;
  onBmAccess?: () => void;
  onRequestReplacement?: () => void;
}

export default function BlackTitaniumCard({
  account,
  onLoadFunds,
  onBmAccess,
  onRequestReplacement,
}: BlackTitaniumCardProps) {
  const { toast } = useToast();
  const [copied, setCopied] = React.useState(false);

  const getPlatformIcon = (platform: string) => {
    const l = (platform || "").toLowerCase();
    if (l.includes("meta") || l.includes("facebook")) return <SiMeta className="w-5 h-5 text-[#1877F2]" />;
    if (l.includes("google") || l.includes("youtube")) return <SiGoogleads className="w-5 h-5 text-yellow-400" />;
    if (l.includes("tiktok")) return <SiTiktok className="w-5 h-5 text-white" />;
    return <Sparkles className="w-5 h-5 text-cyan-400" />;
  };

  const getPartnerBadge = (platform: string) => {
    const l = (platform || "").toLowerCase();
    if (l.includes("meta") || l.includes("facebook")) return "Meta Premier Partner";
    if (l.includes("google") || l.includes("youtube")) return "Google Premier Partner";
    if (l.includes("tiktok")) return "TikTok Agency Partner";
    return "Enterprise Agency Line";
  };

  const isLive = account.status === "ACTIVE" || account.status === "APPROVED";
  const lineBalance = Number(account.balance) || 0;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      title: "Copied to Clipboard",
      description: `${label} copied successfully.`,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative rounded-3xl border border-white/10 bg-gradient-to-br from-[#0c0c14]/75 via-[#06060a]/65 to-[#080c12]/75 backdrop-blur-2xl p-6 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/50 hover:shadow-[0_20px_60px_-15px_rgba(139,92,246,0.3)] overflow-hidden flex flex-col justify-between">
      {/* Background Foil & Shimmer Highlights */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-violet-600/10 via-cyan-500/10 to-transparent rounded-full blur-2xl pointer-events-none group-hover:from-violet-600/20 group-hover:via-cyan-500/20 transition-all duration-500" />
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500 via-cyan-400 to-emerald-400 opacity-80 group-hover:opacity-100" />

      {/* Luminous Border Beam on Hover */}
      <BorderBeam size={180} duration={8} colorFrom="#8B5CF6" colorTo="#06B6D4" />

      <div>
        {/* Titanium Card Header */}
        <div className="relative z-10 flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-black border border-zinc-800 flex items-center justify-center shadow-inner group-hover:border-violet-500/40 transition-colors">
              {getPlatformIcon(account.platform)}
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-zinc-500" /> {getPartnerBadge(account.platform)}
              </div>
              <h4 className="text-sm font-black uppercase text-white tracking-tight mt-0.5">
                {account.name || `${account.platform} Line`}
              </h4>
            </div>
          </div>

          {/* Live Status Radar Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/80 border border-zinc-800 text-[9px] font-black uppercase tracking-wider">
            <span className="relative flex h-2 w-2">
              {isLive ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </>
              ) : (
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
              )}
            </span>
            <span className={isLive ? "text-emerald-400" : "text-amber-300"}>
              {account.status}
            </span>
          </div>
        </div>

        {/* Titanium Metallic Chip & Specs Strip */}
        <div className="relative z-10 rounded-2xl bg-black/70 border border-zinc-800/80 p-3.5 mb-4 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400 font-mono text-[10px] uppercase">Available Ad Spend</span>
            <span className="text-base font-black text-white font-mono tracking-tight tabular-nums">
              ${lineBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800/80 text-[10px] font-mono">
            <div>
              <span className="text-zinc-500 uppercase block text-[8px]">Daily Limit</span>
              <span className="text-zinc-200 font-bold">{account.spendLimit || "Uncapped ($50k+/day)"}</span>
            </div>
            <div>
              <span className="text-zinc-500 uppercase block text-[8px]">Account ID</span>
              <span className="text-cyan-300 font-bold truncate block">{account.accountId || "Provisioning..."}</span>
            </div>
          </div>
        </div>

        {/* Health Indicator */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-[9px] relative z-10">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center gap-1.5 text-cyan-300 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Health: 99.8%</span>
          </div>
          <div className="p-2 rounded-xl bg-black border border-zinc-800 flex items-center gap-1.5 text-zinc-300 font-bold">
            <Shield className="w-3 h-3 text-zinc-400" />
            <span>Enterprise ASN</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="relative z-10 space-y-2 pt-1">
        {onLoadFunds && isLive && (
          <button
            type="button"
            onClick={onLoadFunds}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-95 text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-md shadow-violet-600/20 cursor-pointer"
          >
            {account.status === "APPROVED" && Number(account.balance || 0) < 50 ? "Topup & Unlock BM Access" : "Load Budget"} <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        )}

        <div className="grid grid-cols-2 gap-2">
          {onBmAccess && (
            <button
              type="button"
              onClick={onBmAccess}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-black hover:bg-zinc-900 text-zinc-300 text-[9px] font-bold uppercase tracking-wider border border-zinc-800 transition-colors cursor-pointer shadow-2xs"
            >
              <UserCheck className="w-3 h-3 text-cyan-400" /> BM Access
            </button>
          )}

          {onRequestReplacement && (
            <button
              type="button"
              onClick={onRequestReplacement}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-black hover:bg-zinc-900 text-zinc-400 hover:text-rose-300 text-[9px] font-bold uppercase tracking-wider border border-zinc-800 transition-colors cursor-pointer shadow-2xs"
            >
              <RefreshCw className="w-3 h-3" /> Replace
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
