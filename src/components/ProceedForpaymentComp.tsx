"use client";

import {
    Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Image,
  Link,
} from "@heroui/react";
import { ArrowRight } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface TourDetails {
  amount: number;
  category: string;
  endingDate: string;
  startingDate: string;
  totalPerson: number;
  tourName: string;
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
        console.log(response);

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
              <span className="text-blue-600">{items.tourName}</span>
            </p>
          </CardBody>
          <Divider />
          <CardFooter className="flex flex-col items-start space-y-1    ">
            <p className="font-semibold">
              Booking start date-
              <span className="text-blue-600">{items.startingDate}</span>
            </p>
            <p className="font-semibold">
              Booking end date-
              <span className="text-blue-600">{items.endingDate}</span>
            </p>
            <p className="font-semibold">
              Total person-
              <span className="text-blue-600">{items.totalPerson}</span>
            </p>
            <p className="font-semibold">
              Booking category-
              <span className="text-blue-600">{items.category}</span>
            </p>
            <p className="font-semibold">
              Amount- <span className="text-blue-600"> {items.amount}</span>
            </p>

            <div className="w-full">
                <Button className="w-full font-bold" color="primary">Go for checkout <ArrowRight/></Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
