import { useEffect, useRef } from "react";
import { BrowserProvider, JsonRpcProvider } from "ethers";
import { FhenixClient } from "fhenixjs";
import { useAccount, useChainId } from "wagmi";
import { Eip1193Provider } from "ethers";
import { FHENIX_CHAIN_ID, FHENIX_CHAIN_ID_LOCAL } from "@/constants/contracts";

export default function useFhenix() {
  const chainId = useChainId();
  const { connector } = useAccount();
  const fhenixProvider = useRef<JsonRpcProvider | BrowserProvider>();
  const fhenixClient = useRef<FhenixClient>();

  useEffect(() => {
    if (
      connector &&
      (chainId === FHENIX_CHAIN_ID || chainId === FHENIX_CHAIN_ID_LOCAL)
    ) {
      connector.getProvider().then((provider) => {
        fhenixProvider.current = new BrowserProvider(
          provider as Eip1193Provider
        );
        fhenixClient.current = new FhenixClient({
          provider: fhenixProvider.current as any,
        });
      });
    }
  }, [connector, chainId]);

  return {
    fhenixProvider: fhenixProvider.current,
    fhenixClient: fhenixClient.current,
  };
}
