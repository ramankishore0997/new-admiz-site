import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiFetch } from "@/lib/api";

export interface AdAccount {
  id: string;
  platform: string;
  status: "PENDING" | "ACTIVE" | "SUSPENDED" | "REJECTED";
  spendLimit: string;
  balance: number;
  dateApplied: string;
}

export interface Deposit {
  id: string;
  amount: number;
  crypto: string;
  address: string;
  txHash?: string;
  note?: string;
  date: string;
  status: "COMPLETED" | "PENDING" | "FAILED";
  rawStatus?: string;
  rejectionReason?: string;
}

export interface ApplicationFee {
  id: number;
  applicationId: number;
  amount: number;
  description?: string;
  date: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  companyName: string;
  telegramHandle: string;
  role: string;
  balance: number;
  adAccounts: AdAccount[];
  deposits: Deposit[];
  applicationFees: ApplicationFee[];
}

export interface SubmitDepositResult {
  success: boolean;
  orderId?: string;
  error?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signup: (
    email: string,
    pass: string,
    username: string,
    companyName: string,
    telegramHandle: string,
    phoneNumber?: string,
    country?: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  submitDepositProof: (payload: {
    amount: number;
    network: string;
    txHash: string;
    screenshotUrl: string;
    note?: string;
  }) => Promise<SubmitDepositResult>;
  applyAdAccount: (
    platform: string,
    spendLimit: string,
    notes?: string
  ) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper for safe JSON parsing
  const safeJson = async (res: Response) => {
    try {
      const text = await res.text();
      return JSON.parse(text);
    } catch {
      return { error: "Server returned non-JSON response." };
    }
  };

  // Load session from backend on mount
  useEffect(() => {
    fetch("/api/me", { credentials: "include" })
      .then(async (res) => {
        if (res.ok) return await safeJson(res);
        throw new Error("Unauthenticated");
      })
      .then((userData) => {
        if (userData && userData.id) setUser(userData);
        else setUser(null);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });

    // Any 401 from a page request (expired/invalid session) clears the session
    const onUnauthorized = () => setUser(null);
    window.addEventListener("razr:unauthorized", onUnauthorized);
    return () => window.removeEventListener("razr:unauthorized", onUnauthorized);
  }, []);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password: pass }),
      });
      const data = await safeJson(res);
      if (res.ok && data.id) {
        setUser(data);
        return { success: true };
      } else {
        return { success: false, error: data.error || "Invalid email address/username or password." };
      }
    } catch (e: any) {
      console.error("Login request failed", e);
      return { success: false, error: e.message || "Network connection error." };
    }
  };

  const signup = async (
    email: string,
    pass: string,
    username: string,
    companyName: string,
    telegramHandle: string,
    phoneNumber?: string,
    country?: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email,
          password: pass,
          username,
          companyName,
          telegramHandle,
          phoneNumber,
          country,
        }),
      });
      const data = await safeJson(res);
      if (res.ok && data.id) {
        setUser(data);
        return { success: true };
      } else {
        return { success: false, error: data.error || "Registration failed." };
      }
    } catch (e: any) {
      console.error("Registration request failed", e);
      return { success: false, error: e.message || "Network connection error." };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } catch (e) {
      console.error("Logout request failed", e);
    } finally {
      setUser(null);
    }
  };

  const refreshUser = async () => {
    try {
      const res = await fetch("/api/me", { credentials: "include" });
      if (res.ok) {
        const data = await safeJson(res);
        if (data && data.id) setUser(data);
      }
    } catch (e) {
      console.error("Failed to refresh user profile", e);
    }
  };

  const submitDepositProof = async (payload: {
    amount: number;
    network: string;
    txHash: string;
    screenshotUrl: string;
    note?: string;
  }): Promise<SubmitDepositResult> => {
    try {
      const data = await apiFetch<{ orderId: string; status: string }>("/api/payments/submit-proof", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      return { success: true, orderId: data.orderId };
    } catch (e: any) {
      console.error("Payment proof submission failed", e);
      return { success: false, error: e.message || "Network connection error." };
    }
  };

  // Create real application in DRAFT state when they request account
  const applyAdAccount = async (
    platform: string,
    spendLimit: string,
    notes?: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      // 1. Create Application Draft
      const app = await apiFetch<{ id: number }>("/api/applications", {
        method: "POST",
      });
      const appId = app?.id;

      // 2. Patch Draft details
      await apiFetch(`/api/applications/${appId}`, {
        method: "PATCH",
        body: JSON.stringify({
          personalInfo: { fullName: user?.username || "", email: user?.email || "" },
          advertisingInfo: { platform },
          accountRequirements: { spendLimit, existingAccountId: notes },
        }),
      });

      // 3. Submit
      await apiFetch(`/api/applications/${appId}/submit`, {
        method: "POST",
      });

      await refreshUser();
      return { success: true };
    } catch (e: any) {
      console.error("Quick account application failed", e);
      return { success: false, error: e.message || "Network connection error." };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        logout,
        refreshUser,
        submitDepositProof,
        applyAdAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
