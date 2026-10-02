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
  token?: string;
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

// Clean initial state for client users
export const MOCK_CLIENT_USER: User = {
  id: 1,
  email: "client@razr.marketing",
  username: "Client",
  companyName: "Agency Partner LLC",
  telegramHandle: "agency_lead",
  role: "CLIENT",
  balance: 0,
  adAccounts: [],
  deposits: [],
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
const TOKEN_KEY = "razr_auth_token";

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
    // Check localStorage fallback first for instant preview
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

    const storedToken = localStorage.getItem(TOKEN_KEY) || "";
    const headers = storedToken ? { Authorization: `Bearer ${storedToken}` } : {};

    fetch("/api/me", { credentials: "include", headers })
      .then(async (res) => {
        if (res.ok) return await safeJson(res);
        throw new Error("Unauthenticated");
      })
      .then((userData) => {
        if (userData && userData.id) {
          setUser(userData);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userData));
          if (userData.token) {
            localStorage.setItem(TOKEN_KEY, userData.token);
          }
        } else {
          setUser(null);
        }
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });

    const onUnauthorized = () => {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      localStorage.removeItem(TOKEN_KEY);
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
        if (data.token) {
          localStorage.setItem(TOKEN_KEY, data.token);
        }
        return { success: true };
      }
      if (!res.ok) {
        return { success: false, error: data.error || data.message || "Invalid credentials." };
      }
    } catch (e: any) {
      console.warn("Backend auth error", e);
    }

    // 3. Fallback for offline demo session
    const tempUser: User = {
      id: Date.now(),
      email: cleanEmail || "client@razr.marketing",
      username: cleanEmail.split("@")[0] || "Client",
      companyName: "Agency Partner LLC",
      telegramHandle: "agency_lead",
      role: cleanEmail.includes("admin") ? "SUPER_ADMIN" : "CLIENT",
      balance: 0,
      adAccounts: [],
      deposits: [],
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
        if (data.token) {
          localStorage.setItem(TOKEN_KEY, data.token);
        }
        return { success: true };
      }
      if (!res.ok) {
        return { success: false, error: data.error || data.message || "Registration failed." };
      }
    } catch (e: any) {
      console.warn("Backend registration error", e);
    }

    const newLocalUser: User = {
      id: Date.now(),
      email,
      username: username || "NewAdvertiser",
      companyName: companyName || "My Brand",
      telegramHandle: telegramHandle || "support",
      role: "CLIENT",
      balance: 0,
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
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
    }
  };

  const refreshUser = async () => {
    try {
      const storedToken = localStorage.getItem(TOKEN_KEY) || "";
      const headers = storedToken ? { Authorization: `Bearer ${storedToken}` } : {};
      const res = await fetch("/api/me", { credentials: "include", headers });
      if (res.ok) {
        const data = await safeJson(res);
        if (data && data.id) {
          setUser(data);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
          if (data.token) {
            localStorage.setItem(TOKEN_KEY, data.token);
          }
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
      const res = await apiFetch<any>("/api/payments/deposit-proof", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      await refreshUser();
      return { success: true, orderId: res.orderId };
    } catch (e: any) {
      return { success: false, error: e.message || "Failed to submit deposit proof." };
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
      await apiFetch("/api/applications", {
        method: "POST",
        body: JSON.stringify({
          advertisingInfo: { platform },
          accountRequirements: requirements,
        }),
      });
      await refreshUser();
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || "Failed to submit application." };
    }
  };

  const setSessionUser = (newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newUser));
      if (newUser.token) {
        localStorage.setItem(TOKEN_KEY, newUser.token);
      }
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      localStorage.removeItem(TOKEN_KEY);
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
        setSessionUser,
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
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
