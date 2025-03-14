import { jwtSession } from "@/lib/auth/jwt-verify-session";
import { db } from "@/lib/db/db";
import { admin, tour } from "@/lib/schema/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// create a single entry
export async function POST(req: NextRequest) {
  const {
    data,
    content,
    imageUrl,
    standardPackageDescription,
    premiumPackageDescription,
  } = await req.json();

  // get id from cookie
  const idFromCookie = await jwtSession();

  // check
  if (typeof idFromCookie !== "number") {
    return NextResponse.json({
      success: false,
      message: "Invalid session, please login again",
    });
  }

  try {
    // check if id exist on db
    const checkId = await db
      .select({ id: admin.id })
      .from(admin)
      .where(eq(admin.id, idFromCookie));

    if (checkId.length === 0) {
      (await cookies()).delete("session");
      return NextResponse.json({
        success: false,
        message: "Invalid session, login again",
      });
    }

    const addTour = await db
      .insert(tour)
      .values({
        description: content,
        slug: data.slug,
        tourOverView: data.overview,
        tourName: data.tourName,
        tourPrimaryImage: imageUrl,
        createdBy: idFromCookie,
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
// get all entries from db
export async function GET() {
  //TODO: fetch according to the user
  const idFromCookie = await jwtSession();
  if (typeof idFromCookie !== "number") {
    return NextResponse.json({
      success: false,
      message: "Something went wrong, login again..",
    });
  }

  try {
    // check if id exist in the db
    const checkId = await db
    .select({ id: admin.id })
    .from(admin)
    .where(eq(admin.id, idFromCookie));

  if (checkId.length === 0) {
    (await cookies()).delete("session");
    return NextResponse.json({
      success: false,
      message: "Invalid session, login again",
    });
  }

    const getTours = await db
      .select({
        id: tour.id,
        tourName: tour.tourName,
        tourSlug: tour.slug,
        tourDescription: tour.description,
        tourOverview: tour.tourOverView,
        tourImageUrl: tour.tourPrimaryImage,
        tourCategory: tour.tourCategory,
        updatedAt: tour.updatedAt,
      })
      .from(tour)
      .where(eq(tour.createdBy, idFromCookie));
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
// delete one specific entry, TODO: move this func to by-id folder
export async function DELETE(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const id = params.get("id");

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
