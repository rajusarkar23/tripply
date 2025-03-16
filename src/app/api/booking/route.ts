import { db } from "@/db";
import { bookings } from "@/lib/schema/schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    const {date, personCount, category, price} =  await req.json()
    if (typeof date === "undefined" && typeof personCount === "undefined") {
        return NextResponse.json({
            success: false,
            message: "Both date and person count is required."
        })
    }
    const staringDate = `${date.start.day}-${date.start.month}-${date.start.year}`
    const endingDate = `${date.end.day}-${date.end.month}-${date.end.year}` 
console.log(category);
return
    try {
        const createOrder = await db.insert(bookings).values({

        })
    } catch (error) {
        
    }
    
    
}