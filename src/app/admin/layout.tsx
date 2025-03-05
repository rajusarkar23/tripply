import AdminNavbar from "@/components/AdminNavbar";
import React from "react";

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <AdminNavbar />
      {children}
    </div>
  );
}
