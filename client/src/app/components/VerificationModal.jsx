"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@heroui/react";

const VerificationModal = ({ isOpen, onOpenChange }) => {
  return (
    <Modal
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        <>
          <ModalHeader className="flex flex-col gap-1">
            Verification Required
          </ModalHeader>
          <ModalBody>
            <Input
              type="number"
              variant="bordered"
              label="Verification Code"
            ></Input>
          </ModalBody>
          <ModalFooter>
            <Button color="primary">Verify</Button>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
};

export default VerificationModal;
