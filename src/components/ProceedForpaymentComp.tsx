"use client";

import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Spinner,
} from "@heroui/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import CheckoutButton from "./CheckoutButton";

interface TourDetails {
  amount: number;
  category: string;
  endingDate: string;
  startingDate: string;
  totalPerson: number;
  tourName: string;
  touristEmail: string;
}

export default function ProccedForPaymentComp() {
  const orderId = useParams().orderId;

  // tour state
  const [tour, setTour] = useState<TourDetails[]>([]);

  // loading state
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getBookignDetails = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/booking?id=${orderId}`);
        const response = await res.json();
        if (response.success === true) {
          setTour(response.details);
          setLoading(false);
        } else {
          console.log(response);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    getBookignDetails();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[90vh]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className=" flex justify-center items-center min-h-[90vh]">
      {tour.map((items, index) => (
        <Card className="max-w-[600px]" key={index}>
          <CardHeader className="flex justify-center">
            <div>
              <h2 className="text-4xl font-semibold text-blue-600">
                Your order details.
              </h2>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <p className="font-bold">
              Booking for-
              <span className="text-blue-600 ml-1">{items.tourName}</span>
            </p>
          </CardBody>
          <Divider />
          <CardFooter className="flex flex-col items-start space-y-1    ">
            <p className="font-semibold">
              Booking start date-
              <span className="text-blue-600 ml-1">{items.startingDate}</span>
            </p>
            <p className="font-semibold">
              Booking end date-
              <span className="text-blue-600 ml-1">{items.endingDate}</span>
            </p>
            <p className="font-semibold">
              Total person-
              <span className="text-blue-600 ml-1">{items.totalPerson}</span>
            </p>
            <p className="font-semibold">
              Booking category-
              <span className="text-blue-600 ml-1">{items.category}</span>
            </p>
            <p className="font-semibold">
              Email Id-
              <span className="text-blue-600 ml-1">{items.touristEmail}</span>
            </p>
            <p className="font-semibold">
              Amount-{" "}
              <span className="text-blue-600 ml-1"> {items.amount}</span>
            </p>

            <div className="w-full">
              {orderId && (
                <CheckoutButton
                  email={items.touristEmail}
                  bookingId={orderId?.toString()}
                  price={items.amount.toString()}
                  product={items.tourName}
                />
              )}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
