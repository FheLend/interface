"use client";

import { Box, Button, Flex, useDisclosure } from "@chakra-ui/react";
import { Tr, Td } from "@chakra-ui/table";
import Image from "next/image";
import logo from "@/images/token-demo.png";
import poolAbi from "@/constants/abi/pool.json";
import { useAccount, useChainId, useReadContract } from "wagmi";
import { POOL } from "@/constants/contracts";
import SupplyModal from "./supplyModal";
import { get } from "lodash";
import WithdrawModal from "./withdrawModal";

export default function Pool({ poolAddress }: { poolAddress: `0x${string}` }) {
  const chainId = useChainId();
  const { address } = useAccount();

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

  const { data: reserveData } = useReadContract({
    abi: poolAbi,
    address: POOL[chainId],
    functionName: "getReserveData",
    args: [poolAddress],
  });
  console.log(reserveData);

  return (
    <Tr>
      <Td>
        <Flex alignItems="center">
          <Image src={logo} alt="token" />
          <Box ml="2">USDT</Box>
        </Flex>
      </Td>
      <Td isNumeric>{get(reserveData, "[0]", 0).toLocaleString()}</Td>
      <Td isNumeric>--</Td>
      <Td w="200px">
        <Button onClick={openSupply}>Supply</Button>
        {isOpenSupply && (
          <SupplyModal poolAddress={poolAddress} onClose={closeSupply} />
        )}
        {address && (
          <Button onClick={openWithdraw} variant="outline" ml="3">
            Withdraw
          </Button>
        )}
        {isOpenWithdraw && (
          <WithdrawModal
            poolAddress={poolAddress}
            aTokenAddress={get(reserveData, "[11]", "") as `0x${string}`}
            onClose={closeWithdraw}
          />
        )}
      </Td>
    </Tr>
  );
}
