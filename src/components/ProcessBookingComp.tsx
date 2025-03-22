"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, BadgeX, CheckCircle } from "lucide-react";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";

export default function ProcessBookingComp() {
  const bookingId = useParams().bookingId;
  const [isBookingSuccess, setIsBookingSuccess] =  useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  useEffect(() => {
    const getPaymentStatus = async () => {
      setIsLoading(true)
      try {
        const res = await fetch("/api/checkout/status", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ bookingId }),
        });
        const response = await res.json()
        if (response.success === true) {
          setIsBookingSuccess(true)
          setIsLoading(false)
        } else{
          console.log(response);
          setIsLoading(false)
        }
      } catch (error) {
        console.log(error);
        setIsLoading(false)
      }
    };

    getPaymentStatus();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[90vh]">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center px-6">
      {
        isBookingSuccess ? (
          <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-xl p-10 max-w-md w-full"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.2,
            type: "spring",
            stiffness: 200,
            damping: 10,
          }}
          className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="w-12 h-12 text-green-500" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-3xl font-bold text-center text-gray-800 mb-4"
        >
          Payment Successful!
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-gray-600 mb-8"
        >
          Thank you for the bookign. Eager to serve you.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex justify-center"
        >
          <Button className="w-full font-bold" color="primary" onPress={() => router.push("/bookings")}>
            Go to bookings <ArrowRight size={20} />
          </Button>
        </motion.div>
      </motion.div>
        ) : (<motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-xl p-10 max-w-md w-full"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.2,
              type: "spring",
              stiffness: 200,
              damping: 10,
            }}
            className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6"
          >
            <BadgeX className="w-12 h-12 text-red-600" />
          </motion.div>
  
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-bold text-center text-red-600 mb-4"
          >
            Payment unsuccessful!
          </motion.h2>
  
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center text-gray-600 mb-8"
          >
            Sorry, something went wrong
          </motion.p>
  
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex justify-center"
          >
            <Button className="w-full font-bold" color="primary" onPress={() => router.push("/push")}>
              Go to bookings <ArrowRight size={20} />
            </Button>
          </motion.div>
        </motion.div>)
      }
    </div>
  );
}
