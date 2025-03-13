import { db } from "@/lib/db/db";
import { admin } from "@/lib/schema/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcrypt";
import { generateOTP } from "@/lib/functions/generate-otp";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { otpVerifyEmail } from "@/lib/functions/otp-verification-mail";

// zod validation schema
const signupSchema = z.object({
  email: z.string().email("Seems to be an invalid email"),
  password: z
    .string()
    .min(6, "Minimum length for password is 6")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[\W_]/, "Password must contain at least one special character"),
});

export async function POST(req: NextRequest) {
  // get data
  const { data } = await req.json();
  // validate field
  const validateData = signupSchema.safeParse(data);
  // handle errors
  if (!validateData.success) {
    return NextResponse.json({
      success: false,
      message: validateData.error.format(),
    });
  }

  try {
    // check if email already registered or not
    const checkIfEmailAlreadyRegistered = await db
      .select({ email: admin.email })
      .from(admin)
      .where(eq(admin.email, data.email));

    // return if registered
    if (checkIfEmailAlreadyRegistered.length !== 0) {
      return NextResponse.json({
        success: false,
        message: "This email is already in use.",
      });
    }

    // encrypt the password and otp
    const hashedPassword = bcrypt.hashSync(data.password, 10);
    const otp = generateOTP(6);
    console.log(otp);
    
    const hashedOTP = bcrypt.hashSync(otp, 10);

    // create entry in the db
    const createEntry = await db
      .insert(admin)
      .values({
        name: data.email.split("@")[0],
        email: data.email,
        password: hashedPassword,
        verificationOTP: hashedOTP,
      })
      .returning();

    // check
    if (createEntry.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Unable to create your account, please try again.",
      });
    }

    // send the otp verify mail
    otpVerifyEmail(otp, data.email);

    // create jwt
    const jwt_token = jwt.sign(
      { id: createEntry[0].id },
      `${process.env.OTP_VERIFY_SESSION_JWT_SECRET}`
    );
    // sign cookie
    (await cookies()).set("vsession", jwt_token, {
      maxAge: 30 * 24 * 60 * 60,
      httpOnly: true,
    });

    return NextResponse.json({
      success: true,
      message: "Account has been created successfully",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "Something went wrong, please try again..",
    });
  }
}
