import { Card, PrivateText } from "@/common/common";
import {
  Box,
  Center,
  Flex,
  FlexProps,
  Link,
  useDisclosure,
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

function BorrowBalance({
  aTokenAddresses,
  isOpen,
}: {
  aTokenAddresses: `0x${string}`[];
  isOpen: boolean;
}) {
  const { address } = useAccount();
  const { data } = useReadContracts({
    //@ts-ignore
    contracts: flatten(
      aTokenAddresses.map((tokenAddress) => [
        {
          address: tokenAddress,
          abi: tokenAbi,
          functionName: "symbol",
        },
        {
          address: tokenAddress,
          abi: tokenAbi,
          functionName: "decimals",
        },
        {
          address: tokenAddress,
          abi: tokenAbi,
          functionName: "balanceOf",
          args: [address],
        },
      ])
    ),
  });

  const tokenData = useMemo(() => {
    return aTokenAddresses.map((address, index) => {
      const symbol = get(data, `[${index * 3}].result`);
      const decimals = get(data, `[${index * 3 + 1}].result`);
      const balance = get(data, `[${index * 3 + 2}].result`);

      return {
        address,
        symbol,
        decimals,
        balance,
      };
    });
  }, [aTokenAddresses, data]);

  // TODO: Make the UI for tokenData is []
  // TODO: map aToken to the pool token
  return (
    <Card cardTitle="Deposited Assets" mt="7">
      {tokenData.map((token, index) => (
        <RowInfo key={index}>
          <Box color="whiteBlue.700" fontSize="sm">
            {token.symbol}
          </Box>

          <PrivateText isShow={isOpen}>
            {token.balance
              ? (+formatUnits(
                  token.balance,
                  token.decimals || 18
                )).toLocaleString()
              : "0"}
          </PrivateText>
        </RowInfo>
      ))}
    </Card>
  );
}

function UserInfo({ data, reserves }: { data: any; reserves: any[] }) {
  const { isOpen, onToggle } = useDisclosure();
  const chainId = useChainId();

  const totalLiquidityETH = get(data, "[0]", 0n);
  const totalCollateralETH = get(data, "[1]", 0n);
  const totalBorrowsETH = get(data, "[2]", 0n);
  const totalFeesETH = get(data, "[3]", 0n);
  const availableBorrowsETH = get(data, "[4]", 0n);
  const currentLiquidationThreshold = get(data, "[5]", 0n);
  const ltv = get(data, "[6]", 0n);
  const healthFactor = get(data, "[7]", 0n);

  const {
    data: reserveData,
    isLoading,
    refetch,
  } = useReadContracts({
    //@ts-ignore
    contracts: reserves.map((reserve: any) => ({
      address: POOL[chainId],
      abi: poolAbi,
      functionName: "getReserveData",
      args: [reserve],
    })),
  });
  const aTokenAddresses = map(reserveData, (data: any) => data.result[11]);

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

      <BorrowBalance aTokenAddresses={aTokenAddresses} isOpen={isOpen} />
    </>
  );
}

export default UserInfo;
