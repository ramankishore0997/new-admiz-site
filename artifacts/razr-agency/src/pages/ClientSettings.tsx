import { useState } from "react";
import ClientLayout from "@/components/layout/ClientLayout";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Lock, User, Building, ShieldAlert, Key } from "lucide-react";
import { SiTelegram } from "react-icons/si";

export default function ClientSettings() {
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
        toast({
          title: "Password Changed",
          description: "Your account password was updated successfully.",
        });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
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
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="mb-10 pb-6 border-b border-slate-200 relative z-10">
        <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900">Profile & Settings</h1>
        <p className="text-xs text-slate-500 mt-1">Manage profile parameters and dashboard security keys</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        {/* Profile Card */}
        <div className="lg:col-span-6">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 p-6">
            <h2 className="text-sm font-black uppercase tracking-tight text-slate-900 mb-6">Profile Settings</h2>
            
            <div className="space-y-4 text-xs">
              <div className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50">
                <User className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <span className="text-slate-500 block">Contact Name</span>
                  <span className="font-bold text-slate-900 text-sm">{user?.username}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50">
                <Building className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <span className="text-slate-500 block">Company Name</span>
                  <span className="font-bold text-slate-900 text-sm">{user?.companyName}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50">
                <SiTelegram className="w-4.5 h-4.5 text-primary shrink-0" />
                <div>
                  <span className="text-slate-500 block">Telegram handle</span>
                  <span className="font-bold text-slate-900 text-sm">@{user?.telegramHandle}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Change password */}
        <div className="lg:col-span-6">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 p-6">
            <h2 className="text-sm font-black uppercase tracking-tight text-slate-900 mb-6">Change Password</h2>

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Current Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-slate-900 text-xs outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">New Password</label>
                <div className="relative">
                  <Key className="absolute left-4 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-slate-900 text-xs outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Confirm New Password</label>
                <div className="relative">
                  <Key className="absolute left-4 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-slate-900 text-xs outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isUpdating}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-widest transition-colors shadow-lg shadow-emerald-600/20 cursor-pointer"
              >
                {isUpdating ? "Updating Password..." : "Update Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}
