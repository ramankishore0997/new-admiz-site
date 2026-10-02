import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Lock, User, ShieldAlert, Key, Sparkles, Shield } from "lucide-react";

export default function AdminSettings() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

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
      toast({ variant: "destructive", title: "Mismatch", description: "Passwords do not match." });
      return;
    }

    if (newPassword.length < 8) {
      toast({ variant: "destructive", title: "Weak Password", description: "Password must be at least 8 characters long." });
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
        toast({ title: "Password Changed", description: "Your admin password was updated successfully." });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast({ variant: "destructive", title: "Update Failed", description: data.error });
      }
    } catch {
      setIsUpdating(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="pb-6 border-b border-zinc-800 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-400 text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Security & Auth
          </div>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
            Operations Control Settings
          </h1>
          <p className="text-xs text-zinc-400 mt-1">Manage credential keys and operational system privileges</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
          {/* Profile Card */}
          <div className="lg:col-span-6">
            <div className="rounded-3xl border border-zinc-800 bg-[#060608] backdrop-blur-xl shadow-2xl p-6 md:p-8">
              <h2 className="text-sm font-black uppercase tracking-tight text-white mb-6 flex items-center gap-2">
                <User className="w-4 h-4 text-cyan-400" /> Administrator Settings
              </h2>
              
              <div className="space-y-4 text-xs">
                <div className="flex items-center gap-3 p-4 rounded-2xl border border-zinc-800 bg-black">
                  <User className="w-5 h-5 text-cyan-400 shrink-0" />
                  <div>
                    <span className="text-zinc-400 block">Control Handle</span>
                    <span className="font-bold text-white text-sm">{user?.username}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-2xl border border-zinc-800 bg-black">
                  <ShieldAlert className="w-5 h-5 text-violet-400 shrink-0" />
                  <div>
                    <span className="text-zinc-400 block">Access Authority</span>
                    <span className="font-bold text-cyan-400 uppercase tracking-widest text-[10px] mt-0.5 block">{user?.role}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Change password */}
          <div className="lg:col-span-6">
            <div className="rounded-3xl border border-zinc-800 bg-[#060608] backdrop-blur-xl shadow-2xl p-6 md:p-8">
              <h2 className="text-sm font-black uppercase tracking-tight text-white mb-6 flex items-center gap-2">
                <Key className="w-4 h-4 text-violet-400" /> Change Security Password
              </h2>

              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Current Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3 w-4 h-4 text-zinc-500" />
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full bg-black border border-zinc-800 rounded-xl pl-11 pr-4 py-2.5 text-white text-xs outline-none focus:border-cyan-500 transition-colors placeholder:text-zinc-600"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">New Password</label>
                  <div className="relative">
                    <Key className="absolute left-4 top-3 w-4 h-4 text-zinc-500" />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full bg-black border border-zinc-800 rounded-xl pl-11 pr-4 py-2.5 text-white text-xs outline-none focus:border-cyan-500 transition-colors placeholder:text-zinc-600"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Confirm New Password</label>
                  <div className="relative">
                    <Key className="absolute left-4 top-3 w-4 h-4 text-zinc-500" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full bg-black border border-zinc-800 rounded-xl pl-11 pr-4 py-2.5 text-white text-xs outline-none focus:border-cyan-500 transition-colors placeholder:text-zinc-600"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isUpdating}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-90 text-white text-xs font-black uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-violet-600/30 disabled:opacity-50"
                >
                  {isUpdating ? "Updating..." : "Update Security Password"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
