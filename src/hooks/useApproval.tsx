import {
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import tokenABI from "@/constants/abi/token.json";
import { ethers } from "ethers";

export function useAllowance(
  tokenAddress: `0x${string}`,
  address?: string,
  spender?: string
) {
  const { data, isError, isFetching, refetch } = useReadContract({
    address: tokenAddress,
    abi: tokenABI,
    functionName: "allowance",
    args: [address, spender],
  });

  return {
    data,
    refetchAllowance: refetch,
    isError,
    isFetching,
  };
}

export function useApprove(tokenAddress: `0x${string}`, spender: string) {
  const amount = ethers.MaxUint256;
  const { writeContract, data, error, status } = useWriteContract();

  function approve() {
    writeContract({
      abi: tokenABI,
      address: tokenAddress,
      functionName: "approve",
      args: [spender, amount.toString()],
    });
  }

  const {
    data: txReceipt,
    isLoading: isTxLoading,
    isSuccess,
    error: txError,
  } = useWaitForTransactionReceipt({
    hash: data,
  });
  return {
    txReceipt,
    isTxLoading,
    isLoading: status === "pending",
    isSuccess,
    approve,
    error: error || txError,
  };
}
