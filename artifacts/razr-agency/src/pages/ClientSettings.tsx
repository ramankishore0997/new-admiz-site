import { useEffect, useState } from "react";
import ClientLayout from "@/components/layout/ClientLayout";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Lock, User, Building, ShieldAlert, Key, CheckCircle2, Save } from "lucide-react";
import { SiTelegram } from "react-icons/si";

export default function ClientSettings() {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();

  // Profile
  const [username, setUsername] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [telegramHandle, setTelegramHandle] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [pendingApproval, setPendingApproval] = useState(false);

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
          title: "Profile Updated",
          description: "Your profile settings were saved successfully.",
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

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Contact Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Your name"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-slate-900 text-xs outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Company Name</label>
                <div className="relative">
                  <Building className="absolute left-4 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Your company"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-slate-900 text-xs outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Telegram Handle</label>
                <div className="relative">
                  <SiTelegram className="absolute left-4 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={telegramHandle}
                    onChange={(e) => setTelegramHandle(e.target.value)}
                    placeholder="username"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-slate-900 text-xs outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSavingProfile}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-black uppercase tracking-widest transition-colors shadow-lg shadow-primary/20 cursor-pointer"
              >
                {isSavingProfile ? "Saving..." : (
                  <>
                    <Save className="w-4 h-4" /> Save Changes
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Change password */}
        <div className="lg:col-span-6">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 p-6">
            <h2 className="text-sm font-black uppercase tracking-tight text-slate-900 mb-6">Change Password</h2>

            {pendingApproval ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-center">
                <CheckCircle2 className="w-10 h-10 text-amber-500 mx-auto mb-3" />
                <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">Request Sent for Approval</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Our team has been notified and will review your password change shortly.
                  Your new password becomes active as soon as it is approved — you will
                  receive an update here and in your notifications.
                </p>
              </div>
            ) : (
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50">
                  <ShieldAlert className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    For your account's safety, password changes are reviewed by our team
                    before they take effect. Your current password stays valid until then.
                  </p>
                </div>

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
                  {isUpdating ? "Submitting Request..." : "Request Password Change"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}
