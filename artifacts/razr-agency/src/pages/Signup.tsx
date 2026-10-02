import { useState } from "react";
import { Link, useLocation } from "wouter";
import PageWrapper from "@/components/layout/PageWrapper";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import AnimatedGradientBackground from "@/components/ui/animated-gradient-background";
import {
  Sparkles,
  Mail,
  Lock,
  ArrowRight,
  User,
  Building,
  Phone,
  Globe,
  ShieldAlert,
  ShieldCheck,
  Zap,
  TrendingUp,
  Eye,
  EyeOff,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { SiTelegram } from "react-icons/si";

export default function Signup() {
  const [, setLocation] = useLocation();
  const { signup } = useAuth();
  const { toast } = useToast();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [telegramHandle, setTelegramHandle] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [country, setCountry] = useState("United States");
  const [referCode, setReferCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !username || !companyName || !telegramHandle || !phoneNumber || !country) {
      toast({
        variant: "destructive",
        title: "Missing Fields",
        description: "Please fill in all fields to create your account.",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Password Mismatch",
        description: "Your passwords do not match. Please check them.",
      });
      return;
    }

    if (password.length < 8) {
      toast({
        variant: "destructive",
        title: "Weak Password",
        description: "Password must be at least 8 characters long.",
      });
      return;
    }

    if (!agreeTerms) {
      toast({
        variant: "destructive",
        title: "Terms Agreement Required",
        description: "Please review and agree to the terms and conditions to proceed.",
      });
      return;
    }

    setIsSubmitting(true);
    const result = await signup(
      email,
      password,
      username,
      companyName,
      telegramHandle,
      phoneNumber,
      country,
      referCode
    );
    setIsSubmitting(false);

    if (result.success) {
      toast({
        title: "Account Created!",
        description: "Welcome to Razr Marketing! Your profile has been initialized.",
      });
      setLocation("/app/dashboard");
    } else {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: result.error || "An account with this email already exists. Please sign in.",
      });
    }
  };

  return (
    <PageWrapper>
      {/* Dynamic Animated Ambient Radial Gradient */}
      <AnimatedGradientBackground
        Breathing={true}
        animationSpeed={0.012}
        breathingRange={6}
        startingGap={110}
        topOffset={10}
        gradientColors={[
          "#000000",
          "#1e1b4b",
          "#3b0764",
          "#0f172a",
          "#064e3b",
          "#1e1035",
          "#000000"
        ]}
        gradientStops={[30, 50, 65, 78, 88, 96, 100]}
        containerClassName="opacity-60 pointer-events-none"
      />

      {/* Background Ambient Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />

      <section className="min-h-[85vh] flex items-center justify-center py-12 md:py-16 relative bg-transparent">
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* LEFT COLUMN: Agency Partnership & Prestige Framework */}
            <div className="lg:col-span-5 space-y-8 text-left">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-violet-500/30 bg-violet-950/60 shadow-lg shadow-violet-500/10">
                  <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: "6s" }} />
                  <span className="text-[10px] font-black tracking-widest bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent uppercase">
                    Private Client Growth Network
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-tight">
                  Partner With A <br />
                  <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
                    World-Class Agency.
                  </span>
                </h1>

                <p className="text-sm text-zinc-300 leading-relaxed font-medium">
                  Step into RAZR's elite ecosystem. We equip hyper-growth e-commerce brands, performance media buyers, and global market leaders with the strategic dominance and institutional backing needed to conquer competitive markets.
                </p>
              </div>

              {/* 3 Agency Edge Pillars */}
              <div className="space-y-3.5">
                <div className="p-4 rounded-2xl bg-[#060608] border border-zinc-800/80 flex items-start gap-3.5 hover:border-violet-500/40 transition-all shadow-md">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center shrink-0 text-cyan-300 mt-0.5 shadow-xs">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase text-white tracking-wide">Bespoke Scaling Architecture</h4>
                    <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">Custom algorithmic growth blueprints engineered specifically for your brand economics, product margins, and customer LTV.</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#060608] border border-zinc-800/80 flex items-start gap-3.5 hover:border-cyan-500/40 transition-all shadow-md">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0 text-emerald-400 mt-0.5 shadow-xs">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase text-white tracking-wide">Institutional Global Presence</h4>
                    <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">Headquartered in the heart of London financial district with multi-national trading hubs across Europe, the Americas, and Asia.</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#060608] border border-zinc-800/80 flex items-start gap-3.5 hover:border-emerald-500/40 transition-all shadow-md">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 text-cyan-300 mt-0.5 shadow-xs">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase text-white tracking-wide">Zero-Friction Operations</h4>
                    <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">Instant corporate treasury allocation, 0% cross-border FX markups, and dedicated London compliance routing.</p>
                  </div>
                </div>
              </div>

              {/* Quote & Corporate Endorsement */}
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-left space-y-1.5">
                <div className="text-[11px] text-zinc-300 italic leading-relaxed">
                  "RAZR isn't just an agency - they are the strategic engine that took our multi-brand portfolio to an 8-figure global footprint."
                </div>
                <div className="flex items-center justify-between text-[10px] text-zinc-400 font-bold pt-1 border-t border-zinc-800/80">
                  <span className="text-cyan-300 uppercase tracking-wider">RAZR Global Media International Ltd</span>
                  <span>London · EC3A 8EP</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Interactive Registration Form */}
            <div className="lg:col-span-7 w-full max-w-xl mx-auto">
              <SpotlightCard tone="violet-cyan" className="p-7 sm:p-9 shadow-2xl backdrop-blur-xl">
                <div className="text-center mb-6">
                  <img
                    src="/logo.png"
                    alt="Razr Marketing"
                    style={{ height: 76, width: "auto" }}
                    className="object-contain mx-auto mb-4 drop-shadow-lg"
                  />
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-950/40 mb-3">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-[9px] font-black tracking-widest bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent uppercase">
                      New Client Registration
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mb-1">
                    <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
                      Create Your Account
                    </span>
                  </h2>
                  <p className="text-xs text-zinc-400">Fill in your business details to access the agency dashboard</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black text-zinc-300 uppercase tracking-wider">Full Name / Username <span className="text-rose-400">*</span></label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="e.g. Alex Morgan"
                          required
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-3 py-2.5 text-white text-xs font-bold outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/50 transition-colors placeholder:text-zinc-600"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black text-zinc-300 uppercase tracking-wider">Company / Brand Name <span className="text-rose-400">*</span></label>
                      <div className="relative">
                        <Building className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                        <input
                          type="text"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="e.g. Apex Ecom Media"
                          required
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-3 py-2.5 text-white text-xs font-bold outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/50 transition-colors placeholder:text-zinc-600"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black text-zinc-300 uppercase tracking-wider">Work Email Address <span className="text-rose-400">*</span></label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="alex@apexecom.com"
                          required
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-3 py-2.5 text-white text-xs font-bold outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/50 transition-colors placeholder:text-zinc-600"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black text-zinc-300 uppercase tracking-wider">Telegram Handle <span className="text-rose-400">*</span></label>
                      <div className="relative">
                        <SiTelegram className="absolute left-3.5 top-3.5 w-3.5 h-3.5 text-zinc-500" />
                        <span className="absolute left-8 top-2.5 text-zinc-500 text-xs font-bold">@</span>
                        <input
                          type="text"
                          value={telegramHandle.replace(/^@/, "")}
                          onChange={(e) => setTelegramHandle(e.target.value)}
                          placeholder="alex_ads"
                          required
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-12 pr-3 py-2.5 text-white text-xs font-bold outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/50 transition-colors placeholder:text-zinc-600"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black text-zinc-300 uppercase tracking-wider">Mobile Number <span className="text-rose-400">*</span></label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="+1 555 0199"
                          required
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-3 py-2.5 text-white text-xs font-bold outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/50 transition-colors placeholder:text-zinc-600"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black text-zinc-300 uppercase tracking-wider">Country of Operation <span className="text-rose-400">*</span></label>
                      <div className="relative">
                        <Globe className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                        <input
                          type="text"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          placeholder="United States"
                          required
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-3 py-2.5 text-white text-xs font-bold outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/50 transition-colors placeholder:text-zinc-600"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-black text-zinc-300 uppercase tracking-wider">Password (Min 8 chars) <span className="text-rose-400">*</span></label>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-10 py-2.5 text-white text-xs font-bold outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/50 transition-colors placeholder:text-zinc-600"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-zinc-500 hover:text-zinc-300"
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black text-zinc-300 uppercase tracking-wider">Confirm Password <span className="text-rose-400">*</span></label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-3 py-2.5 text-white text-xs font-bold outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/50 transition-colors placeholder:text-zinc-600"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-zinc-300 uppercase tracking-wider">Referral Code (Optional)</label>
                    <div className="relative">
                      <ShieldAlert className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                      <input
                        type="text"
                        value={referCode}
                        onChange={(e) => setReferCode(e.target.value)}
                        placeholder="e.g. RAZR-SCALE"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-3 py-2.5 text-white text-xs font-bold outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/50 transition-colors placeholder:text-zinc-600"
                      />
                    </div>
                  </div>

                  {/* Terms Checkbox */}
                  <div className="flex items-start gap-2.5 pt-1">
                    <input
                      type="checkbox"
                      id="agreeTerms"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-1 accent-violet-500 rounded border-zinc-800 bg-zinc-950 cursor-pointer"
                    />
                    <label htmlFor="agreeTerms" className="text-[10px] text-zinc-400 leading-relaxed cursor-pointer select-none">
                      I agree to the{" "}
                      <Link href="/terms" className="text-cyan-400 hover:underline font-bold">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-cyan-400 hover:underline font-bold">
                        Privacy Policy
                      </Link>
                      .
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white text-xs font-black uppercase tracking-widest hover:opacity-95 hover:scale-[1.02] disabled:opacity-30 disabled:pointer-events-none transition-all duration-300 mt-2 shadow-xl shadow-violet-600/30 cursor-pointer"
                  >
                    {isSubmitting ? "Creating Account..." : "Complete Registration & Launch"}
                    {!isSubmitting && <ArrowRight className="w-4 h-4" />}
                  </button>
                </form>

                <div className="mt-5 text-center border-t border-zinc-800 pt-4">
                  <p className="text-xs text-zinc-400">
                    Already have an agency account?{" "}
                    <Link href="/login" className="bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent font-bold hover:underline">
                      Sign In to Portal
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
