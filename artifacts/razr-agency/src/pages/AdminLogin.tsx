import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Shield, Mail, Lock, ArrowRight, Zap } from "lucide-react";

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
      toast({
        title: "Access Granted",
        description: "Welcome to Operations Panel!",
      });
      setLocation("/admin/dashboard");
    } else {
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: result.error || "Invalid credentials.",
      });
    }
  };

  const handleFillDemo = () => {
    setEmail("admin@razr.marketing");
    setPassword("admin123");
  };

  return (
    <div className="min-h-screen bg-black text-foreground flex items-center justify-center relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-md relative z-10">
        <div className="relative group rounded-3xl overflow-hidden border border-zinc-800 bg-[#060608] p-8 shadow-2xl backdrop-blur-xl">
          {/* Top line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-cyan-400 to-emerald-400" />

          <div className="text-center mb-6">
            <img
              src="/logo.png"
              alt="Razr Marketing"
              style={{ height: 84, width: "auto" }}
              className="object-contain mx-auto mb-5 drop-shadow-lg"
            />
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-950/40 mb-4">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[9px] font-black tracking-widest bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent uppercase">Ops Control</span>
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-2">
              <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">Razr Operations</span>
            </h2>
            <p className="text-xs text-zinc-400 font-bold tracking-wider uppercase">Administrative Control Panel</p>
          </div>

          {/* Quick Local Demo Badge */}
          <div className="mb-6 p-3 rounded-2xl bg-zinc-950 border border-violet-500/30 text-left space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan-400" /> Localhost Admin Demo
              </span>
              <button
                type="button"
                onClick={handleFillDemo}
                className="px-2 py-0.5 rounded-lg bg-violet-500/20 hover:bg-violet-500/30 text-[9px] font-black text-cyan-300 uppercase tracking-wider cursor-pointer transition-colors border border-violet-500/30"
              >
                Auto Fill
              </button>
            </div>
            <div className="text-[11px] font-mono text-zinc-300 flex justify-between pt-0.5">
              <span>ID: <strong className="text-white">admin@razr.marketing</strong></span>
              <span>Pass: <strong className="text-white">admin123</strong></span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-zinc-300 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@razr.marketing"
                  required
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-white text-xs outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/50 transition-colors placeholder:text-zinc-600"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-zinc-300 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-white text-xs outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/50 transition-colors placeholder:text-zinc-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:opacity-95 hover:scale-[1.02] disabled:opacity-30 text-white text-xs font-black uppercase tracking-widest transition-all duration-300 mt-2 shadow-xl shadow-violet-600/25 cursor-pointer font-bold"
            >
              {isSubmitting ? "Authenticating..." : "Authenticate"}
              {!isSubmitting && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
