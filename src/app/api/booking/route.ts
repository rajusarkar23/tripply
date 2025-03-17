import { db } from "@/db";
import { userJwtSession } from "@/lib/auth/jwt-verify-for-user";
import { bookings, tour } from "@/lib/schema/schema";
import { eq, sql } from "drizzle-orm";
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
    const createOrder = await db
      .insert(bookings)
      .values({
        bookingFor: tourId,
        bookingBy: idFromCookie,
        bookingCategory: category,
        bookingCost: price,
        bookingDateStart: staringDate,
        bookingDateEnd: endingDate,
        totalTouristCount: personCount,
      })
      .returning();

    if (createOrder.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Unable to process your order, try again",
      });
    }

    if (category === "standard") {
      const getStandardTour = await db
        .select({
          avalableSlots: sql`${tour.tourCategory} #>> '{standard,slotsAvailable}'`,
          slotsBooked: sql`${tour.tourCategory} #>> '{standard,slotsBooked}'`,
        })
        .from(tour)
        .where(eq(tour.id, tourId));

      if (getStandardTour.length === 0) {
        return NextResponse.json({
          success: false,
          message: "Unable to process your order, try again",
        });
      }

      await db
        .update(tour)
        .set({
          tourCategory: sql`
          jsonb_set(
            jsonb_set(
              ${tour.tourCategory},
              '{standard,slotsBooked}',
              to_jsonb((${tour.tourCategory} -> 'standard' ->> 'slotsBooked')::int + 1)
            ),
            '{standard,slotsAvailable}',
            to_jsonb((${tour.tourCategory} -> 'standard' ->> 'slotsAvailable')::int - 1)
          )
        `,
        })
        .where(eq(tour.id, tourId));
    } else {
      const getPremium = await db
        .select({
          avalableSlots: sql`${tour.tourCategory} #>> '{premium,slotsAvailable}'`,
          slotsBooked: sql`${tour.tourCategory} #>> '{premium,slotsBooked}'`,
        })
        .from(tour)
        .where(eq(tour.id, tourId));

      if (getPremium.length === 0) {
        return NextResponse.json({
          success: false,
          message: "Unable to process your order, try again",
        });
      }

      const seats = getPremium.map((seat) => seat.avalableSlots)[0];
      const seatsBooked = getPremium.map((booked) => booked.slotsBooked)[0];

      await db.update(tour).set({
        tourCategory: {
          premium: {
            slotsBooked: Number(seatsBooked) + 1,
            slotsAvailable: Number(seats) - 1,
          },
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
}
