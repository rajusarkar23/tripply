import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const id  =  req.nextUrl.searchParams;
  console.log(Array.isArray(id));
  console.log(id);
  
  const id2 = id.get("tourId")
  console.log(id2);
  
}
