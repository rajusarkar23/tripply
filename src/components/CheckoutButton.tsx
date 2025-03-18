"use client";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { MoveRight } from "lucide-react";
import { useState } from "react";

export default function CheckoutButton({
  product,
  price,
  bookingId,
  email,
}: {
  product: string;
  price: string;
  bookingId: string;
  email: string;
}) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/checkout/process-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          price,
          product,
          email,
          bookingId,
          successUrl: `${window.location.origin}/process-booking/${bookingId}`,
          cancelUrl: `${window.location.origin}/cancel/${bookingId}`,
        }),
      });

      const response = await res.json();

      console.log(response);

      if (response.url) {
        window.location.href = response.url;
      } else {
        console.log("Failed to create session", response);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {loading ? (
        <Button isDisabled className="w-full">
          <Spinner />
        </Button>
      ) : (
        <Button
          onPress={handlePayment}
          className="w-full font-semibold text-xl border border-green-300 shadow shadow-white/20"
          color="primary"
        >
          Go for checkout <MoveRight />
        </Button>
      )}
    </div>
  );
}
