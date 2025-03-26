"use client";

import useAdminTourStore from "@/store/tour-store/adminTourStore";
import {
  Button,
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
  bookingDate: string | null
}

export default function AdminFailedBookings() {
  const { bookings, fetchBookings } = useAdminTourStore() as {
    fetchBookings: () => void;
    bookings: Booking[];
  };

  const failedBookings = [];

  for (const booking of bookings) {
    if (!booking.isPaymentDone) {
      failedBookings.push({
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

  console.log(failedBookings);

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div>
      <div className="mt-10 mb-10">
        <h2 className="text-center text-3xl font-semibold text-blue-950 underline underline-offset-8">Failed bookings</h2>
      </div>
       <div className="flex justify-center">
      <div className="grid grid-cols-3 gap-2">
        {failedBookings.map((failedBooking, index) => (
          <div key={index}>
            <Card className="max-w-[400px]">
              <CardHeader className="flex gap-3">
                <div className="flex flex-col">
                  <p className="text-md">
                    <span className="text-blue-950 font-semibold">
                      Booking Id:
                    </span>{" "}
                    {failedBooking.id}
                  </p>
                  <p className="text-md">
                    <span className="text-blue-950 font-semibold">Tour:</span>{" "}
                    {failedBooking.bookingFor}
                  </p>
                  <p className="text-small text-green-950">Initiated by:</p>
                  <p className="text-sm">
                    <span className="text-blue-950 font-semibold">Name:</span>
                    {failedBooking.bookingBy}
                  </p>
                  <p className="text-small">
                    <span className="text-blue-950 font-semibold">Email:</span>
                    {failedBooking.bookingByPersonEmail}
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
                  {failedBooking.bookingStartingDate}
                </p>
                <p className="text-blue-950">
                  <span className="text-small text-default-500">
                    Ending Date:{" "}
                  </span>
                  {failedBooking.bookingEndingDate}
                </p>
                <p className="text-blue-950">
                  <span className="text-small text-default-500">
                    Person count:{" "}
                  </span>
                  {failedBooking.totalPersonCount}
                </p>
                <p className="text-blue-950">
                  <span className="text-small text-default-500">Amount: </span>
                  {failedBooking.bookingCost}
                </p>
                {
                    !failedBooking.isPaymentDone && (<Chip color="warning" className="mt-1"><span className="font-semibold">Payment not done</span></Chip>)
                }
              </CardBody>
              <Divider />
              <CardFooter className="flex justify-between px-4">
                <div><Chip color="secondary">Mail not sent</Chip></div>
                <div className="space-x-2">
                  <Button color="danger" size="sm">Delete</Button>
                  <Button color="success" size="sm" className="font-semibold">
                    Send mail
                  </Button>
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
