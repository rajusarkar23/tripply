import { TouristAuthJwt } from "@/lib/auth/tourist-auth-validation";
import { db } from "@/lib/db/db";
import { tourists } from "@/lib/schema/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { newName } = await req.json();

  const idFromCookie = await TouristAuthJwt();

  if (typeof idFromCookie !== "number") {
    return NextResponse.json({
      success: false,
      message: "Invalid session. login again..",
    });
  }

  try {
    await db
      .update(tourists)
      .set({
        name: newName,
      })
      .where(eq(tourists.id, idFromCookie));

    return NextResponse.json({
      success: true,
      message: "Name update success.",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "Something went wrong, please try again",
    });
  }
}
