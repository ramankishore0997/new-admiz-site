export const RECEIVING_WALLET_ADDRESS = "TTfpa75gZowYgmvJHeYqzfBBRMV9WP8k9w";

export interface ManualPaymentNetwork {
  id: string;
  name: string;
  network: string;
  badge: string;
  color: string;
  text: string;
}

export const MANUAL_PAYMENT_NETWORKS: ManualPaymentNetwork[] = [
  { id: "tron",     name: "Tron (TRC20)",             network: "TRC20",    badge: "TRON / TRC20", color: "from-[#EB0029]/20 to-[#EB0029]/5", text: "text-[#EB0029]" },
];

export interface WalletConfig {
  id: string;
  name: string;
  symbol: string;
  network: string;
  address: string;
  color: string;
  text: string;
}

export const PAYMENT_CONFIG = {
  telegramSupportUrl: "https://t.me/RazrMarketing",
  wallets: MANUAL_PAYMENT_NETWORKS.map((n) => ({
    id: n.id,
    name: n.name,
    symbol: "USDT",
    network: n.network,
    address: RECEIVING_WALLET_ADDRESS,
    color: n.color,
    text: n.text,
  })) as WalletConfig[],
};
