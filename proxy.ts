import { NextResponse, type NextRequest } from "next/server";

/**
 * Admin auth gate (Next 16 proxy convention). Runs before every `/dashboard/*`
 * request:
 * - no access-token cookie      → redirect to /login
 * - access token JWT is expired → clear the session cookies + redirect to /login
 *
 * A non-JWT token (e.g. the dev "mock" session when the backend is down) has no
 * `exp` to check, so it's allowed through. Invalid-but-unexpired tokens are
 * additionally caught by the 401 handling in the admin server actions.
 */

const ACCESS = "yd_access_token";
const REFRESH = "yd_refresh_token";

function isJwtExpired(token: string): boolean {
  const parts = token.split(".");
  if (parts.length !== 3) return false; // not a JWT → can't check, let it pass
  try {
    let b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    while (b64.length % 4) b64 += "=";
    const payload = JSON.parse(atob(b64)) as { exp?: number };
    if (typeof payload.exp !== "number") return false;
    return payload.exp * 1000 <= Date.now();
  } catch {
    return false;
  }
}

export function proxy(req: NextRequest) {
  const token = req.cookies.get(ACCESS)?.value;
  const loginUrl = new URL("/login", req.url);

  if (!token) {
    return NextResponse.redirect(loginUrl);
  }

  if (isJwtExpired(token)) {
    const res = NextResponse.redirect(loginUrl);
    res.cookies.delete(ACCESS);
    res.cookies.delete(REFRESH);
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
