import { db } from "@/db";
import { userJwtSession } from "@/lib/auth/jwt-verify-for-user";
import { bookings, tour, tourists } from "@/lib/schema/schema";
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
      try {
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

        return NextResponse.json({
          success: true,
          message: "Your order for standard ctagory has been created.",
          orderId: createOrder[0].id,
        });
      } catch (error) {
        console.log(error);
        return NextResponse.json({
          success: false,
          message: "Unable to create your booking for standard category",
        });
      }
    } else {
      try {
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

        await db.update(tour).set({
          tourCategory: sql` jsonb_set(
         jsonb_set(
         ${tour.tourCategory},
         '{premium,slotsBooked}',
         to_jsonb((${tour.tourCategory} -> 'premium' ->> 'slotsBooked')::int + 1)
         ),
         '{premium, slotsAvailable}',
         to_jsonb((${tour.tourCategory} -> 'premium' ->> 'slotsAvailable')::int - 1)
         )`,
        });

        return NextResponse.json({
          success: true,
          message: "Your bookign for premium category hass been created.",
          orderId: createOrder[0].id,
        });
      } catch (error) {
        console.log(error);
        return NextResponse.json({
          success: false,
          message: "Unable to create your booking for premium category.",
        });
      }
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "Something went wrong, please try again..",
    });
  }
}

// getPayment details by payment id

export async function GET(req: NextRequest) {
  const bookingId = Number(req.nextUrl.searchParams.get("id"));
  if (typeof bookingId !== "number") {
    return NextResponse.json({
      success: false,
      message: "Invalid booking Id.",
    });
  }

  try {
    const getBookignById = await db
      .select({
        category: bookings.bookingCategory,
        startingDate: bookings.bookingDateStart,
        endingDate: bookings.bookingDateEnd,
        totalPerson: bookings.totalTouristCount,
        amount: bookings.bookingCost,
        tourName: tour.tourName,
        touristEmail: tourists.email
      })
      .from(bookings)
      .leftJoin(tour, eq(tour.id, bookings.bookingFor))
      .leftJoin(tourists, eq(tourists.id, bookings.bookingBy))
      .where(eq(bookings.id, bookingId));
    if (!Array.isArray(getBookignById)) {
      return NextResponse.json({
        success: false,
        message: "Not able to retrive the bookign details.",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Booking details fetched successfully",
      details: getBookignById,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "Something went wrong, please try again..",
    });
  }
}
