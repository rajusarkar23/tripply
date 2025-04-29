import { db } from "@/lib/db/db";
import { tourV2 } from "@/lib/schema/schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    const {VisitTiming, heroBannerImageurls, heroBannerContentHeadAndPara, thingsTodo, mainBackImageUrl, placeName} = await req.json()

    try {
        const create = await db.insert(tourV2).values({
            heroBannerContent: {
                heading: heroBannerContentHeadAndPara.heading,
                briefParagraph: heroBannerContentHeadAndPara.briefParagraph,
                heroBannerImageUrls: heroBannerImageurls
            },
            mainBackImage: mainBackImageUrl,
            placeName,
            slug: "test-slug-2",
            thingsToDoArr: thingsTodo,
            visitTimings: VisitTiming,
            createdBy: 1
        }).returning()
        if (create.length === 0) {
            return NextResponse.json({
                success: false,
                message: "Unable to create the tour, try again"
            })
        }

        return NextResponse.json({
            success: true,
            message: "Tour added successfully"
        })
        
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            success: false,
            message: "Internal server error, please try after sometime."
        })
    }
    
}