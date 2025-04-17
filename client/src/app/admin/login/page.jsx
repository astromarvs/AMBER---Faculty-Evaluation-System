"use client";

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

const Login = () => {
  return (
    <div className="w-full h-screen flex bg-cover bg-center">
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
              <div className="grid grid-cols-1 gap-4">
                <Input label="User Name" variant="bordered" />
                <Input label="Password" type="password" variant="bordered" />
              </div>
            </section>
          </CardBody>

          <CardFooter className="flex flex-col items-center gap-3">
            <Button className="w-8/12 bg-blue-500 text-white" variant="solid">
              Login
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
