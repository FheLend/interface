import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/modal";
import { useRef } from "react";
import SupplyForm from "./supplyForm";

export default function SupplyModal({
  poolAddress,
  apr,
  apy,
  onClose,
}: {
  poolAddress: `0x${string}`;
  apr: number;
  apy: number;
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
        <ModalHeader>Supply</ModalHeader>
        <ModalCloseButton />
        <ModalBody mb="10">
          <SupplyForm poolAddress={poolAddress} apr={apr} apy={apy} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
