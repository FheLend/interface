import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/modal";
import { useRef } from "react";
import WithdrawForm from "./withdrawForm";

export default function WithdrawModal({
  aTokenAddress,
  onClose,
}: {
  aTokenAddress: `0x${string}`;
  onClose: () => void;
}) {
  const initialRef = useRef(null);

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
          <WithdrawForm aTokenAddress={aTokenAddress} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
