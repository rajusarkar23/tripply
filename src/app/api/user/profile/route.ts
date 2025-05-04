import { userJwtSession } from "@/lib/auth/jwt-verify-for-user";
import { db } from "@/lib/db/db";
import { tourists } from "@/lib/schema/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(){
    const userId = await userJwtSession()

    if (typeof userId !== "number") {
        return NextResponse.json({
            success: false,
            message: "Login again, invalid auth key"
        })
    }

    try {
        const find = await db.select({
            name: tourists.name,
            email: tourists.email,
            profileImageUrl: tourists.profileImageUrl,
            lastUpdated: tourists.updatedAt
        }).from(tourists).where(eq(tourists.id, userId))

        if (find.length === 0) {
            return NextResponse.json({
                success: false,
                message: "Account details not found"
            })
        }
        return NextResponse.json({
            success: true,
            message: "Account details fetched",
            accountDetails: find[0]
        })
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            success: false,
            message: "Internal server error, try again."
        })
    }
    
}