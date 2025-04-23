"use client";

import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Spinner } from "@heroui/spinner";
import { Globe, OctagonX } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import UserGoogleAuth from "./UserGoogleAuthComp";
import { Divider } from "@heroui/react";

export default function UserSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const errors: string[] = [];

  const router = useRouter();

  // Password validation
  if (password.length < 6) {
    errors.push("Password must be 6 character or more.");
  }
  if ((password.match(/[A-Z]/g) || []).length < 1) {
    errors.push("Password must include atleast one uppercase letter.");
  }
  if ((password.match(/[\W_]/) || []).length < 1) {
    errors.push("Password must include atleast one special character.");
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = {
      email,
      password,
    };

    try {
      setIsLoading(true);
      setIsError(false);
      const res = await fetch("/api/authentication/user-signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data }),
      });
      const response = await res.json();

      if (response.success) {
        router.push("/authentication/email-otp-verification");
      } else {
        setIsLoading(false);
        setIsError(true);
        setErrorMessage(response.message);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setIsError(true);
      setErrorMessage("Something went wrong, try again..");
    }
  };

  return (
    <Form
      className="max-w-md mx-auto w-full flex items-center justify-center min-h-[90vh] px-4"
      onSubmit={onSubmit}
    >
      <div className="border rounded-md p-8 shadow-lg w-full">
        <div>
          <div className="flex flex-col justify-center text-center">
            <h2 className="text-2xl font-semibold flex justify-center items-center text-blue-600">
              <Globe />
              Tripply - Signup
            </h2>
            <p className="text-sm font-semibold">
              Please create your account to continue.
            </p>
          </div>
          <Divider />
          <div className="py-1 text-center">
            <p className="text-xs">Continue with email and password</p>
          </div>
          <div className="flex justify-center">
            {isError && (
              <p className="font-bold text-sm text-red-600 flex items-center">
                <OctagonX size={16} className="mr-1" />
                {errorMessage}
              </p>
            )}
          </div>
        </div>

        <Input
          isRequired
          errorMessage="Please enter a valid email"
          label="Email"
          labelPlacement="outside"
          name="email"
          placeholder="Enter your email"
          type="email"
          value={email}
          onValueChange={setEmail}
          className="py-2"
        />
        <Input
          errorMessage={() => (
            <ul>
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          )}
          isRequired
          isInvalid={errors.length > 0}
          label="Password"
          labelPlacement="outside"
          placeholder="Please enter a password"
          type="password"
          value={password}
          onValueChange={setPassword}
        />

        {isLoading ? (
          <Button isDisabled className="w-full">
            <Spinner />
          </Button>
        ) : (
          <Button
            type="submit"
            color="primary"
            className="w-full font-bold mt-2"
          >
            Signup
          </Button>
        )}
        <div className="text-center mt-2">
          <p className="text-sm font-semibold">OR</p>
          <UserGoogleAuth />
        </div>
        <p className="text-xs font-semibold text-center">
          Already have account?
          <Link
            href={"/authentication/signin"}
            className="text-blue-600 ml-1 underline underline-offset-4 font-semibold"
          >
            Signin
          </Link>
        </p>
      </div>
    </Form>
  );
}
