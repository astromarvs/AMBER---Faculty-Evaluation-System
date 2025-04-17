"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Divider,
  Button,
  Link,
  useDisclosure,
} from "@heroui/react";
import { Eye, EyeOff } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VerificationModal from "../../components/VerificationModal";

const SignUp = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isVisible, setIsVisible] = useState(false);
  const [isVisible2, setIsVisible2] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    position: "",
    role: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleVisibility2 = () => setIsVisible2(!isVisible2);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.,])[A-Za-z\d@$!%*?&.,]{8,}$/;
    return regex.test(password);
  };

  const isEmptyField = () => {
    return Object.values(formData).some((val) => val.trim() === "");
  };

  const handleSubmit = () => {
    if (isEmptyField()) {
      toast.error("All fields must be filled out.");
      return;
    }

    if (!validatePassword(formData.password)) {
      toast.error(
        "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character."
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    onOpen(); // Open modal if all checks pass
  };

  return (
    <div className="w-full h-screen flex bg-cover bg-center">
      {/* Left-side design panel */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-black/50 text-white p-10">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">
            Welcome to AMBER Faculty Evaluation System
          </h2>
          <p className="text-lg">Create your account today!</p>
        </div>
      </div>

      {/* Right-side form card */}
      <div className="flex w-full md:w-1/2 items-center justify-center my-auto p-6">
        <Card className="w-full max-w-xl p-6 backdrop-blur-sm bg-white/90">
          <CardHeader className="text-xl font-semibold">
            Create Account
          </CardHeader>
          <Divider />
          <CardBody className="space-y-6">
            {/* Personal Information */}
            <section>
              <h5 className="text-medium font-medium text-gray-600 mb-2">
                Personal Information
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  variant="bordered"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                <Input
                  label="Last Name"
                  variant="bordered"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Input
                  label="Email"
                  variant="bordered"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                <Input
                  label="Phone Number"
                  variant="bordered"
                  name="phone"
                  type="number"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Input
                  label="Position"
                  variant="bordered"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                />
                <Input
                  label="Role"
                  variant="bordered"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                />
              </div>
            </section>

            <Divider />

            {/* Login Information */}
            <section>
              <h5 className="text-medium font-medium text-gray-600 mb-2">
                Login Information
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="User Name"
                  variant="bordered"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                />
                <Input
                  label="Password"
                  type={isVisible ? "text" : "password"}
                  variant="bordered"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  endContent={
                    <button
                      aria-label="toggle password visibility"
                      className="focus:outline-none"
                      type="button"
                      onClick={toggleVisibility}
                    >
                      {isVisible ? (
                        <EyeOff className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <Eye className="text-2xl text-default-400 pointer-events-none" />
                      )}
                    </button>
                  }
                />
                <Input
                  label="Confirm Password"
                  type={isVisible2 ? "text" : "password"}
                  variant="bordered"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  endContent={
                    <button
                      aria-label="toggle password visibility"
                      className="focus:outline-none"
                      type="button"
                      onClick={toggleVisibility2}
                    >
                      {isVisible2 ? (
                        <EyeOff className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <Eye className="text-2xl text-default-400 pointer-events-none" />
                      )}
                    </button>
                  }
                />
              </div>
            </section>
          </CardBody>

          <CardFooter className="flex flex-col items-center gap-3">
            <Button
              className="w-8/12 bg-blue-500 text-white"
              variant="solid"
              onClick={handleSubmit}
            >
              Create Account
            </Button>
            <p className="text-lg font-medium text-center">
              Already have an account?{" "}
              <Link href="/admin/login" color="foreground" underline="always">
                Login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>

      {/* Modal */}
      <VerificationModal isOpen={isOpen} onOpenChange={onOpenChange} />

      {/* Toast container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default SignUp;
