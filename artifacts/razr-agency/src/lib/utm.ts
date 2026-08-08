const STORAGE_KEY = "razr_attribution";
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;
const CLICK_KEYS = ["fbclid", "gclid"] as const;

export type Attribution = Partial<Record<(typeof UTM_KEYS)[number] | (typeof CLICK_KEYS)[number] | "landing" | "ts", string>>;

export function captureAttribution(): Attribution {
  if (typeof window === "undefined") return {};

  try {
    const existing = sessionStorage.getItem(STORAGE_KEY);
    if (existing) return JSON.parse(existing) as Attribution;
  } catch {}

  const params = new URLSearchParams(window.location.search);
  const data: Attribution = {};
  for (const k of UTM_KEYS) {
    const v = params.get(k);
    if (v) data[k] = v;
  }
  for (const k of CLICK_KEYS) {
    const v = params.get(k);
    if (v) data[k] = v;
  }

  if (Object.keys(data).length > 0) {
    data.landing = window.location.pathname;
    data.ts = new Date().toISOString();
  }

  try {
    if (Object.keys(data).length > 0) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  } catch {}

  return data;
}

export function getAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  try {
    const existing = sessionStorage.getItem(STORAGE_KEY);
    if (existing) return JSON.parse(existing) as Attribution;
  } catch {}
  return {};
}

export function getAttributionLabel(): string {
  const a = getAttribution();
  const parts: string[] = [];
  if (a.utm_source) parts.push(`src:${a.utm_source}`);
  if (a.utm_medium) parts.push(`med:${a.utm_medium}`);
  if (a.utm_campaign) parts.push(`camp:${a.utm_campaign}`);
  if (a.utm_content) parts.push(`ad:${a.utm_content}`);
  if (a.fbclid) parts.push("fb-click");
  if (a.gclid) parts.push("g-click");
  return parts.join(" | ");
}
