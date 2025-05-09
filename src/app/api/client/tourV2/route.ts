import { db } from "@/lib/db/db";
import { tourV2 } from "@/lib/schema/schema";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const getData = await db.select({placeName: tourV2.placeName, mainBackImage: tourV2.mainBackImage, slug: tourV2.slug, heroBannerContent: tourV2.heroBannerContent}).from(tourV2)
        if (getData.length === 0) {
            return NextResponse.json({
                success: false,
                message: "No tour found"
            })
        }
        return NextResponse.json({
            success: true,
            message: "Tour fetch success",
            tours: getData
        })
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            success: false,
            message: "Internal server error"
        })
    }
}