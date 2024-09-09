"use client";

import NotFound from "@/app/not-found";
import { Card } from "@/common/common";
import { TOKEN_LOGO, TOKENS } from "@/constants/contracts";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import { Box, Divider, Flex, Grid, GridItem, Image } from "@chakra-ui/react";
import Link from "next/link";
import { useChainId } from "wagmi";

function PoolDetail({ params }: { params: { address: string } }) {
  const chainId = useChainId();
  const poolAddress = params.address;
  const token = TOKENS[chainId].find((t) => t.address === poolAddress);

  if (!token) {
    return <NotFound />;
  }

  return (
    <>
      <Flex mt="10" align="center">
        <Box as={Link} href="/dashboard" mr="2">
          <ChevronLeftIcon boxSize={6} />
        </Box>
        <Image src={TOKEN_LOGO[token.symbol]} alt="token logo" boxSize={7} />
        <Box ml="2" fontSize="xl" fontWeight="medium">
          {token.symbol}
        </Box>
      </Flex>

      <Flex my="10" align="center">
        <Box>
          <Box color="whiteAlpha.700" mb="3">
            Supply
          </Box>
          <Box fontSize="2xl">$116.61M</Box>
        </Box>
        <Divider orientation="vertical" h="70px" mx="10" opacity="0.2" />
        <Box>
          <Box color="whiteAlpha.700" mb="3">
            Supply
          </Box>
          <Box fontSize="2xl">$116.61M</Box>
        </Box>
        <Divider orientation="vertical" h="70px" mx="10" opacity="0.2" />
        <Box>
          <Box color="whiteAlpha.700" mb="3">
            Supply
          </Box>
          <Box fontSize="2xl">$116.61M</Box>
        </Box>
        <Divider orientation="vertical" h="70px" mx="10" opacity="0.2" />
        <Box>
          <Box color="whiteAlpha.700" mb="3">
            Supply
          </Box>
          <Box fontSize="2xl">$116.61M</Box>
        </Box>
      </Flex>

      <Grid templateColumns="repeat(3, 1fr)" gap={6}>
        <GridItem colSpan={2}>
          <Card title="Supply info">sfs</Card>
        </GridItem>
        <GridItem>
          <Card>sfs</Card>
        </GridItem>
      </Grid>
    </>
  );
}

export default PoolDetail;
