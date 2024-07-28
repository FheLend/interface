import { createPublicClient, createWalletClient, custom, http } from "viem";
import { mainnet } from "viem/chains";
import { fhenix } from "./web3modal";

export const publicClient = createPublicClient({
  chain: fhenix,
  transport: http(),
});

export const walletClient = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum),
});
