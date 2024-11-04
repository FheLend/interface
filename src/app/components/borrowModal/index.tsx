import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/modal";
import { useRef } from "react";
import BorrowForm from "./borrowForm";

export default function BorrowModal({
  poolAddress,
  availableLiquidity,
  onClose,
}: {
  poolAddress: `0x${string}`;
  availableLiquidity?: number;
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
        <ModalHeader>Borrow</ModalHeader>
        <ModalCloseButton />
        <ModalBody mb="10">
          <BorrowForm
            poolAddress={poolAddress}
            availableLiquidity={availableLiquidity}
            allowSelect={false}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
