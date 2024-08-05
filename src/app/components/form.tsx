import { POOL } from "@/constants/contracts";
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
import { useEffect, useRef } from "react";
import { useAccount } from "wagmi";
import poolAbi from "@/constants/abi/pool.json";
import {
  useDisclosure,
  Button,
  Box,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Spacer,
  Center,
} from "@chakra-ui/react";
import lendingpoolAbi from "@/constants/abi/lendingPoolAddress.json";
import tokenAbi from "@/constants/abi/token.json";
import ConnectButton from "@/common/connect-button";
import { Field, Form, Formik } from "formik";
import { isAddress } from "viem";

export default function DepositForm({ poolAddress }: { poolAddress: string }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { address, isConnected, connector } = useAccount();
  const fhenixProvider = useRef<JsonRpcProvider | BrowserProvider>();
  const fhenixClient = useRef<FhenixClient>();

  useEffect(() => {
    if (connector) {
      connector.getProvider().then((provider) => {
        fhenixProvider.current = new BrowserProvider(
          provider as Eip1193Provider
        );
        fhenixClient.current = new FhenixClient({
          provider: fhenixProvider.current as any,
        });
      });
    }
  }, [connector]);

  async function deposit(values: number) {
    if (!fhenixClient.current || !fhenixProvider.current) return;
    let encrypted = await fhenixClient.current.encrypt_uint32(values);

    const signer = await fhenixProvider.current.getSigner();

    const contract = new ethers.Contract(POOL, poolAbi, signer);
    // @todo: Load proper types for the contract.
    const contractWithSigner = contract.connect(signer);
    //@ts-ignore
    const tx = await contractWithSigner.deposit(poolAddress, encrypted, 1n);
    console.log(tx);
    return await tx.wait();
  }

  function validateAmount(value: number) {
    let error;
    console.log(value);
    if (!value) {
      error = "Amount is required";
    } else if (value <= 0) {
      error = "Invalid amount";
    }
    return error;
  }

  return (
    <>
      <Button onClick={onOpen}>Supply</Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay zIndex={1} />
        <ModalContent zIndex={1}>
          <ModalHeader>Supply</ModalHeader>
          <ModalCloseButton />
          <ModalBody mb="10">
            <Formik
              initialValues={{ amount: "" }}
              onSubmit={(values, actions) => {
                deposit(+values.amount).finally(() => {
                  actions.setSubmitting(false);
                });
              }}
            >
              {(props) => (
                <Form>
                  <Field name="amount" validate={validateAmount}>
                    {({ field, form }: any) => (
                      <FormControl
                        mt="5"
                        isInvalid={form.errors.amount && form.touched.amount}
                      >
                        <FormLabel opacity="0.7">Amount</FormLabel>
                        <Input type="number" placeholder="0" {...field} />
                        <FormErrorMessage>
                          {form.errors.amount}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>

                  <Center
                    mt="4"
                    justifyContent="space-between"
                    fontSize="small"
                  >
                    <Box color="whiteAlpha.500">Supply APY</Box>
                    <Box>--</Box>
                  </Center>
                  <Center
                    mt="1"
                    justifyContent="space-between"
                    fontSize="small"
                  >
                    <Box color="whiteAlpha.500">Network fee</Box>
                    <Box>--</Box>
                  </Center>

                  <Center mt="5">
                    {isConnected ? (
                      <Button
                        // onClick={mint}
                        isLoading={props.isSubmitting}
                        loadingText="Confirming"
                        type="submit"
                      >
                        Supply
                      </Button>
                    ) : (
                      <ConnectButton />
                    )}
                  </Center>
                </Form>
              )}
            </Formik>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
