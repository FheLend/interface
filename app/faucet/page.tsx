"use client";

import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import tokenAbi from "@/constants/abi/token.json";
import { useAccount, useWriteContract } from "wagmi";
import ConnectButton from "@/components/connect-button";

export default function Faucet() {
  const { address, isConnected } = useAccount();
  const { writeContract, status, data } = useWriteContract();

  function mint() {
    writeContract({
      abi: tokenAbi,
      address: "0x45d6e627CB563da9f14BaB25B3F64FaFbA9943Ca",
      functionName: "mint",
      args: [],
    });
  }

  return (
    <Box w="500px" maxW="100%" mt="10">
      <Box fontSize="2xl">Faucet</Box>

      <FormControl mt="5">
        <FormLabel opacity="0.7">
          Your wallet address to mint USDT (testing token)
        </FormLabel>
        <Input value={address} disabled />
        <FormHelperText mb="4">
          Each wallet allows minting 100 tokens per time
        </FormHelperText>
      </FormControl>

      {isConnected ? (
        <Button
          onClick={mint}
          isLoading={status === "pending"}
          type="submit"
          loadingText="waitting"
        >
          Mint
        </Button>
      ) : (
        <ConnectButton />
      )}
      {data && <Box mt="4">TxHash: {data}</Box>}
    </Box>
  );
}
