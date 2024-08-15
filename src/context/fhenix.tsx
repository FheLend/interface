"use client";

import { createContext, useContext, useState } from "react";
import { useEffect, useRef } from "react";
import { BrowserProvider, JsonRpcProvider } from "ethers";
import { FhenixClient } from "fhenixjs";
import { useChainId } from "wagmi";
import { Eip1193Provider } from "ethers";
import { FHENIX_CHAIN_ID, FHENIX_CHAIN_ID_LOCAL } from "@/constants/contracts";

export const FhenixContext = createContext<{
  fhenixProvider?: JsonRpcProvider | BrowserProvider;
  fhenixClient?: FhenixClient;
}>({
  fhenixProvider: undefined,
  fhenixClient: undefined,
});

export function useFhenix() {
  return useContext(FhenixContext);
}

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function FhenixProvider({
  children,
}: {
  children: JSX.Element;
}) {
  const chainId = useChainId();
  const [fhenixProvider, setFhenixProvider] = useState<
    JsonRpcProvider | BrowserProvider
  >();
  const [fhenixClient, setFhenixClient] = useState<FhenixClient>();

  useEffect(() => {
    if (chainId === FHENIX_CHAIN_ID || chainId === FHENIX_CHAIN_ID_LOCAL) {
      const provider = new BrowserProvider(window.ethereum as Eip1193Provider);
      setFhenixProvider(provider);
      const fhenixClient = new FhenixClient({
        provider: provider as any,
      });
      setFhenixClient(fhenixClient);
    }
  }, [chainId]);

  return (
    <FhenixContext.Provider
      value={{
        fhenixProvider,
        fhenixClient,
      }}
    >
      {children}
    </FhenixContext.Provider>
  );
}
