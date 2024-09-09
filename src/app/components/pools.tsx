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

export default function Pools({
  poolAddresses,
}: {
  poolAddresses: `0x${string}`[];
}) {
  console.log(poolAddresses);
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
            <Th>TVL</Th>
            <Th>Supply APR</Th>
            <Th>Borrow APR, variable</Th>
            <Th>Your Supplied</Th>
            <Th>Your Borrowed</Th>
            <Th>Action</Th>
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
