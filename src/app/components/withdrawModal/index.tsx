import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/modal";
import { useCallback, useRef, useState } from "react";
import { useAccount, useBalance, useChainId } from "wagmi";
import {
  Button,
  Box,
  FormControl,
  FormLabel,
  Input,
  Center,
  Flex,
} from "@chakra-ui/react";
import { formatUnits, parseUnits } from "viem";
import { filterNumberInput } from "@/utils/helper";
import Image from "next/image";
import loading from "@/images/icons/loading.svg";
import { TextAutoEllipsis } from "@/common/common";
import { WithdrawButton } from "./withdrawBtn";

export default function WithdrawModal({
  poolAddress,
  aTokenAddress,
  onClose,
}: {
  poolAddress: `0x${string}`;
  aTokenAddress: `0x${string}`;
  onClose: () => void;
}) {
  const chainId = useChainId();
  const initialRef = useRef(null);
  const [amount, setAmount] = useState("");
  const { isConnected, address } = useAccount();

  const {
    data: balanceData,
    isFetching: isFetchingBalance,
    refetch: refetchBalance,
  } = useBalance({ address, token: aTokenAddress });
  console.log(balanceData);

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
        <ModalHeader>Withdraw</ModalHeader>
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
                    setAmount(balanceData?.formatted || "");
                  }}
                  cursor="pointer"
                >
                  <Box opacity="0.7">Deposited: </Box>
                  <Flex fontWeight="semibold" ml="1">
                    {isFetchingBalance ? (
                      <Image src={loading} alt="loading-icon" />
                    ) : (
                      <TextAutoEllipsis ml="1">
                        {balanceData?.formatted}
                      </TextAutoEllipsis>
                    )}
                    <Box ml="1">{balanceData?.symbol}</Box>
                  </Flex>
                </Flex>
              </Flex>
            )}
          </FormControl>

          <Center mt="5" flexDir="column">
            {+amount > 0 ? (
              <WithdrawButton
                amount={parseUnits(
                  amount,
                  balanceData?.decimals || 18
                ).toString()}
                aTokenAddress={aTokenAddress}
                refetchBalance={refetchBalance}
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
