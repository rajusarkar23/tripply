import { NextRequest } from "next/server";

function jwtVerifyOTPSession(req: NextRequest) {
  const cookies = req.cookies;
  return cookies
  
}
console.log(jwtVerifyOTPSession);
