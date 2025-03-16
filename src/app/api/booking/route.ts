import { db } from "@/db";
import { userJwtSession } from "@/lib/auth/jwt-verify-for-user";
import { bookings } from "@/lib/schema/schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { date, personCount, category, price, tourId } = await req.json();
  if (typeof date === "undefined" && typeof personCount === "undefined") {
    return NextResponse.json({
      success: false,
      message: "Both date and person count is required.",
    });
  }
  const staringDate = `${date.start.day}-${date.start.month}-${date.start.year}`;
  const endingDate = `${date.end.day}-${date.end.month}-${date.end.year}`;

  const idFromCookie = await userJwtSession();

  if (typeof idFromCookie !== "number") {
    return NextResponse.json({
      success: false,
      message: "Not able to verify identity, login again..",
    });
  }

  try {
    const createOrder = await db.insert(bookings).values({
        bookingFor: tourId,
        bookingBy: idFromCookie,
        bookingCategory: category,
        bookingCost: price,
        bookingDateStart: staringDate,
        bookingDateEnd: endingDate,
        totalTouristCount: personCount,
    }).returning({id: bookings.id});

    console.log(createOrder);
    
  } catch (error) {
    console.log(error);
    
  }
}
