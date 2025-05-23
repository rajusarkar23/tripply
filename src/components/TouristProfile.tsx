"use client";

import { useUserStore } from "@/store/user-store/userStore";
import { Avatar, Button, Divider, Skeleton } from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, ChevronDown, LogIn } from "lucide-react";
import Link from "next/link";

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

export default function TouristProfile() {

  const { fetchUserDetails, profile, isUserLogedIn, isLoading } =
    useUserStore() as {
      fetchUserDetails: () => void;
      bookings: Booking[];
      profile: Profile;
      isLoading: boolean;
      isUserLogedIn: boolean;
    };

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isUserLogedIn) {
      fetchUserDetails();
    }

    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (isLoading && !isUserLogedIn) {
    return (
      <div className="max-w-[300px] w-full flex items-center gap-3">
        <div>
          <Skeleton className="flex rounded-full w-12 h-12" />
        </div>
      </div>
    );
  }

  if (!isUserLogedIn) {
    return (
      <div>
        <Link
        className="rounded-full bg-blue-600 items-center justify-center font-bold p-2 px-6 text-sm text-white flex"
        href={"/authentication/signin"}>
          Signin <LogIn size={20}/>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="light"
        className="flex items-center gap-2 px-2 py-1 rounded-full"
        onPress={() => setIsOpen(!isOpen)}
      >
        <Avatar className="h-8 w-8">
          <img src="/placeholder.svg?height=32&width=32" alt="Profile" />
        </Avatar>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </motion.div>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-card shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
          >
            <div className="bg-white space-y-3 rounded">
              <div className="hover:bg-slate-200 px-4 py-2">
                <Link href={"/my-account"} className="hover:text-blue-700">
                  <span className="font-semibold">Signed In as</span> <span className="flex">{profile.email}<ArrowUpRight/></span>
                </Link>
              </div>
              <Divider />
              <div className="flex justify-center pb-3 px-4">
                <Button className="w-full" variant="flat" color="danger">
                  Logout
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
