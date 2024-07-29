"use client";

import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useEffect } from "react";
import lendingpoolAbi from "@/constants/abi/lendingpool.json";
import tokenAbi from "@/constants/abi/token.json";
import { useReadContract, useAccount, useWriteContract } from "wagmi";
import ConnectButton from "@/components/connect-button";
import { Field, Form, Formik } from "formik";
import { isAddress } from "viem";

export default function Dummy() {
  const { data } = useReadContract({
    abi: lendingpoolAbi,
    address: "0x8416421b7d73Dc5D283deDA365D2797381c31E2e",
    functionName: "getTokenDistributor",
  });
  const { address, isConnected, ...rest } = useAccount();
  console.log(data, address, rest);
  const { writeContract } = useWriteContract();

  function mint(address: string) {
    const data = writeContract({
      abi: tokenAbi,
      address: "0x45d6e627CB563da9f14BaB25B3F64FaFbA9943Ca",
      functionName: "mint",
      args: [],
    });
    console.log(data);
  }

  function validateAddress(value: string) {
    let error;
    if (!value) {
      error = "Address is required";
    } else if (!isAddress(value)) {
      error = "Invalid wallet address";
    }
    return error;
  }

  return (
    <Box w="500px" maxW="100%" mt="10">
      <Box fontSize="2xl">Faucet</Box>

      <Formik
        initialValues={{ address: "" }}
        onSubmit={(values, actions) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            actions.setSubmitting(false);
          }, 1000);
        }}
      >
        {(props) => (
          <Form>
            <Field name="address" validate={validateAddress}>
              {({ field, form }: any) => (
                <FormControl
                  mt="5"
                  isInvalid={form.errors.address && form.touched.address}
                >
                  <FormLabel opacity="0.7">
                    Enter your wallet address to mint USDT (testing token)
                  </FormLabel>
                  <Input type="text" placeholder="0xabc..." {...field} />
                  <FormErrorMessage>{form.errors.address}</FormErrorMessage>
                  <FormHelperText mb="4">
                    Each wallet allows minting 100 tokens
                  </FormHelperText>
                </FormControl>
              )}
            </Field>

            {isConnected ? (
              <Button
                // onClick={mint}
                isLoading={props.isSubmitting}
                type="submit"
              >
                Mint
              </Button>
            ) : (
              <ConnectButton />
            )}
          </Form>
        )}
      </Formik>
    </Box>
  );
}
