"use client";

import { useUserStore } from "@/store/user-store/userStore";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Image,
} from "@heroui/react";
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
    return;
  }

  return (
    <div>
      <div className="flex justify-center py-4">
        <h2 className="text-3xl font-semibold">Bookigns by:</h2>
        <p className="text-3xl font-bold text-gray-600">{profile.name}</p>
      </div>
    
    <div className="flex justify-center">
      <div className="grid grid-cols-3 gap-2 py-2 max-w-[1400px]">
        {bookings.map((booking, index) => (
          <Card className="p-6 flex justify-center" key={index}>
            <CardHeader className="flex gap-3">
              <Image
                alt="tour_image"
                height={40}
                radius="sm"
                src={booking.tourImageUrl!}
                width={80}
              />
              <div className="flex flex-col">
                <p className="text-lg font-semibold">{booking.tourName}</p>
                <p className="text-small text-default-500">Booked by: {profile.name}</p>
              </div>
            </CardHeader>
            <Divider />
            <CardBody>
              <p className="text-default-500">
                Starting date: <span className="font-semibold">{booking.startingDate}</span>
              </p>
              <p className="text-default-500">
                Ending date: <span className="font-semibold">{booking.endingDate}</span>
              </p>
            </CardBody>
            <Divider />
            <CardFooter>
              <p className="text-xl font-bold text-blue-600">Paid: {booking.paid}</p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
    </div>

  );
}
