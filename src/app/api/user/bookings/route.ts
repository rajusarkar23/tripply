import { userJwtSession } from "@/lib/auth/jwt-verify-for-user"
import { db } from "@/lib/db/db"
import { bookings, tourV2 } from "@/lib/schema/schema"
import { and, eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function GET(){
    const userId = await userJwtSession()

    if (typeof userId !== "number") {
        return NextResponse.json({
            success: false,
            message: "Login again, auth key is not valid"
        })
    }
    try {
        const findBookingsByUserId = await db.select({
            tourName: tourV2.placeName,
            tourStartsOn: bookings.bookingDateStart,
            tourEndsOn: bookings.bookingDateEnd,
            totalPerson: bookings.totalTouristCount,
            totalCost: bookings.bookingCost,
            paymentid: bookings.paymentId,
            bookingCategory: bookings.bookingCategory,
            emailUsed: bookings.bookingPersonEmail,
            bookingDate: bookings.createdAt
        }).from(bookings).where(and(eq(bookings.bookingBy, userId), eq(bookings.isPaymentDone, true))).leftJoin(tourV2, eq(tourV2.id, bookings.bookingFor))

        if (findBookingsByUserId.length === 0) {
            return NextResponse.json({
                success: false,
                message: "You don't have any bookings for now"
            })
        }

        return NextResponse.json({
            success: true,
            message: "Bookings fetched successfully",
            bookings: findBookingsByUserId
        })
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            success: false,
            message: "Internal server error"
        })
    }
}