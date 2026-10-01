import { getAttributionLabel } from "./utm";

export const TELEGRAM_URL = "https://t.me/RazrMarketing";
export const WHATSAPP_NUMBER = "+44 7473 951923";
export const WHATSAPP_URL = "https://wa.me/447473951923?text=Hello%20Razr%20Support,%20I%20need%20assistance";

export type WaIntent =
  | "general"
  | "setup-access"
  | "full-access"
  | "book-call"
  | "roi-tier"
  | "case-study"
  | "exit-discount"
  | "urgency-slot"
  | "founder-call"
  | "support";

type IntentExtras = {
  budget?: string;
  roas?: string;
  slot?: string;
  caseName?: string;
  source?: string;
};

export function buildWaLink(_intent: WaIntent = "general", _extras: IntentExtras = {}): string {
  void getAttributionLabel(); // retain utm import, no-op
  return TELEGRAM_URL;
}

export function buildDirectWhatsAppLink(customMsg?: string): string {
  if (customMsg) {
    return `https://wa.me/447473951923?text=${encodeURIComponent(customMsg)}`;
  }
  return WHATSAPP_URL;
}
