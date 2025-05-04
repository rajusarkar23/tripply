"use client";

import useAdminTourStore from "@/store/tour-store/adminTourStore";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Divider,
} from "@heroui/react";
import { useEffect } from "react";

interface Booking {
  id: number | null;
  bookingFor: string | null;
  bookingBy: string | null;
  bookingByPersonEmail: string | null;
  bookingCategory: string | null;
  bookingStartingDate: string | null;
  bookingEndingDate: string | null;
  totalPersonCount: string | null;
  bookingCost: number | null;
  isPaymentDone: boolean | null;
}

export default function AdminSuccessBookings() {
  const { bookings, fetchBookings } = useAdminTourStore() as {
    fetchBookings: () => void;
    bookings: Booking[];
  };

  const successBookings = [];

  for (const booking of bookings) {
    if (booking.isPaymentDone) {
        successBookings.push({
        id: booking.id,
        bookingFor: booking.bookingFor,
        bookingBy: booking.bookingBy,
        bookingByPersonEmail: booking.bookingByPersonEmail,
        bookingCategory: booking.bookingCategory,
        bookingStartingDate: booking.bookingStartingDate,
        bookingEndingDate: booking.bookingEndingDate,
        totalPersonCount: booking.totalPersonCount,
        bookingCost: booking.bookingCost,
        isPaymentDone: booking.isPaymentDone,
      });
    }
  }

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="bg-gray-200/70">
      <div className="mb-8">
        <h2 className="text-center text-3xl font-semibold text-green-950 bg-yellow-400">Successful Bookings</h2>
      </div>
       <div className="flex justify-center">
      <div className="grid grid-cols-3 gap-2">
        {successBookings.map((successBooking, index) => (
          <div key={index}>
            <Card className="max-w-[400px] shadow-none border">
              <CardHeader className="flex gap-3">
                <div className="flex flex-col">
                  <p className="text-md">
                    <span className="text-blue-950 font-semibold">
                      Booking Id:
                    </span>{" "}
                    {successBooking.id}
                  </p>
                  <p className="text-md">
                    <span className="text-blue-950 font-semibold">Tour:</span>{" "}
                    {successBooking.bookingFor}
                  </p>
                  <p className="text-small text-green-950">Booked by:</p>
                  <p className="text-sm">
                    <span className="text-blue-950 font-semibold">Name:</span>
                    {successBooking.bookingBy}
                  </p>
                  <p className="text-small">
                    <span className="text-blue-950 font-semibold">Email:</span>
                    {successBooking.bookingByPersonEmail}
                  </p>
                </div>
              </CardHeader>
              <Divider />
              <CardBody>
                <p className="font-semibold">Booking details</p>
                <p className="text-blue-950">
                  <span className="text-small text-default-500">
                    Starting Date:{" "}
                  </span>
                  {successBooking.bookingStartingDate}
                </p>
                <p className="text-blue-950">
                  <span className="text-small text-default-500">
                    Ending Date:{" "}
                  </span>
                  {successBooking.bookingEndingDate}
                </p>
                <p className="text-blue-950">
                  <span className="text-small text-default-500">
                    Person count:{" "}
                  </span>
                  {successBooking.totalPersonCount}
                </p>
                <p className="text-blue-950">
                  <span className="text-small text-default-500">Amount: </span>
                  {successBooking.bookingCost}
                </p>
                {
                    successBooking.isPaymentDone && (<Chip color="success" className="mt-1"><span className="font-semibold">Payment done</span></Chip>)
                }
              </CardBody>
              <Divider />
              <CardFooter className="flex justify-between px-4">
               <div className="space-x-1">
                <Chip color="secondary">Mail not sent</Chip>
                <Chip color="warning">Archive</Chip>
                <Chip color="success">Send mail</Chip>
               </div>
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>
    </div>
    </div>
   
  );
}
