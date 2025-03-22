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
      })
      .from(bookings)
      .leftJoin(tourists, eq(tourists.id, bookings.bookingBy))
      .leftJoin(tour, eq(tour.id, bookings.bookingFor));

    const failedBookings = [];

    for (const booking of getBookings) {
      if (booking.isPaymentDone === false) {
        failedBookings.push({
          id: booking.id,
          bookingFor: booking.bookingFor,
          bookingBy: booking.bookingBy,
          bookingByPersonEmail: booking.bookingByPersonEmail,
          bookingCategory: booking.bookingCategory,
          bookingStartingDate: booking.bookingStartingDate,
          bookingEndingDate: booking.bookingEndingDate,
          totalPersonCount: booking.totalPersonCount,
          bookingCost: booking.bookingCost,
          isPaymentDone: booking.isPaymentDone,
        });
      }
    }
    if (failedBookings.length === 0) {
        return NextResponse.json({
            success: false,
            message: "No failed bookings available"
        })
    }

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
