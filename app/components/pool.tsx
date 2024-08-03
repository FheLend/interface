"use client";

import { Box, Button, Center, Flex, Spacer } from "@chakra-ui/react";
import { Tr, Td } from "@chakra-ui/table";
import Image from "next/image";
import logo from "@/images/token-demo.png";
import poolAbi from "@/constants/abi/pool.json";
import { useClient, useConfig, useReadContract, useWriteContract } from "wagmi";
import { FhenixClient } from "fhenixjs";
import { getClient } from "wagmi/actions";
import { config } from "@/config/web3modal";

// fhenixClient.current = new FhenixClient({ provider: fhenixProvider.current });

export default function Pool({ poolAddress }: { poolAddress: string }) {
  const { data: reserveData } = useReadContract({
    abi: poolAbi,
    address: "0xDE603943466310b6c6CcC54dfeD5264F1cfd5A28",
    functionName: "getReserveData",
    args: [poolAddress],
  });
  const { writeContract, ...rest } = useWriteContract();
  //   const client = useClient();
  //   const config = useConfig();

  const x = getClient(config);
  console.log(x);
  return (
    <Tr>
      <Td>
        <Flex alignItems="center">
          <Image src={logo} alt="token" />
          <Box ml="2">USDT</Box>
        </Flex>
      </Td>
      <Td isNumeric>6,754</Td>
      <Td isNumeric>25.4</Td>
      <Td isNumeric>50%</Td>
      <Td w="200px">
        <Button variant="outline">Withdraw</Button>
        <Button
          ml="3"
          onClick={() => {
            const x = writeContract({
              abi: poolAbi,
              address: "0xDE603943466310b6c6CcC54dfeD5264F1cfd5A28",
              functionName: "deposit",
              args: [poolAddress, 1e10, 1],
            });
            console.log(x);
          }}
        >
          Supply
        </Button>
      </Td>
    </Tr>
  );
}
