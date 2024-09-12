"use client";

import { FHENIX_CHAIN_ID, FHENIX_CHAIN_ID_LOCAL } from "@/constants/contracts";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import { Box, Button, Flex } from "@chakra-ui/react";
import { transparentize } from "@chakra-ui/theme-tools";
import { useChainId, useSwitchChain } from "wagmi";

function Notice() {
  const chainId = useChainId();
  const { chains, switchChain } = useSwitchChain();
  if (chainId === FHENIX_CHAIN_ID) {
    return (
      <Flex
        borderRadius="xl"
        border="1px"
        borderColor="yellow.400"
        px="5"
        py="3"
        bgColor={transparentize("yellow.300", 0.1) as any}
        fontSize="sm"
        color="yellow.400"
        align="center"
        mt="5"
      >
        <InfoOutlineIcon color="yellow.400" boxSize="5" mr="4" />
        <Box>
          <Box>
            As the gas cost of current Fhenix Helium Testnet is quite high
            (around 0.3 TFHE for a deposit/borrow/withdraw transactions), you
            might not be able to try all actions of the Felend.
          </Box>
          <Box mt="1">
            We suggest you to use the exposed Localfhenix instead.
            <Button
              variant="outline"
              size="sm"
              borderColor="yellow.400"
              color="yellow.400"
              ml="3"
              onClick={() => switchChain({ chainId: FHENIX_CHAIN_ID_LOCAL })}
            >
              Switch chain
            </Button>
          </Box>
        </Box>
      </Flex>
    );
  }
  return null;
}

export default Notice;
