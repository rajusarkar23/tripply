import { db } from "@/lib/db/db";
import { tourV2 } from "@/lib/schema/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const slugFromUrl = req.nextUrl.searchParams.get("slug")
    if (typeof slugFromUrl !== "string") {
        return NextResponse.json({
            success: false,
            message: "Unable to fetch tour"
        })
    }

    try {
        const find = await db.select().from(tourV2).where(eq(tourV2.slug, slugFromUrl))
        if (find.length === 0) {
            return NextResponse.json({
                success: false,
                message: "No tour found"
            })
        }

        return NextResponse.json({
            success: true,
            message: "Tour fetched successfully",
            tour: find
        })
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            success: false,
            message: "Internal server error."
        })
    }
}