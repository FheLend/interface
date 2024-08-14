import { useState } from "react";
import { Box, Button } from "@chakra-ui/react";
import { ContractTransactionResponse, ethers } from "ethers";
import { useAccount, useChainId } from "wagmi";
import aTokenAbi from "@/constants/abi/aToken.json";
import { get } from "lodash";
import useFhenix from "@/hooks/useFhenix";

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
  const { fhenixClient, fhenixProvider } = useFhenix();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [loadingText, setLoadingText] = useState<string>();

  async function withdraw() {
    try {
      if (!fhenixClient || !fhenixProvider) return;
      setLoading(true);
      setError("");
      let encrypted = await fhenixClient.encrypt_uint128(BigInt(amount));
      const signer = await fhenixProvider.getSigner();

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
