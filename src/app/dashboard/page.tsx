"use client";

import { Box, Flex, Grid, GridItem, Spacer } from "@chakra-ui/react";
import { Card } from "@/common/common";
import { useAccount } from "wagmi";
import Pools from "../components/pools";
import { isEmpty } from "lodash";
import UserInfo from "./userInfo";
import { useReserves, useUserAccountData } from "@/store/pools";

export default function Home() {
  const { isConnected } = useAccount();
  const { reserves } = useReserves();
  const { userAccountData } = useUserAccountData();

  console.log(reserves);
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
          {isConnected && <UserInfo data={userAccountData} />}
        </GridItem>
      </Grid>
    </Box>
  );
}
