import { db } from "@/lib/db/db";
import { tour } from "@/lib/schema/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const id = params.get("id");

  try {
    const findTourById = await db
      .select({
        id: tour.id,
        tourName: tour.tourName,
        tourOverview: tour.tourOverView,
        tourImageUrl: tour.tourPrimaryImage,
      })
      .from(tour)
      .where(eq(tour.id, Number(id)));

    if (findTourById.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No tour found with the provided id",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Tour fetched successfully",
      tourbById: findTourById,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "Something went wrong, try again",
    });
  }
}
