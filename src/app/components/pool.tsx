"use client";

import { Box, Button, Flex, Tooltip, useDisclosure } from "@chakra-ui/react";
import { Tr, Td } from "@chakra-ui/table";
import Image from "next/image";
import logo from "@/images/token-demo.png";
import poolAbi from "@/constants/abi/pool.json";
import tokenAbi from "@/constants/abi/token.json";
import { useAccount, useChainId, useReadContracts } from "wagmi";
import { POOL } from "@/constants/contracts";
import SupplyModal from "./supplyModal";
import { get } from "lodash";
import WithdrawModal from "./withdrawModal";
import BorrowModal from "./borrowModal";

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
    ],
  });

  const reserveData = get(result, "data[0].result", []) as any[];
  const tokenSymbol = get(result, "data[1].result", "") as string;

  return (
    <Tr>
      <Td>
        <Flex alignItems="center">
          <Image src={logo} alt="token" />
          <Box ml="2">{tokenSymbol}</Box>
        </Flex>
      </Td>
      <Td isNumeric>{get(reserveData, "[0]", 0).toLocaleString()}</Td>
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
      </Td>
    </Tr>
  );
}
