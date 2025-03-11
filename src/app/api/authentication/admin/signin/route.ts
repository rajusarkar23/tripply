import { db } from "@/lib/db/db";
import { admin } from "@/lib/schema/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const { data } = await req.json();

  if (!data.email || !data.password) {
    return NextResponse.json({
      success: false,
      message: "Email and password both are required field.",
    });
  }

  try {
    // check if email registered or not
    const findWithEmail = await db
      .select({ email: admin.email, password: admin.password, id: admin.id })
      .from(admin)
      .where(eq(admin.email, data.email));

    // if not registered
    if (findWithEmail.length === 0) {
      return NextResponse.json({
        success: false,
        message: "This email is not registered.",
      });
    }
    // get db password
    const storedPassword = findWithEmail[0].password;

    //compare password
    const comparePassword = bcrypt.compareSync(data.password, storedPassword);

    // if comparison => false
    if (!comparePassword) {
      return NextResponse.json({
        success: false,
        message: "Wrong credentials",
      });
    }
    // create jwt
    const jwt_token = jwt.sign(
      { id: findWithEmail[0].id },
      `${process.env.SESSION_JWT_SECRET}`
    );
    // create jwt
    (await cookies()).set("session", jwt_token, {
      maxAge: 30 * 24 * 60 * 60,
      httpOnly: true,
    });

    return NextResponse.json({
      success: true,
      message: "Login success",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "Something went wrong, please try again..",
    });
  }
}
