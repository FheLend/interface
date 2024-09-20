import { POOL_CORE } from "@/constants/contracts";
import { useCallback, useRef, useState } from "react";
import { useAccount, useBalance, useChainId } from "wagmi";
import {
  Button,
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Center,
  Flex,
} from "@chakra-ui/react";
import { useAllowance } from "@/hooks/useApproval";
import { ApproveButton } from "@/common/approveBtn";
import { filterNumberInput, formatSmallNumber } from "@/utils/helper";
import Image from "next/image";
import loading from "@/images/icons/loading.svg";
import { TextAutoEllipsis } from "@/common/common";
import { SupplyButton } from "./supplyBtn";
import { formatUnits, parseUnits } from "viem";
import ConnectButton from "@/common/connect-button";

export default function SupplyForm({
  poolAddress,
  apr,
  apy,
}: {
  poolAddress: `0x${string}`;
  apr: number;
  apy: number;
}) {
  const chainId = useChainId();
  const initialRef = useRef(null);
  const [amount, setAmount] = useState("");
  const { address, isConnected } = useAccount();

  const {
    data: balanceData,
    isFetching: isFetchingBalance,
    refetch: refetchBalance,
  } = useBalance({ address, token: poolAddress });

  const {
    isFetching: isFetchingAllowance,
    data,
    refetchAllowance,
  } = useAllowance(poolAddress, address, POOL_CORE[chainId]);

  const allowance = (data || 0n) as bigint;
  const needToBeApproved =
    allowance !== undefined &&
    +amount > +formatUnits(allowance, balanceData?.decimals || 18);

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
          Amount to supply
        </FormLabel>
        <Input
          ref={initialRef}
          type="number"
          placeholder="0"
          value={amount}
          onChange={handleChangeInput}
        />

        {address && (
          <Flex mt="3" fontSize="small" justify="flex-end">
            <Flex
              onClick={() => {
                console.log(balanceData);
                setAmount(balanceData?.formatted || "");
              }}
              cursor="pointer"
            >
              <Box opacity="0.7">Balance: </Box>
              <Flex fontWeight="semibold" ml="1">
                {isFetchingBalance ? (
                  <Image src={loading} alt="loading-icon" />
                ) : (
                  <TextAutoEllipsis ml="1">
                    {balanceData?.formatted &&
                      formatSmallNumber(balanceData?.formatted)}
                  </TextAutoEllipsis>
                )}
                <Box ml="1">{balanceData?.symbol}</Box>
              </Flex>
            </Flex>
          </Flex>
        )}
        <FormErrorMessage>{}</FormErrorMessage>
      </FormControl>

      <Center mt="4" justifyContent="space-between" fontSize="small">
        <Box color="whiteAlpha.500">Supply APR</Box>
        <Box>{(apr * 100).toLocaleString()}%</Box>
      </Center>
      <Center mt="1" justifyContent="space-between" fontSize="small">
        <Box color="whiteAlpha.500">Supply APY</Box>
        <Box>{(apy * 100).toLocaleString()}%</Box>
      </Center>

      <Center mt="5" flexDir="column">
        {isConnected ? (
          <>
            {+amount > 0 ? (
              needToBeApproved ? (
                <ApproveButton
                  amount={amount}
                  address={poolAddress}
                  isFetchingAllowance={isFetchingAllowance}
                  refetchAllowance={refetchAllowance}
                />
              ) : +amount <= +(balanceData?.formatted || 0) ? (
                <SupplyButton
                  amount={parseUnits(
                    amount,
                    balanceData?.decimals || 18
                  ).toString()}
                  poolAddress={poolAddress}
                  refetchAllowance={refetchAllowance}
                  refetchBalance={refetchBalance}
                />
              ) : (
                <Button isDisabled>
                  Insufficient {balanceData?.symbol} token
                </Button>
              )
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
