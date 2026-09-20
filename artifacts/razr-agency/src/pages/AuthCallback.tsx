import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ShieldCheck, AlertCircle } from "lucide-react";
import RazrLogo from "@/components/RazrLogo";

export default function AuthCallback() {
  const [, setLocation] = useLocation();
  const { refreshUser } = useAuth();
  const { toast } = useToast();
  const [statusText, setStatusText] = useState("Verifying Google credentials...");
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function handleAuth() {
      if (!isSupabaseConfigured) {
        setHasError(true);
        setStatusText("Supabase is not configured yet. Please check environment variables.");
        toast({
          variant: "destructive",
          title: "Setup Required",
          description: "Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
        });
        setTimeout(() => setLocation("/login"), 3000);
        return;
      }

      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (session && session.user) {
          const email = session.user.email;
          const name = session.user.user_metadata?.full_name || session.user.user_metadata?.name || email?.split("@")[0] || "Client";

          setStatusText("Synchronizing institutional profile...");

          const res = await fetch("/api/auth/oauth-sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ email, name }),
          });

          if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.error || "Failed to initialize server session");
          }

          await refreshUser();

          if (isMounted) {
            toast({
              title: "Authenticated Successfully",
              description: `Welcome to RAZR Marketing, ${name}!`,
            });
            setLocation("/app/dashboard");
          }
        } else {
          // Listen for onAuthStateChange in case hash parsing is in progress
          const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
            if (currentSession && currentSession.user) {
              subscription.unsubscribe();
              const email = currentSession.user.email;
              const name = currentSession.user.user_metadata?.full_name || email?.split("@")[0] || "Client";

              const res = await fetch("/api/auth/oauth-sync", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, name }),
              });

              if (res.ok) {
                await refreshUser();
                if (isMounted) {
                  toast({
                    title: "Authenticated Successfully",
                    description: "Welcome to RAZR Marketing!",
                  });
                  setLocation("/app/dashboard");
                }
              }
            }
          });

          // Timeout after 6s if no session
          setTimeout(() => {
            if (isMounted) {
              setHasError(true);
              setStatusText("Session timeout. Redirecting to login...");
              setTimeout(() => setLocation("/login"), 2000);
            }
          }, 6000);
        }
      } catch (err: any) {
        if (isMounted) {
          setHasError(true);
          setStatusText(err.message || "Google authentication failed.");
          toast({
            variant: "destructive",
            title: "Authentication Failed",
            description: err.message || "Could not complete Google sign-in.",
          });
          setTimeout(() => setLocation("/login"), 3000);
        }
      }
    }

    handleAuth();

    return () => {
      isMounted = false;
    };
  }, [setLocation, refreshUser, toast]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-2xl relative z-10 text-center">
        <div className="flex justify-center mb-6">
          <RazrLogo size={56} />
        </div>

        <div className="mb-6 flex justify-center">
          {hasError ? (
            <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
              <AlertCircle className="w-6 h-6" />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          )}
        </div>

        <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 mb-2">
          {hasError ? "Authentication Notice" : "Connecting Account"}
        </h2>
        <p className="text-xs text-slate-500 mb-6">{statusText}</p>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-600">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          End-to-End Encrypted Handshake
        </div>
      </div>
    </div>
  );
}
