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
  Text,
} from "@chakra-ui/react";
import Link from "next/link";
import {
  useAccount,
  useChainId,
  useReadContract,
  useReadContracts,
} from "wagmi";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/tabs";
import SupplyForm from "@/app/components/supplyModal/supplyForm";
import BorrowForm from "@/app/components/borrowModal/borrowForm";
import RepayForm from "@/app/components/repay/repayForm";
import WithdrawForm from "@/app/components/withdrawModal/withdrawForm";
import { get } from "lodash";
import poolAbi from "@/constants/abi/pool.json";
import tokenAbi from "@/constants/abi/token.json";
import { formatUnits } from "viem";

const RAY = 10 ** 27;
const SECONDS_PER_YEAR = 31536000;

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

  const { data, refetch, isLoading } = useReadContracts({
    contracts: [
      {
        address: POOL[chainId],
        abi: poolAbi,
        functionName: "getReserveData",
        args: [poolAddress],
      },
      {
        address: POOL[chainId],
        abi: poolAbi,
        functionName: "getReserveConfigurationData",
        args: [poolAddress],
      },
      {
        address: poolAddress as `0x${string}`,
        abi: tokenAbi,
        functionName: "decimals",
      },
      {
        address: poolAddress as `0x${string}`,
        abi: tokenAbi,
        functionName: "symbol",
      },
    ],
  });

  const reserveData = get(data, "[0].result", []) as any[];
  const reserveConfigurationData = get(data, "[1].result", []) as any[];

  const tokenDecimals = get(data, "[2].result", 18) as number;
  const tokenSymbol = get(data, "[3].result", "TOKEN") as string;

  const totalLiquidity = get(reserveData, "[0]", 0n);
  const availableLiquidity = get(reserveData, "[1]", 0n);
  const totalBorrowsStable = get(reserveData, "[2]", 0n);
  const totalBorrowsVariable = get(reserveData, "[3]", 0n);
  const liquidityRate = get(reserveData, "[4]", 0n);
  const variableBorrowRate = get(reserveData, "[5]", 0n);
  const stableBorrowRate = get(reserveData, "[6]", 0n);
  const averageStableBorrowRate = get(reserveData, "[7]", 0n);
  const utilizationRate = get(reserveData, "[8]", 0n);
  const aTokenAddress = get(reserveData, "[11]", "");

  const ltv = get(reserveConfigurationData, "[0]", 0n);
  const liquidationThreshold = get(reserveConfigurationData, "[1]", 0n);
  const liquidationBonus = get(reserveConfigurationData, "[2]", 0n);
  const usageAsCollateralEnabled = get(reserveConfigurationData, "[4]", false);
  const borrowingEnabled = get(reserveConfigurationData, "[5]", false);
  const stableBorrowRateEnabled = get(reserveConfigurationData, "[6]", false);

  const depositAPR = Number(liquidityRate) / RAY;
  const depositAPY =
    (1 + depositAPR / SECONDS_PER_YEAR) ** SECONDS_PER_YEAR - 1;

  const stableBorrowAPR = Number(variableBorrowRate) / RAY;
  const variableBorrowAPR = Number(variableBorrowRate) / RAY;
  const variableBorrowAPY =
    (1 + variableBorrowAPR / SECONDS_PER_YEAR) ** SECONDS_PER_YEAR - 1;
  const stableBorrowAPY =
    (1 + stableBorrowAPR / SECONDS_PER_YEAR) ** SECONDS_PER_YEAR - 1;

  return (
    <>
      <Flex mt="10" align="center">
        <Box as={Link} href="/dashboard" mr="2">
          <ChevronLeftIcon boxSize={6} />
        </Box>
        <Image src={TOKEN_LOGO[tokenSymbol]} alt="token logo" boxSize={7} />
        <Box ml="2" fontSize="xl" fontWeight="medium">
          {tokenSymbol}
        </Box>
      </Flex>

      <Flex my="6" align="center">
        <Box>
          <Box color="whiteBlue.700" mb="3">
            Total Liquidity
          </Box>
          <Box fontSize="2xl">
            {(+formatUnits(totalLiquidity, tokenDecimals)).toLocaleString()}
            <Text as="span" ml="1" color="whiteBlue.700">
              {tokenSymbol}
            </Text>
          </Box>
        </Box>
        <VerticalDivider />
        <Box>
          <Box color="whiteBlue.700" mb="3">
            Available Liquidity
          </Box>
          <Box fontSize="2xl">
            {(+formatUnits(availableLiquidity, tokenDecimals)).toLocaleString()}
            <Text as="span" ml="1" color="whiteBlue.700">
              {tokenSymbol}
            </Text>
          </Box>
        </Box>
        <VerticalDivider />
        <Box>
          <Box color="whiteBlue.700" mb="3">
            Utilization Rate
          </Box>
          <Box fontSize="2xl">
            {(+formatUnits(utilizationRate, 27)).toLocaleString()} %
          </Box>
        </Box>
      </Flex>

      <Grid templateColumns="repeat(3, 1fr)" gap={6}>
        <GridItem colSpan={{ base: 3, lg: 2 }}>
          <Card cardTitle="Supply info" px="8">
            <Flex mt="6" align="center">
              <Box>
                <Box color="whiteBlue.700" fontSize="sm" mb="3">
                  Total Supply
                </Box>
                <Box fontSize="lg">
                  {(+formatUnits(
                    totalLiquidity,
                    tokenDecimals
                  )).toLocaleString()}
                  <Text as="span" ml="1" color="whiteBlue.700">
                    {tokenSymbol}
                  </Text>
                </Box>
              </Box>
              <VerticalDivider />
              <Box>
                <Box color="whiteBlue.700" fontSize="sm" mb="3">
                  APR
                </Box>
                <Box fontSize="lg">{(depositAPR * 100).toLocaleString()}%</Box>
              </Box>
              <VerticalDivider />
              <Box>
                <Box color="whiteBlue.700" fontSize="sm" mb="3">
                  APY
                </Box>
                <Box fontSize="lg">{(depositAPY * 100).toLocaleString()}%</Box>
              </Box>
            </Flex>
          </Card>
          <Card cardTitle="Borrow info" mt="6" px="8">
            <Flex mt="6" align="center" flexWrap="wrap">
              <Box>
                <Box color="whiteBlue.700" fontSize="sm" mb="3">
                  Total Borrowed
                </Box>
                <Box fontSize="lg">
                  {(+formatUnits(
                    totalLiquidity - availableLiquidity,
                    tokenDecimals
                  )).toLocaleString()}
                  <Text as="span" ml="1" color="whiteBlue.700">
                    {tokenSymbol}
                  </Text>
                </Box>
              </Box>
              <VerticalDivider />
              <Box>
                <Box color="whiteBlue.700" fontSize="sm" mb="3">
                  APR, variable
                </Box>
                <Box fontSize="lg">
                  {(variableBorrowAPR * 100).toLocaleString()}%
                </Box>
              </Box>
              <VerticalDivider />
              <Box>
                <Box color="whiteBlue.700" fontSize="sm" mb="3">
                  APY, variable
                </Box>
                <Box fontSize="lg">
                  {(variableBorrowAPY * 100).toLocaleString()}%
                </Box>
              </Box>
              <VerticalDivider />
              <Box>
                <Box color="whiteBlue.700" fontSize="sm" mb="3">
                  APR, stable
                </Box>
                <Box fontSize="lg">
                  {(stableBorrowAPR * 100).toLocaleString()}%
                </Box>
              </Box>
              <VerticalDivider />
              <Box>
                <Box color="whiteBlue.700" fontSize="sm" mb="3">
                  APY, stable
                </Box>
                <Box fontSize="lg">
                  {(stableBorrowAPY * 100).toLocaleString()}%
                </Box>
              </Box>
            </Flex>
          </Card>
          <Card cardTitle="Pool info" mt="6" px="8">
            <RowInfo>
              <Box color="whiteBlue.700" fontSize="sm">
                a{tokenSymbol} address
              </Box>
              <Box>{aTokenAddress}</Box>
            </RowInfo>
            <RowInfo>
              <Box color="whiteBlue.700" fontSize="sm">
                Loan to value
              </Box>
              {Number(ltv).toLocaleString()} %
            </RowInfo>
            <RowInfo>
              <Box color="whiteBlue.700" fontSize="sm">
                Liquidation threshold
              </Box>
              {Number(liquidationThreshold).toLocaleString()} %
            </RowInfo>
            <RowInfo>
              <Box color="whiteBlue.700" fontSize="sm">
                Liquidation Bonus
              </Box>
              {Number(liquidationBonus).toLocaleString()} %
            </RowInfo>
            <RowInfo>
              <Box color="whiteBlue.700" fontSize="sm">
                Usage as collateral
              </Box>
              {`${usageAsCollateralEnabled}`}
            </RowInfo>
            <RowInfo>
              <Box color="whiteBlue.700" fontSize="sm">
                Borrowing
              </Box>
              {`${borrowingEnabled}`}
            </RowInfo>
            <RowInfo>
              <Box color="whiteBlue.700" fontSize="sm">
                Stable borrow rate
              </Box>
              {`${stableBorrowRateEnabled}`}
            </RowInfo>
          </Card>
        </GridItem>
        <GridItem colSpan={{ base: 3, lg: 1 }}>
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
                    apr={depositAPR}
                    apy={depositAPY}
                  />
                </TabPanel>
                <TabPanel>
                  <WithdrawForm
                    aTokenAddress={aTokenAddress as `0x${string}`}
                  />
                </TabPanel>
                <TabPanel>
                  <BorrowForm
                    poolAddress={poolAddress as `0x${string}`}
                    availableLiquidity={+formatUnits(availableLiquidity, tokenDecimals)}
                  />
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
