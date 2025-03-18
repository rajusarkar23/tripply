import { db } from "@/db";
import { jwtPaymentSession } from "@/lib/auth/payment-sesssion";
import { bookings } from "@/lib/schema/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// create stripe client
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(req: NextRequest) {
  // get bookign id
  const { bookingId } = await req.json();
  // get session id from cookie
  const paymentSessionFromCookie = await jwtPaymentSession();
  // checks
  if (
    typeof bookingId !== "string" &&
    typeof paymentSessionFromCookie !== "string"
  ) {
    return NextResponse.json({
      success: false,
      message:
        "Either bookign id or the payment id is not in a acceptable format. ",
    });
  }

  try {
    // get the payment_intent/ payment id by retriving from session
    const payment_intent = (
      await stripe.checkout.sessions.retrieve(paymentSessionFromCookie)
    ).payment_intent?.toString();
    // get payment details from paymentdetails
    const paymentDetails = await stripe.paymentIntents.retrieve(
      payment_intent!.toString()
    );
    // checks
    if (paymentDetails.status === "succeeded") {
      // update
      await db
        .update(bookings)
        .set({
          paymentId: payment_intent,
          isPaymentDone: true,
          isBookingSuccess: true,
        })
        .where(eq(bookings.id, Number(bookingId)));
      // response
      return NextResponse.json({
        success: true,
        message: "Booking was success",
        paymentId: payment_intent,
      });
    }
    // if failed
    await db.update(bookings).set({
      paymentId: payment_intent,
    });
    // response
    return NextResponse.json({
      success: false,
      message: "Payment failed. check the status few minutes later",
      paymentId: payment_intent,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "Something went wrong, please try again..",
    });
  }
}
