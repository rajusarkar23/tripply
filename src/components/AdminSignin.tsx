"use client";

import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import Link from "next/link";
import { useState } from "react";

export default function AdminSignin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <Form className="max-w-md mx-auto w-full flex items-center justify-center min-h-[90vh]">
      <div className="border max-w-md mx-auto w-full px-6 py-10 rounded-lg shadow-xl space-y-10">
        <div className="pb-6">
          <h2 className="text-center text-2xl font-bold">Signin</h2>
          <p className="text-center font-semibold text-gray-600">
            Please signin to continue.
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
          label="Password"
          labelPlacement="outside"
          placeholder="Please enter a password"
          value={password}
          onValueChange={setPassword}
        />

        <Button type="submit" color="primary" className="w-full font-bold">
          Signin
        </Button>
        <p className="text-center font-semibold text-gray-600">
          Do not have account?
          <Link href={"/authentication/admin/signup"} className="text-blue-600">
             Signup
          </Link>
        </p>
      </div>
    </Form>
  );
}
