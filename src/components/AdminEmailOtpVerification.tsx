"use client"
import { Button, Form, InputOtp } from "@heroui/react";

export default function AdminEmailOtpVerification() {
  return (
    <Form className="flex justify-center items-center min-h-[90vh]">
      <div className="border py-12 px-6 rounded-lg shadow-xl">
        <div>
            <h2 className="text-center font-bold text-gray-600">Enter the OTP below</h2>
        </div>
        <InputOtp
          isRequired
          aria-label="OTP input field"
          length={6}
          name="otp"
          placeholder="Enter you email OTP"
          color="primary"
        />
        <div className="flex justify-center mt-6">
        <Button color="primary" className="font-bold"
        onPress={async() => {
          try {
            const res = await fetch("/api/authentication/admin/email-otp-verify", {
              method: "POST"
            })
            console.log(await res.json());
            
          } catch (error) {
            
          }
        }}>Submit</Button>
        </div>
      </div>
    </Form>
  );
}
