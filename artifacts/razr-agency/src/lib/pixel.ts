declare global {
  interface Window {
    fbq?: (
      event: "track" | "trackCustom" | "init" | "consent",
      name: string,
      params?: Record<string, unknown>
    ) => void;
  }
}

function fire(event: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  try {
    window.fbq?.("track", event, params);
  } catch {}
}

export function trackLead(params?: Record<string, unknown>) {
  fire("Lead", { content_category: "telegram_click", ...params });
}

export function trackInitiateCheckout(params?: Record<string, unknown>) {
  fire("InitiateCheckout", { currency: "USD", ...params });
}

export function trackContact(params?: Record<string, unknown>) {
  fire("Contact", params);
}

export function trackViewContent(params?: Record<string, unknown>) {
  fire("ViewContent", params);
}

export function trackPageView() {
  fire("PageView");
}

export function trackSubscribe(params?: Record<string, unknown>) {
  fire("Subscribe", { currency: "USD", ...params });
}

export function trackCustom(name: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  try {
    window.fbq?.("trackCustom", name, params);
  } catch {}
}

export {};
