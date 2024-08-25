"use client";

import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Link,
  Select,
} from "@chakra-ui/react";
import tokenAbi from "@/constants/abi/token.json";
import { useAccount, useChainId, useChains, useWriteContract } from "wagmi";
import ConnectButton from "@/common/connect-button";
import { TOKENS } from "@/constants/contracts";
import { useMemo, useState } from "react";
import { ellipsis } from "@/utils/helper";
import { get } from "lodash";
import { useBalance } from "wagmi";
import Image from "next/image";
import loading from "@/images/icons/loading.svg";

export default function Faucet() {
  const chainId = useChainId();
  const chains = useChains();
  const { address, isConnected } = useAccount();
  const { writeContract, status, data, error } = useWriteContract();
  const chainInfo = useMemo(
    () => chains.find((chain) => chain.id === chainId),
    [chains, chainId]
  );
  const [token, setToken] = useState<`0x${string}`>();
  const [isGetETH, setIsGetETH] = useState(false);
  const [errorGetETH, setErrorGetETH] = useState<string>();

  const {
    data: balance,
    isLoading,
    refetch,
  } = useBalance({
    address,
    token,
  });

  function mint() {
    if (token) {
      writeContract({
        abi: tokenAbi,
        address: token,
        functionName: "mint",
        args: [],
      });
    } else {
      setErrorGetETH("");
      setIsGetETH(true);
      fetch(`https://api.felend.xyz/getFunds?address=${address}`)
        .then((data) => data.json())
        .then((data) => {
          if (data.error) {
            setErrorGetETH(data.error);
          }
        })
        .catch((e) => {
          console.log(e);
          setErrorGetETH(e.message);
        })
        .finally(() => {
          setIsGetETH(false);
          refetch();
        });
    }
  }

  return (
    <>
      <Box fontSize="2xl">Faucet</Box>

      <FormControl mt="5" w="500px" maxW="100%">
        <Flex justifyContent="space-between">
          <FormLabel opacity="0.7">Your wallet address</FormLabel>
          <Center>
            {isLoading ? (
              <Box as={Image} mr="2" src={loading} alt="loading-icon" />
            ) : (
              <Box mr="2">
                {Number(balance?.formatted ?? 0).toLocaleString()}
              </Box>
            )}
            <Select
              variant="unstyled"
              onChange={(e) => setToken(e.target.value as `0x${string}`)}
            >
              <option value={undefined} style={{ color: "#111518" }}>
                tFHE
              </option>
              {TOKENS[chainId].map((token) => (
                <option
                  value={token.address}
                  key={token.address}
                  style={{ color: "#111518" }}
                >
                  {token.symbol}
                </option>
              ))}
            </Select>
          </Center>
        </Flex>
        <Input value={address ?? ""} readOnly />
        <FormHelperText mb="4" color="whiteAlpha.700">
          Each wallet allows minting 100 tokens per time
        </FormHelperText>
      </FormControl>

      {isConnected ? (
        <Button
          onClick={mint}
          isLoading={status === "pending" || isGetETH}
          type="submit"
          loadingText="Confirming..."
        >
          Mint
        </Button>
      ) : (
        <ConnectButton />
      )}
      <Box mt="2" fontSize="sm" color="red.300">
        {token ? get(error, "shortMessage") : errorGetETH}
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