import { useCallback, useRef, useState } from "react";
import { useAccount, useBalance } from "wagmi";
import {
  Button,
  Box,
  FormControl,
  FormLabel,
  Input,
  Center,
  Flex,
} from "@chakra-ui/react";
import { parseUnits } from "viem";
import { filterNumberInput, formatNumber } from "@/utils/helper";
import Image from "next/image";
import loading from "@/images/icons/loading.svg";
import { TextAutoEllipsis } from "@/common/common";
import { WithdrawButton } from "./withdrawBtn";
import ConnectButton from "@/common/connect-button";

export default function WithdrawForm({
  aTokenAddress,
}: {
  aTokenAddress: `0x${string}`;
}) {
  const initialRef = useRef(null);
  const [amount, setAmount] = useState("");
  const { address, isConnected } = useAccount();

  const {
    data: balanceData,
    isFetching: isFetchingBalance,
    refetch: refetchBalance,
  } = useBalance({ address, token: aTokenAddress });
  console.log(aTokenAddress);

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
          Amount to withdraw
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
              setAmount(balanceData?.formatted || "");
            }}
            cursor="pointer"
          >
            <Box opacity="0.7">Deposited: </Box>
            <Flex fontWeight="semibold" ml="1">
              {isFetchingBalance ? (
                <Image src={loading} alt="loading-icon" />
              ) : (
                <TextAutoEllipsis ml="1">
                  {balanceData?.formatted &&
                    formatNumber(balanceData?.formatted)}
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
              Number(amount) <= Number(balanceData?.formatted) ? (
                <WithdrawButton
                  amount={parseUnits(
                    amount,
                    balanceData?.decimals || 18
                  ).toString()}
                  aTokenAddress={aTokenAddress}
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
