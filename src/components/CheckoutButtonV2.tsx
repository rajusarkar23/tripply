"use client";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CheckoutButtonV2({
  bookingFor,
  totalPrice,
  name,
  email,
  touristCount,
  bookingStart,
  bookingEnd,
  category,
  placeName,
  isConsentprovided
}: {
  bookingFor: number;
  totalPrice: number;
  name: string;
  email: string;
  touristCount: number;
  bookingStart: string;
  bookingEnd: string;
  category: string;
  placeName: string;
  isConsentprovided: boolean
}) {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handlePayment = async () => {
    try {
      setLoading(true);
      // first create an order
      const sendReq = await fetch("/api/bookingV2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingFor,
          totalPrice,
          name,
          email,
          touristCount,
          bookingStart,
          bookingEnd,
          category,
        }),
      });
      const res = await sendReq.json();
      if (res.success) {
        // go for payment
        try {
          const sendReq = await fetch("/api/checkout/process-payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              price: totalPrice,
              product: placeName,
              email,
              bookingId: res.orderId,
              successUrl: `${window.location.origin}/process-booking/${res.orderId}`,
              cancelUrl: `${window.location.origin}/cancel/${res.orderId}`,
            }),
          });

          const response = await sendReq.json();
          if (response.url) {
            router.push(response.url);
          } else {
            console.log("Failed to create session", response);
            setLoading(false);
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        console.log(res);
        setLoading(false);
      }
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
          color="primary"
          className="font-semibold"
          isDisabled={!isConsentprovided}
        >
          Go for booking
        </Button>
      )}
    </div>
  );
}
