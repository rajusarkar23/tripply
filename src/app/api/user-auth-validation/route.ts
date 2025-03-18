import { db } from "@/db";
import { TouristAuthJwt } from "@/lib/auth/tourist-auth-validation";
import { bookings, tour, tourists } from "@/lib/schema/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const idFromCookie = await TouristAuthJwt();

  if (typeof idFromCookie !== "number") {
    return NextResponse.json({
      success: false,
      message: "Not authenticated",
    });
  }

  try {
    const getTouristById = await db
      .select({
        name: tourists.name,
        email: tourists.email,
        touristBookings: bookings.bookingFor,
        startingDate: bookings.bookingDateStart,
        endingDate: bookings.bookingDateEnd,
        paid: bookings.bookingCost,
        tourName: tour.tourName,
        tourImageUrl: tour.tourPrimaryImage
      })
      .from(tourists)
      .where(eq(tourists.id, idFromCookie))
      .leftJoin(bookings, eq(bookings.bookingBy, tourists.id))
      .leftJoin(tour, eq(tour.id, bookings.bookingFor))

    if (!Array.isArray(getTouristById)) {
        return NextResponse.json({
            success: false,
            message:"No profile details found for the user, please login again."
        })
    }

    return NextResponse.json({
        success: true,
        message: "user details found",
        userProfile:  {
            name: getTouristById[0].name,
            email: getTouristById[0].email
        },
        bookingDetails: getTouristById.map((tourist) => ({startingDate: tourist.startingDate, endingDate: tourist.endingDate, paid: tourist.paid, tourName: tourist.tourName, tourImageUrl: tourist.tourImageUrl}))
    })
  } catch (error) {
    console.log(error);
    return NextResponse.json({
        success: false,
        message: "Something went wrong, try again.."
    })
  }
}
