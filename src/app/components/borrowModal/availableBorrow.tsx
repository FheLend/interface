import { useReadContract } from "wagmi";
import priceOracleAbi from "@/constants/abi/priceOracle.json";
import { formatUnits } from "viem";
import { useEffect } from "react";

function AvailableBorrow({
  address,
  tokenAddress,
  availableBorrowsETH,
  render,
}: {
  address: `0x${string}`;
  tokenAddress: `0x${string}`;
  availableBorrowsETH: number;
  render: (price: string) => JSX.Element;
}) {
  const { data, isLoading, refetch } = useReadContract({
    address: address,
    abi: priceOracleAbi,
    functionName: "getAssetPrice",
    args: [tokenAddress],
  });

  const price = formatUnits((data as bigint) || 0n, 18);
  const amount = availableBorrowsETH / Number(price);

  return render(`${amount}`);
}

export default AvailableBorrow;
