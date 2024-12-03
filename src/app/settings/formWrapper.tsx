"use client";
import { Card } from "@/common/common";
import { Box } from "@chakra-ui/react";
import { getAll } from "@vercel/edge-config";
import Form from "./form";
import { useAccount } from "wagmi";
import { WHITE_LIST } from "@/constants/contracts";
import { redirect } from "next/navigation";

function FormWrapper({ data }: { data: any }) {
  const { address } = useAccount();

  if (
    !address ||
    !WHITE_LIST.find((a) => a.toLowerCase() === address.toLowerCase())
  ) {
    redirect("/404");
  }

  // data: {"pool":"0x417b80C8c11f05097039198Aa714e068aE9daa0E","poolAddressesProvider":"0x4208C0f3FB8988BfFa260573Ec8dE51fD4896D37","poolCore":"0xfe9517F1A0F46e105c02c99de8FB18CAF3d197AB","priceOracle":"0x16BC76613aC12540Cc87377bff3ebAD37B2aD9CF"}
  return <Form data={data} />;
}

export default FormWrapper;
