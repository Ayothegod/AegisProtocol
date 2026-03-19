import { createConfig, http } from "wagmi";
import { somniaTestnet } from "./somnia";

export const wagmiConfig = createConfig({
  chains: [somniaTestnet],
  transports: {
    [somniaTestnet.id]: http(import.meta.env.VITE_SOMNIA_RPC_URL),
  },
});
