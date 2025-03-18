"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function ProcessBookingComp() {
  const bookingId = useParams().bookingId;
  console.log(bookingId);

  useEffect(() => {
    const getPaymentStatus = async () => {
      try {
        const res = await fetch("/api/checkout/status", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ bookingId }),
        });

        console.log(await res.json());
        
      } catch (error) {
        console.log(error);
      }
    };

    getPaymentStatus();
  }, []);

  return <div>ProcessBookingcomp</div>;
}
