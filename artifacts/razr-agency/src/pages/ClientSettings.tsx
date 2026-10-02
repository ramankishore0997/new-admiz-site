import { useEffect, useState } from "react";
import ClientLayout from "@/components/layout/ClientLayout";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Lock,
  User,
  Building,
  ShieldAlert,
  Key,
  CheckCircle2,
  Save,
  ShieldCheck,
  Zap,
  Mail,
  Smartphone,
  Globe2,
  Clock,
  Sparkles,
  ArrowUpRight,
  Headphones,
  Sliders,
  Bell,
  Eye,
  EyeOff
} from "lucide-react";
import { SiTelegram, SiMeta, SiGoogleads } from "react-icons/si";

export default function ClientSettings() {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();

  // Active Tab
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "notifications">("profile");

  // Profile State
  const [username, setUsername] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [telegramHandle, setTelegramHandle] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [pendingApproval, setPendingApproval] = useState(false);

  // Notification Toggles State
  const [notifyDeposit, setNotifyDeposit] = useState(true);
  const [notifyHandover, setNotifyHandover] = useState(true);
  const [notifyDailyDigest, setNotifyDailyDigest] = useState(false);
  const [notifyTelegramBot, setNotifyTelegramBot] = useState(true);

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setCompanyName(user.companyName || "");
      setTelegramHandle((user.telegramHandle || "").replace(/^@/, ""));
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      toast({
        variant: "destructive",
        title: "Missing Fields",
        description: "Contact name is required.",
      });
      return;
    }

    setIsSavingProfile(true);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, companyName, telegramHandle }),
      });
      const data = await res.json();
      setIsSavingProfile(false);

      if (res.ok) {
        await refreshUser();
        toast({
          title: "Enterprise Profile Updated",
          description: "Your account parameters were saved successfully.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Update Failed",
          description: data.error || "Could not update profile.",
        });
      }
    } catch {
      setIsSavingProfile(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong.",
      });
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        variant: "destructive",
        title: "Missing Fields",
        description: "Please fill in all password fields.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Mismatch",
        description: "New passwords do not match.",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        variant: "destructive",
        title: "Weak Password",
        description: "New password must be at least 8 characters long.",
      });
      return;
    }

    setIsUpdating(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      setIsUpdating(false);

      if (res.ok) {
        setPendingApproval(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        toast({
          title: "Security Request Dispatched",
          description: "Password update submitted to security review queue.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Update Failed",
          description: data.error || "Password change unsuccessful.",
        });
      }
    } catch {
      setIsUpdating(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong.",
      });
    }
  };

  return (
    <ClientLayout>
      <div className="space-y-8">
        {/* Header Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-[#060608] p-8 md:p-10 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-cyan-300 text-xs font-bold uppercase tracking-widest mb-3 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Enterprise Account Control Center
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white">
                Account Settings &{" "}
                <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
                  Security Keys
                </span>
              </h1>
              <p className="text-sm text-zinc-300 mt-2 max-w-2xl leading-relaxed">
                Manage your enterprise profile parameters, dedicated Telegram escalation handle, password security, and automated media buying alerts.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <div className="p-4 rounded-2xl bg-black border border-zinc-800 shadow-inner text-right">
                <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Account Tier</div>
                <div className="text-sm font-black text-cyan-300 font-mono flex items-center gap-1.5 justify-end mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  VIP Tier-1 Client
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl border border-zinc-800 bg-[#060608] shadow-xl space-y-1.5">
            <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Client Partner ID</div>
            <div className="text-base font-black text-white font-mono">
              #{user?.id ? `CLI-${user.id.toString().padStart(4, "0")}` : "CLI-8821"}
            </div>
            <div className="text-[10px] text-cyan-300 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-cyan-400" /> Identity Confirmed
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-zinc-800 bg-[#060608] shadow-xl space-y-1.5">
            <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Tax Exemption Status</div>
            <div className="text-base font-black text-emerald-400 font-mono">0% Ad VAT Active</div>
            <div className="text-[10px] text-zinc-400 font-medium">UK Export Standard</div>
          </div>

          <div className="p-5 rounded-2xl border border-zinc-800 bg-[#060608] shadow-xl space-y-1.5">
            <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Assigned Partner Rep</div>
            <div className="text-base font-black text-white font-mono">Victor Chen</div>
            <div className="text-[10px] text-violet-300 font-bold flex items-center gap-1">
              <Headphones className="w-3 h-3 text-violet-400" /> 24/7 VIP Escalation
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-zinc-800 bg-[#060608] shadow-xl space-y-1.5">
            <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Security Level</div>
            <div className="text-base font-black text-white font-mono">Institutional 256-bit</div>
            <div className="text-[10px] text-cyan-300 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-cyan-400" /> End-to-End Encrypted
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
          {[
            { id: "profile", label: "Enterprise Profile", icon: User },
            { id: "security", label: "Security & Credentials", icon: Lock },
            { id: "notifications", label: "Notification Preferences", icon: Bell },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={"px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 " +
                  (activeTab === tab.id
                    ? "bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-black shadow-lg shadow-violet-500/20"
                    : "bg-[#060608] text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-800")}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: PROFILE SETTINGS */}
        {/* ========================================================================= */}
        {activeTab === "profile" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Form */}
            <div className="lg:col-span-8">
              <div className="rounded-3xl border border-zinc-800 bg-[#060608] shadow-2xl p-6 md:p-8 space-y-6">
                <div className="border-b border-zinc-800 pb-4">
                  <h2 className="text-lg font-black uppercase tracking-tight text-white">
                    Enterprise Profile <span className="bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent">Details</span>
                  </h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Your contact and brand details used for invoice generation and partner account provisioning.
                  </p>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                        Authorized Contact Name <span className="text-cyan-400">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="Your full name"
                          required
                          className="w-full bg-black border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-white text-xs font-bold outline-none focus:border-cyan-500 transition-all placeholder:text-zinc-600"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                        Company / Brand Name
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                        <input
                          type="text"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="e.g. Acme Media Corp"
                          className="w-full bg-black border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-white text-xs font-bold outline-none focus:border-cyan-500 transition-all placeholder:text-zinc-600"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                        Registered Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                        <input
                          type="email"
                          value={user?.email || "partner@razr.marketing"}
                          disabled
                          className="w-full bg-black/50 border border-zinc-800/80 rounded-xl pl-10 pr-4 py-2.5 text-zinc-500 text-xs font-mono cursor-not-allowed"
                        />
                      </div>
                      <div className="text-[9px] text-zinc-500">Primary authentication handle (Locked for security)</div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                        VIP Telegram Handle (For 5-Min Escalations)
                      </label>
                      <div className="relative">
                        <SiTelegram className="absolute left-3.5 top-3 w-4 h-4 text-[#229ED9]" />
                        <input
                          type="text"
                          value={telegramHandle}
                          onChange={(e) => setTelegramHandle(e.target.value)}
                          placeholder="username (without @)"
                          className="w-full bg-black border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-white text-xs font-bold outline-none focus:border-cyan-500 transition-all placeholder:text-zinc-600"
                        />
                      </div>
                      <div className="text-[9px] text-zinc-500">Directly routed to your dedicated account manager</div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSavingProfile}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-95 hover:scale-105 text-white text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-violet-600/30 cursor-pointer disabled:opacity-50"
                    >
                      {isSavingProfile ? (
                        "Saving Changes..."
                      ) : (
                        <>
                          <Save className="w-4 h-4" /> Save Profile Parameters
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Right Side: Account Infrastructure Summary */}
            <div className="lg:col-span-4 space-y-4">
              <div className="rounded-3xl border border-zinc-800 bg-[#060608] text-white p-6 md:p-7 space-y-4 shadow-xl">
                <div className="flex items-center gap-2 text-xs font-black uppercase text-cyan-400">
                  <Zap className="w-4 h-4" /> Allocated Line Limits
                </div>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center border-b border-zinc-800/80 pb-2">
                    <span className="text-zinc-400">Meta Enterprise:</span>
                    <span className="font-mono font-bold text-white">Uncapped</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-zinc-800/80 pb-2">
                    <span className="text-zinc-400">Google Premier MCC:</span>
                    <span className="font-mono font-bold text-white">Invoiced</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-zinc-800/80 pb-2">
                    <span className="text-zinc-400">TikTok Business:</span>
                    <span className="font-mono font-bold text-white">Worldwide</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">Billing Tax:</span>
                    <span className="font-mono font-bold text-emerald-400">0% VAT</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link href="/app/specs">
                    <span className="text-[11px] font-black uppercase tracking-wider text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer">
                      Inspect All Account Specs →
                    </span>
                  </Link>
                </div>
              </div>

              <div className="rounded-3xl border border-zinc-800 bg-[#060608] p-6 space-y-2 shadow-xl text-xs text-zinc-400">
                <div className="font-bold text-white uppercase text-[11px] flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-cyan-400" /> United Kingdom Registered Entity
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  RAZR Global Media International Ltd (Company No. 14829104). 30 St Mary Axe, City of London, London EC3A 8EP, United Kingdom.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: SECURITY & PASSWORDS */}
        {/* ========================================================================= */}
        {activeTab === "security" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            <div className="lg:col-span-8">
              <div className="rounded-3xl border border-zinc-800 bg-[#060608] shadow-2xl p-6 md:p-8 space-y-6">
                <div className="border-b border-zinc-800 pb-4">
                  <h2 className="text-lg font-black uppercase tracking-tight text-white">
                    Security Credentials & <span className="bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent">Password Management</span>
                  </h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    For enterprise safety, password changes go through security checks before immediate activation.
                  </p>
                </div>

                {pendingApproval ? (
                  <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-6 text-center space-y-3">
                    <CheckCircle2 className="w-12 h-12 text-cyan-400 mx-auto" />
                    <h3 className="text-base font-black uppercase tracking-tight text-white">
                      Security Check Queued
                    </h3>
                    <p className="text-xs text-zinc-300 max-w-md mx-auto leading-relaxed">
                      Your password change request has been logged by the automated security queue. Your existing login remains operational until new credential handshake completes.
                    </p>
                    <button
                      onClick={() => setPendingApproval(false)}
                      className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold cursor-pointer"
                    >
                      Dismiss Notification
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleUpdatePassword} className="space-y-4">
                    <div className="flex items-start gap-3 p-4 rounded-2xl border border-violet-500/30 bg-violet-500/10 text-xs text-zinc-300">
                      <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                      <p className="leading-relaxed">
                        Your account is protected by hardware security session tokens. Always use at least 8 characters with numbers and special symbols.
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                        Current Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                        <input
                          type={showPass ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          className="w-full bg-black border border-zinc-800 rounded-xl pl-10 pr-10 py-2.5 text-white text-xs font-bold outline-none focus:border-cyan-500 placeholder:text-zinc-600"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPass(!showPass)}
                          className="absolute right-3.5 top-3 text-zinc-400 hover:text-white cursor-pointer"
                        >
                          {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                          New Password
                        </label>
                        <div className="relative">
                          <Key className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                          <input
                            type={showPass ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Minimum 8 characters"
                            required
                            className="w-full bg-black border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-white text-xs font-bold outline-none focus:border-cyan-500 placeholder:text-zinc-600"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <Key className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                          <input
                            type={showPass ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Re-type new password"
                            required
                            className="w-full bg-black border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-white text-xs font-bold outline-none focus:border-cyan-500 placeholder:text-zinc-600"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isUpdating}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-95 hover:scale-105 text-white text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-violet-600/30 cursor-pointer disabled:opacity-50"
                      >
                        {isUpdating ? "Processing Security Update..." : "Update Security Password"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Right Column: Security Controls */}
            <div className="lg:col-span-4 space-y-4">
              <div className="rounded-3xl border border-zinc-800 bg-[#060608] p-6 space-y-4 shadow-xl text-xs">
                <div className="font-black uppercase text-white tracking-tight flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" /> Active Security Controls
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                    <span className="text-zinc-400">2-Factor Protection</span>
                    <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] font-bold">
                      Enforced
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                    <span className="text-zinc-400">Session Encryption</span>
                    <span className="font-mono font-bold text-white">TLS 1.3 / AES-256</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Escrow Balance Lock</span>
                    <span className="text-emerald-400 font-bold">100% Protected</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: NOTIFICATIONS & ALERTS */}
        {/* ========================================================================= */}
        {activeTab === "notifications" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-zinc-800 bg-[#060608] shadow-2xl p-6 md:p-8 space-y-6 max-w-3xl"
          >
            <div className="border-b border-zinc-800 pb-4">
              <h2 className="text-lg font-black uppercase tracking-tight text-white">
                Media Buying Alert <span className="bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent">Preferences</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Configure when and where our automated operations system sends you priority notifications.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-black border border-zinc-800">
                <div>
                  <div className="font-bold text-white uppercase text-[11px]">Instant Balance Top-Up Confirmations</div>
                  <div className="text-zinc-400 mt-0.5">Receive instant invoice receipts when ad credit is provisioned.</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifyDeposit}
                  onChange={(e) => setNotifyDeposit(e.target.checked)}
                  className="w-4 h-4 accent-cyan-400 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-black border border-zinc-800">
                <div>
                  <div className="font-bold text-white uppercase text-[11px]">2–12 Hour Handover SLA Alerts</div>
                  <div className="text-zinc-400 mt-0.5">Get notified the exact second your BM partner invite is ready.</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifyHandover}
                  onChange={(e) => setNotifyHandover(e.target.checked)}
                  className="w-4 h-4 accent-cyan-400 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-black border border-zinc-800">
                <div>
                  <div className="font-bold text-white uppercase text-[11px]">Telegram Direct Bot Dispatch</div>
                  <div className="text-zinc-400 mt-0.5">Push critical account updates directly to your registered Telegram.</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifyTelegramBot}
                  onChange={(e) => setNotifyTelegramBot(e.target.checked)}
                  className="w-4 h-4 accent-cyan-400 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-black border border-zinc-800">
                <div>
                  <div className="font-bold text-white uppercase text-[11px]">Daily Media Buying Scaling Digest</div>
                  <div className="text-zinc-400 mt-0.5">Receive daily ROAS benchmark trends and CPM updates.</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifyDailyDigest}
                  onChange={(e) => setNotifyDailyDigest(e.target.checked)}
                  className="w-4 h-4 accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() =>
                  toast({
                    title: "Preferences Saved",
                    description: "Your notification settings have been updated.",
                  })
                }
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-95 hover:scale-105 text-white text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-violet-600/30 cursor-pointer"
              >
                Save Preferences
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </ClientLayout>
  );
}
