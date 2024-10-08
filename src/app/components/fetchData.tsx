"use client";

import poolAbi from "@/constants/abi/pool.json";
import { useAccount, useChainId, useReadContracts } from "wagmi";
import { flatten, get } from "lodash";
import { POOL, POOL_CORE, TOKEN_LOGO } from "@/constants/contracts";
import { useReserves, useTokens, useUserAccountData } from "@/store/pools";
import { useEffect, useMemo } from "react";
import tokenAbi from "@/constants/abi/token.json";

function FetchData() {
  const chainId = useChainId();
  const { address } = useAccount();

  const { data } = useReadContracts({
    contracts: [
      {
        abi: poolAbi,
        address: POOL_CORE[chainId],
        functionName: "getReserves",
      },
      {
        address: POOL[chainId],
        abi: poolAbi,
        functionName: "getUserAccountData",
        args: [address],
      },
    ],
  });

  const reserves = get(data, "[0].result", []) as any[];
  const userAccountData = get(data, "[1].result", []) as any[];
  const { setReserves } = useReserves();
  const { setUserAccountData } = useUserAccountData();

  useEffect(() => {
    if (reserves.length) {
      setReserves(reserves);
    }
  }, [reserves]);

  useEffect(() => {
    if (userAccountData.length) {
      setUserAccountData(userAccountData);
    }
  }, [userAccountData]);

  return <>{reserves.length && <FetchTokenInfo addresses={reserves} />}</>;
}

function FetchTokenInfo({ addresses }: { addresses: `0x${string}`[] }) {
  const callData = useMemo(() => {
    const data = addresses.map((poolAddress) => [
      { address: poolAddress, abi: tokenAbi, functionName: "symbol" },
      { address: poolAddress, abi: tokenAbi, functionName: "decimals" },
    ]);
    return flatten(data);
  }, [addresses]);

  const { data, refetch, isLoading } = useReadContracts({
    //@ts-ignore
    contracts: callData,
  });
  const tokens = useMemo(() => {
    if (!data) return {};
    const tokensRecord: Record<
      string,
      { symbol: string; decimals: number; logo: string }
    > = {};
    for (let i = 0; i < data.length; i += 2) {
      const address = addresses[i / 2];
      tokensRecord[address] = {
        symbol: data[i]?.result as string,
        decimals: data[i + 1]?.result as number,
        logo: TOKEN_LOGO[data[i]?.result as string],
      };
    }
    return tokensRecord;
  }, [data, addresses]);

  const { setTokens } = useTokens();
  useEffect(() => {
    setTokens(tokens);
  }, [tokens]);

  return null;
}

export default FetchData;
