"use client";

import {
  Box,
  Button,
  Center,
  Circle,
  Flex,
  FlexProps,
  GridItem,
  SimpleGrid,
  Spacer,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { Card, PrivateText } from "@/common/common";
import { useAccount, useReadContracts } from "wagmi";
import Pools from "../components/pools";
import { get, isEmpty, map } from "lodash";
import {
  useConfig,
  useReserves,
  useTokens,
  useUserAccountData,
} from "@/store/pools";
import { ArrowBackIcon, MinusIcon } from "@chakra-ui/icons";
import Link from "next/link";
import poolAbi from "@/constants/abi/pool.json";
import WithdrawModal from "../components/withdrawModal";
import { useMemo } from "react";
import useETHPrice from "@/hooks/usePrices";
import { formatNumber } from "@/utils/helper";
import eyeIcon from "@/images/icons/eye.svg";
import eyeOffIcon from "@/images/icons/eye-off.svg";
import Image from "next/image";

function BoxInfo({
  title,
  usdVal,
  ethVal,
  isShow,
}: {
  title: string;
  usdVal: number;
  ethVal: number;
  isShow: boolean;
}) {
  return (
    <Box
      color="whiteBlue.600"
      fontSize="sm"
      borderRadius="2xl"
      border="1px"
      px="4"
      py="3"
      borderColor="whiteAlpha.300"
    >
      {title}
      <Box color="white" fontSize="xl" my="1" fontWeight="semibold">
        <PrivateText isShow={isShow}>${formatNumber(usdVal)}</PrivateText>
      </Box>
      <PrivateText isShow={isShow}>{formatNumber(ethVal)} ETH</PrivateText>
    </Box>
  );
}

function WithdrawBtn({ token }: any) {
  const {
    isOpen: isOpenWithdraw,
    onOpen: openWithdraw,
    onClose: closeWithdraw,
  } = useDisclosure();

  return (
    <>
      <Tooltip label={`Withdraw ${token.symbol}`}>
        <Circle
          onClick={openWithdraw}
          border="1px"
          borderColor="whiteBlue.300"
          size="5"
          cursor="pointer"
        >
          <MinusIcon boxSize="3" />
        </Circle>
      </Tooltip>

      {isOpenWithdraw && (
        <WithdrawModal
          aTokenAddress={token.aTokenAddress as `0x${string}`}
          onClose={closeWithdraw}
        />
      )}
    </>
  );
}

function RowInfo(props: FlexProps) {
  return (
    <Flex
      py="2"
      borderBottom="1px"
      borderColor="primary.600"
      justify="space-between"
      align="center"
      {...props}
    />
  );
}

function DepositedBalance() {
  const { address } = useAccount();
  const { reserves } = useReserves();
  const { tokens } = useTokens();
  const { config } = useConfig();
  const { data } = useReadContracts({
    //@ts-ignore
    contracts: reserves.map((reserve) => ({
      address: config?.pool as `0x${string}`,
      abi: poolAbi,
      functionName: "getUserReserveData",
      args: [reserve, address],
    })),
  });

  const {
    data: reserveData,
    refetch,
    isLoading,
  } = useReadContracts({
    //@ts-ignore
    contracts: reserves.map((reserve) => ({
      address: config?.pool as `0x${string}`,
      abi: poolAbi,
      functionName: "getReserveData",
      args: [reserve],
    })),
  });

  const tokenData = useMemo(() => {
    return map(data, (reserve, index) => {
      const borrowBalance = get(reserve, "result[0]", 0n);
      const aTokenAddress = get(reserveData, `[${index}].result[11]`, "");
      return {
        symbol: tokens[reserves[index]]?.symbol,
        decimals: tokens[reserves[index]]?.decimals,
        logo: tokens[reserves[index]]?.logo || "",
        balance: borrowBalance,
        address: reserves[index],
        aTokenAddress,
      };
    })
      .filter((token) => token.balance > 0)
      .sort((a, b) => Number(b.balance) - Number(a.balance));
  }, [data, reserves, tokens, reserveData]);

  return (
    <Card cardTitle="Deposited Assets" mt="7">
      {isEmpty(tokenData) ? (
        <Center my="20" flexDir="column">
          <Box color="white">No open positions yet</Box>
          {!address && (
            <Box fontSize="sm" mt="5" color="whiteBlue.600">
              Connect wallet to see performance of your positions
            </Box>
          )}
          <Button as={Link} href="/lending" mt="5">
            Explore products
          </Button>
        </Center>
      ) : (
        <Pools
          poolAddresses={tokenData.map((p) => p.address) as `0x${string}`[]}
        />
      )}
    </Card>
  );
}

export default function Portfolio() {
  const { isConnected } = useAccount();
  const { reserves } = useReserves();
  const { userAccountData } = useUserAccountData();
  const { ethPrice } = useETHPrice();
  const { isOpen, onToggle } = useDisclosure();

  const {
    totalLiquidityETH = 0n,
    totalCollateralETH = 0n,
    totalBorrowsETH = 0n,
    totalFeesETH = 0n,
    availableBorrowsETH = 0n,
    currentLiquidationThreshold = 0,
    ltv = 0,
    healthFactor = 0n,
  } = userAccountData || {};

  return (
    <Box mt="10">
      <Flex>
        <Flex fontSize="2xl" alignItems="center">
          <Link href="/lending">
            <Box borderRadius="lg" px="2" bg="blackAlpha.400" mr="3">
              <ArrowBackIcon boxSize="5" />
            </Box>
          </Link>
          Dashboard
          <Box
            as={Image}
            src={isOpen ? eyeIcon : eyeOffIcon}
            alt="icon"
            cursor="pointer"
            onClick={onToggle}
            ml="3"
          />
        </Flex>
        <Spacer />
      </Flex>

      <Box fontSize="sm" mt="2" color="whiteBlue.600">
        Track all your positions in one place
      </Box>

      <SimpleGrid
        columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }}
        my="10"
        gap="5"
      >
        <GridItem>
          <BoxInfo
            title="Net worth"
            usdVal={Number(totalLiquidityETH) * ethPrice}
            ethVal={Number(totalLiquidityETH)}
            isShow={isOpen}
          />
        </GridItem>
        <GridItem>
          <BoxInfo
            title="Total borrowed"
            usdVal={Number(totalBorrowsETH) * ethPrice}
            ethVal={Number(totalBorrowsETH)}
            isShow={isOpen}
          />
        </GridItem>
        <GridItem>
          <BoxInfo
            title="Total collateral"
            usdVal={Number(totalCollateralETH) * ethPrice}
            ethVal={Number(totalCollateralETH)}
            isShow={isOpen}
          />
        </GridItem>
      </SimpleGrid>
      <DepositedBalance />
    </Box>
  );
}
