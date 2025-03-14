import { db } from "@/lib/db/db";
import { ratings, tour } from "@/lib/schema/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // try to get all tours
    const getAllTours = await db
      .select({
        name: tour.tourName,
        image: tour.tourPrimaryImage,
        overview: tour.tourOverView,
        slug: tour.slug,
        description: tour.description,
        tourCategory: tour.tourCategory,
        ratings: ratings.rating,
      })
      .from(tour)
      .leftJoin(ratings, eq(tour.id, ratings.ratingFor));
    // if not found
    if (getAllTours.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No tours found",
      });
    }
    // return
    return NextResponse.json({
      success: true,
      message: "Tours fetched",
      tours: getAllTours,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "Something went wrong, please try again..",
    });
  }
}
