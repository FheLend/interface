import { useState } from "react";
import { Box, Button } from "@chakra-ui/react";
import { ContractTransactionResponse, ethers } from "ethers";
import { useAccount, useChainId } from "wagmi";
import { GAS_LIMIT, POOL } from "@/constants/contracts";
import poolAbi from "@/constants/abi/pool.json";
import { get } from "lodash";
import { useFhenix } from "@/context/fhenix";

export function RepayButton({
  amount,
  poolAddress,
  refetchBalance,
}: {
  amount: string;
  poolAddress: `0x${string}`;
  refetchBalance: () => void;
}) {
  const chainId = useChainId();
  const { address } = useAccount();
  const { fhenixClient, fhenixProvider } = useFhenix();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [loadingText, setLoadingText] = useState<string>();

  async function borrow() {
    try {
      if (!fhenixClient || !fhenixProvider || !address) return;
      setLoading(true);
      setError("");
      let encrypted = await fhenixClient.encrypt_uint128(BigInt(amount));
      const signer = await fhenixProvider.getSigner();

      const contract = new ethers.Contract(POOL[chainId], poolAbi, signer);
      const contractWithSigner = contract.connect(signer);

      setLoadingText("Confirming...");
      //@ts-ignore
      const tx: ContractTransactionResponse = await contractWithSigner.repay(
        poolAddress,
        encrypted,
        address,
        { gasLimit: GAS_LIMIT[chainId] }
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
        Repay
      </Button>
      {error && (
        <Box mt="2" fontSize="small" color="red.300" wordBreak="break-word">
          {error}
        </Box>
      )}
    </>
  );
}