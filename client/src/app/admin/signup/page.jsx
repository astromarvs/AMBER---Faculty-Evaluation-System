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
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoadingAnimation from "../../components/LoadingAnimation";

const SignUp = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isVisible, setIsVisible] = useState(false);
  const [isVisible2, setIsVisible2] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { data: session, status } = useSession(); // Added status for loading state

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    position: "",
    role: "",
    userName: "",
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

  useEffect(() => {
    // If the user is logged in, redirect them to the dashboard
    if (session) {
      router.push("/admin/dashboard");
    }
  }, [session, router]);

  // If the user is logged in, do not render the sign-up form
  if (session) {
    return null; // Or a redirect to another page if preferred
  }

  if (status === "loading") {
    return <LoadingAnimation />;
  }

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.,])[A-Za-z\d@$!%*?&.,]{8,}$/;
    return regex.test(password);
  };

  const isEmptyField = () => {
    return Object.values(formData).some((val) => val.trim() === "");
  };

  const generateVerificationCode = () => {
    // Generate a random 6-digit number between 100000 and 999999
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleSubmit = async () => {
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

    let userNameResponse;

    try {
      userNameResponse = await fetch(
        "http://localhost:5000/api/admin/check-username",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userName: formData.userName }),
        }
      );
    } catch (err) {
      toast.error("Network error while checking username.");
      return;
    }

    if (userNameResponse.status === 409) {
      toast.error("Username already exists.");
      return;
    } else if (!userNameResponse.ok) {
      toast.error("Something went wrong while checking username.");
      return;
    } else {
      setIsLoading(true);
      try {
        // Generate verification code
        const verificationCode = generateVerificationCode();

        // Create updated form data
        const updatedFormData = { ...formData, verificationCode };
        setFormData(updatedFormData);

        // Send verification email
        const response = await fetch("http://localhost:5000/api/email/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: updatedFormData.email,
            subject: "Account Verification Code",
            text: `Hello ${updatedFormData.firstName},\n\nYour verification code is: ${verificationCode}`,
            html: `
            <p>Hello <strong>${updatedFormData.firstName}</strong>,</p>
            <p>Your verification code is: <strong>${verificationCode}</strong></p>
            <p>This code will expire in 10 minutes.</p>
          `,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to send verification email");
        }

        onOpen(); // Open modal if email sent successfully
      } catch (error) {
        toast.error("Failed to send verification email. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
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
                  name="userName"
                  value={formData.userName}
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
              isLoading={isLoading}
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
      <VerificationModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        formData={formData}
      />

      {/* Toast container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default SignUp;
