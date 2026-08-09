export const RECEIVING_WALLET_ADDRESS = "0x5e094e9Fc46FF77D638682CcB50b6D3b6BFbd2d0";
export const TRON_WALLET_ADDRESS = "TTfpa75gZowYgmvJHeYqzfBBRMV9WP8k9w";

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
  { id: "bsc",      name: "BNB Smart Chain (BEP20)", network: "BEP20",    badge: "BSC / BEP20", color: "from-[#F0B90B]/20 to-[#F0B90B]/5", text: "text-[#F0B90B]", address: RECEIVING_WALLET_ADDRESS },
  { id: "eth",      name: "Ethereum (ERC20)",        network: "ERC20",    badge: "ETH / ERC20", color: "from-[#627EEA]/20 to-[#627EEA]/5", text: "text-[#627EEA]", address: RECEIVING_WALLET_ADDRESS },
  { id: "polygon",  name: "Polygon",                 network: "Polygon",  badge: "POLYGON",     color: "from-[#8247E5]/20 to-[#8247E5]/5", text: "text-[#8247E5]", address: RECEIVING_WALLET_ADDRESS },
  { id: "arbitrum", name: "Arbitrum One",            network: "Arbitrum", badge: "ARBITRUM",    color: "from-[#28A0F0]/20 to-[#28A0F0]/5", text: "text-[#28A0F0]", address: RECEIVING_WALLET_ADDRESS },
  { id: "optimism", name: "Optimism",                network: "Optimism", badge: "OPTIMISM",    color: "from-[#FF0420]/20 to-[#FF0420]/5", text: "text-[#FF0420]", address: RECEIVING_WALLET_ADDRESS },
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
