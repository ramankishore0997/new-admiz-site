import { useState } from "react";
import { Link } from "wouter";
import PageWrapper from "@/components/layout/PageWrapper";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Mail, Lock, ArrowRight, ArrowLeft, Key } from "lucide-react";

export default function ForgotPassword() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [debugToken, setDebugToken] = useState<string | null>(null);

  // New password reset states (Step 2 after reset token is set)
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const [successReset, setSuccessReset] = useState(false);

  const handleRequestLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setIsSubmitting(false);

      if (res.ok) {
        toast({
          title: "Reset link sent!",
          description: data.message,
        });
        if (data.debugToken) {
          setDebugToken(data.debugToken);
          setResetToken(data.debugToken); // Auto-fill token for local sandbox testing convenience
        }
      }
    } catch {
      setIsSubmitting(false);
      toast({
        variant: "destructive",
        title: "Request Failed",
        description: "An error occurred. Please try again.",
      });
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords mismatch",
        description: "Passwords do not match.",
      });
      return;
    }

    setIsResetting(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: resetToken, newPassword }),
      });
      const data = await res.json();
      setIsResetting(false);

      if (res.ok) {
        toast({
          title: "Password Reset Success!",
          description: data.message,
        });
        setSuccessReset(true);
      } else {
        toast({
          variant: "destructive",
          title: "Reset Failed",
          description: data.error || "Reset token invalid.",
        });
      }
    } catch {
      setIsResetting(false);
    }
  };

  return (
    <PageWrapper>
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

      <section className="min-h-[70vh] flex items-center justify-center pt-10 pb-16 relative">
        <div className="container mx-auto px-4 max-w-md relative z-10">
          <div className="relative group rounded-3xl overflow-hidden border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500" />

            {successReset ? (
              <div className="text-center py-6 space-y-6">
                <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
                  <Key className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tight text-slate-900">Password Updated</h3>
                  <p className="text-xs text-slate-600 mt-2">Your password was reset successfully. You can now login.</p>
                </div>
                <Link
                  href="/login"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 text-white text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-[0_4px_20px_rgba(5,150,105,0.25)]"
                >
                  Return to Login
                </Link>
              </div>
            ) : debugToken ? (
              <div className="space-y-6">
                <div className="text-center">
                  <img
                    src="/logo.png"
                    alt="Razr Marketing"
                    style={{ height: 72, width: "auto" }}
                    className="object-contain mx-auto mb-5"
                  />
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 mb-4">
                    <Key className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[9px] font-black tracking-widest text-primary uppercase">Reset Sandbox</span>
                  </div>
                  <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 mb-2">New Password</h2>
                  <p className="text-xs text-slate-500">Set your new dashboard security credentials below</p>
                </div>

                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-3 w-4 h-4 text-slate-400" />
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
                      <Lock className="absolute left-4 top-3 w-4 h-4 text-slate-400" />
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
                    disabled={isResetting}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 text-white text-xs font-black uppercase tracking-widest hover:bg-emerald-700 disabled:opacity-30 disabled:pointer-events-none transition-all duration-300 mt-2 shadow-[0_4px_20px_rgba(5,150,105,0.25)] cursor-pointer"
                  >
                    {isResetting ? "Updating Password..." : "Reset Password"}
                    {!isResetting && <ArrowRight className="w-4 h-4" />}
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <img
                    src="/logo.png"
                    alt="Razr Marketing"
                    style={{ height: 72, width: "auto" }}
                    className="object-contain mx-auto mb-5"
                  />
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 mb-4">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[9px] font-black tracking-widest text-primary uppercase">Recovery</span>
                  </div>
                  <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 mb-2">Recover Access</h2>
                  <p className="text-xs text-slate-500">Enter email to generate custom reset validation tokens</p>
                </div>

                <form onSubmit={handleRequestLink} className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@company.com"
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-slate-900 text-xs outline-none focus:border-primary/50 transition-colors"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 text-white text-xs font-black uppercase tracking-widest hover:bg-emerald-700 disabled:opacity-30 disabled:pointer-events-none transition-all duration-300 mt-2 shadow-[0_4px_20px_rgba(5,150,105,0.25)] cursor-pointer"
                  >
                    {isSubmitting ? "Requesting Link..." : "Send Reset Link"}
                    {!isSubmitting && <ArrowRight className="w-4 h-4" />}
                  </button>
                </form>

                <div className="mt-8 text-center border-t border-slate-200 pt-6">
                  <Link href="/login" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors">
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
