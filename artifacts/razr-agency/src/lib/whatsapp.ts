import { getAttributionLabel } from "./utm";

export const TELEGRAM_URL = "https://t.me/RazrMarketing";

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

export function buildDirectWhatsAppLink(_customMsg?: string): string {
  return TELEGRAM_URL;
}
