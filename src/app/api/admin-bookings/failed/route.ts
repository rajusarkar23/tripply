import { jwtSession } from "@/lib/auth/jwt-verify-session";
import { db } from "@/lib/db/db";
import { bookings, tourV2 } from "@/lib/schema/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(){
    const adminIdFromCookie = await jwtSession()

    if (typeof adminIdFromCookie !== "number") {
        return NextResponse.json({
            success: false,
            message: "Login again"
        })
    }

    try {
        const getSuccessBookings = await db.select({
            tourName: tourV2.placeName,
            tourStartsOn: bookings.bookingDateStart,
            tourEndsOn: bookings.bookingDateEnd,
            totalPerson: bookings.totalTouristCount,
            totalCost: bookings.bookingCost,
            paymentid: bookings.paymentId,
            bookingCategory: bookings.bookingCategory,
            emailUsed: bookings.bookingPersonEmail,
            bookingDate: bookings.createdAt
        }).from(bookings).where(eq(bookings.isPaymentDone, false)).leftJoin(tourV2, eq(tourV2.id, bookings.bookingFor))

        if (getSuccessBookings.length === 0) {
            return NextResponse.json({
                success: false,
                message: "No successfull bookings found"
            })
        }

        return NextResponse.json({
            success: true,
            bookings: getSuccessBookings
        })
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            success: false,
            message: "Server error"
        })
    }
}