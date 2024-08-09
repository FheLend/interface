import { POOL, POOL_CORE, TOKEN_TEST } from "@/constants/contracts";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/modal";
import { useCallback, useRef, useState } from "react";
import { useAccount, useBalance } from "wagmi";
import {
  Button,
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Center,
  Flex,
} from "@chakra-ui/react";
import ConnectButton from "@/common/connect-button";
import { useAllowance } from "@/hooks/useApproval";
import { formatUnits } from "viem";
import { ApproveButton } from "@/common/approveBtn";
import { filterNumberInput } from "@/utils/helper";
import Image from "next/image";
import loading from "@/images/icons/loading.svg";
import { TextAutoEllipsis } from "@/common/common";
import { SupplyButton } from "./supplyBtn";

export default function SupplyModal({
  poolAddress,
  onClose,
}: {
  poolAddress: `0x${string}`;
  onClose: () => void;
}) {
  const initialRef = useRef(null);
  const [amount, setAmount] = useState("");
  const { isConnected, address } = useAccount();

  const {
    data: balanceData,
    isFetching: isFetchingBalance,
    refetch: refetchBalance,
  } = useBalance({ address, token: TOKEN_TEST });

  const {
    isFetching: isFetchingAllowance,
    data,
    isError,
    refetchAllowance,
  } = useAllowance(TOKEN_TEST, address, POOL_CORE);

  const allowance = isError
    ? undefined
    : formatUnits((data || 0) as bigint, 18); // TODO: need to fetch the token decimals
  const needToBeApproved = allowance !== undefined && +amount > +allowance;

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
        <ModalHeader>Supply</ModalHeader>
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

            {address && (
              <Flex mt="3" fontSize="small" justify="flex-end">
                <Flex
                  onClick={() => {
                    console.log(balanceData);
                    setAmount(balanceData?.formatted || "");
                  }}
                  cursor="pointer"
                >
                  <Box opacity="0.7">Balance:</Box>
                  <Flex fontWeight="semibold" ml="1">
                    {isFetchingBalance ? (
                      <Image src={loading} alt="loading-icon" />
                    ) : (
                      <TextAutoEllipsis ml="1">
                        {" "}
                        {balanceData?.formatted}
                      </TextAutoEllipsis>
                    )}
                    <Box ml="1">USDT</Box>
                  </Flex>
                </Flex>
              </Flex>
            )}
            <FormErrorMessage>{}</FormErrorMessage>
          </FormControl>

          <Center mt="4" justifyContent="space-between" fontSize="small">
            <Box color="whiteAlpha.500">Supply APY</Box>
            <Box>--</Box>
          </Center>
          <Center mt="1" justifyContent="space-between" fontSize="small">
            <Box color="whiteAlpha.500">Network fee</Box>
            <Box>--</Box>
          </Center>

          <Center mt="5">
            {isConnected ? (
              <>
                {+amount > 0 ? (
                  needToBeApproved ? (
                    <ApproveButton
                      amount={amount}
                      isFetchingAllowance={isFetchingAllowance}
                      refetchAllowance={refetchAllowance}
                    />
                  ) : (
                    <SupplyButton amount={amount} poolAddress={poolAddress} />
                  )
                ) : (
                  <Button isDisabled>Enter an amount</Button>
                )}
              </>
            ) : (
              <ConnectButton />
            )}
          </Center>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
