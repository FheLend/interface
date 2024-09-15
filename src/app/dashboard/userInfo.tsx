import { Card, PrivateText } from "@/common/common";
import {
  Box,
  Center,
  Flex,
  FlexProps,
  Link,
  useDisclosure,
} from "@chakra-ui/react";
import { get } from "lodash";
import Image from "next/image";
import { formatUnits } from "viem";
import eyeIcon from "@/images/icons/eye.svg";
import eyeOffIcon from "@/images/icons/eye-off.svg";

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
          href="https://docs.felend.xyz"
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
  );
}

export default UserInfo;
