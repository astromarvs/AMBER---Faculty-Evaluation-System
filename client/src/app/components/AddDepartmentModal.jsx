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
import { toast, ToastContainer } from "react-toastify";


const AddDepartmentModal = ({ isOpen, onOpenChange, session }) => {
  const [deptCode, setDeptCode] = useState("");
  const [deptName, setDeptName] = useState("");

  const handleAddDepartment = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/department/add-department", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({ deptCode, deptName }),
      });

      console.log(session?.accessToken)
      const data = await res.json();
      if (res.ok) {
        toast.success("Department added successfully!");
        onOpenChange(false);
        setDeptCode("");
        setDeptName("");
      } else {
        toast.error(data.error || "Failed to add department.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    }
  };

  return (
    <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleAddDepartment}>
            <ModalHeader className="flex flex-col gap-1">Add Department</ModalHeader>
            <ModalBody>
              <Input
                label="Department Code"
                value={deptCode}
                onChange={(e) => setDeptCode(e.target.value)}
                variant="bordered"
              />
              <Input
                label="Department Name"
                value={deptName}
                onChange={(e) => setDeptName(e.target.value)}
                variant="bordered"
              />
            </ModalBody>
            <ModalFooter>
              <Button type="submit" color="primary">
                Add Department
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
      <ToastContainer position="top-right" autoClose={2000} />
    </Modal>
  );
};

export default AddDepartmentModal;
