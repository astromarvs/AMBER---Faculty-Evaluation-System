"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Divider,
  Button,
  Link,
} from "@heroui/react";
import { Eye, EyeOff } from "lucide-react";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import LoadingAnimation from "../../components/LoadingAnimation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const { data: session, status } = useSession();

  useEffect(() => {
    // If the user is logged in, redirect them to the dashboard
    if (session) {
      router.push("/admin/dashboard");
    }
  }, [session, router]);

  if (status === "loading") {
    return <LoadingAnimation />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await signIn("credentials", {
      redirect: false,
      userName: username,
      password,
    });

    setLoading(false);

    if (result?.error) {
      toast.error("Invalid credentials!");
    } else {
      router.push("/admin/dashboard");
    }
  };

  return (
    <div className="w-full h-screen flex bg-cover bg-center">
      <ToastContainer position="top-right" autoClose={2000} />
      {/* Left-side design panel */}
      <div className="hidden md:flex w-3/4 items-center justify-center bg-black/50 text-white p-10">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">
            Welcome to AMBER Faculty Evaluation System
          </h2>
          <p className="text-lg">Login</p>
        </div>
      </div>

      {/* Right-side form card */}
      <div className="flex w-full md:w-1/2 items-center justify-center my-auto p-6">
        <Card className="w-full max-w-xl p-6 backdrop-blur-sm shadow-lg bg-white/90">
          <CardHeader className="text-xl font-semibold">Login</CardHeader>
          <Divider />
          <CardBody className="space-y-6">
            {/* Login Information */}
            <section>
              <h5 className="text-medium font-medium text-gray-600 mb-2">
                Login Information
              </h5>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-4">
                  <Input
                    label="User Name"
                    variant="bordered"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  <Input
                    label="Password"
                    type={isVisible ? "text" : "password"}
                    variant="bordered"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
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
                </div>
              </form>
            </section>
          </CardBody>

          <CardFooter className="flex flex-col items-center gap-3">
            <Button
              className="w-8/12 bg-blue-500 text-white"
              variant="solid"
              onClick={handleSubmit}
              isLoading={loading}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Login"}
            </Button>
            <p className="text-lg font-medium text-center">
              Doesn't have an account?{" "}
              <Link href="/admin/signup" color="foreground" underline="always">
                Create Account
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
