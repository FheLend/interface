"use client";

import {
  Box,
  Button,
  Flex,
  Image,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { Tr, Td } from "@chakra-ui/table";
import poolAbi from "@/constants/abi/pool.json";
import tokenAbi from "@/constants/abi/token.json";
import { useAccount, useChainId, useReadContracts } from "wagmi";
import { POOL, TOKEN_LOGO } from "@/constants/contracts";
import SupplyModal from "./supplyModal";
import { get } from "lodash";
import WithdrawModal from "./withdrawModal";
import BorrowModal from "./borrowModal";
import { formatUnits } from "viem";
import RepayModal from "./repay";

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

  const result = useReadContracts({
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

  const reserveData = get(result, "data[0].result", []) as any[];
  const tokenSymbol = get(result, "data[1].result", "") as string;
  const tokenDecimals = get(result, "data[2].result", "") as number;

  return (
    <Tr>
      <Td>
        <Flex alignItems="center">
          <Image src={TOKEN_LOGO[tokenSymbol]} boxSize="6" alt="token-logo" />
          <Box ml="2">{tokenSymbol}</Box>
        </Flex>
      </Td>
      <Td isNumeric>
        {(+formatUnits(
          get(reserveData, "[0]", 0n),
          tokenDecimals
        )).toLocaleString()}
      </Td>
      <Td isNumeric>--</Td>
      <Td w="200px">
        <Tooltip label="Connect wallet to supply" isDisabled={isConnected}>
          <Button onClick={openSupply} size="sm" isDisabled={!isConnected}>
            Supply
          </Button>
        </Tooltip>
        {isOpenSupply && (
          <SupplyModal poolAddress={poolAddress} onClose={closeSupply} />
        )}

        <Tooltip label="Connect wallet to widthdraw" isDisabled={isConnected}>
          <Button
            onClick={openWithdraw}
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
            aTokenAddress={get(reserveData, "[11]", "") as `0x${string}`}
            onClose={closeWithdraw}
          />
        )}

        <Tooltip label="Connect wallet to borrow" isDisabled={isConnected}>
          <Button
            ml="3"
            size="sm"
            isDisabled={!isConnected}
            onClick={openBorrow}
          >
            Borrow
          </Button>
        </Tooltip>
        {isOpenBorrow && (
          <BorrowModal poolAddress={poolAddress} onClose={closeBorrow} />
        )}

        <Tooltip label="Connect wallet to repay" isDisabled={isConnected}>
          <Button
            ml="3"
            variant="outline"
            size="sm"
            isDisabled={!isConnected}
            onClick={openRepay}
          >
            Repay
          </Button>
        </Tooltip>
        {isOpenRepay && (
          <RepayModal poolAddress={poolAddress} onClose={closeRepay} />
        )}
      </Td>
    </Tr>
  );
}
