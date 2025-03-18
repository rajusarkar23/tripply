import { jwtSession } from "@/lib/auth/jwt-verify-session";
import { db } from "@/lib/db/db";
import { tour } from "@/lib/schema/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// get specific entry bt id
export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const id = params.get("id");

  try {
    const findTourById = await db
      .select({
        id: tour.id,
        tourName: tour.tourName,
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

// delete one specific entry, TODO: move this func to by-id folder
export async function DELETE(req: NextRequest) {
  const id = await req.json()

  if (!id || isNaN(Number(id))) {
    return NextResponse.json({
      success: false,
      message: "The id is not valid or undefined",
    });
  }

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

// edit by id
export async function PUT(req: NextRequest) {
  const {
    data,
    editedDescription,
    imageUrl,
    editedStandarPackageDescription,
    editedPremiumpackageDescription,
  } = await req.json();

  const idFromCookie = await jwtSession();

  if (typeof idFromCookie !== "number") {
    return NextResponse.json({
      success: false,
      message: "Invalid session, login again..",
    });
  }

  try {
    const updateTour = await db
      .update(tour)
      .set({
        tourName: data.tourName,
        tourOverView: data.overview,
        slug: data.slug,
        tourPrimaryImage: imageUrl,
        createdBy: idFromCookie,
        description: editedDescription,
        tourCategory: {
          standard: {
            title: data.standardPackageTitle,
            price: data.standardPackagePrice,
            slotsAvailable: data.standardPackageSlots,
            description: editedStandarPackageDescription,
            slotsBooked: data.standardSlotsBooked,
            totalSlots: data.standardSlotsBooked + data.standardPackageSlots,
          },
          premium: {
            title: data.premiumPackageTitle,
            price: data.premiumPackagePrice,
            slotsAvailable: data.premiumPackageSlots,
            description: editedPremiumpackageDescription,
            slotsBooked: data.premiumSlotsBooked,
            totalSlots: data.premiumSlotsBooked + data.premiumPackageSlots,
          },
        },
      })
      .where(eq(tour.id, data.tourId))
      .returning();

    if (updateTour.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Unable to update the tour",
      });
    }
    return NextResponse.json({
      success: true,
      message: "Tour updated successfully",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "Something went wrong, try again...",
      error: error,
    });
  }
}
