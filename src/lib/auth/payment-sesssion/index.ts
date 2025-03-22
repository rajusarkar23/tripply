import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function jwtPaymentSession() {
  const cookie = (await cookies()).get("_tripply_payment_session")?.value;

  if (!cookie) {
    return "No cookie available";
  }

  const decodeCookie = jwt.verify(
    cookie,
    `${process.env.PAYMENT_SESSION_JWT_SECRET}`
  );

  //@ts-expect-error, id available assume
  const id = decodeCookie.sessionId;

  return id;
}
