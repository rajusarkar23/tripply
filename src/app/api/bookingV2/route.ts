import { userJwtSession } from "@/lib/auth/jwt-verify-for-user";
import { db } from "@/lib/db/db";
import { bookings } from "@/lib/schema/schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const {bookingFor,totalPrice,name,email,touristCount,bookingStart,bookingEnd,category} = await req.json();

  console.log(category);
  
    const userIdFromCookie = await userJwtSession()

  try {
    const createOrder = await db.insert(bookings).values({
        bookingBy: userIdFromCookie,
        bookingCategory: category,
        bookingCost: totalPrice,
        bookingDateEnd: bookingEnd,
        bookingDateStart: bookingStart,
        bookingFor,
        totalTouristCount: touristCount,
        bookingPersonName: name,
        bookingPersonEmail: email
    }).returning()

    if (createOrder.length === 0) {
        return NextResponse.json({
            success: false,
            message: "Not able to take this order, try again"
        })
    }

    return NextResponse.json({success: true, message: "Order created", orderId: createOrder[0].id})
    
  } catch (error) {
    console.log(error);
    return NextResponse.json({
        success: false,
        message: "Internal server error, try agin after sometime"
    })
  }

}
