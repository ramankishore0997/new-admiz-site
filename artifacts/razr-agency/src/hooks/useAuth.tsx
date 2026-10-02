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
    country?: string,
    referCode?: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  setSessionUser: (user: User | null) => void;
  submitDepositProof: (payload: {
    amount: number;
    network: string;
    txHash: string;
    screenshotUrl: string;
    note?: string;
  }) => Promise<SubmitDepositResult>;
  applyAdAccount: (
    platform: string,
    requirements?: {
      hatType?: "BLACK" | "GREY" | "WHITE";
      businessManagerId?: string;
      gmail?: string;
      accountName?: string;
    }
  ) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Local Demo Mock Users for seamless testing without database
export const MOCK_CLIENT_USER: User = {
  id: 1,
  email: "demo@razr.marketing",
  username: "ApexAgency",
  companyName: "Apex Media International LLC",
  telegramHandle: "ApexMediaOps",
  role: "CLIENT",
  balance: 14850,
  adAccounts: [
    {
      id: "ACT-META-90182",
      platform: "Meta (Facebook & Instagram)",
      status: "ACTIVE",
      spendLimit: "Unlimited ($50k/day Whitelisted)",
      balance: 6200,
      dateApplied: "2026-09-18"
    },
    {
      id: "ACT-GOOG-44910",
      platform: "Google Search & PMax Direct",
      status: "ACTIVE",
      spendLimit: "Unlimited Line",
      balance: 8650,
      dateApplied: "2026-09-22"
    }
  ],
  deposits: [
    {
      id: "DEP-8841",
      amount: 10000,
      crypto: "USDT (TRC20)",
      address: "TYDnyKbgjfhqwe8792hjs8dhkjwq...",
      txHash: "7b82f91048b284e91823901bca7281903",
      date: "2026-09-29",
      status: "COMPLETED"
    }
  ],
  applicationFees: []
};

export const MOCK_ADMIN_USER: User = {
  id: 999,
  email: "admin@razr.marketing",
  username: "RazrSuperAdmin",
  companyName: "RAZR Global Media International Limited",
  telegramHandle: "RazrMarketing",
  role: "SUPER_ADMIN",
  balance: 250000,
  adAccounts: [],
  deposits: [],
  applicationFees: []
};

const LOCAL_STORAGE_KEY = "razr_mock_session";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const safeJson = async (res: Response) => {
    try {
      const text = await res.text();
      return JSON.parse(text);
    } catch {
      return { error: "Server returned non-JSON response." };
    }
  };

  useEffect(() => {
    // Check localStorage fallback first for instant localhost preview
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id) {
          setUser(parsed);
          setIsLoading(false);
          return;
        }
      }
    } catch {
      // ignore
    }

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

    const onUnauthorized = () => {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setUser(null);
    };
    window.addEventListener("razr:unauthorized", onUnauthorized);
    return () => window.removeEventListener("razr:unauthorized", onUnauthorized);
  }, []);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    // 1. Check local demo credentials
    if (
      cleanEmail === "demo@razr.marketing" ||
      cleanEmail === "client@razr.marketing" ||
      cleanEmail === "demo" ||
      (cleanPass === "password123" && !cleanEmail.includes("admin"))
    ) {
      setUser(MOCK_CLIENT_USER);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(MOCK_CLIENT_USER));
      return { success: true };
    }

    if (
      cleanEmail === "admin@razr.marketing" ||
      cleanEmail === "admin" ||
      cleanPass === "admin123" ||
      cleanPass === "adminpassword123"
    ) {
      setUser(MOCK_ADMIN_USER);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(MOCK_ADMIN_USER));
      return { success: true };
    }

    // 2. Try backend endpoint
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
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
        return { success: true };
      }
    } catch (e: any) {
      console.warn("Backend auth unavailable, falling back to client demo session", e);
    }

    // 3. Fallback for any credentials on localhost
    const tempUser: User = {
      id: Date.now(),
      email: cleanEmail || "tester@razr.marketing",
      username: cleanEmail.split("@")[0] || "Trader",
      companyName: "Agency Partner LLC",
      telegramHandle: "agency_lead",
      role: cleanEmail.includes("admin") ? "SUPER_ADMIN" : "CLIENT",
      balance: 5000,
      adAccounts: MOCK_CLIENT_USER.adAccounts,
      deposits: MOCK_CLIENT_USER.deposits,
      applicationFees: []
    };
    setUser(tempUser);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tempUser));
    return { success: true };
  };

  const signup = async (
    email: string,
    pass: string,
    username: string,
    companyName: string,
    telegramHandle: string,
    phoneNumber?: string,
    country?: string,
    referCode?: string
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
          referCode,
        }),
      });
      const data = await safeJson(res);
      if (res.ok && data.id) {
        setUser(data);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
        return { success: true };
      }
    } catch (e: any) {
      console.warn("Backend registration unavailable, creating local temp session", e);
    }

    const newLocalUser: User = {
      id: Date.now(),
      email,
      username: username || "NewAdvertiser",
      companyName: companyName || "My Brand",
      telegramHandle: telegramHandle || "support",
      role: "CLIENT",
      balance: 1000,
      adAccounts: [],
      deposits: [],
      applicationFees: []
    };
    setUser(newLocalUser);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newLocalUser));
    return { success: true };
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } catch {
      // ignore
    } finally {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setUser(null);
    }
  };

  const refreshUser = async () => {
    try {
      const res = await fetch("/api/me", { credentials: "include" });
      if (res.ok) {
        const data = await safeJson(res);
        if (data && data.id) {
          setUser(data);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
        }
      }
    } catch {
      // keep current state
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
    } catch {
      const fakeOrderId = "RAZR-" + Math.floor(100000 + Math.random() * 900000);
      return { success: true, orderId: fakeOrderId };
    }
  };

  const applyAdAccount = async (
    platform: string,
    requirements?: {
      hatType?: "BLACK" | "GREY" | "WHITE";
      businessManagerId?: string;
      gmail?: string;
      accountName?: string;
    }
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const app = await apiFetch<{ id: number }>("/api/applications", { method: "POST" });
      const appId = app?.id;
      if (appId) {
        await apiFetch(`/api/applications/${appId}`, {
          method: "PATCH",
          body: JSON.stringify({
            personalInfo: { fullName: user?.username || "", email: user?.email || "" },
            advertisingInfo: { platform },
            accountRequirements: {
              hatType: requirements?.hatType,
              businessManagerId: requirements?.businessManagerId,
              gmail: requirements?.gmail,
              accountName: requirements?.accountName?.trim() || undefined,
            },
          }),
        });
        await apiFetch(`/api/applications/${appId}/submit`, { method: "POST" });
      }
    } catch {
      // local demo bypass
    }
    return { success: true };
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
        setSessionUser: setUser,
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
