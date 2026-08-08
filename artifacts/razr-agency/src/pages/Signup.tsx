import { useState } from "react";
import { Link, useLocation } from "wouter";
import PageWrapper from "@/components/layout/PageWrapper";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Mail, Lock, ArrowRight, User, Building, Phone, Globe, ShieldAlert } from "lucide-react";
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
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
        description: "Your passwords do not match. Please verify them.",
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
      country
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
      {/* Background Orbs */}
      <div className="absolute top-10 left-10 w-[450px] h-[450px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none" />

      <section className="min-h-[85vh] flex items-center justify-center pt-8 pb-16 relative">
        <div className="container mx-auto px-4 max-w-lg relative z-10">
          <div className="relative group rounded-3xl overflow-hidden border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60">
            {/* Top decorative bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500" />

            <div className="text-center mb-6">
              <img
                src="/logo.png"
                alt="Razr Marketing"
                style={{ height: 84, width: "auto" }}
                className="object-contain mx-auto mb-5"
              />
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 mb-4">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span className="text-[9px] font-black tracking-widest text-primary uppercase">Join Platform</span>
              </div>
              <h2 className="text-3xl font-black uppercase tracking-tight text-slate-900 mb-2">Create Account</h2>
              <p className="text-xs text-slate-500">Register to apply for ad accounts and manage budgets</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Contact Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="John Doe"
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-slate-900 text-xs outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
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
                      placeholder="Acme Ecom LLC"
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-slate-900 text-xs outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@acme.com"
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-slate-900 text-xs outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Telegram Handle</label>
                  <div className="relative">
                    <SiTelegram className="absolute left-4 top-3.5 w-3.5 h-3.5 text-slate-400" />
                    <span className="absolute left-9 top-2.5 text-slate-400 text-xs font-medium">@</span>
                    <input
                      type="text"
                      value={telegramHandle.replace(/^@/, "")}
                      onChange={(e) => setTelegramHandle(e.target.value)}
                      placeholder="handle"
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-14 pr-4 py-2.5 text-slate-900 text-xs outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Mobile Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+1 555 0199"
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-slate-900 text-xs outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Country</label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="United States"
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-slate-900 text-xs outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Choose Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-slate-900 text-xs outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-slate-900 text-xs outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 accent-primary rounded border-slate-300 bg-white"
                />
                <label htmlFor="agreeTerms" className="text-[10px] text-slate-600 leading-relaxed cursor-pointer select-none">
                  I agree to the{" "}
                  <Link href="/terms" className="text-primary hover:underline font-bold">
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-primary hover:underline font-bold">
                    Privacy Policy
                  </Link>
                  .
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 text-white text-xs font-black uppercase tracking-widest hover:bg-emerald-700 disabled:opacity-30 disabled:pointer-events-none transition-all duration-300 mt-2 shadow-[0_4px_20px_rgba(5,150,105,0.25)] cursor-pointer"
              >
                {isSubmitting ? "Creating Account..." : "Register Now"}
                {!isSubmitting && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            <div className="mt-6 text-center border-t border-slate-200 pt-4">
              <p className="text-xs text-slate-500">
                Already have an account?{" "}
                <Link href="/login" className="text-primary font-bold hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
