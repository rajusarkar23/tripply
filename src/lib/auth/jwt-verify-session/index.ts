import { cookies } from "next/headers";
import jwt from "jsonwebtoken"

export async function jwtSession() {
  const cookie = (await cookies()).get("_tripply_a_session_")?.value;

  if (!cookie) {
    return "No cookie available"
  }
  
  const decodeCookie = jwt.verify(cookie, `${process.env.SESSION_JWT_SECRET}`);
  
  //@ts-expect-error, id available assume
  const id = decodeCookie.id

  return id
}
