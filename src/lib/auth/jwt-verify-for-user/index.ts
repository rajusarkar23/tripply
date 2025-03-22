import { cookies } from "next/headers";
import jwt from "jsonwebtoken"

export async function userJwtSession() {
  const cookie = (await cookies()).get("_tripply_tou_session_")?.value;

  if (!cookie) {
    return "No cookie available"
  }
  
  const decodeCookie = jwt.verify(cookie, `${process.env.USER_SESSION_JWT_SECRET}`);
  
  //@ts-expect-error, id available assume
  const id = decodeCookie.id

  return id
}
