"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminNavbar() {
  const pathname = usePathname();

  const addPath = "/admin/add-new-tour";
  const tours = "/admin/tours";
  const successBookings = "/admin/bookings";
  const failedBookings = "/admin/failed-bookings";

  return (
    <div className="bg-white border-b-black/20 border shadow-md h-14 flex justify-between items-center px-4">
      <div>
        <Link href={"/admin/home"} className=" text-3xl font-semibold">
          Admin panel
        </Link>
      </div>
      <div className="space-x-2">
        <Link
          href={"/admin/add-new-tour"}
          className={`${
            pathname === addPath
              ? "font-bold text-white p-1  rounded-full px-2 transition-all bg-black"
              : "font-bold text-black border p-1 rounded-full px-2 border-black/60 hover:bg-black hover:text-white transition-all"
          }`}
        >
          Add new tour
        </Link>
        <Link
          href={"/admin/tours"}
          className={`${
            pathname === tours
              ? "font-bold text-white p-1  rounded-full px-2 transition-all bg-black"
              : "font-bold text-black border p-1 rounded-full px-2 border-black/60 hover:bg-black hover:text-white transition-all"
          }`}
        >
          Tours
        </Link>
        <Link
          href={"/admin/bookings"}
          className={`${
            pathname === successBookings
              ? "font-bold text-white p-1  rounded-full px-2 transition-all bg-black"
              : "font-bold text-black border p-1 rounded-full px-2 border-black/60 hover:bg-black hover:text-white transition-all"
          }`}
        >
          Bookings
        </Link>
        <Link
          href={"/admin/failed-bookings"}
          className={`${
            pathname === failedBookings
              ? "font-bold text-white p-1  rounded-full px-2 transition-all bg-black"
              : "font-bold text-black border p-1 rounded-full px-2 border-black/60 hover:bg-black hover:text-white transition-all"
          }`}
        >
          Failed Bookings
        </Link>
      </div>
    </div>
  );
} 