import { cookies } from "next/headers";
import jwt from "jsonwebtoken"
export async function jwtVerifyOTPSession() {
  const cookie = (await cookies()).get("vsession")?.value;

  if (!cookie) {
    return "No cookie available"
  }
  
  const decodeCookie = jwt.verify(cookie, `${process.env.OTP_VERIFY_SESSION_JWT_SECRET}`);
  
  //@ts-expect-error, id available assume
  const id = decodeCookie.id

  return id
}
