import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/table";
import Pool from "./pool";
import { Box, Button, GridItem, Show, SimpleGrid } from "@chakra-ui/react";
import PoolCard from "./pool.card";

export default function Pools({
  poolAddresses,
}: {
  poolAddresses: `0x${string}`[];
}) {
  console.log(poolAddresses);
  return (
    <>
      <Show above="md">
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
                <Th>Total Supplied</Th>
                <Th>Total Borrowed</Th>
                <Th>Supply APY</Th>
                <Th>Borrow APY</Th>
              </Tr>
            </Thead>
            <Tbody>
              {poolAddresses.map((address) => (
                <Pool poolAddress={address} key={address} />
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Show>

      <Show below="md">
        {poolAddresses.map((address) => (
          <PoolCard poolAddress={address} key={address} />
        ))}
      </Show>
    </>
  );
}
