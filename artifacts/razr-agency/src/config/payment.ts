export const TRON_WALLET_ADDRESS = "TCnevWTfAeo6SmaJoNF5k5kbZzDxsuR1eo";
export const BEP20_WALLET_ADDRESS = "0x7C13ee11d0f56576a6996Af3DD51961570FD0fD7";

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
