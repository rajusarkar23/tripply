import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import React from "react";

export default function TourLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <Navigation />
      {children}
      <Footer />
    </div>
  );
}
