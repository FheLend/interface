"use client";

import { Box, Button, Center, Flex, Spacer } from "@chakra-ui/react";
import { Card, Tag } from "./components/common";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/table";
import Image from "next/image";
import logo from "@/images/token-demo.png";
import { useEffect } from "react";
import { publicClient, walletClient } from "./config/viem";
import lendingpoolAbi from "./constants/abi/lendingpool.json";
import tokenAbi from "./constants/abi/token.json";
import { useReadContract, useAccount, useWriteContract } from "wagmi";

export default function Home() {
  const { data } = useReadContract({
    abi: lendingpoolAbi,
    address: "0x8416421b7d73Dc5D283deDA365D2797381c31E2e",
    functionName: "getTokenDistributor",
  });
  const { address, ...rest } = useAccount();
  console.log(data, address, rest);
  const { writeContract } = useWriteContract();

  function mint() {
    const data = writeContract({
      abi: tokenAbi,
      address: "0x45d6e627CB563da9f14BaB25B3F64FaFbA9943Ca",
      functionName: "mint",
      args: [],
    });
    console.log(data);
  }

  // async function mint2() {
  //   try {
  //     const { request } = await publicClient.simulateContract({
  //       account: address,
  //       address: "0x45d6e627CB563da9f14BaB25B3F64FaFbA9943Ca",
  //       abi: tokenAbi,
  //       functionName: "mint",
  //     });
  //     console.log(request);
  //     const x = await walletClient.writeContract(request);
  //     console.log(x);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  return (
    <Box mt="10">
      <Button onClick={mint}>Mint</Button>
      <Flex>
        <Box fontSize="2xl">Dashboard</Box>
        <Spacer />

        <Tag title="Net worth" sub="$22,222" />
        <Tag title="Net APY" sub="17.6%" ml="3" />
      </Flex>

      <Card
        title="Your Supplies"
        mt="7"
        sub={
          <Center fontSize="sm" color="whiteAlpha.600">
            Collateral:
            <Box fontSize="lg" color="whiteAlpha.900" ml="2">
              $6,765
            </Box>
          </Center>
        }
      >
        <TableContainer>
          <Table variant="unstyled">
            <Thead>
              <Tr
                color="whiteAlpha.600"
                _first={{
                  th: { textTransform: "capitalize", fontWeight: "normal" },
                }}
              >
                <Th>Assets</Th>
                <Th isNumeric>Balance</Th>
                <Th isNumeric>APY</Th>
                <Th isNumeric>Max TLV</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {Array.from({ length: 5 }).map((_, index) => (
                <Tr key={index}>
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
                    <Button ml="3">Supply</Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}
