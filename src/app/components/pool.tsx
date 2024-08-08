"use client";

import { Box, Button, Flex, useDisclosure } from "@chakra-ui/react";
import { Tr, Td } from "@chakra-ui/table";
import Image from "next/image";
import logo from "@/images/token-demo.png";
import poolAbi from "@/constants/abi/pool.json";
import { useReadContract } from "wagmi";
import { POOL } from "@/constants/contracts";
import SupplyModal from "./supplyModal";

export default function Pool({ poolAddress }: { poolAddress: `0x${string}` }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data: reserveData } = useReadContract({
    abi: poolAbi,
    address: POOL,
    functionName: "getReserveData",
    args: [poolAddress],
  });

  return (
    <Tr>
      <Td>
        <Flex alignItems="center">
          <Image src={logo} alt="token" />
          <Box ml="2">USDT</Box>
        </Flex>
      </Td>
      <Td isNumeric>--</Td>
      <Td isNumeric>--</Td>
      <Td w="200px">
        <Button onClick={onOpen}>Supply</Button>
        {isOpen && <SupplyModal poolAddress={poolAddress} onClose={onClose} />}

        <Button variant="outline" ml="3" isDisabled>
          Withdraw
        </Button>
      </Td>
    </Tr>
  );
}
