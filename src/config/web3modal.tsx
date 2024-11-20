import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";

import { cookieStorage, createStorage } from "wagmi";
import { defineChain } from "viem";
import { FHENIX_CHAIN_ID, FHENIX_CHAIN_ID_LOCAL } from "@/constants/contracts";

// Get projectId from https://cloud.walletconnect.com
export const projectId = process.env.NEXT_PUBLIC_WEB3_MODAL;

if (!projectId) throw new Error("Project ID is not defined");

const metadata = {
  name: "Felend",
  description: "Felend",
  url: "https://web3modal.com", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

export const fhenixRpcUrl = "https://api.nitrogen.fhenix.zone";
export const fhenix = defineChain({
  id: FHENIX_CHAIN_ID,
  name: "Fhenix Nitrogen",
  nativeCurrency: { name: "Fhenix Nitrogen", symbol: "tFHE", decimals: 18 },
  rpcUrls: {
    default: { http: [fhenixRpcUrl] },
  },
  blockExplorers: {
    default: { name: "Fhenixscan", url: "https://explorer.nitrogen.fhenix.zone" },
  },
  contracts: {},
});

export const fhenixRpcUrlLocal = "https://local.felend.xyz";
export const fhenixLocal = defineChain({
  id: FHENIX_CHAIN_ID_LOCAL,
  name: "Local Fhenix Helium",
  nativeCurrency: { name: "Fhenix Local", symbol: "tFHE", decimals: 18 },
  rpcUrls: {
    default: { http: [fhenixRpcUrlLocal] },
  },
  blockExplorers: {
    default: { name: "Fhenixscan", url: "https://explorer.nitrogen.fhenix.zone" },
  },
  contracts: {},
});

// Create wagmiConfig
const chains = [fhenix, fhenixLocal] as const;
export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
});
