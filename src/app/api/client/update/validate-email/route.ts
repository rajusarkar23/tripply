import { TouristAuthJwt } from "@/lib/auth/tourist-auth-validation";
import { generateOTP } from "@/lib/functions/generate-otp";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { db } from "@/lib/db/db";
import { tourists } from "@/lib/schema/schema";
import { eq } from "drizzle-orm";
import { otpVerifyEmail } from "@/lib/functions/otp-verification-mail";

export async function POST(req: NextRequest) {
  const { newEmail } = await req.json();

  const idFromCookie = await TouristAuthJwt();

  if (typeof idFromCookie !== "number") {
    return NextResponse.json({
      success: false,
      message: "Invalid session. login again..",
    });
  }

  const otp = generateOTP(6);

  const hashedOTP = bcrypt.hashSync(otp, 10);

  try {
    const checkIfEmailIsAlreadyRegistered = await db
      .select({ email: tourists.email })
      .from(tourists)
      .where(eq(tourists.email, newEmail));
    if (checkIfEmailIsAlreadyRegistered.length !== 0) {
      return NextResponse.json({
        success: false,
        message: "This email is already registered.",
      });
    }

    otpVerifyEmail(otp, newEmail);
    await db
      .update(tourists)
      .set({
        verificationOTP: hashedOTP,
      })
      .where(eq(tourists.id, idFromCookie));
    return NextResponse.json({
      success: true,
      message: "Verification email sent",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "Something went wrong, try again..",
    });
  }
}
