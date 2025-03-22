import { jwtVerifyOTPSession } from "@/lib/auth/jwt-verify-for-otp-verification";
import { db } from "@/lib/db/db";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { tourists } from "@/lib/schema/schema";

export async function POST(req: NextRequest) {
  //get otp from body
  const { otp } = await req.json();
  // get user id from cookie
  const idFromCookie = await jwtVerifyOTPSession();
  // validate the type
  if (typeof idFromCookie !== "number") {
    return NextResponse.json({
      success: false,
      message: "Invalid session, login again..",
    });
  }

  try {
    // find
    const findById = await db
      .select()
      .from(tourists)
      .where(eq(tourists.id, idFromCookie));
    // if nothing found
    if (findById.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No registered user found with the id.",
      });
    }
    // get db otp
    const storedOTP = findById[0].verificationOTP;
    // compare them
    const compare = bcrypt.compareSync(otp, storedOTP);
    // if comparison fails
    if (!compare) {
      return NextResponse.json({
        success: false,
        message: "Wrong OTP",
      });
    }
    // update the user
    await db
      .update(tourists)
      .set({
        isVerified: true,
      })
      .where(eq(tourists.id, idFromCookie));
    // create jwy
    const jwt_token = jwt.sign(
      { id: findById[0].id },
      `${process.env.USER_SESSION_JWT_SECRET}`
    );
    // assign jwt
    (await cookies()).set("_tripply_tou_session_", jwt_token, {
      maxAge: 30 * 24 * 60 * 60,
      httpOnly: true,
    });
    // return
    return NextResponse.json({
      success: true,
      message: "Verified successfully",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "Something went wrong, please try again..",
    });
  }
}
