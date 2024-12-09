"use client";

import {
  Box,
  Button,
  Flex,
  GridItem,
  Image,
  SimpleGrid,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import poolAbi from "@/constants/abi/pool.json";
import { useAccount, useChainId, useReadContracts } from "wagmi";
import SupplyModal from "./supplyModal";
import { get } from "lodash";
import { formatUnits } from "viem";
import { useConfig, useTokens } from "@/store/pools";
import WithdrawModal from "./withdrawModal";
import BorrowModal from "./borrowModal";
import Link from "next/link";

const RAY = 10 ** 27; // 10 to the power 27
const SECONDS_PER_YEAR = 31536000;

export default function PoolCard({
  poolAddress,
}: {
  poolAddress: `0x${string}`;
}) {
  const chainId = useChainId();
  const { isConnected } = useAccount();
  const { tokens } = useTokens();
  const { config } = useConfig();

  const {
    isOpen: isOpenSupply,
    onOpen: openSupply,
    onClose: closeSupply,
  } = useDisclosure();
  const {
    isOpen: isOpenWithdraw,
    onOpen: openWithdraw,
    onClose: closeWithdraw,
  } = useDisclosure();
  const {
    isOpen: isOpenBorrow,
    onOpen: openBorrow,
    onClose: closeBorrow,
  } = useDisclosure();
  const {
    isOpen: isOpenRepay,
    onOpen: openRepay,
    onClose: closeRepay,
  } = useDisclosure();

  const { data, refetch, isLoading } = useReadContracts({
    contracts: [
      {
        address: config?.pool as `0x${string}`,
        abi: poolAbi,
        functionName: "getReserveData",
        args: [poolAddress],
      },
    ],
  });

  const reserveData = get(data, "[0].result", []) as any[];
  const totalLiquidity = get(reserveData, "[0]", 0n);
  const availableLiquidity = get(reserveData, "[1]", 0n);
  const aTokenAddress = get(reserveData, "[11]", "") as `0x${string}`;
  const liquidityRate = get(reserveData, "[4]", 0n);
  const variableBorrowRate = get(reserveData, "[5]", 0n);

  function handleCloseModal(onClose: () => void) {
    refetch();
    onClose();
  }

  // Deposit and Borrow calculations
  // APY and APR are returned here as decimals, multiply by 100 to get the percents

  const depositAPR = Number(liquidityRate) / RAY;
  const depositAPY =
    (1 + depositAPR / SECONDS_PER_YEAR) ** SECONDS_PER_YEAR - 1;
  const variableBorrowAPR = Number(variableBorrowRate) / RAY;
  const variableBorrowAPY =
    (1 + variableBorrowAPR / SECONDS_PER_YEAR) ** SECONDS_PER_YEAR - 1;
  // stableBorrowAPR = variableBorrowRate / RAY;

  if (!tokens[poolAddress]) {
    return null;
  }

  return (
    <SimpleGrid
      columns={2}
      color="whiteBlue.600"
      gap={4}
      pb="10"
      mb="10"
      borderBottom="1px solid"
      borderColor="whiteBlue.900"
    >
      <GridItem colSpan={2}>
        <Flex alignItems="center" as={Link} href={`/pools/${poolAddress}`}>
          <Image src={tokens[poolAddress].logo} boxSize="6" alt="token-logo" />
          <Box ml="2" textDecor="underline">
            {tokens[poolAddress].symbol}
          </Box>
        </Flex>
      </GridItem>
      <GridItem>
        <Box fontSize="sm">Total Supplied</Box>
        <Box fontSize="lg" color="white" mt="1">
          {(+formatUnits(
            totalLiquidity,
            tokens[poolAddress].decimals
          )).toLocaleString()}
        </Box>
      </GridItem>
      <GridItem>
        <Box fontSize="sm">Total Borrowed</Box>
        <Box fontSize="lg" color="white" mt="1">
          {(+formatUnits(
            totalLiquidity - availableLiquidity,
            tokens[poolAddress].decimals
          )).toLocaleString()}
        </Box>
      </GridItem>
      <GridItem>
        <Box fontSize="sm">Supply APY</Box>
        <Box fontSize="lg" color="green.300" mt="1">
          {(depositAPY * 100).toLocaleString()}%
        </Box>
      </GridItem>
      <GridItem>
        <Box fontSize="sm">Borrow APY</Box>
        <Box fontSize="lg" color="yellow.300" mt="1">
          {(variableBorrowAPY * 100).toLocaleString()}%
        </Box>
      </GridItem>
      <GridItem>
        <Tooltip label="Connect wallet to supply" isDisabled={isConnected}>
          <Button
            variant="outline"
            w="100%"
            onClick={openSupply}
            isDisabled={!isConnected}
          >
            Supply
          </Button>
        </Tooltip>
        {isOpenSupply && (
          <SupplyModal
            poolAddress={poolAddress}
            apr={depositAPR}
            apy={depositAPY}
            onClose={() => {
              handleCloseModal(closeSupply);
            }}
          />
        )}
      </GridItem>
      <GridItem>
        <Tooltip label="Connect wallet to withdraw" isDisabled={isConnected}>
          <Button
            variant="outline"
            w="100%"
            onClick={openBorrow}
            isDisabled={!isConnected}
          >
            Borrow
          </Button>
        </Tooltip>
        {isOpenBorrow && (
          <BorrowModal
            poolAddress={poolAddress}
            onClose={() => {
              handleCloseModal(closeBorrow);
            }}
            availableLiquidity={+formatUnits(availableLiquidity, 18)}
          />
        )}
      </GridItem>
    </SimpleGrid>
  );
}
