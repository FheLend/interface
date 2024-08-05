"use client";

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

export default function Pools({ poolAddresses }: { poolAddresses: string[] }) {
  return (
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
            <Th isNumeric>TVL</Th>
            <Th isNumeric>APY</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {poolAddresses.map((address) => (
            <Pool poolAddress={address} key={address} />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
