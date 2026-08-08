export const RECEIVING_WALLET_ADDRESS = "0x5e094e9Fc46FF77D638682CcB50b6D3b6BFbd2d0";

export interface ManualPaymentNetwork {
  id: string;
  name: string;
  network: string;
  badge: string;
  color: string;
  text: string;
}

export const MANUAL_PAYMENT_NETWORKS: ManualPaymentNetwork[] = [
  { id: "bsc",      name: "BNB Smart Chain (BEP20)", network: "BEP20",    badge: "BSC / BEP20", color: "from-[#F0B90B]/20 to-[#F0B90B]/5", text: "text-[#F0B90B]" },
  { id: "eth",      name: "Ethereum (ERC20)",        network: "ERC20",    badge: "ETH / ERC20", color: "from-[#627EEA]/20 to-[#627EEA]/5", text: "text-[#627EEA]" },
  { id: "polygon",  name: "Polygon",                 network: "Polygon",  badge: "POLYGON",     color: "from-[#8247E5]/20 to-[#8247E5]/5", text: "text-[#8247E5]" },
  { id: "arbitrum", name: "Arbitrum One",            network: "Arbitrum", badge: "ARBITRUM",    color: "from-[#28A0F0]/20 to-[#28A0F0]/5", text: "text-[#28A0F0]" },
  { id: "optimism", name: "Optimism",                network: "Optimism", badge: "OPTIMISM",    color: "from-[#FF0420]/20 to-[#FF0420]/5", text: "text-[#FF0420]" },
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
