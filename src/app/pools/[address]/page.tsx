"use client";

import NotFound from "@/app/not-found";
import { Card } from "@/common/common";
import { POOL, TOKEN_LOGO, TOKENS } from "@/constants/contracts";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import {
  Box,
  Divider,
  Flex,
  FlexProps,
  Grid,
  GridItem,
  Image,
} from "@chakra-ui/react";
import Link from "next/link";
import { useChainId, useReadContract, useReadContracts } from "wagmi";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/tabs";
import SupplyForm from "@/app/components/supplyModal/supplyForm";
import BorrowForm from "@/app/components/borrowModal/borrowForm";
import RepayForm from "@/app/components/repay/repayForm";
import WithdrawForm from "@/app/components/withdrawModal/withdrawForm";
import { get } from "lodash";
import poolAbi from "@/constants/abi/pool.json";

function VerticalDivider() {
  return (
    <Divider
      orientation="vertical"
      h="70px"
      mx="10"
      borderColor="primary.600"
    />
  );
}

function RowInfo(props: FlexProps) {
  return (
    <Flex
      py="4"
      borderBottom="1px"
      borderColor="primary.600"
      justify="space-between"
      align="center"
      {...props}
    />
  );
}

function PoolDetail({ params }: { params: { address: string } }) {
  const chainId = useChainId();
  const poolAddress = params.address;
  const token = TOKENS[chainId].find((t) => t.address === poolAddress);

  // uint256 totalLiquidity,
  // uint256 availableLiquidity,
  // uint256 totalBorrowsStable,
  // uint256 totalBorrowsVariable,
  // uint256 liquidityRate,
  // uint256 variableBorrowRate,
  // uint256 stableBorrowRate,
  // uint256 averageStableBorrowRate,
  // uint256 utilizationRate,
  // uint256 liquidityIndex,
  // uint256 variableBorrowIndex,
  // address aTokenAddress,
  // uint40 lastUpdateTimestamp

  const { data, refetch, isLoading } = useReadContract({
    address: POOL[chainId],
    abi: poolAbi,
    functionName: "getReserveData",
    args: [poolAddress],
  });

  const totalLiquidity = get(data, "[0]", 0n);
  const availableLiquidity = get(data, "[1]", 0n);
  const totalBorrowsStable = get(data, "[2]", 0n);
  const totalBorrowsVariable = get(data, "[3]", 0n);
  const liquidityRate = get(data, "[4]", 0n);
  const variableBorrowRate = get(data, "[5]", 0n);
  const stableBorrowRate = get(data, "[6]", 0n);
  const averageStableBorrowRate = get(data, "[7]", 0n);
  const utilizationRate = get(data, "[8]", 0n);
  const aTokenAddress = get(data, "[11]", "");

  if (!token) {
    return <NotFound />;
  }

  return (
    <>
      <Flex mt="10" align="center">
        <Box as={Link} href="/dashboard" mr="2">
          <ChevronLeftIcon boxSize={6} />
        </Box>
        <Image src={TOKEN_LOGO[token.symbol]} alt="token logo" boxSize={7} />
        <Box ml="2" fontSize="xl" fontWeight="medium">
          {token.symbol}
        </Box>
      </Flex>

      <Flex my="6" align="center">
        <Box>
          <Box color="whiteBlue.700" mb="3">
            Supply
          </Box>
          <Box fontSize="2xl">$116.61M</Box>
        </Box>
        <VerticalDivider />
        <Box>
          <Box color="whiteBlue.700" mb="3">
            Liquidity
          </Box>
          <Box fontSize="2xl">$116.61M</Box>
        </Box>
      </Flex>

      <Grid templateColumns="repeat(3, 1fr)" gap={6}>
        <GridItem colSpan={2}>
          <Card title="Supply info" px="8">
            <Flex mt="6" align="center">
              <Box>
                <Box color="whiteBlue.700" fontSize="sm" mb="3">
                  Total Supply
                </Box>
                <Box fontSize="lg">$116.61M</Box>
              </Box>
              <VerticalDivider />
              <Box>
                <Box color="whiteBlue.700" fontSize="sm" mb="3">
                  Total Supply
                </Box>
                <Box fontSize="lg">$116.61M</Box>
              </Box>
            </Flex>
          </Card>
          <Card title="Borrow info" mt="6" px="8">
            <Flex mt="6" align="center">
              <Box>
                <Box color="whiteBlue.700" fontSize="sm" mb="3">
                  Total Supply
                </Box>
                <Box fontSize="lg">$116.61M</Box>
              </Box>
              <VerticalDivider />
              <Box>
                <Box color="whiteBlue.700" fontSize="sm" mb="3">
                  Total Supply
                </Box>
                <Box fontSize="lg">$116.61M</Box>
              </Box>
            </Flex>
          </Card>
          <Card title="Market info" mt="6" px="8">
            <RowInfo>
              <Box color="whiteBlue.700" fontSize="sm">
                Total Supply
              </Box>
              <Box>$116.61M</Box>
            </RowInfo>
            <RowInfo>
              <Box color="whiteBlue.700" fontSize="sm">
                Total Supply
              </Box>
              <Box>$116.61M</Box>
            </RowInfo>
            <RowInfo>
              <Box color="whiteBlue.700" fontSize="sm">
                Total Supply
              </Box>
              <Box>$116.61M</Box>
            </RowInfo>
          </Card>
        </GridItem>
        <GridItem>
          <Card px="8">
            <Tabs variant="basic" colorScheme="primary" isLazy>
              <TabList>
                <Tab>Supply</Tab>
                <Tab>Withdraw</Tab>
                <Tab>Borrow</Tab>
                <Tab>Repay</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <SupplyForm
                    poolAddress={poolAddress as `0x${string}`}
                    apr={1}
                    apy={1}
                  />
                </TabPanel>
                <TabPanel>
                  <WithdrawForm aTokenAddress={poolAddress as `0x${string}`} />
                </TabPanel>
                <TabPanel>
                  <BorrowForm poolAddress={poolAddress as `0x${string}`} />
                </TabPanel>
                <TabPanel>
                  <RepayForm poolAddress={poolAddress as `0x${string}`} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Card>
        </GridItem>
      </Grid>
    </>
  );
}

export default PoolDetail;
