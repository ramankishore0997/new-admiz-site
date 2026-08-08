import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import PageWrapper from "@/components/layout/PageWrapper";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Mail, Lock, ArrowRight, Shield } from "lucide-react";

export default function Login() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Missing Fields",
        description: "Please enter both email and password.",
      });
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      toast({
        title: "Login Successful",
        description: "Welcome back to Razr Marketing!",
      });
      setLocation("/app/dashboard");
    } else {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: result.error || "Invalid email or password. Please try again or create an account.",
      });
    }
  };

  return (
    <PageWrapper>
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

      <section className="min-h-[70vh] flex items-center justify-center pt-10 pb-16 relative">
        <div className="container mx-auto px-4 max-w-md relative z-10">
          <div className="relative group rounded-3xl overflow-hidden border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60">
            {/* Top decorative bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500" />

            <div className="text-center mb-8">
              <img
                src="/logo.png"
                alt="Razr Marketing"
                style={{ height: 84, width: "auto" }}
                className="object-contain mx-auto mb-5"
              />
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 mb-4">
                <Shield className="w-3.5 h-3.5 text-primary animate-pulse" />
                <span className="text-[9px] font-black tracking-widest text-primary uppercase">Secure Portal</span>
              </div>
              <h2 className="text-3xl font-black uppercase tracking-tight text-slate-900 mb-2">Welcome Back</h2>
              <p className="text-xs text-slate-500">Access your agency ad account dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-slate-900 text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Password</label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-slate-900 text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 bg-white accent-primary"
                  />
                  <span>Remember me</span>
                </label>
                <Link href="/forgot-password" className="text-primary hover:underline font-bold">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 text-white text-xs font-black uppercase tracking-widest hover:bg-emerald-700 disabled:opacity-30 disabled:pointer-events-none transition-all duration-300 mt-2 shadow-[0_4px_20px_rgba(5,150,105,0.25)] cursor-pointer"
              >
                {isSubmitting ? "Authenticating..." : "Sign In"}
                {!isSubmitting && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            <div className="mt-8 text-center border-t border-slate-200 pt-6">
              <p className="text-xs text-slate-500">
                New to Razr Marketing?{" "}
                <Link href="/signup" className="text-primary font-bold hover:underline">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
