import { POOL, POOL_CORE } from "@/constants/contracts";
import { useCallback, useMemo, useRef, useState } from "react";
import { useAccount, useBalance, useChainId, useReadContract } from "wagmi";
import {
  Button,
  Box,
  FormControl,
  FormLabel,
  Input,
  Center,
  Flex,
} from "@chakra-ui/react";
import { filterNumberInput, formatNumber } from "@/utils/helper";
import Image from "next/image";
import loading from "@/images/icons/loading.svg";
import { TextAutoEllipsis } from "@/common/common";
import poolAbi from "@/constants/abi/pool.json";
import { get } from "lodash";
import { formatUnits, parseUnits } from "viem";
import { RepayButton } from "./repayBtn";
import ConnectButton from "@/common/connect-button";
import { useAllowance } from "@/hooks/useApproval";
import { ApproveButton } from "@/common/approveBtn";

export default function RepayForm({
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

  const {
    isFetching: isFetchingAllowance,
    data,
    refetchAllowance,
  } = useAllowance(poolAddress, address, POOL_CORE[chainId]);

  const allowance = (data || 0n) as bigint;
  const needToBeApproved =
    allowance !== undefined &&
    +amount > +formatUnits(allowance, balanceData?.decimals || 18);

  const {
    data: userReserveData,
    isLoading,
    refetch,
  } = useReadContract({
    address: POOL[chainId],
    abi: poolAbi,
    functionName: "getUserReserveData",
    args: [poolAddress, address],
  });

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
          Amount to repay
        </FormLabel>
        <Input
          ref={initialRef}
          type="number"
          placeholder="0"
          value={amount}
          onChange={handleChangeInput}
          variant="filled"
          size="lg"
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
                  {formatNumber(borrowedBalance)}
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
            {Number(amount) > 0 ? (
              needToBeApproved ? (
                <ApproveButton
                  amount={amount}
                  address={poolAddress}
                  isFetchingAllowance={isFetchingAllowance}
                  refetchAllowance={refetchAllowance}
                />
              ) : Number(amount) > Number(borrowedBalance) ? (
                <Button isDisabled>
                  You paid more than the required amount
                </Button>
              ) : (
                <RepayButton
                  amount={parseUnits(
                    amount,
                    balanceData?.decimals || 18
                  ).toString()}
                  poolAddress={poolAddress}
                  refetchBalance={refetch}
                />
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
