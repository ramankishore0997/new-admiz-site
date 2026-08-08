import { createContext, useContext, useState, useEffect, ReactNode } from "react";

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

  // Load session from backend on mount
  useEffect(() => {
    fetch("/api/me")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Unauthenticated");
      })
      .then((userData) => {
        setUser(userData);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pass }),
      });
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
        return { success: true };
      } else {
        const data = await res.json();
        return { success: false, error: data.error || "Invalid email address or password." };
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
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
        return { success: true };
      } else {
        const data = await res.json();
        return { success: false, error: data.error || "Registration failed." };
      }
    } catch (e: any) {
      console.error("Registration request failed", e);
      return { success: false, error: e.message || "Network connection error." };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.error("Logout request failed", e);
    } finally {
      setUser(null);
    }
  };

  const refreshUser = async () => {
    try {
      const res = await fetch("/api/me");
      if (res.ok) {
        setUser(await res.json());
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
      const res = await fetch("/api/payments/submit-proof", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        return { success: true, orderId: data.orderId };
      }
      const data = await res.json();
      return { success: false, error: data.error || "Failed to submit payment proof." };
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
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const data = await res.json();
        return { success: false, error: data.error || "Failed to create application." };
      }
      const app = await res.json();
      const appId = app?.id;

      // 2. Patch Draft details
      const patchRes = await fetch(`/api/applications/${appId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personalInfo: { fullName: user?.username || "", email: user?.email || "" },
          advertisingInfo: { platform },
          accountRequirements: { spendLimit, existingAccountId: notes },
        }),
      });
      if (!patchRes.ok) {
        const data = await patchRes.json();
        return { success: false, error: data.error || "Failed to update application." };
      }

      // 3. Submit
      const submitRes = await fetch(`/api/applications/${appId}/submit`, {
        method: "POST",
      });
      if (!submitRes.ok) {
        const data = await submitRes.json();
        return { success: false, error: data.error || "Failed to submit application." };
      }

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
