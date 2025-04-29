import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import React from "react";

export default function TourV2Layout({
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
