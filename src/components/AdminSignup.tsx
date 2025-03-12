"use client";

import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function AdminSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const errors: string[] = [];

  const router = useRouter()

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
    e.preventDefault()

    const data = {
      email,
      password
    }

    try {
      const res = await fetch("/api/authentication/admin/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({data})
      })
      const response = await res.json()

      if (response.success) {
        router.push("/authentication/admin/email-otp-verification")
      }
    } catch (error) {
      console.log(error);
      
    }
  }

  return (
    <Form className="max-w-md mx-auto w-full flex items-center justify-center min-h-[90vh]" onSubmit={onSubmit}>
      <div className="border max-w-md mx-auto w-full px-6 py-10 rounded-lg shadow-xl space-y-10">
        <div className="pb-6">
          <h2 className="text-center text-2xl font-bold">Signup</h2>
          <p className="text-center font-semibold text-gray-600">
            Please create your account below.
          </p>
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
        />
        <Input
          errorMessage={() => (
            <ul>
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          )}
          isInvalid={errors.length > 0}
          label="Password"
          labelPlacement="outside"
          placeholder="Please enter a password"
          type="password"
          value={password}
          onValueChange={setPassword}
        />

        <Button type="submit" color="primary" className="w-full font-bold">
          Signup
        </Button>
        <p className="text-center font-semibold text-gray-600">
          Have account?{" "}
          <Link href={"/authentication/admin/signin"} className="text-blue-600">
            Signin
          </Link>
        </p>
      </div>
    </Form>
  );
}
