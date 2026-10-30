export const TRON_WALLET_ADDRESS = "TCXcgzEG8j2i7hQpK4tTZtTCh5KdqqfJa5";
export const BEP20_WALLET_ADDRESS = "0x8F6E90b54B941887dF53CaeC9965F6CcDB701Fa6";

export interface ManualPaymentNetwork {
  id: string;
  name: string;
  network: string;
  badge: string;
  color: string;
  text: string;
  address: string;
}

export const MANUAL_PAYMENT_NETWORKS: ManualPaymentNetwork[] = [
  { id: "tron",     name: "Tron (TRC20)",             network: "TRC20",    badge: "TRON / TRC20", color: "from-[#EB0029]/20 to-[#EB0029]/5", text: "text-[#EB0029]",   address: TRON_WALLET_ADDRESS },
  { id: "bsc",      name: "BNB Smart Chain (BEP20)", network: "BEP20",    badge: "BSC / BEP20", color: "from-[#F0B90B]/20 to-[#F0B90B]/5", text: "text-[#F0B90B]", address: BEP20_WALLET_ADDRESS },
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
  whatsappNumber: "+44 7473 951923",
  whatsappSupportUrl: "https://wa.me/447473951923?text=Hello%20Razr%20Support,%20I%20need%20assistance",
  wallets: MANUAL_PAYMENT_NETWORKS.map((n) => ({
    id: n.id,
    name: n.name,
    symbol: "USDT",
    network: n.network,
    address: n.address,
    color: n.color,
    text: n.text,
  })) as WalletConfig[],
};
