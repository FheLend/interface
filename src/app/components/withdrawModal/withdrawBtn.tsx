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
import aTokenAbi from "@/constants/abi/aToken.json";
import { get } from "lodash";

export function WithdrawButton({
  amount,
  aTokenAddress,
  refetchBalance,
}: {
  amount: string;
  aTokenAddress: `0x${string}`;
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

  async function withdraw() {
    try {
      if (!fhenixClient.current || !fhenixProvider.current) return;
      setLoading(true);
      setError("");
      let encrypted = await fhenixClient.current.encrypt_uint128(
        BigInt(amount)
      );
      const signer = await fhenixProvider.current.getSigner();

      const contract = new ethers.Contract(aTokenAddress, aTokenAbi, signer);
      const contractWithSigner = contract.connect(signer);

      setLoadingText("Confirming...");
      //@ts-ignore
      const tx: ContractTransactionResponse = await contractWithSigner.redeem(
        encrypted,
        { gasLimit: 3_000_000 }
      );
      setLoadingText("Waiting for tx...");
      await tx.wait(); // return ContractTransactionReceipt
      setLoading(false);
      refetchBalance();
    } catch (error) {
      setLoading(false);
      setError(get(error, "reason") || get(error, "message"));
    }
  }

  return (
    <>
      <Button
        onClick={withdraw}
        isLoading={loading}
        loadingText={loadingText}
        isDisabled={loading}
      >
        Withdraw
      </Button>
      {error && (
        <Box mt="2" fontSize="small" color="red.300" wordBreak="break-word">
          {error}
        </Box>
      )}
    </>
  );
}
