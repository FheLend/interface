import { useState } from "react";
import { Box, Button } from "@chakra-ui/react";
import { ContractTransactionResponse, ethers } from "ethers";
import { useChainId } from "wagmi";
import { GAS_LIMIT, POOL } from "@/constants/contracts";
import poolAbi from "@/constants/abi/pool.json";
import { get } from "lodash";
import { useFhenix } from "@/context/fhenix";
import { getError } from "@/utils/helper";
import { useConfig } from "@/store/pools";

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
  const { config } = useConfig();

  async function deposit() {
    try {
      if (!fhenixClient || !fhenixProvider) return;
      setLoading(true);
      setError("");
      let encrypted = await fhenixClient.encrypt_uint128(BigInt(amount));
      const signer = await fhenixProvider.getSigner();

      const contract = new ethers.Contract(
        config?.pool as string,
        poolAbi,
        signer
      );
      const contractWithSigner = contract.connect(signer);

      setLoadingText("Confirming...");
      //@ts-ignore
      const tx: ContractTransactionResponse = await contractWithSigner.deposit(
        poolAddress,
        encrypted,
        { gasLimit: config?.defaultGas || GAS_LIMIT[chainId] }
      );
      setLoadingText("Waiting for tx...");
      await tx.wait(); // return ContractTransactionReceipt from ethers
      setLoading(false);
      refetchAllowance();
      refetchBalance();
    } catch (error) {
      setLoading(false);
      setError(getError(error));
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
        <Box mt="3" fontSize="small" color="red.300" wordBreak="break-word">
          {error}
        </Box>
      )}
    </>
  );
}
