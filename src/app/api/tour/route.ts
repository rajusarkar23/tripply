import { NextRequest } from "next/server";

export async function POST(req: NextRequest){
    const {data, content} = await req.json()
    console.log(data, content);
    
}