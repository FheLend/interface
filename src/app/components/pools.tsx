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
import { Show } from "@chakra-ui/react";
import PoolCard from "./pool.card";
import { usePathname } from "next/navigation";

export default function Pools({
  poolAddresses,
}: {
  poolAddresses: `0x${string}`[];
}) {
  const pathname = usePathname();
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
                {pathname === "/portfolio" && <Th>Your Supplied</Th>}
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
