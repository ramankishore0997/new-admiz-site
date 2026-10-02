import { useState } from "react";
import { Link, useLocation } from "wouter";
import PageWrapper from "@/components/layout/PageWrapper";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import AnimatedGradientBackground from "@/components/ui/animated-gradient-background";
import { EarthBlaze } from "@/components/ui/earth-blaze";
import {
  Mail,
  Lock,
  ArrowRight,
  Shield,
  Zap,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Layers,
  Headphones,
  Eye,
  EyeOff,
  Globe2,
  Building2,
  ShieldCheck,
} from "lucide-react";

export default function Login() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      {/* Full-Screen WebGL Earth Blaze Atmospheric Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-auto">
        <EarthBlaze
          starCount={2600}
          galaxyBrightness={1.35}
          surfaceBrightness={1.2}
          illumination={1.2}
          auroraEnabled={true}
          interactive={true}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            aspectRatio: "auto",
          }}
        />
        {/* Atmospheric vignette for crystal clear readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90 pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />
      </div>

      <section className="min-h-[85vh] flex items-center justify-center py-12 md:py-16 relative z-10 bg-transparent pointer-events-none">
        <div className="container mx-auto px-4 max-w-6xl relative z-10 pointer-events-none">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* LEFT COLUMN: Agency Powerhouse Showcase & Prestige Metrics */}
            <div className="lg:col-span-6 space-y-6 text-left pointer-events-auto">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-violet-500/30 bg-violet-950/60 backdrop-blur-md shadow-lg shadow-violet-500/10">
                  <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: "6s" }} />
                  <span className="text-[10px] font-black tracking-widest bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent uppercase">
                    Global Growth Powerhouse · London HQ
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-tight">
                  The Global Benchmark In <br />
                  <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
                    High-Velocity Scale.
                  </span>
                </h1>

                <p className="text-sm text-zinc-300 leading-relaxed max-w-lg font-medium">
                  RAZR is an elite global performance agency engineering multi-million dollar growth campaigns for visionary brands, high-growth direct-to-consumer leaders, and enterprise market makers across 48+ countries.
                </p>
              </div>

              {/* 3 Agency Pillars */}
              <div className="space-y-3.5">
                <div className="p-4 rounded-2xl bg-[#060608]/80 backdrop-blur-md border border-zinc-800/80 flex items-start gap-3.5 hover:border-violet-500/40 transition-all shadow-md">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center shrink-0 text-cyan-300 mt-0.5 shadow-xs">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase text-white tracking-wide">Institutional Media Arbitrage</h4>
                    <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">Proprietary algorithmic media buying blueprints across Meta, Google, TikTok &amp; YouTube deployed with military precision.</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#060608]/80 backdrop-blur-md border border-zinc-800/80 flex items-start gap-3.5 hover:border-cyan-500/40 transition-all shadow-md">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0 text-emerald-400 mt-0.5 shadow-xs">
                    <Headphones className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase text-white tracking-wide">Private Client Trading Desk</h4>
                    <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">Direct round-the-clock access to our London strategists offering bespoke scaling advisory and 24/7 concierge support.</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#060608]/80 backdrop-blur-md border border-zinc-800/80 flex items-start gap-3.5 hover:border-emerald-500/40 transition-all shadow-md">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 text-cyan-300 mt-0.5 shadow-xs">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase text-white tracking-wide">Uncapped Capital Velocity</h4>
                    <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">Backed by corporate treasury liquidity with 0% foreign exchange markups, protected asset architecture, and frictionless scaling.</p>
                  </div>
                </div>
              </div>

              {/* Prestige Agency Metrics Strip */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-zinc-950/80 backdrop-blur-md border border-zinc-800/90 text-left">
                  <div className="text-xl font-black text-white font-mono">$150M+</div>
                  <div className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 mt-0.5">Revenue Engineered</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-zinc-950/80 backdrop-blur-md border border-zinc-800/90 text-left">
                  <div className="text-xl font-black text-cyan-300 font-mono">48+</div>
                  <div className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 mt-0.5">Global Markets</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-zinc-950/80 backdrop-blur-md border border-zinc-800/90 text-left">
                  <div className="text-xl font-black text-emerald-400 font-mono">8-Figure</div>
                  <div className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 mt-0.5">Client Portfolios</div>
                </div>
              </div>

              {/* Corporate Identity Footer */}
              <div className="flex items-center gap-2 text-[10px] text-zinc-400 pt-1">
                <Building2 className="w-3.5 h-3.5 text-violet-400" />
                <span>RAZR Global Media International Ltd · 30 St Mary Axe (The Gherkin), London EC3A 8EP</span>
              </div>
            </div>

            {/* RIGHT COLUMN: Interactive Spotlight Sign In Card */}
            <div className="lg:col-span-6 w-full max-w-md mx-auto pointer-events-auto">
              <SpotlightCard tone="violet-cyan" className="p-7 sm:p-9 shadow-2xl backdrop-blur-xl">
                <div className="text-center mb-6">
                  <img
                    src="/logo.png"
                    alt="Razr Marketing"
                    style={{ height: 76, width: "auto" }}
                    className="object-contain mx-auto mb-4 drop-shadow-lg"
                  />
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-950/40 mb-3">
                    <Shield className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                    <span className="text-[9px] font-black tracking-widest bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent uppercase">
                      Client Portal Login
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mb-1">
                    <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
                      Welcome Back
                    </span>
                  </h2>
                  <p className="text-xs text-zinc-400">Sign in to manage your ad lines and wallet liquidity</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="text-[10px] font-black text-zinc-300 uppercase tracking-wider">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@company.com"
                        required
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-white text-xs font-bold outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/50 transition-colors placeholder:text-zinc-600"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 text-left">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black text-zinc-300 uppercase tracking-wider">Password</label>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-11 pr-11 py-3 text-white text-xs font-bold outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/50 transition-colors placeholder:text-zinc-600"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3.5 text-zinc-500 hover:text-zinc-300 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center gap-2 text-zinc-400 cursor-pointer select-none text-[11px]">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-zinc-800 bg-zinc-950 accent-violet-500 cursor-pointer"
                      />
                      <span>Remember session</span>
                    </label>
                    <Link href="/forgot-password" className="text-cyan-400 hover:underline font-bold text-[11px]">
                      Forgot password?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white text-xs font-black uppercase tracking-widest hover:opacity-95 hover:scale-[1.02] disabled:opacity-30 disabled:pointer-events-none transition-all duration-300 mt-2 shadow-xl shadow-violet-600/30 cursor-pointer"
                  >
                    {isSubmitting ? "Authenticating..." : "Sign In to Portal"}
                    {!isSubmitting && <ArrowRight className="w-4 h-4" />}
                  </button>
                </form>

                <div className="mt-6 text-center border-t border-zinc-800 pt-5">
                  <p className="text-xs text-zinc-400">
                    Need an enterprise ad account?{" "}
                    <Link href="/signup" className="bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent font-bold hover:underline">
                      Create Account
                    </Link>
                  </p>
                </div>
              </SpotlightCard>
            </div>

          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
