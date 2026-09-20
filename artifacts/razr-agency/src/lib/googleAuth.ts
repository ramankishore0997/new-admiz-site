export const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  "955281194717-n5j3vds7cn9rm5jk3f5flcrgjqvg17aq.apps.googleusercontent.com";

declare global {
  interface Window {
    google?: any;
  }
}

/**
 * Safely parse a Google OAuth ID Token (JWT) without external libraries
 */
export function parseGoogleJwt(token: string): {
  email?: string;
  name?: string;
  picture?: string;
  sub?: string;
  email_verified?: boolean;
} | null {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

/**
 * Initialize Google Identity Services One-Tap and Button Handler
 */
export function initGoogleIdentity(
  onSuccess: (credential: string, profile: { email: string; name: string }) => void,
  onError?: (err: any) => void
) {
  if (typeof window === "undefined") return;

  const handleCredential = (response: any) => {
    if (!response?.credential) {
      onError?.(new Error("No credential received from Google"));
      return;
    }

    const payload = parseGoogleJwt(response.credential);
    if (!payload?.email) {
      onError?.(new Error("Failed to parse Google email profile"));
      return;
    }

    onSuccess(response.credential, {
      email: payload.email,
      name: payload.name || payload.email.split("@")[0] || "Client",
    });
  };

  const tryInit = () => {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredential,
        auto_select: false,
        cancel_on_tap_outside: true,
      });
      return true;
    }
    return false;
  };

  if (!tryInit()) {
    const interval = setInterval(() => {
      if (tryInit()) clearInterval(interval);
    }, 200);
    setTimeout(() => clearInterval(interval), 5000);
  }
}

/**
 * Render standard Google Sign In Button inside a container div
 */
export function renderGoogleButton(
  container: HTMLElement,
  options?: { theme?: "outline" | "filled_blue" | "filled_black"; size?: "large" | "medium"; width?: number }
) {
  if (typeof window === "undefined" || !container) return;

  const tryRender = () => {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.renderButton(container, {
        theme: options?.theme || "outline",
        size: options?.size || "large",
        shape: "pill",
        text: "continue_with",
        width: options?.width || (container.clientWidth > 0 ? container.clientWidth : 340),
        logo_alignment: "left",
      });
      return true;
    }
    return false;
  };

  if (!tryRender()) {
    const interval = setInterval(() => {
      if (tryRender()) clearInterval(interval);
    }, 200);
    setTimeout(() => clearInterval(interval), 5000);
  }
}
