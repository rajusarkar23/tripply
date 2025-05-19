import { jwtSession } from "@/lib/auth/jwt-verify-session";
import { db } from "@/lib/db/db";
import { tourV2 } from "@/lib/schema/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const idFromCookie = await jwtSession();

  if (typeof idFromCookie !== "number") {
    return NextResponse.json({
      success: false,
      message: "Login again, auth cookie is not valid",
    });
  }

  try {
    const getTourByadminId = await db
      .select({
        imageUrl: tourV2.mainBackImage,
        placeName: tourV2.placeName,
        pricing: tourV2.tourPricing,
        slug: tourV2.slug,
        createdOn: tourV2.createdAt,
      })
      .from(tourV2)
      .where(eq(tourV2.createdBy, idFromCookie));

    if (getTourByadminId.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No tours found",
      });
    }

    return NextResponse.json({
      success: true,
      tours: getTourByadminId,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "Server error, try again",
    });
  }
}

// delete

export async function DELETE(req: NextRequest) {
  const url = req.nextUrl.searchParams;
  const slug = url.get("slug");
  console.log(slug);

  try {
    const deleteTourBySlug = await db
      .delete(tourV2)
      .where(eq(tourV2.slug, slug!))
      .returning();

    console.log(deleteTourBySlug);

    if (deleteTourBySlug.length === 0) {
      return NextResponse.json({
        success: false,
        message: `Unable to delete tour ${slug}`,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Tour deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "Internal server error.",
    });
  }
}
