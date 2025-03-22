import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function TouristAuthJwt() {
  const cookie = (await cookies()).get("_tripply_tou_session_")?.value;

  if (!cookie) {
    return "Noo cookie available";
  }

  const decodeCookie = jwt.verify(
    cookie,
    `${process.env.USER_SESSION_JWT_SECRET}`
  );
  //@ts-expect-error, id is available
  const id = decodeCookie.id;
  return id;
}
