"use client";

import { Box, Button, Center, Flex, Spacer } from "@chakra-ui/react";
import { Tr, Td } from "@chakra-ui/table";
import Image from "next/image";
import logo from "@/images/token-demo.png";
import poolAbi from "@/constants/abi/pool.json";
import {
  useClient,
  useConfig,
  useReadContract,
  useWriteContract,
  useAccount,
  Connector,
} from "wagmi";
import { FhenixClient } from "fhenixjs";
import { getClient } from "wagmi/actions";
import { config } from "@/config/web3modal";
import { useEffect, useRef } from "react";
import {
  BrowserProvider,
  Eip1193Provider,
  ethers,
  JsonRpcProvider,
} from "ethers";
import { EncryptionTypes } from "fhenixjs";
import { POOL } from "@/constants/contracts";
import DepositForm from "./form";

export default function Pool({ poolAddress }: { poolAddress: string }) {
  const { data: reserveData } = useReadContract({
    abi: poolAbi,
    address: POOL,
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
      <Td isNumeric>--</Td>
      <Td isNumeric>--</Td>
      <Td w="200px">
        <DepositForm poolAddress={poolAddress} />
        <Button variant="outline" ml="3" isDisabled>
          Withdraw
        </Button>
      </Td>
    </Tr>
  );
}
