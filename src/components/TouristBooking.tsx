"use client";

import { useUserStore } from "@/store/user-store/userStore";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Image,
} from "@heroui/react";
import Link from "next/link";
import { useEffect } from "react";

interface Profile {
  name: string;
  email: string;
}

interface Booking {
  tourName: string | null;
  tourImageUrl: string | null;
  startingDate: string | null;
  endingDate: string | null;
  paid: number | null;
}

export default function TouristBooking() {
  const { fetchUserDetails, bookings, profile } = useUserStore() as {
    fetchUserDetails: () => void;
    bookings: Booking[];
    profile: Profile;
  };

  useEffect(() => {
    fetchUserDetails();
    
  }, []);

  if (typeof profile === "undefined") {
    return
  }
  

  return (
    <div className="flex justify-center items-center min-h-[90vh]">
      <Card className="max-w-[400px]">
        <CardHeader className="flex gap-3">
          <Image
            alt="heroui logo"
            height={40}
            radius="sm"
            src="https://pub-367a5b1b28f9415dae5b51f69d042dff.r2.dev/145857007_307ce493-b254-4b2d-8ba4-d12c080d6651.svg"
            width={40}
          />
          <div className="flex flex-col">
            <p className="text-md font-semibold">Your Bookings</p>
            <p>{profile.email}</p>
           
          </div>
        </CardHeader>
        <Divider />
        <CardBody className="space-y-1">
          {bookings.map((booking, index) => (
            <div
              key={index}
              className="hover:bg-gray-200 p-2 rounded transition-all duration-150 border hover:shadow-lg"
            >
              <p className="font-bold text-blue-600">{booking.tourName}</p>
              <p>
                Start:{" "}
                <span className="font-semibold text-sm text-green-600">
                  {booking.startingDate}
                </span>
              </p>
              <p>
                End:{" "}
                <span className="font-semibold text-sm text-green-600">
                  {booking.endingDate}
                </span>
              </p>
              <p>
                Paid:{" "}
                <span className="font-semibold text-sm text-green-600">
                  {booking.paid}
                </span>
              </p>
            </div>
          ))}
        </CardBody>
        <Divider />
        <CardFooter className="flex flex-col">
          <div className="space-x-1">
            <Button size="sm" className="font-semibold">
              Update Name
            </Button>
            <Button size="sm" className="font-semibold">
              Update Email
            </Button>
            <Button size="sm" className="font-semibold">
              Update Password
            </Button>
          </div>
          <div className="mt-2">
            <Link
              href="/profile"
              className="text-sm font-semibold text-blue-600 underline"
            >
              Looking for profile details?
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
