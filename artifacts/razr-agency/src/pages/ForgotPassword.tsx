import { useState } from "react";
import { Link } from "wouter";
import PageWrapper from "@/components/layout/PageWrapper";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Mail, Lock, ArrowLeft, Key, CheckCircle2, Clock } from "lucide-react";

export default function ForgotPassword() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !newPassword || !confirmPassword) {
      toast({
        variant: "destructive",
        title: "Missing Fields",
        description: "Please fill in all fields.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords mismatch",
        description: "Passwords do not match.",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        variant: "destructive",
        title: "Weak Password",
        description: "Password must be at least 8 characters long.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });
      const data = await res.json();
      setIsSubmitting(false);

      if (res.ok) {
        setSubmitted(true);
      } else {
        toast({
          variant: "destructive",
          title: "Request Failed",
          description: data.error || "An error occurred. Please try again.",
        });
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

  return (
    <PageWrapper>
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />

      <section className="min-h-[70vh] flex items-center justify-center pt-10 pb-16 relative bg-black">
        <div className="container mx-auto px-4 max-w-md relative z-10">
          <div className="relative group rounded-3xl overflow-hidden border border-zinc-800 bg-[#060608] p-8 shadow-2xl backdrop-blur-xl">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-cyan-400 to-emerald-400" />

            {submitted ? (
              <div className="text-center py-6 space-y-6">
                <div className="w-12 h-12 rounded-full bg-violet-950/60 border border-violet-500/30 flex items-center justify-center mx-auto text-cyan-400">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tight text-white">
                    <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">Request Submitted</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                    Our team has been notified and will review your password reset request.
                    If the account exists, your new password becomes active once it is
                    approved — the sign-in details you set here will then work on the login page.
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-950/40">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-[9px] font-black tracking-widest bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent uppercase">Under Review</span>
                </div>
                <Link
                  href="/login"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white text-xs font-black uppercase tracking-widest hover:opacity-95 hover:scale-[1.02] transition-all shadow-xl shadow-violet-600/25 font-bold"
                >
                  Return to Login
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <img
                    src="/logo.png"
                    alt="Razr Marketing"
                    style={{ height: 72, width: "auto" }}
                    className="object-contain mx-auto mb-5 drop-shadow-lg"
                  />
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-950/40 mb-4">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-[9px] font-black tracking-widest bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent uppercase">Recovery</span>
                  </div>
                  <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-2">
                    <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">Recover Access</span>
                  </h2>
                  <p className="text-xs text-zinc-400">Enter your email and the new password you want to use</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-zinc-300 uppercase tracking-wider">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-3 w-4 h-4 text-zinc-500" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@company.com"
                        required
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-11 pr-4 py-2.5 text-white text-xs outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/50 transition-colors placeholder:text-zinc-600"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-zinc-300 uppercase tracking-wider">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-3 w-4 h-4 text-zinc-500" />
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-11 pr-4 py-2.5 text-white text-xs outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/50 transition-colors placeholder:text-zinc-600"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-zinc-300 uppercase tracking-wider">Confirm New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-3 w-4 h-4 text-zinc-500" />
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-11 pr-4 py-2.5 text-white text-xs outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/50 transition-colors placeholder:text-zinc-600"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white text-xs font-black uppercase tracking-widest hover:opacity-95 hover:scale-[1.02] disabled:opacity-30 disabled:pointer-events-none transition-all duration-300 mt-2 shadow-xl shadow-violet-600/25 cursor-pointer font-bold"
                  >
                    {isSubmitting ? "Submitting Request..." : "Submit Reset Request"}
                    {!isSubmitting && <Key className="w-4 h-4" />}
                  </button>
                </form>

                <div className="mt-8 text-center border-t border-zinc-800 pt-6">
                  <Link href="/login" className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors">
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
