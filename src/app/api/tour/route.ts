import { db } from "@/lib/db/db";
import { tour } from "@/lib/schema/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const {
    data,
    content,
    standardPackageDescription,
    premiumPackageDescription,
  } = await req.json();

  try {
    const addTour = await db
      .insert(tour)
      .values({
        description: content,
        slug: data.slug,
        tourName: data.tourName,

        tourCategory: {
          standard: {
            description: standardPackageDescription,
            title: data.standardPackageTitle,
            price: Number(data.standardPackagePrice),
            totalSlots: Number(data.standardPackageSlots),
            slotsAvailable: Number(data.standardPackageSlots),
            slotsBooked: 0,
          },
          premium: {
            description: premiumPackageDescription,
            title: data.premiumPackageTitle,
            price: Number(data.premiumPackagePrice),
            totalSlots: Number(data.premiumPackageSlots),
            slotsAvailable: Number(data.premiumPackageSlots),
            slotsBooked: 0,
          },
        },
      })
      .returning();

    if (addTour.length === 0) {
      return NextResponse.json({
        success: false,
        message: "unable to add new tour",
      });
    }

    console.log(addTour);

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

export async function GET() {
  //TODO: fetch according to the user

  try {
    const getTours = await db
      .select({
        id: tour.id,
        tourName: tour.tourName,
        tourImageUrl: tour.tourPrimaryImage,
        tourCategory: tour.tourCategory,
        createdAt: tour.createdAt,
        updatedAt: tour.updatedAt,
      })
      .from(tour);
    if (getTours.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No tour found",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Tours fetched successfully",
      tours: getTours,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "Something went wrong, while fetching tour",
    });
  }
}

export async function DELETE(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const id = params.get("id");

  try {
    const deleteTour = await db
      .delete(tour)
      .where(eq(tour.id, Number(id)))
      .returning();

    if (deleteTour.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Unable to find tour with the provided id",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Deleted successfully.",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "Something went wrong please try again..",
    });
  }
}
