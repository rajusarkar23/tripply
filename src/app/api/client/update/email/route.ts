import { TouristAuthJwt } from "@/lib/auth/tourist-auth-validation";
import { db } from "@/lib/db/db";
import { tourists } from "@/lib/schema/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  const { newEmail, otpValue } = await req.json();

  const idFromCookie = await TouristAuthJwt();

  if (typeof idFromCookie !== "number") {
    return NextResponse.json({
      success: false,
      message: "Invalid session. login again..",
    });
  }

  try {
    const dbOtp = await db
      .select({ otp: tourists.verificationOTP })
      .from(tourists)
      .where(eq(tourists.id, idFromCookie));
    // compare otps
    const compare = await bcrypt.compare(otpValue, dbOtp[0].otp);
    if (compare) {
      await db
        .update(tourists)
        .set({
          email: newEmail,
        })
        .where(eq(tourists.id, idFromCookie));

      return NextResponse.json({
        success: true,
        message: "Email update success",
      });
    }

    return NextResponse.json({
      success: false,
      message: "Unable to verify your otp, try again with correct inputs.",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "Something went wrong, Please try again..",
    });
  }
}
