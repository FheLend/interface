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
import { POOL } from "@/constants/contracts";
import SupplyModal from "./supplyModal";
import { get } from "lodash";
import { formatUnits } from "viem";
import Link from "next/link";
import { useTokens } from "@/store/pools";

const RAY = 10 ** 27; // 10 to the power 27
const SECONDS_PER_YEAR = 31536000;

export default function Pool({ poolAddress }: { poolAddress: `0x${string}` }) {
  const chainId = useChainId();
  const { isConnected } = useAccount();
  const { tokens } = useTokens();

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
        address: POOL[chainId],
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
  // stableBorrowAPR = variableBorrowRate / RAY;

  if (!tokens[poolAddress]) {
    return null;
  }

  return (
    <LinkBox
      as={Tr}
      cursor="pointer"
      _hover={{ bg: "primary.900", transition: "0.3s" }}
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
      <Td isNumeric>{(depositAPR * 100).toLocaleString()}%</Td>
      <Td isNumeric>{(variableBorrowAPR * 100).toLocaleString()}%</Td>
      <Td w="200px" borderRightRadius="lg">
        <Tooltip label="Connect wallet to supply" isDisabled={isConnected}>
          <Button
            onClick={openSupply}
            size="sm"
            isDisabled={!isConnected}
            pos="relative"
            zIndex="1"
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
        <LinkOverlay as={Link} href={`/pools/${poolAddress}`}>
          <Button variant="outline" ml="3" size="sm">
            Detail
          </Button>
        </LinkOverlay>
      </Td>
    </LinkBox>
  );
}
