import type { Metadata } from "next";
import "../globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";


export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Navigation />
      {children}
      <Footer />
    </div>
  );
}
