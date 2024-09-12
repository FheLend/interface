"use client";

import NotFound from "@/app/not-found";
import { Card } from "@/common/common";
import { POOL, TOKEN_LOGO, TOKENS } from "@/constants/contracts";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import {
  Box,
  Divider,
  Flex,
  FlexProps,
  Grid,
  GridItem,
  Image,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";
import {
  useAccount,
  useChainId,
  useReadContract,
  useReadContracts,
} from "wagmi";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/tabs";
import SupplyForm from "@/app/components/supplyModal/supplyForm";
import BorrowForm from "@/app/components/borrowModal/borrowForm";
import RepayForm from "@/app/components/repay/repayForm";
import WithdrawForm from "@/app/components/withdrawModal/withdrawForm";
import { get } from "lodash";
import poolAbi from "@/constants/abi/pool.json";
import tokenAbi from "@/constants/abi/token.json";
import { formatUnits } from "viem";

function RowInfo(props: FlexProps) {
  return (
    <Flex
      py="4"
      borderBottom="1px"
      borderColor="primary.600"
      justify="space-between"
      align="center"
      {...props}
    />
  );
}

function UserPoolInfo({ poolAddress }: { poolAddress: `0x${string}` }) {
  const chainId = useChainId();
  const { address } = useAccount();

  const { data, refetch, isLoading } = useReadContracts({
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
        address: poolAddress as `0x${string}`,
        abi: tokenAbi,
        functionName: "decimals",
      },
    ],
  });

  const userAccountData = get(data, "[0].result", []) as any[];
  const userReserveData = get(data, "[1].result", []) as any[];
  const tokenDecimals = get(data, "[2].result", 18) as number;

  const totalLiquidityETH = get(userAccountData, "[0]", 0n);
  const totalCollateralETH = get(userAccountData, "[1]", 0n);
  const totalBorrowsETH = get(userAccountData, "[2]", 0n);
  const totalFeesETH = get(userAccountData, "[3]", 0n);
  const availableBorrowsETH = get(userAccountData, "[4]", 0n);
  const currentLiquidationThreshold = get(userAccountData, "[5]", 0n);
  const ltv = get(userAccountData, "[6]", 0n);
  const healthFactor = get(userAccountData, "[7]", 0n);

  console.log(data);

  return (
    <>
      <Box mt="5">Your info</Box>
      <Divider borderColor="primary.600" mt="5" />
      <RowInfo>
        <Box color="whiteBlue.700" fontSize="sm">
          Total Liquidity
        </Box>
        <Box>
          ~ {(+formatUnits(totalLiquidityETH, tokenDecimals)).toLocaleString()}{" "}
          ETH
        </Box>
      </RowInfo>
      <RowInfo>
        <Box color="whiteBlue.700" fontSize="sm">
          Total Collateral
        </Box>
        <Box>
          ~ {(+formatUnits(totalCollateralETH, tokenDecimals)).toLocaleString()}{" "}
          ETH
        </Box>
      </RowInfo>
      <RowInfo>
        <Box color="whiteBlue.700" fontSize="sm">
          Total Borrowed
        </Box>
        <Box>
          ~ {(+formatUnits(totalBorrowsETH, tokenDecimals)).toLocaleString()}{" "}
          ETH
        </Box>
      </RowInfo>
      <RowInfo>
        <Box color="whiteBlue.700" fontSize="sm">
          Total Fees
        </Box>
        <Box>
          ~ {(+formatUnits(totalFeesETH, tokenDecimals)).toLocaleString()} ETH
        </Box>
      </RowInfo>
      <RowInfo>
        <Box color="whiteBlue.700" fontSize="sm">
          Available Borrows
        </Box>
        <Box>
          ~{" "}
          {(+formatUnits(availableBorrowsETH, tokenDecimals)).toLocaleString()}{" "}
          ETH
        </Box>
      </RowInfo>
      <RowInfo>
        <Box color="whiteBlue.700" fontSize="sm">
          Liquidation Threshold
        </Box>
        <Box>{Number(currentLiquidationThreshold).toLocaleString()} %</Box>
      </RowInfo>
      <RowInfo>
        <Box color="whiteBlue.700" fontSize="sm">
          Loan to value
        </Box>
        <Box>{Number(ltv).toLocaleString()} %</Box>
      </RowInfo>
      <RowInfo>
        <Box color="whiteBlue.700" fontSize="sm">
          Health Factor
        </Box>
        <Box>{(+formatUnits(healthFactor, 18)).toLocaleString()}</Box>
      </RowInfo>
    </>
  );
}

export default UserPoolInfo;
