"use client";

import { useUserStore } from "@/store/user-store/userStore";
import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Image } from "@heroui/react";
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

export default function ShowTouristProfileData() {
  const { fetchUserDetails, profile } = useUserStore() as {
    fetchUserDetails: () => void;
    profile: Profile;
    isLoading: boolean;
    bookings: Booking[];
  };

  
  useEffect(() => {
    fetchUserDetails()
  }, [])

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
          <p className="text-md font-semibold">Your profie</p>
          <p className="text-small text-default-500">{profile.email}</p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <p>Hey, <span className="font-semibold text-sm text-gray-600">{profile.name}</span></p>
      </CardBody> 
      <Divider />
      <CardFooter className="flex flex-col">
        <div className="space-x-1">
         <Button size="sm" className="font-semibold">Update Name</Button>
         <Button size="sm" className="font-semibold">Update Email</Button>
         <Button size="sm" className="font-semibold">Update Password</Button>
        </div>
        <div className="mt-2">
            <Link href="/bookings"className="text-sm font-semibold text-blue-600 underline">Looking for booking details?</Link>
        </div>
      </CardFooter>
    </Card> 
    </div>
  
  )
}
