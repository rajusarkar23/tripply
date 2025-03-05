import { db } from "@/lib/db/db";
import { tour } from "@/lib/schema/schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { data, content } = await req.json();

  try {
    const addTour = await db.insert(tour).values({
      description: content,
      slug: data.slug,
      tourName: data.tourName,
    }).returning();

    if (addTour.length === 0) {
      return NextResponse.json({
        success: false,
        message: "unable to add new tour",
      });
    }
    
    return NextResponse.json({
      success: true,
      message: "New tour added.",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "Something went wrong, while adding new tour",
    });
  }
}
