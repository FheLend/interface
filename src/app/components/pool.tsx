"use client";

import {
  Box,
  Button,
  Flex,
  Image,
  LinkBox,
  LinkOverlay,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { Tr, Td } from "@chakra-ui/table";
import poolAbi from "@/constants/abi/pool.json";
import { useAccount, useChainId, useReadContracts } from "wagmi";
import SupplyModal from "./supplyModal";
import { get } from "lodash";
import { formatUnits } from "viem";
import Link from "next/link";
import { useConfig, useTokens } from "@/store/pools";
import BorrowModal from "./borrowModal";
import WithdrawModal from "./withdrawModal";
import { usePathname } from "next/navigation";

const RAY = 10 ** 27; // 10 to the power 27
const SECONDS_PER_YEAR = 31536000;

export default function Pool({ poolAddress }: { poolAddress: `0x${string}` }) {
  const { isConnected, address } = useAccount();
  const { tokens } = useTokens();
  const { config } = useConfig();

  const pathname = usePathname();
  console.log(pathname);

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
      {
        address: config?.pool as `0x${string}`,
        abi: poolAbi,
        functionName: "getUserReserveData",
        args: [poolAddress, address],
      },
    ],
  });

  const reserveData = get(data, "[0].result", []) as any[];
  const userReserveData = get(data, "[1].result", []) as any[];

  const totalLiquidity = get(reserveData, "[0]", 0n);
  const availableLiquidity = get(reserveData, "[1]", 0n);
  const aTokenAddress = get(reserveData, "[11]", "") as `0x${string}`;
  const liquidityRate = get(reserveData, "[4]", 0n);
  const variableBorrowRate = get(reserveData, "[5]", 0n);
  const depositedBalance = get(userReserveData, "[0]", 0n);

  console.log(depositedBalance);

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
  const variableAPY =
    (1 + variableBorrowAPR / SECONDS_PER_YEAR) ** SECONDS_PER_YEAR - 1;
  // stableBorrowAPR = variableBorrowRate / RAY;

  if (!tokens[poolAddress]) {
    return null;
  }

  return (
    <LinkBox
      as={Tr}
      cursor="pointer"
      _hover={{ bg: "primary.600", transition: "0.3s" }}
    >
      <Td borderLeftRadius="lg">
        <Flex alignItems="center">
          <Image src={tokens[poolAddress].logo} boxSize="6" alt="token-logo" />
          <Box ml="2">{tokens[poolAddress].symbol}</Box>
        </Flex>
      </Td>
      <Td isNumeric>
        {(+formatUnits(
          totalLiquidity,
          tokens[poolAddress].decimals
        )).toLocaleString()}
      </Td>
      <Td isNumeric>
        {(+formatUnits(
          totalLiquidity - availableLiquidity,
          tokens[poolAddress].decimals
        )).toLocaleString()}
      </Td>
      <Td isNumeric>
        <Flex align="center">
          <Box mr="2" color="green.300">
            {(depositAPY * 100).toLocaleString()}%
          </Box>
          <Tooltip label="Connect wallet to supply" isDisabled={isConnected}>
            <Button
              onClick={openSupply}
              size="sm"
              isDisabled={!isConnected}
              pos="relative"
              zIndex="1"
              bgColor="primary.900"
              color="whiteBlue.500"
              _hover={{ bg: "primary.800" }}
            >
              Supply
            </Button>
          </Tooltip>
        </Flex>
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
      </Td>
      <Td isNumeric>
        <Flex align="center">
          <Box mr="2" color="yellow.300">
            {(variableAPY * 100).toLocaleString()}%
          </Box>
          <Tooltip label="Connect wallet to withdraw" isDisabled={isConnected}>
            <Button
              onClick={openBorrow}
              size="sm"
              isDisabled={!isConnected}
              pos="relative"
              zIndex="1"
              bgColor="primary.900"
              color="whiteBlue.500"
              _hover={{ bg: "primary.800" }}
            >
              Borrow
            </Button>
          </Tooltip>
        </Flex>
        {isOpenBorrow && (
          <BorrowModal
            poolAddress={poolAddress}
            onClose={() => {
              handleCloseModal(closeBorrow);
            }}
            availableLiquidity={+formatUnits(availableLiquidity, 18)}
          />
        )}
        <LinkOverlay as={Link} href={`/pools/${poolAddress}`} />
      </Td>
      {isConnected && pathname === "/portfolio" && (
        <Td isNumeric>
          <Flex align="center">
            <Box mr="2">
              {(+formatUnits(
                depositedBalance,
                tokens[poolAddress].decimals
              )).toLocaleString()}{" "}
              {tokens[poolAddress].symbol}
            </Box>
            <Button
              onClick={openWithdraw}
              size="sm"
              bgColor="primary.900"
              color="whiteBlue.500"
              _hover={{ bg: "primary.800" }}
            >
              Withdraw
            </Button>
          </Flex>
          {isOpenWithdraw && (
            <WithdrawModal
              aTokenAddress={aTokenAddress as `0x${string}`}
              onClose={closeWithdraw}
            />
          )}
        </Td>
      )}
    </LinkBox>
  );
}
