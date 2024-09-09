import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/modal";
import { useRef } from "react";
import RepayForm from "./repayForm";

export default function RepayModal({
  poolAddress,
  onClose,
}: {
  poolAddress: `0x${string}`;
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
        <ModalHeader>Repay</ModalHeader>
        <ModalCloseButton />
        <ModalBody mb="10">
          <RepayForm poolAddress={poolAddress} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
