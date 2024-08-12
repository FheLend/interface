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

export function BorrowButton({
  amount,
  poolAddress,
  refetchBalance,
}: {
  amount: string;
  poolAddress: `0x${string}`;
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

  async function borrow() {
    try {
      if (!fhenixClient.current || !fhenixProvider.current) return;
      setLoading(true);
      setError("");
      let encrypted = await fhenixClient.current.encrypt_uint128(
        BigInt(amount)
      );
      const signer = await fhenixProvider.current.getSigner();

      const contract = new ethers.Contract(POOL[chainId], poolAbi, signer);
      const contractWithSigner = contract.connect(signer);

      setLoadingText("Confirming...");
      //@ts-ignore
      const tx: ContractTransactionResponse = await contractWithSigner.borrow(
        poolAddress,
        encrypted,
        1n, // _interestRateMode
        1n, // _referralCode
        { gasLimit: 3_000_000 }
      );
      setLoadingText("Waiting for tx...");
      await tx.wait(); // return ContractTransactionReceipt from ethers
      setLoading(false);
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
        onClick={borrow}
        isLoading={loading}
        loadingText={loadingText}
        isDisabled={loading}
      >
        Borrow
      </Button>
      {error && (
        <Box mt="2" fontSize="small" color="red.300" wordBreak="break-word">
          {error}
        </Box>
      )}
    </>
  );
}
