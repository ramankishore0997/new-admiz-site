/**
 * Server-side blockchain explorer mapping. NEVER construct explorer URLs from
 * client input — only these known network keys are ever used.
 */
const EXPLORER_MAP: Record<string, string> = {
  bsc: "https://bscscan.com/tx/",
  eth: "https://etherscan.io/tx/",
  polygon: "https://polygonscan.com/tx/",
  arbitrum: "https://arbiscan.io/tx/",
  optimism: "https://optimistic.etherscan.io/tx/",
  base: "https://basescan.org/tx/",
  tron: "https://tronscan.org/#/transaction/",
  solana: "https://solscan.io/tx/",
};

export function explorerLink(network: string | null | undefined, txHash: string): string | null {
  const base = EXPLORER_MAP[String(network || "").toLowerCase()];
  if (!base || !txHash) return null;
  return `${base}${txHash}`;
}

export function truncateMiddle(value: string, maxLen = 18): string {
  if (value.length <= maxLen) return value;
  const half = Math.floor((maxLen - 1) / 2);
  return `${value.slice(0, half)}…${value.slice(-half)}`;
}

export function truncate(value: string, maxLen = 200): string {
  if (value.length <= maxLen) return value;
  return `${value.slice(0, maxLen)}…`;
}

export function formatDate(d: Date | string | null | undefined): string {
  if (!d) return "-";
  const date = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toISOString().slice(0, 16).replace("T", " ");
}

export function statusEmoji(status: string | null | undefined): string {
  switch (status) {
    case "ACTIVE":
    case "PAID":
    case "APPROVED":
    case "SUBMITTED":
    case "COMPLETED":
      return "✅";
    case "REJECTED":
    case "SUSPENDED":
    case "EXPIRED":
    case "CANCELLED":
      return "❌";
    case "PENDING_VERIFICATION":
    case "PENDING":
    case "PENDING_REVIEW":
    case "PENDING_PROVISIONING":
    case "INFORMATION_REQUIRED":
    case "DOCUMENTS_REQUIRED":
    case "UNDER_REVIEW":
    case "PROVISIONING":
      return "⏳";
    case "DRAFT":
      return "📝";
    default:
      return "•";
  }
}
