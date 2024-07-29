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

export default function Home() {
  return (
    <Box mt="10">
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
