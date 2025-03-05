"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminNavbar() {
  const pathname = usePathname();

  const addPath = "/admin/add-new-tour";

  return (
    <div className="bg-white border-b-black/20 border shadow-md h-14 flex justify-between items-center px-4">
      <div>
        <Link href={"/admin/home"} className=" text-3xl font-semibold">
          Admin panel
        </Link>
      </div>
      <div>
        <Link
          href={"/admin/add-new-tour"}
          className={`${
            pathname === addPath
              ? "font-bold text-white p-1  rounded-full px-2 transition-all bg-black"
              : "font-bold text-blue-600 border p-1 rounded-full px-2 border-black/60 hover:bg-black hover:text-white transition-all"
          }`}
        >
          Add new tour
        </Link>
      </div>
    </div>
  );
} 