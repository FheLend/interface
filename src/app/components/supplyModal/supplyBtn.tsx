import { useEffect, useRef, useState } from "react";
import { Box, Button } from "@chakra-ui/react";
import { ContractTransactionResponse, ethers, JsonRpcProvider } from "ethers";
import { BrowserProvider } from "ethers";
import { FhenixClient } from "fhenixjs";
import { useAccount, useChainId } from "wagmi";
import { Eip1193Provider } from "ethers";
import {
  FHENIX_CHAIN_ID,
  FHENIX_CHAIN_ID_LOCAL,
  POOL,
} from "@/constants/contracts";
import poolAbi from "@/constants/abi/pool.json";
import { get } from "lodash";

export function SupplyButton({
  amount,
  poolAddress,
  refetchAllowance,
  refetchBalance,
}: {
  amount: string;
  poolAddress: `0x${string}`;
  refetchAllowance: () => void;
  refetchBalance: () => void;
}) {
  const chainId = useChainId();
  const { connector } = useAccount();
  const fhenixProvider = useRef<JsonRpcProvider | BrowserProvider>();
  const fhenixClient = useRef<FhenixClient>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [loadingText, setLoadingText] = useState<string>();

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

  async function deposit() {
    try {
      if (!fhenixClient.current || !fhenixProvider.current) return;
      setLoading(true);
      setError("");
      let encrypted = await fhenixClient.current.encrypt_uint32(+amount);
      const signer = await fhenixProvider.current.getSigner();

      const contract = new ethers.Contract(POOL[chainId], poolAbi, signer);
      const contractWithSigner = contract.connect(signer);

      setLoadingText("Confirming...");
      //@ts-ignore
      const tx: ContractTransactionResponse = await contractWithSigner.deposit(
        poolAddress,
        encrypted,
        1n
      );
      setLoadingText("Waiting for tx...");
      await tx.wait(); // return ContractTransactionReceipt from ethers
      setLoading(false);
      refetchAllowance();
      refetchBalance();
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError(get(error, "reason") || get(error, "message"));
    }
  }

  return (
    <>
      <Button
        onClick={deposit}
        isLoading={loading}
        loadingText={loadingText}
        isDisabled={loading}
      >
        Supply
      </Button>
      {error && (
        <Box mt="2" fontSize="small" color="red.300">
          {error}
        </Box>
      )}
    </>
  );
}
