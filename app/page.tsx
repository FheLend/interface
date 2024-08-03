"use client";

import { Box, Button, Center, Flex, Spacer } from "@chakra-ui/react";
import { Card, Tag } from "./common/common";
import poolAbi from "@/constants/abi/pool.json";
import { useReadContract } from "wagmi";
import Pools from "./components/pools";
import { first, isEmpty } from "lodash";

export default function Home() {
  const { data: reserves } = useReadContract({
    abi: poolAbi,
    address: "0xb00C2be32C16cE0C50f98b73502f01b2840790a7",
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
