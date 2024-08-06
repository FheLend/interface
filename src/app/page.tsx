"use client";

import { Box, Button, Center, Flex, Spacer } from "@chakra-ui/react";
import { Card, Tag } from "../common/common";
import poolAbi from "@/constants/abi/pool.json";
import { useReadContract } from "wagmi";
import Pools from "./components/pools";
import { first, isEmpty } from "lodash";
import { POOL_CORE } from "@/constants/contracts";

export default function Home() {
  const { data: reserves } = useReadContract({
    abi: poolAbi,
    address: POOL_CORE,
    functionName: "getReserves",
  });

  return (
    <Box mt="10">
      <Flex>
        <Box fontSize="2xl">Dashboard</Box>
        <Spacer />

        <Tag title="Net worth" sub="$22,222" />
        <Tag title="Net APY" sub="17.6%" ml="3" />
      </Flex>

      <Card
        title="Pools"
        mt="7"
        // sub={
        //   <Center fontSize="sm" color="whiteAlpha.600">
        //     Collateral:
        //     <Box fontSize="lg" color="whiteAlpha.900" ml="2">
        //       $6,765
        //     </Box>
        //   </Center>
        // }
      >
        {!isEmpty(reserves) && <Pools poolAddresses={reserves as string[]} />}
      </Card>
    </Box>
  );
}
