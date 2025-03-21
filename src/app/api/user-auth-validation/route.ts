import { db } from "@/db";
import { TouristAuthJwt } from "@/lib/auth/tourist-auth-validation";
import { bookings, tour, tourists } from "@/lib/schema/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

type Booking = {
  tourName: string | null;
  tourImageUrl: string | null;
  startingDate: string | null;
  endingDate: string | null;
  paid: number | null;
}

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
        isPaymentDone: bookings.isPaymentDone,
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



    const bookingArr: Booking[]= []

    for(const tourist of getTouristById) {
      if (tourist.isPaymentDone === true) {
        const newBookArray = {
          tourName: tourist.tourName,
          email: tourist.email,
          tourImageUrl: tourist.tourImageUrl,
          startingDate: tourist.startingDate,
          endingDate: tourist.endingDate,
          paid: tourist.paid
        }
        bookingArr.push(newBookArray)
      }
    }

    return NextResponse.json({
        success: true,
        message: "user details found",
        userProfile:  {
            name: getTouristById[0].name,
            email: getTouristById[0].email
        },
        bookingDetails: bookingArr
    })
  } catch (error) {
    console.log(error);
    return NextResponse.json({
        success: false,
        message: "Something went wrong, try again.."
    })
  }
}
