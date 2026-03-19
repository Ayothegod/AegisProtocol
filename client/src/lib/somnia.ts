import { defineChain } from "viem";

export const somniaTestnet = defineChain({
  id: 50312,
  name: "Somnia Testnet",
  nativeCurrency: {
    name: "Somnia Token",
    symbol: "STT",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [import.meta.env.VITE_SOMNIA_RPC_URL],
      webSocket: [import.meta.env.VITE_SOMNIA_WSS_URL],
    },
  },
  blockExplorers: {
    default: {
      name: "Somnia Explorer",
      url: "https://shannon-explorer.somnia.network",
    },
  },
  testnet: true,
});
