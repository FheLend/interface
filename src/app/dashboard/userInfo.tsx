import { Card, PrivateText } from "@/common/common";
import {
  Box,
  Center,
  Flex,
  FlexProps,
  Link,
  useDisclosure,
  Image as ChakraImage,
} from "@chakra-ui/react";
import { flatten, get, map } from "lodash";
import Image from "next/image";
import { formatUnits } from "viem";
import eyeIcon from "@/images/icons/eye.svg";
import eyeOffIcon from "@/images/icons/eye-off.svg";
import { useAccount, useChainId, useReadContracts } from "wagmi";
import { POOL } from "@/constants/contracts";
import poolAbi from "@/constants/abi/pool.json";
import tokenAbi from "@/constants/abi/token.json";
import { useMemo } from "react";
import { useReserves, useTokens } from "@/store/pools";

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

function BorrowBalance({ isOpen }: { isOpen: boolean }) {
  const { address } = useAccount();
  const chainId = useChainId();
  const { reserves } = useReserves();
  const { tokens } = useTokens();
  const { data } = useReadContracts({
    //@ts-ignore
    contracts: reserves.map((reserve) => ({
      address: POOL[chainId],
      abi: poolAbi,
      functionName: "getUserReserveData",
      args: [reserve, address],
    })),
  });

  const tokenData = useMemo(() => {
    return map(data, (reserve, index) => {
      const borrowBalance = get(reserve, "result[0]", 0n);
      return {
        symbol: tokens[reserves[index]]?.symbol,
        decimals: tokens[reserves[index]]?.decimals,
        logo: tokens[reserves[index]]?.logo || "",
        balance: borrowBalance,
      };
    })
      .filter((token) => token.balance > 0)
      .sort((a, b) => Number(b.balance) - Number(a.balance));
  }, [data, reserves, tokens]);

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

            <PrivateText isShow={isOpen}>
              {token.balance
                ? (+formatUnits(
                    token.balance,
                    token.decimals || 18
                  )).toLocaleString()
                : "0"}
            </PrivateText>
          </RowInfo>
        );
      })}
    </Card>
  );
}

function UserInfo({ data }: { data: any }) {
  const { isOpen, onToggle } = useDisclosure();

  const totalLiquidityETH = get(data, "[0]", 0n);
  const totalCollateralETH = get(data, "[1]", 0n);
  const totalBorrowsETH = get(data, "[2]", 0n);
  const totalFeesETH = get(data, "[3]", 0n);
  const availableBorrowsETH = get(data, "[4]", 0n);
  const currentLiquidationThreshold = get(data, "[5]", 0n);
  const ltv = get(data, "[6]", 0n);
  const healthFactor = get(data, "[7]", 0n);

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

      <BorrowBalance isOpen={isOpen} />
    </>
  );
}

export default UserInfo;
