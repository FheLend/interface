import { POOL, POOL_ADDRESSES_PROVIDER } from "@/constants/contracts";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  useAccount,
  useBalance,
  useChainId,
  useReadContract,
  useReadContracts,
} from "wagmi";
import {
  Button,
  Box,
  FormControl,
  FormLabel,
  Input,
  Center,
  Flex,
  Tooltip,
} from "@chakra-ui/react";
import { filterNumberInput, formatNumber } from "@/utils/helper";
import Image from "next/image";
import loading from "@/images/icons/loading.svg";
import { TextAutoEllipsis } from "@/common/common";
import { BorrowButton } from "./borrowBtn";
import poolAbi from "@/constants/abi/pool.json";
import poolAddressesProviderAbi from "@/constants/abi/poolAddressesProvider.json";
import { get, min } from "lodash";
import { formatUnits, parseUnits } from "viem";
import ConnectButton from "@/common/connect-button";
import AvailableBorrow from "./availableBorrow";
import { InfoOutlineIcon } from "@chakra-ui/icons";

export default function BorrowForm({
  poolAddress,
  availableLiquidity,
}: {
  poolAddress: `0x${string}`;
  availableLiquidity?: number;
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
      {
        address: POOL_ADDRESSES_PROVIDER[chainId],
        abi: poolAddressesProviderAbi,
        functionName: "getPriceOracle",
      },
    ],
  });

  const userAccountData = get(data, "[0].result", []) as any[];
  const userReserveData = get(data, "[1].result", []) as any[];
  const priceOracleAddress = get(data, "[2].result", "");
  const availableBorrowsETH = get(userAccountData, "[4]", 0n);
  console.log(userReserveData);

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
          {isLoading ? (
            <Image src={loading} alt="loading-icon" />
          ) : (
            <>
              {priceOracleAddress && (
                <AvailableBorrow
                  address={priceOracleAddress as `0x${string}`}
                  tokenAddress={poolAddress}
                  availableBorrowsETH={+formatUnits(availableBorrowsETH, 18)}
                  render={(amount) => (
                    <Flex
                      onClick={() => {
                        setAmount(
                          (
                            min([
                              Number(amount),
                              Number(availableLiquidity) * 0.25,
                            ]) as number
                          ).toString()
                        );
                      }}
                      cursor="pointer"
                    >
                      <Box opacity="0.7">Available to borrow: </Box>
                      <Flex fontWeight="semibold" ml="1" align="center">
                        <TextAutoEllipsis ml="1">
                          {formatNumber(
                            min([
                              Number(amount),
                              Number(availableLiquidity) * 0.25,
                            ]) as number
                          )}
                        </TextAutoEllipsis>
                        <Box ml="1">{balanceData?.symbol}</Box>
                        <Tooltip
                          label={
                            <Box>
                              <Box>Max to borrow: {formatNumber(amount)}</Box>
                              <Box>
                                Available to borrow:{" "}
                                {formatNumber(
                                  Number(availableLiquidity) * 0.25
                                )}
                              </Box>
                              <Box fontSize="xs">
                                (25% of current liquidity)
                              </Box>
                            </Box>
                          }
                        >
                          <InfoOutlineIcon ml="1" />
                        </Tooltip>
                      </Flex>
                    </Flex>
                  )}
                />
              )}
            </>
          )}
        </Flex>
      </FormControl>
      <Center mt="5" flexDir="column">
        {isConnected ? (
          <>
            {Number(amount) > 0 ? (
              Number(amount) > Number(availableLiquidity) * 0.25 ? (
                <Button isDisabled>
                  You can borrow only 25% of available liquidity at a time
                </Button>
              ) : (
                <BorrowButton
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
