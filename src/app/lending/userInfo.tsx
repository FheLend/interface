import { Card, PrivateText } from "@/common/common";
import {
  Box,
  Center,
  Flex,
  FlexProps,
  Link,
  useDisclosure,
  Image as ChakraImage,
  Circle,
  Tooltip,
} from "@chakra-ui/react";
import { get, map } from "lodash";
import Image from "next/image";
import { formatUnits } from "viem";
import eyeIcon from "@/images/icons/eye.svg";
import eyeOffIcon from "@/images/icons/eye-off.svg";
import { useAccount, useChainId, useReadContracts } from "wagmi";
import poolAbi from "@/constants/abi/pool.json";
import { useMemo } from "react";
import { useConfig, useReserves, useTokens } from "@/store/pools";
import { MinusIcon } from "@chakra-ui/icons";
import WithdrawModal from "../components/withdrawModal";

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

function DepositedBalance({ isOpen }: { isOpen: boolean }) {
  const { address } = useAccount();

  const chainId = useChainId();
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
        aTokenAddress,
      };
    })
      .filter((token) => token.balance > 0)
      .sort((a, b) => Number(b.balance) - Number(a.balance));
  }, [data, reserves, tokens, reserveData]);

  return (
    <Card cardTitle="Deposited Assets" mt="7">
      {tokenData.map((token, index) => {
        return (
          <RowInfo key={index}>
            <Center>
              <ChakraImage src={token.logo} boxSize="6" alt="token-logo" />
              <Box fontSize="sm" ml="2">
                {token.symbol}
              </Box>
            </Center>

            <Center>
              <PrivateText isShow={isOpen} mr="2">
                {token.balance
                  ? (+formatUnits(
                      token.balance,
                      token.decimals || 18
                    )).toLocaleString()
                  : "0"}
              </PrivateText>
              <WithdrawBtn token={token} />
            </Center>
          </RowInfo>
        );
      })}
    </Card>
  );
}

function UserInfo({ data }: { data: any }) {
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
  } = data || {};

  return (
    <>
      <Card
        cardTitle={
          <Center>
            <Box mr="2">Your Position</Box>
            <Box
              as={Image}
              src={isOpen ? eyeIcon : eyeOffIcon}
              alt="icon"
              cursor="pointer"
              onClick={onToggle}
            />
          </Center>
        }
        subTitle={
          <Link
            href="https://docs.felend.xyz/introduction/retrieve-data"
            isExternal
            fontSize="xs"
            fontWeight="300"
            textDecor="underline"
          >
            Why my info is hidden?
          </Link>
        }
        mt="7"
      >
        <RowInfo>
          <Box color="whiteBlue.700" fontSize="sm">
            Total Liquidity
          </Box>
          <Box>
            <PrivateText isShow={isOpen}>
              ~ {(+formatUnits(totalLiquidityETH, 18)).toLocaleString()}
            </PrivateText>{" "}
            ETH
          </Box>
        </RowInfo>
        <RowInfo>
          <Box color="whiteBlue.700" fontSize="sm">
            Total Collateral
          </Box>
          <Box>
            <PrivateText isShow={isOpen}>
              ~ {(+formatUnits(totalCollateralETH, 18)).toLocaleString()}
            </PrivateText>{" "}
            ETH
          </Box>
        </RowInfo>
        <RowInfo>
          <Box color="whiteBlue.700" fontSize="sm">
            Total Borrowed
          </Box>
          <Box>
            <PrivateText isShow={isOpen}>
              ~ {(+formatUnits(totalBorrowsETH, 18)).toLocaleString()}
            </PrivateText>{" "}
            ETH
          </Box>
        </RowInfo>
        <RowInfo>
          <Box color="whiteBlue.700" fontSize="sm">
            Total Fees
          </Box>
          <Box>
            <PrivateText isShow={isOpen}>
              ~ {(+formatUnits(totalFeesETH, 18)).toLocaleString()}
            </PrivateText>{" "}
            ETH
          </Box>
        </RowInfo>
        <RowInfo>
          <Box color="whiteBlue.700" fontSize="sm">
            Available Borrows
          </Box>
          <Box>
            <PrivateText isShow={isOpen}>
              ~ {(+formatUnits(availableBorrowsETH, 18)).toLocaleString()}
            </PrivateText>{" "}
            ETH
          </Box>
        </RowInfo>
        <RowInfo>
          <Box color="whiteBlue.700" fontSize="sm">
            Liquidation Threshold
          </Box>
          <Box>
            <PrivateText isShow={isOpen}>
              {Number(currentLiquidationThreshold).toLocaleString()}
            </PrivateText>{" "}
            %
          </Box>
        </RowInfo>
        <RowInfo>
          <Box color="whiteBlue.700" fontSize="sm">
            Loan to value
          </Box>
          <Box>
            <PrivateText isShow={isOpen}>
              {Number(ltv).toLocaleString()}
            </PrivateText>{" "}
            %
          </Box>
        </RowInfo>
        <RowInfo>
          <Box color="whiteBlue.700" fontSize="sm">
            Health Factor
          </Box>
          <PrivateText isShow={isOpen}>
            {totalBorrowsETH
              ? (+formatUnits(healthFactor, 18)).toLocaleString()
              : "∞"}
          </PrivateText>
        </RowInfo>
      </Card>

      <DepositedBalance isOpen={isOpen} />
    </>
  );
}

export default UserInfo;
