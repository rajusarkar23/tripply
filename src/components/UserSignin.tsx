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

export default function UserSignin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = {
      email,
      password,
    };

    try {
      setIsLoading(true);
      setIsError(false);
      const res = await fetch("/api/authentication/user-signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data }),
      });
      const response = await res.json();

      if (response.success) {
        router.push("/");
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
      <div className="border w-full rounded-md p-8 shadow-lg">
        <div>
          <div className="flex flex-col justify-center text-center">
            <h2 className="text-2xl font-semibold flex justify-center items-center text-blue-600"><Globe />Tripply - Signin</h2>
            <p className="text-xs font-semibold">Please signin to continue.</p>
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
          isRequired
          label="Password"
          type="password"
          labelPlacement="outside"
          placeholder="Please enter a password"
          value={password}
          onValueChange={setPassword}
        />
        <div className="py-2">
          {isLoading ? (
            <Button isDisabled className="w-full">
              <Spinner />
            </Button>
          ) : (
            <Button type="submit" color="primary" className="w-full font-bold mt-2">
              Signin
            </Button>
          )}
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold">OR</p>
          <UserGoogleAuth />
        </div>
        <p className="text-xs font-semibold text-center">
          Do not have account?
          <Link
            href={"/authentication/signup"}
            className="text-blue-600 ml-1 underline underline-offset-4 font-semibold"
          >
            Signup
          </Link>
        </p>
      </div>
    </Form>
  );
}
