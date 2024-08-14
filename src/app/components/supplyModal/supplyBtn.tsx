import { useState } from "react";
import { Box, Button } from "@chakra-ui/react";
import { ContractTransactionResponse, ethers } from "ethers";
import { useChainId } from "wagmi";
import { POOL } from "@/constants/contracts";
import poolAbi from "@/constants/abi/pool.json";
import { get } from "lodash";
import useFhenix from "@/hooks/useFhenix";

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
  const { fhenixClient, fhenixProvider } = useFhenix();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [loadingText, setLoadingText] = useState<string>();

  async function deposit() {
    try {
      if (!fhenixClient || !fhenixProvider) return;
      setLoading(true);
      setError("");
      let encrypted = await fhenixClient.encrypt_uint128(BigInt(amount));
      const signer = await fhenixProvider.getSigner();

      const contract = new ethers.Contract(POOL[chainId], poolAbi, signer);
      const contractWithSigner = contract.connect(signer);

      setLoadingText("Confirming...");
      //@ts-ignore
      const tx: ContractTransactionResponse = await contractWithSigner.deposit(
        poolAddress,
        encrypted,
        1n, // _referralCode
        { gasLimit: 3_000_000 }
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
        <Box mt="2" fontSize="small" color="red.300" wordBreak="break-word">
          {error}
        </Box>
      )}
    </>
  );
}
