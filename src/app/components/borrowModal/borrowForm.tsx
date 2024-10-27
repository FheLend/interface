import { POOL, POOL_ADDRESSES_PROVIDER } from "@/constants/contracts";
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
  Tooltip,
  InputGroup,
  InputRightElement,
  Image as ChakraImage,
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
import { ChevronDownIcon, InfoOutlineIcon } from "@chakra-ui/icons";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/menu";
import { useTokens } from "@/store/pools";
import { orderBy } from "lodash";

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
  const { tokens } = useTokens();
  const sortedTokens = orderBy(
    Object.entries(tokens),
    ([addr]) => addr !== address
  );

  console.log(sortedTokens);
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

  const handleChangeInput = useCallback(
    (event: any) => {
      const isValid = filterNumberInput(event, event.target.value, amount);

      if (!isValid) return;
      setAmount(event.target.value);
    },
    [amount]
  );
  console.log("tokens", tokens);
  return (
    <>
      <FormControl mt="5">
        <FormLabel color="whiteBlue.600" fontWeight="light" fontSize="sm">
          Amount to borrow
        </FormLabel>
        <InputGroup>
          <Input
            ref={initialRef}
            type="number"
            placeholder="0"
            value={amount}
            onChange={handleChangeInput}
            variant="filled"
            size="lg"
          />
          {/* <InputRightElement
            w="fit-content"
            h="100%"
            fontSize="sm"
            pr="3"
            color="whiteBlue.700"
            cursor="pointer"
          >
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon verticalAlign="middle" />}
                variant="unstyled"
              >
                Select token
              </MenuButton>
              <MenuList
                zIndex={1}
                bgColor="primary.600"
                border="0"
                minW="140px"
              >
                {sortedTokens.map(([address, token]) => (
                  <MenuItem
                    key={address}
                    bgColor="primary.600"
                    _hover={{ bgColor: "primary.300" }}
                  >
                    <ChakraImage src={token.logo} boxSize="6" />
                    <Box color="whiteBlue.400" ml="2">
                      {token.symbol}
                    </Box>
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </InputRightElement> */}
        </InputGroup>
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
                      <Box color="whiteBlue.600">Available to borrow: </Box>
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
