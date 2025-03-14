import { NextResponse } from "next/server";

export async function middleware(request) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath =
    path.startsWith("/auth/") ||
    path.startsWith("/api/auth/") ||
    path === "/api/auth";

  // Get the token from the cookies
  const token = request.cookies.get("firebase-token")?.value;

  // If the path is not public and there's no token, redirect to login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // If the path is login/signup and there's a token, redirect to home
  if (path.startsWith("/auth/") && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Configure which paths the middleware runs on
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
