import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (
    request.nextUrl.pathname.startsWith("/admin") &&
    !request.cookies.get("session")
  ) {
    return NextResponse.rewrite(
      new URL("/authentication/admin/signin", request.url)
    );
  }

  if (
    request.nextUrl.pathname.startsWith("/profile") &&
    !request.cookies.get("tousession")
  ) {
    return NextResponse.rewrite(new URL("/authentication/signin", request.url));
  }

  if (request.nextUrl.pathname.startsWith("/bookings") && !request.cookies.get("tousession")) {
    return NextResponse.rewrite(new URL("/authentication/signin", request.url))
  }
}
