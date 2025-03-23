import { db } from "@/db";
import { bookings } from "@/lib/schema/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
// Stripe client
const stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}` as string, {
  apiVersion: "2025-02-24.acacia",
});

console.log(":ran3");

export async function POST(req: NextRequest) {
  // get data from client
  const { price, product, email, bookingId, successUrl, cancelUrl } =
    await req.json();

console.log(email);


  try {
    // create session with above data

    console.log("ran");
    
    const createSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: product,
            },
            unit_amount: price * 80 * 100,
          },
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
    });
    console.log("ran54");
    
    // update
    await db
      .update(bookings)
      .set({
        paymentSessionId: createSession.id,
      })
      .where(eq(bookings.id, bookingId));
    // assign jwt
    console.log(":ran4");
    
    const jwt_token = jwt.sign(
      { sessionId: createSession.id },
      `${process.env.PAYMENT_SESSION_JWT_SECRET}`
    );
    // set cookie
    (await cookies()).set("_tripply_payment_session", jwt_token, {
      maxAge: 10 * 60 * 100,
      expires: 10 * 60 * 100,
      httpOnly: true,
    });
    // return res
    return NextResponse.json({
      success: true,
      message: "Payment session created",
      url: createSession.url,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "Something went wrong, please try again..",
    });
  }
}
