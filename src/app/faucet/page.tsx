"use client";

import {
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Link,
} from "@chakra-ui/react";
import tokenAbi from "@/constants/abi/token.json";
import { useAccount, useChainId, useChains, useWriteContract } from "wagmi";
import ConnectButton from "@/common/connect-button";
import { TOKEN_TEST } from "@/constants/contracts";
import { useMemo } from "react";
import { ellipsis } from "@/utils/helper";
import { useWatchPendingTransactions } from "wagmi";
import { get } from "lodash";
import { useBalance } from "wagmi";
import { TextAutoEllipsis } from "@/common/common";

export default function Faucet() {
  const chainId = useChainId();
  const chains = useChains();
  const { address, isConnected } = useAccount();
  const { writeContract, status, data, error } = useWriteContract();
  const chainInfo = useMemo(
    () => chains.find((chain) => chain.id === chainId),
    [chains, chainId]
  );

  const { data: balance } = useBalance({ address, token: TOKEN_TEST[chainId] });

  function mint() {
    writeContract({
      abi: tokenAbi,
      address: TOKEN_TEST[chainId],
      functionName: "mint",
      args: [],
    });
  }

  return (
    <>
      <Box fontSize="2xl">Faucet</Box>

      <FormControl mt="5" w="500px" maxW="100%">
        <Flex justifyContent="space-between">
          <FormLabel opacity="0.7">Your wallet address</FormLabel>
          <Flex>
            <TextAutoEllipsis mr="1">{balance?.formatted}</TextAutoEllipsis>
            {balance?.symbol}
          </Flex>
        </Flex>
        <Input value={address ?? ""} readOnly />
        <FormHelperText mb="4" color="whiteAlpha.700">
          Each wallet allows minting 100 tokens per time
        </FormHelperText>
      </FormControl>

      {isConnected ? (
        <Button
          onClick={mint}
          isLoading={status === "pending"}
          type="submit"
          loadingText="Confirming..."
        >
          Mint
        </Button>
      ) : (
        <ConnectButton />
      )}
      <Box mt="2" fontSize="sm" color="red.300">
        {get(error, "shortMessage")}
      </Box>
      {data && (
        <Box mt="4">
          TxHash:{" "}
          <Link
            href={`${chainInfo?.blockExplorers?.default.url}/tx/${data}`}
            isExternal
            color="primary.100"
            textDecor="underline"
          >
            {ellipsis(data, 10, 8)}
          </Link>
        </Box>
      )}
    </>
  );
}
