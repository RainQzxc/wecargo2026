import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ROUTES } from "@/constants/routes";

// Kept in sync with SESSION_COOKIE in src/features/auth/session.ts. Inlined so
// the proxy bundle does not pull in the server-only session module.
const SESSION_COOKIE = "wecargo_session";

/**
 * Optimistic auth gate. Runs before render and bounces clearly-unauthenticated
 * requests to /dashboard back to login based on cookie presence only. This is a
 * convenience pre-filter — it does NOT validate the session or check roles.
 * Authoritative auth/permission checks live in the DAL guards (server-side,
 * close to the data). See src/features/auth/dal.ts.
 */
export function proxy(request: NextRequest) {
  const hasSession = request.cookies.has(SESSION_COOKIE);
  if (!hasSession) {
    const url = new URL(ROUTES.login, request.url);
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
