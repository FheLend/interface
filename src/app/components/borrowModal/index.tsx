import { POOL, TOKEN_TEST } from "@/constants/contracts";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/modal";
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
import { useAllowance } from "@/hooks/useApproval";
import { ApproveButton } from "@/common/approveBtn";
import { filterNumberInput } from "@/utils/helper";
import Image from "next/image";
import loading from "@/images/icons/loading.svg";
import { TextAutoEllipsis } from "@/common/common";
import { BorrowButton } from "./borrowBtn";
import poolAbi from "@/constants/abi/pool.json";
import { get } from "lodash";
import { formatUnits, parseUnits } from "viem";

export default function BorrowModal({
  poolAddress,
  onClose,
}: {
  poolAddress: `0x${string}`;
  onClose: () => void;
}) {
  const chainId = useChainId();
  const initialRef = useRef(null);
  const [amount, setAmount] = useState("");
  const { address } = useAccount();

  const { data: balanceData } = useBalance({
    address,
    token: TOKEN_TEST[chainId],
  });

  const {
    data: userReserveData,
    isLoading,
    refetch,
  } = useReadContract({
    abi: poolAbi,
    address: POOL[chainId],
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
    <Modal
      isOpen={true}
      onClose={onClose}
      initialFocusRef={initialRef}
      isCentered
    >
      <ModalOverlay zIndex={1} />
      <ModalContent zIndex={1}>
        <ModalHeader>Borrow</ModalHeader>
        <ModalCloseButton />
        <ModalBody mb="10">
          <FormControl mt="5">
            <FormLabel opacity="0.7">Amount</FormLabel>
            <Input
              ref={initialRef}
              type="number"
              placeholder="0"
              value={amount}
              onChange={handleChangeInput}
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
                      {borrowedBalance.toLocaleString()}
                    </TextAutoEllipsis>
                  )}
                  <Box ml="1">{balanceData?.symbol}</Box>
                </Flex>
              </Flex>
            </Flex>
          </FormControl>

          <Center mt="5" flexDir="column">
            {+amount > 0 ? (
              <BorrowButton
                amount={parseUnits(
                  amount,
                  balanceData?.decimals || 18
                ).toString()}
                poolAddress={poolAddress}
                refetchBalance={refetch}
              />
            ) : (
              <Button isDisabled>Enter an amount</Button>
            )}
          </Center>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
