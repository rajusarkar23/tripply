"use client";

import { useUserStore } from "@/store/user-store/userStore";
import { useEffect } from "react";

interface Profile {
  name: string;
  email: string;
}

interface Booking {
  tournName: string | null;
  tourImageUrl: string | null;
  startingDate: string | null;
  endingDate: string | null;
  paid: number | null;
}

export default function TouristProfile() {
  const { fetchUserDetails, bookings, profile, isLoading } = useUserStore() as {
    fetchUserDetails: () => void;
    bookings: Booking[];
    profile: Profile[];
    isLoading: boolean
  };

  useEffect(() => {
   fetchUserDetails()
  }, []);
  return (
    <div>
      <h1>User</h1>
    </div>
  );
}
