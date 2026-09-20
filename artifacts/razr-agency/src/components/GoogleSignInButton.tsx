import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { initGoogleIdentity, renderGoogleButton, GOOGLE_CLIENT_ID } from "@/lib/googleAuth";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface GoogleSignInButtonProps {
  buttonText?: string;
  className?: string;
}

export default function GoogleSignInButton({
  buttonText = "Continue with Google",
  className = "",
}: GoogleSignInButtonProps) {
  const [, setLocation] = useLocation();
  const { setSessionUser } = useAuth();
  const { toast } = useToast();
  const googleBtnRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sdkLoaded, setSdkLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const handleSuccess = async (credential: string, profile: { email: string; name: string }) => {
      if (!isMounted) return;
      setIsLoading(true);

      try {
        // 1. Sync with backend database and session cookie
        const res = await fetch("/api/auth/oauth-sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            email: profile.email,
            name: profile.name,
            credential,
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to initialize account session");
        }

        const userData = await res.json();
        setSessionUser(userData);

        toast({
          title: "Sign In Successful",
          description: `Welcome back, ${profile.name}!`,
        });

        setLocation("/app/dashboard");
      } catch (err: any) {
        setIsLoading(false);
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: err.message || "Failed to complete Google sign-in.",
        });
      }
    };

    const handleError = (err: any) => {
      if (!isMounted) return;
      setIsLoading(false);
      console.warn("Google One-Tap notice:", err);
    };

    // Initialize GIS
    initGoogleIdentity(handleSuccess, handleError);

    // Try rendering standard button
    const checkSdk = setInterval(() => {
      if (window.google?.accounts?.id && googleBtnRef.current) {
        setSdkLoaded(true);
        renderGoogleButton(googleBtnRef.current, {
          theme: "outline",
          size: "large",
        });
        clearInterval(checkSdk);
      }
    }, 150);

    const timeout = setTimeout(() => clearInterval(checkSdk), 4000);

    return () => {
      isMounted = false;
      clearInterval(checkSdk);
      clearTimeout(timeout);
    };
  }, [setLocation, setSessionUser, toast]);

  // Fallback handler if Google Web SDK is blocked by browser extension
  const handleFallbackClick = async () => {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
      return;
    }

    if (!isSupabaseConfigured) {
      toast({
        title: "Google Sign-In Notice",
        description: "Google services are initializing. Please try again in a few seconds.",
      });
      return;
    }

    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Google Sign-In Error",
        description: err.message || "Failed to initialize Google authentication.",
      });
    }
  };

  return (
    <div className={`w-full flex flex-col items-center justify-center ${className}`}>
      {/* Container for official direct Google One-Tap/GIS Button */}
      <div
        ref={googleBtnRef}
        className={`w-full flex justify-center min-h-[44px] ${sdkLoaded && !isLoading ? "block" : "hidden"}`}
      />

      {/* Fallback & Loading Visual Button */}
      {(!sdkLoaded || isLoading) && (
        <button
          type="button"
          onClick={handleFallbackClick}
          disabled={isLoading}
          className="w-full relative flex items-center justify-center gap-3 px-5 py-3 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold uppercase tracking-wider transition-all shadow-sm cursor-pointer disabled:opacity-75"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
          ) : (
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          )}
          <span>{isLoading ? "Connecting Account..." : buttonText}</span>
        </button>
      )}
    </div>
  );
}
