import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";

import { cookieStorage, createStorage } from "wagmi";
import { defineChain } from "viem";

// Get projectId from https://cloud.walletconnect.com
export const projectId = process.env.NEXT_PUBLIC_WEB3_MODAL;

if (!projectId) throw new Error("Project ID is not defined");

const metadata = {
  name: "Felend",
  description: "Felend",
  url: "https://web3modal.com", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

export const fhenixChainId = 8008135;
export const fhenixRpcUrl = "https://api.helium.fhenix.zone";
export const fhenix = defineChain({
  id: fhenixChainId,
  name: "Fhenix Helium",
  nativeCurrency: { name: "Fhenix Helium", symbol: "tFHE", decimals: 18 },
  rpcUrls: {
    default: { http: [fhenixRpcUrl] },
  },
  blockExplorers: {
    default: { name: "Fhenixscan", url: "https://explorer.helium.fhenix.zone" },
  },
  contracts: {},
});

// Create wagmiConfig
const chains = [fhenix] as const;
export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
});
