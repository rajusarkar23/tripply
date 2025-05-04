import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tripply - My Profile",
  description: "User profile",
};

export default function UserProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="bg-gray-300">{children}</div>;
}
