import { db } from "@/db";
import { bookings, tour, tourists } from "@/lib/schema/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const getBookings = await db
      .select({
        id: bookings.id,
        bookingFor: tour.tourName,
        bookingBy: tourists.name,
        bookingByPersonEmail: tourists.email,
        bookingCategory: bookings.bookingCategory,
        bookingStartingDate: bookings.bookingDateStart,
        bookingEndingDate: bookings.bookingDateEnd,
        totalPersonCount: bookings.totalTouristCount,
        bookingCost: bookings.bookingCost,
        isPaymentDone: bookings.isPaymentDone,
        bookingDate: bookings.createdAt
      })
      .from(bookings)
      .leftJoin(tourists, eq(tourists.id, bookings.bookingBy))
      .leftJoin(tour, eq(tour.id, bookings.bookingFor));

    return NextResponse.json({
        success: true,
        message: "failed bookings fetched",
        getBookings
    })
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "Something went wrong, please try again..",
    });
  }
}
