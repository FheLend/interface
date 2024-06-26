import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";

import { cookieStorage, createStorage } from "wagmi";
import { mainnet } from "wagmi/chains";
import { defineChain } from "viem";

// Get projectId from https://cloud.walletconnect.com
export const projectId = "e806705b066bca1ee41f75d79cc0c607";
// export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID

if (!projectId) throw new Error("Project ID is not defined");

const metadata = {
  name: "Felend",
  description: "Felend",
  url: "https://web3modal.com", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

export const fhenix = defineChain({
  id: 8008135,
  name: "Fhenix Helium",
  nativeCurrency: { name: "Fhenix Helium", symbol: "tFHE", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://api.helium.fhenix.zone"] },
  },
  blockExplorers: {
    default: { name: "Fhenixscan", url: "https://explorer.helium.fhenix.zone" },
  },
  contracts: {},
});

// Create wagmiConfig
const chains = [fhenix, mainnet] as const;
export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
});
