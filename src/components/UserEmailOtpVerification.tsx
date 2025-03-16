"use client";
import { Button, Form, InputOtp, Spinner } from "@heroui/react";
import { OctagonX } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UserEmailOtpVerification() {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

  const handleClick = async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      const res = await fetch("/api/authentication/email-otp-verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp }),
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
      setIsLoading(false)
      setIsError(true)
      setErrorMessage("Something went wrong, try again..")
    }
  };

  return (
    <Form className="flex justify-center items-center min-h-[90vh]">
      <div className="border py-12 px-6 rounded-lg shadow-xl">
        <div>
          <h2 className="text-center font-bold text-gray-600">
            Enter the OTP below
          </h2>
          <div className="flex justify-center">
            {isError && (
              <p className="font-bold text-red-600 flex items-center">
                <OctagonX size={20} className="mr-1" />
                {errorMessage}
              </p>
            )}
          </div>
        </div>
        <InputOtp
          isRequired
          aria-label="OTP input field"
          length={6}
          name="otp"
          placeholder="Enter you email OTP"
          color="primary"
          value={otp}
          onValueChange={setOtp}
        />
        <div className="flex justify-center mt-6">
         {
          isLoading ? (<Button><Spinner /></Button>) : ( <Button
            type="button"
            color="primary"
            className="font-bold"
            onPress={handleClick}
          >
            Submit
          </Button>)
         }
        </div>
      </div>
    </Form>
  );
}
