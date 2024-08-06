import { POOL, POOL_CORE, TOKEN_TEST } from "@/constants/contracts";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/modal";
import { BrowserProvider, ethers } from "ethers";
import { Eip1193Provider } from "ethers";
import { JsonRpcProvider } from "ethers";
import { FhenixClient } from "fhenixjs";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAccount, useBalance } from "wagmi";
import poolAbi from "@/constants/abi/pool.json";
import {
  useDisclosure,
  Button,
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Spacer,
  Center,
  Flex,
} from "@chakra-ui/react";
import ConnectButton from "@/common/connect-button";
import { Field, Form, Formik } from "formik";
import { fhenixChainId } from "@/config/web3modal";
import { useAllowance, useApprove } from "@/hooks/useApproval";
import { formatUnits } from "viem";
import { ApproveButton } from "@/common/approveBtn";
import { filterNumberInput } from "@/utils/helper";
import Image from "next/image";
import loading from "@/images/icons/loading.svg";
import { TextAutoEllipsis } from "@/common/common";

export default function DepositForm({ poolAddress }: { poolAddress: string }) {
  const [amount, setAmount] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { chainId, isConnected, connector, address } = useAccount();
  const fhenixProvider = useRef<JsonRpcProvider | BrowserProvider>();
  const fhenixClient = useRef<FhenixClient>();

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

  useEffect(() => {
    if (connector && chainId === fhenixChainId) {
      connector.getProvider().then((provider) => {
        fhenixProvider.current = new BrowserProvider(
          provider as Eip1193Provider
        );
        fhenixClient.current = new FhenixClient({
          provider: fhenixProvider.current as any,
        });
      });
    }
  }, [connector, chainId]);

  const allowance = isError
    ? undefined
    : formatUnits((data || 0) as bigint, 18); // TODO: need to fetch the token decimals
  const needToBeApproved = allowance !== undefined && +amount > +allowance;

  async function deposit() {
    if (!fhenixClient.current || !fhenixProvider.current) return;
    let encrypted = await fhenixClient.current.encrypt_uint32(+amount);

    const signer = await fhenixProvider.current.getSigner();

    const contract = new ethers.Contract(POOL, poolAbi, signer);
    // @todo: Load proper types for the contract.
    const contractWithSigner = contract.connect(signer);
    //@ts-ignore
    const tx = await contractWithSigner.deposit(poolAddress, encrypted, 1n);
    console.log(tx);
    return await tx.wait();
  }

  const handleChangeInput = useCallback(
    (event: any) => {
      const isValid = filterNumberInput(event, event.target.value, amount);

      if (!isValid) return;
      setAmount(event.target.value);
    },
    [amount]
  );

  return (
    <>
      <Button onClick={onOpen}>Supply</Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay zIndex={1} />
        <ModalContent zIndex={1}>
          <ModalHeader>Supply</ModalHeader>
          <ModalCloseButton />
          <ModalBody mb="10">
            <FormControl mt="5">
              <FormLabel opacity="0.7">Amount</FormLabel>
              <Input
                type="number"
                placeholder="0"
                onChange={handleChangeInput}
              />

              {address && (
                <Flex mt="3" fontSize="small" justify="flex-end">
                  <Flex
                    onClick={() => setAmount(balanceData?.formatted || "")}
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
                  {needToBeApproved ? (
                    <ApproveButton
                      amount={amount}
                      isFetchingAllowance={isFetchingAllowance}
                      refetchAllowance={refetchAllowance}
                    />
                  ) : (
                    <Button
                      onClick={deposit}
                      loadingText="Confirming"
                      type="submit"
                    >
                      Supply
                    </Button>
                  )}
                </>
              ) : (
                <ConnectButton />
              )}
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
