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
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          price,
          product,
          email,
          bookingId,
          successUrl: `${window.location.origin}/process-order`,
          cancelUrl: `${window.location.origin}/cancel`,
        }),
      });

      const data = await res.json();

      console.log(data);

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.log("Failed to create session", data);
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
