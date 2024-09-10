import { POOL } from "@/constants/contracts";
import { useCallback, useMemo, useRef, useState } from "react";
import { useAccount, useBalance, useChainId, useReadContracts } from "wagmi";
import {
  Button,
  Box,
  FormControl,
  FormLabel,
  Input,
  Center,
  Flex,
} from "@chakra-ui/react";
import { filterNumberInput } from "@/utils/helper";
import Image from "next/image";
import loading from "@/images/icons/loading.svg";
import { TextAutoEllipsis } from "@/common/common";
import { BorrowButton } from "./borrowBtn";
import poolAbi from "@/constants/abi/pool.json";
import { get } from "lodash";
import { formatUnits, parseUnits } from "viem";
import ConnectButton from "@/common/connect-button";

export default function BorrowForm({
  poolAddress,
}: {
  poolAddress: `0x${string}`;
}) {
  const chainId = useChainId();
  const initialRef = useRef(null);
  const [amount, setAmount] = useState("");
  const { address, isConnected } = useAccount();

  const { data: balanceData } = useBalance({
    address,
    token: poolAddress,
  });

  const { data, isLoading, refetch } = useReadContracts({
    contracts: [
      {
        address: POOL[chainId],
        abi: poolAbi,
        functionName: "getUserAccountData",
        args: [address],
      },
      {
        address: POOL[chainId],
        abi: poolAbi,
        functionName: "getUserReserveData",
        args: [poolAddress, address],
      },
    ],
  });

  const userAccountData = get(data, "[0].result", []) as any[];
  const userReserveData = get(data, "[1].result", []) as any[];

  console.log(userAccountData, userReserveData);
  const borrowedBalance = useMemo(
    () =>
      formatUnits(get(userReserveData, "[1]", 0n), balanceData?.decimals || 18),
    [userReserveData, balanceData]
  );

  const handleChangeInput = useCallback(
    (event: any) => {
      const isValid = filterNumberInput(event, event.target.value, amount);

      if (!isValid) return;
      setAmount(event.target.value);
    },
    [amount]
  );

  return (
    <>
      <FormControl mt="5">
        <FormLabel color="whiteBlue.600" fontWeight="light" fontSize="sm">
          Amount to borrow
        </FormLabel>
        <Input
          ref={initialRef}
          type="number"
          placeholder="0"
          value={amount}
          onChange={handleChangeInput}
        />

        <Flex mt="3" fontSize="small" justify="flex-end">
          <Flex
            onClick={() => {
              setAmount(borrowedBalance.toString());
            }}
            cursor="pointer"
          >
            <Box opacity="0.7">Borrowed: </Box>
            <Flex fontWeight="semibold" ml="1">
              {isLoading ? (
                <Image src={loading} alt="loading-icon" />
              ) : (
                <TextAutoEllipsis ml="1">
                  {borrowedBalance.toLocaleString()}
                </TextAutoEllipsis>
              )}
              <Box ml="1">{balanceData?.symbol}</Box>
            </Flex>
          </Flex>
        </Flex>
      </FormControl>

      <Center mt="5" flexDir="column">
        {isConnected ? (
          <>
            {+amount > 0 ? (
              <BorrowButton
                amount={parseUnits(
                  amount,
                  balanceData?.decimals || 18
                ).toString()}
                poolAddress={poolAddress}
                refetchBalance={refetch}
              />
            ) : (
              <Button isDisabled>Enter an amount</Button>
            )}
          </>
        ) : (
          <ConnectButton size="md" />
        )}
      </Center>
    </>
  );
}