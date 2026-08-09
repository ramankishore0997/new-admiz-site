import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Shield, Mail, Lock, ArrowRight } from "lucide-react";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { login, logout } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      try {
        // Fetch user profile again and verify role is admin/reviewer
        const meRes = await fetch("/api/me", { credentials: "include" });
        if (!meRes.ok) {
          throw new Error("Session check failed.");
        }
        const userData = await meRes.json();
        const isAdmin = ["SUPER_ADMIN", "ADMIN", "REVIEWER", "SUPPORT"].includes(userData.role);
        if (isAdmin) {
          toast({
            title: "Access Granted",
            description: `Welcome to Operations Panel, ${userData.username}!`,
          });
          setLocation("/admin/dashboard");
        } else {
          // Log out client immediately if trying to access admin (also clears context state)
          await logout();
          toast({
            variant: "destructive",
            title: "Access Denied",
            description: "You do not have administrative privileges.",
          });
        }
      } catch (e: any) {
        await logout();
        toast({
          variant: "destructive",
          title: "Verification Failed",
          description: e.message || "Could not verify your session. Please try again.",
        });
      }
    } else {
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: result.error || "Invalid credentials.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-md relative z-10">
        <div className="relative group rounded-3xl overflow-hidden border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60">
          {/* Top line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500" />

          <div className="text-center mb-8">
            <img
              src="/logo.png"
              alt="Razr Marketing"
              style={{ height: 84, width: "auto" }}
              className="object-contain mx-auto mb-5"
            />
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-200 bg-emerald-50 mb-4">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-[9px] font-black tracking-widest text-emerald-600 uppercase">Ops Control</span>
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 mb-2">Razr Marketing</h2>
            <p className="text-xs text-slate-500 font-bold tracking-wider uppercase">Administrative Control Panel</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@razr.marketing"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-slate-900 text-xs outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-slate-900 text-xs outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-900 disabled:opacity-30 text-white text-xs font-black uppercase tracking-widest transition-all duration-300 mt-2 shadow-[0_4px_25px_rgba(5,150,105,0.25)] cursor-pointer"
            >
              {isSubmitting ? "Verifying Credentials..." : "Authenticate"}
              {!isSubmitting && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
