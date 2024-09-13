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
import tokenAbi from "@/constants/abi/token.json";
import { useAccount, useBalance, useChainId, useReadContracts } from "wagmi";
import { POOL, TOKEN_LOGO } from "@/constants/contracts";
import SupplyModal from "./supplyModal";
import { get } from "lodash";
import WithdrawModal from "./withdrawModal";
import BorrowModal from "./borrowModal";
import { formatUnits } from "viem";
import RepayModal from "./repay";
import { useMemo } from "react";
import Link from "next/link";

const RAY = 10 ** 27; // 10 to the power 27
const SECONDS_PER_YEAR = 31536000;

export default function Pool({ poolAddress }: { poolAddress: `0x${string}` }) {
  const chainId = useChainId();
  const { isConnected } = useAccount();

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
      {
        address: poolAddress,
        abi: tokenAbi,
        functionName: "symbol",
      },
      {
        address: poolAddress,
        abi: tokenAbi,
        functionName: "decimals",
      },
    ],
  });

  const reserveData = get(data, "[0].result", []) as any[];
  const tokenSymbol = get(data, "[1].result", "") as string;
  const tokenDecimals = get(data, "[2].result", 18) as number;
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

  return (
    <LinkBox
      as={Tr}
      cursor="pointer"
      _hover={{ bg: "primary.900", transition: "0.3s" }}
    >
      <Td borderLeftRadius="lg">
        <LinkOverlay as={Link} href={`/pools/${poolAddress}`}>
          <Flex alignItems="center">
            <Image src={TOKEN_LOGO[tokenSymbol]} boxSize="6" alt="token-logo" />
            <Box ml="2">{tokenSymbol}</Box>
          </Flex>
        </LinkOverlay>
      </Td>
      <Td isNumeric>
        {(+formatUnits(totalLiquidity, tokenDecimals)).toLocaleString()}
      </Td>
      <Td isNumeric>
        {(+formatUnits(
          totalLiquidity - availableLiquidity,
          tokenDecimals
        )).toLocaleString()}
      </Td>
      <Td isNumeric>{(depositAPR * 100).toLocaleString()}%</Td>
      <Td isNumeric>{(variableBorrowAPR * 100).toLocaleString()}%</Td>
      <Td w="200px" borderRightRadius="lg">
        <Tooltip label="Connect wallet to supply" isDisabled={isConnected}>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              openSupply();
            }}
            size="sm"
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

        <Tooltip label="Connect wallet to widthdraw" isDisabled={isConnected}>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              openWithdraw();
            }}
            variant="outline"
            ml="3"
            size="sm"
            isDisabled={!isConnected}
          >
            Withdraw
          </Button>
        </Tooltip>
        {isOpenWithdraw && (
          <WithdrawModal
            aTokenAddress={aTokenAddress}
            onClose={() => {
              handleCloseModal(closeWithdraw);
            }}
          />
        )}

        <Tooltip label="Connect wallet to borrow" isDisabled={isConnected}>
          <Button
            ml="3"
            size="sm"
            isDisabled={!isConnected}
            onClick={(e) => {
              e.stopPropagation();
              openBorrow();
            }}
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
          />
        )}

        <Tooltip label="Connect wallet to repay" isDisabled={isConnected}>
          <Button
            ml="3"
            variant="outline"
            size="sm"
            isDisabled={!isConnected}
            onClick={(e) => {
              e.stopPropagation();
              openRepay();
            }}
          >
            Repay
          </Button>
        </Tooltip>
        {isOpenRepay && (
          <RepayModal
            poolAddress={poolAddress}
            onClose={() => {
              handleCloseModal(closeRepay);
            }}
          />
        )}
      </Td>
    </LinkBox>
  );
}
