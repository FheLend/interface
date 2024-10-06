"use client";

import { Box, Flex, Grid, GridItem, Spacer } from "@chakra-ui/react";
import { Card } from "@/common/common";
import poolAbi from "@/constants/abi/pool.json";
import { useAccount, useChainId, useReadContracts } from "wagmi";
import Pools from "../components/pools";
import { get, isEmpty } from "lodash";
import { POOL, POOL_CORE } from "@/constants/contracts";
import UserInfo from "./userInfo";

export default function Home() {
  const chainId = useChainId();
  const { address, isConnected } = useAccount();
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

  return (
    <Box mt="10">
      <Flex>
        <Box fontSize="2xl">Dashboard</Box>
        <Spacer />

        {/* <Tag
          title="Net worth"
          sub={`~ ${(+formatUnits(
            totalLiquidityETH,
            18
          )).toLocaleString()} ETH`}
        /> */}
      </Flex>

      <Grid templateColumns="repeat(3, 1fr)" gap={6}>
        <GridItem colSpan={{ base: 3, lg: isConnected ? 2 : 3 }}>
          <Card cardTitle="Pools" mt="7">
            {!isEmpty(reserves) && (
              <Pools poolAddresses={reserves as `0x${string}`[]} />
            )}
          </Card>
        </GridItem>
        <GridItem colSpan={{ base: 3, lg: 1 }}>
          {isConnected && (
            <UserInfo data={userAccountData} reserves={reserves} />
          )}
        </GridItem>
      </Grid>
    </Box>
  );
}
