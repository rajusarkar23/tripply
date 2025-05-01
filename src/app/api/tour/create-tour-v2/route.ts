import { db } from "@/lib/db/db";
import { tourV2 } from "@/lib/schema/schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    const {VisitTiming, heroBannerImageurls, heroBannerContentHeadAndPara, thingsTodo, mainBackImageUrl, placeName, pricing} = await req.json()

    function slugify(str:string) {
        str = str.replace(/^\s+|\s+$/g, ''); // trim leading/trailing white space
        str = str.toLowerCase(); // convert string to lowercase
        str = str.replace(/[^a-z0-9 -]/g, '') // remove any non-alphanumeric characters
                 .replace(/\s+/g, '-') // replace spaces with hyphens
                 .replace(/-+/g, '-'); // remove consecutive hyphens
        return str;
    }

    try {
        const create = await db.insert(tourV2).values({
            heroBannerContent: {
                heading: heroBannerContentHeadAndPara.heading,
                briefParagraph: heroBannerContentHeadAndPara.briefParagraph,
                heroBannerImageUrls: heroBannerImageurls
            },
            mainBackImage: mainBackImageUrl,
            placeName,
            slug: slugify(placeName),
            thingsToDoArr: thingsTodo,
            visitTimings: VisitTiming,
            tourPricing: {
                standard: pricing.standard,
                premium: pricing.premium
            },
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