"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminNavbar() {
  const pathname = usePathname();

  const addPathV2 = "/admin/add-new-tour-v2";
  const allTours = "/admin/all-tours"
  const bookings = "/admin/bookings";

  return (
    <div className="bg-white border-b-black/20 border shadow-md h-14 flex justify-between items-center px-4">
      <div>
        <Link href={"/admin/home"} className=" text-3xl font-semibold">
          Admin panel
        </Link>
      </div>
      <div className="space-x-2">
        <Link
          href={"/admin/add-new-tour-v2"}
          className={`${
            pathname === addPathV2
              ? "font-bold text-white p-1  rounded-full px-2 transition-all bg-black"
              : "font-bold text-black border p-1 rounded-full px-2 border-black/60 hover:bg-black hover:text-white transition-all"
          }`}
        >
          Add new tour
        </Link>
        <Link
          href={"/admin/all-tours"}
          className={`${
            pathname === allTours
              ? "font-bold text-white p-1  rounded-full px-2 transition-all bg-black"
              : "font-bold text-black border p-1 rounded-full px-2 border-black/60 hover:bg-black hover:text-white transition-all"
          }`}
        >
          All Tours
        </Link>
      
       
        <Link
          href={"/admin/bookings"}
          className={`${
            pathname === bookings
              ? "font-bold text-white p-1  rounded-full px-2 transition-all bg-black"
              : "font-bold text-black border p-1 rounded-full px-2 border-black/60 hover:bg-black hover:text-white transition-all"
          }`}
        >
          Bookings
        </Link>
      </div>
    </div>
  );
} 