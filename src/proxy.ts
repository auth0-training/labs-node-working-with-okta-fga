import { NextResponse, type NextRequest } from "next/server";
import { auth0 } from "@/lib/auth0";

export async function proxy(request: NextRequest) {
  const authResponse = await auth0.middleware(request);

  if (request.nextUrl.pathname.startsWith("/api/auth")) {
    return authResponse;
  }

  const session = await auth0.getSession(request);
  if (!session) {
    const loginUrl = new URL("/api/auth/login", request.nextUrl.origin);
    loginUrl.searchParams.set("returnTo", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return authResponse;
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};
