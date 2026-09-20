import { useEffect, useState, useRef } from "react";
import { useLocation } from "wouter";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ShieldCheck, AlertCircle } from "lucide-react";
import RazrLogo from "@/components/RazrLogo";

export default function AuthCallback() {
  const [, setLocation] = useLocation();
  const { setSessionUser } = useAuth();
  const { toast } = useToast();
  const [statusText, setStatusText] = useState("Verifying Google credentials...");
  const [hasError, setHasError] = useState(false);
  const syncInProgress = useRef(false);

  useEffect(() => {
    let isMounted = true;

    async function syncAndRedirect(session: any) {
      if (syncInProgress.current || !session?.user) return;
      syncInProgress.current = true;

      try {
        const email = session.user.email;
        const name =
          session.user.user_metadata?.full_name ||
          session.user.user_metadata?.name ||
          email?.split("@")[0] ||
          "Client";

        if (isMounted) setStatusText("Synchronizing institutional profile...");

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

        const userData = await res.json();
        setSessionUser(userData);

        if (isMounted) {
          toast({
            title: "Authenticated Successfully",
            description: `Welcome to RAZR Marketing, ${name}!`,
          });
          window.location.replace("/app/dashboard");
        }
      } catch (err: any) {
        if (isMounted) {
          setHasError(true);
          setStatusText(err.message || "Session sync failed.");
          toast({
            variant: "destructive",
            title: "Authentication Failed",
            description: err.message || "Could not complete Google sign-in.",
          });
          setTimeout(() => setLocation("/login"), 3000);
        }
      }
    }

    async function handleAuth() {
      if (!isSupabaseConfigured) {
        setHasError(true);
        setStatusText("Supabase is not configured yet. Please check environment variables.");
        setTimeout(() => setLocation("/login"), 3000);
        return;
      }

      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (session && session.user) {
          await syncAndRedirect(session);
        } else {
          // Listen for onAuthStateChange
          const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
            if (currentSession && currentSession.user) {
              subscription.unsubscribe();
              void syncAndRedirect(currentSession);
            }
          });

          // Timeout after 8s if no session
          setTimeout(() => {
            if (isMounted && !syncInProgress.current) {
              setHasError(true);
              setStatusText("Session timeout. Redirecting to login...");
              setTimeout(() => setLocation("/login"), 2000);
            }
          }, 8000);
        }
      } catch (err: any) {
        if (isMounted) {
          setHasError(true);
          setStatusText(err.message || "Google authentication failed.");
          setTimeout(() => setLocation("/login"), 3000);
        }
      }
    }

    void handleAuth();

    return () => {
      isMounted = false;
    };
  }, [setLocation, setSessionUser, toast]);

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
