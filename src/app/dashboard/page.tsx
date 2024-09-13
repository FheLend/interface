"use client";

import {
  Box,
  Center,
  Flex,
  FlexProps,
  Grid,
  GridItem,
  SimpleGrid,
  Spacer,
} from "@chakra-ui/react";
import { Card, Tag } from "@/common/common";
import poolAbi from "@/constants/abi/pool.json";
import { useAccount, useChainId, useReadContracts } from "wagmi";
import Pools from "../components/pools";
import { get, isEmpty } from "lodash";
import { POOL, POOL_CORE } from "@/constants/contracts";
import { formatUnits } from "viem";

function RowInfo(props: FlexProps) {
  return (
    <Flex
      py="2"
      borderBottom="1px"
      borderColor="primary.600"
      justify="space-between"
      align="center"
      {...props}
    />
  );
}

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

  const totalLiquidityETH = get(userAccountData, "[0]", 0n);
  const totalCollateralETH = get(userAccountData, "[1]", 0n);
  const totalBorrowsETH = get(userAccountData, "[2]", 0n);
  const totalFeesETH = get(userAccountData, "[3]", 0n);
  const availableBorrowsETH = get(userAccountData, "[4]", 0n);
  const currentLiquidationThreshold = get(userAccountData, "[5]", 0n);
  const ltv = get(userAccountData, "[6]", 0n);
  const healthFactor = get(userAccountData, "[7]", 0n);

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
          <Card title="Pools" mt="7">
            {!isEmpty(reserves) && (
              <Pools poolAddresses={reserves as `0x${string}`[]} />
            )}
          </Card>
        </GridItem>
        <GridItem colSpan={{ base: 3, lg: 1 }}>
          {isConnected && (
            <Card title="Your Position" mt="7">
              <RowInfo>
                <Box color="whiteBlue.700" fontSize="sm">
                  Total Liquidity
                </Box>
                <Box>
                  ~ {(+formatUnits(totalLiquidityETH, 18)).toLocaleString()} ETH
                </Box>
              </RowInfo>
              <RowInfo>
                <Box color="whiteBlue.700" fontSize="sm">
                  Total Collateral
                </Box>
                <Box>
                  ~ {(+formatUnits(totalCollateralETH, 18)).toLocaleString()}{" "}
                  ETH
                </Box>
              </RowInfo>
              <RowInfo>
                <Box color="whiteBlue.700" fontSize="sm">
                  Total Borrowed
                </Box>
                <Box>
                  ~ {(+formatUnits(totalBorrowsETH, 18)).toLocaleString()} ETH
                </Box>
              </RowInfo>
              <RowInfo>
                <Box color="whiteBlue.700" fontSize="sm">
                  Total Fees
                </Box>
                <Box>
                  ~ {(+formatUnits(totalFeesETH, 18)).toLocaleString()} ETH
                </Box>
              </RowInfo>
              <RowInfo>
                <Box color="whiteBlue.700" fontSize="sm">
                  Available Borrows
                </Box>
                <Box>
                  ~ {(+formatUnits(availableBorrowsETH, 18)).toLocaleString()}{" "}
                  ETH
                </Box>
              </RowInfo>
              <RowInfo>
                <Box color="whiteBlue.700" fontSize="sm">
                  Liquidation Threshold
                </Box>
                <Box>
                  {Number(currentLiquidationThreshold).toLocaleString()} %
                </Box>
              </RowInfo>
              <RowInfo>
                <Box color="whiteBlue.700" fontSize="sm">
                  Loan to value
                </Box>
                <Box>{Number(ltv).toLocaleString()} %</Box>
              </RowInfo>
              <RowInfo>
                <Box color="whiteBlue.700" fontSize="sm">
                  Health Factor
                </Box>
                <Box>
                  {totalBorrowsETH
                    ? (+formatUnits(healthFactor, 18)).toLocaleString()
                    : "∞"}
                </Box>
              </RowInfo>
            </Card>
          )}
        </GridItem>
      </Grid>
    </Box>
  );
}
