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
import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const VerificationModal = ({ isOpen, onOpenChange, formData }) => {
  const [enteredCode, setEnteredCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleVerify = async () => {
    if (!enteredCode) {
      toast.error("Please enter the verification code");
      return;
    }

    if (enteredCode !== formData.verificationCode) {
      toast.error("Incorrect verification code!");
      return;
    }

    if (!/^\d{6}$/.test(enteredCode)) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    console.log(formData);

    setIsLoading(true);
    try {
      // Register admin with verification code
      const response = await fetch(
        "http://localhost:5000/api/admin/register-admin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }
      onOpenChange(false);

      toast.success("Account created successfully! Redirecting to Login page...");
      setTimeout(() => {
        router.push("/admin/login");
      }, 2000);
    } catch (error) {
      toast.error(error.message || "Failed to register. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
            <p className="mb-4">
              We've sent a verification code to {formData.email}
            </p>
            <Input
              type="number"
              variant="bordered"
              label="Verification Code"
              value={enteredCode}
              onChange={(e) => setEnteredCode(e.target.value)}
              placeholder="Enter 6-digit code"
              maxLength={6}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={handleVerify}
              isLoading={isLoading}
            >
              Verify
            </Button>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
};

export default VerificationModal;
