import { NextResponse, type NextRequest } from "next/server";
import { endpoints } from "@/lib/endpoint";

/**
 * Admin auth gate + silent token refresh (Next 16 proxy convention). Runs before
 * every `/dashboard/*` request (page loads AND server-action POSTs) and keeps the
 * session alive across the short-lived access token:
 *
 * - valid (unexpired) access token                 → allow (fast path)
 * - access expired but refresh token still valid   → call POST /auth/refresh,
 *   mint a fresh access token, forward it to THIS render (mutated request cookie)
 *   AND persist it to the browser (response cookie), then allow. This runs at
 *   most ~once/hour per active session; every request in between hits the fast
 *   path, so there's no per-navigation refresh.
 * - refresh token missing/expired, or refresh rejected (401/403) → clear + /login
 * - backend unreachable / 5xx during refresh       → allow (the apiClient's
 *   withFallback keeps the panel usable on mock data; we never log out on a
 *   transient backend outage)
 *
 * This is the primary, persistent refresh path. The apiClient's own 401→refresh
 * interceptor remains the reactive safety net for tokens that are unexpired but
 * revoked/invalid (which `exp` alone can't detect) and for expiry mid-request.
 *
 * Middleware must stay dependency-light (Edge runtime): it cannot import the
 * `next/headers` cookie helpers, so cookie names/options are defined locally.
 */

const ACCESS = "yd_access_token";
const REFRESH = "yd_refresh_token";
const REMEMBER = "yd_remember";

const REFRESH_WINDOW = 60 * 60 * 24 * 30; // 30 days — refresh-token lifetime
const BASE = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");

function isJwt(token: string): boolean {
  return token.split(".").length === 3;
}

function isJwtExpired(token: string): boolean {
  if (!isJwt(token)) return false; // not a JWT (e.g. dev mock) → treat as usable
  try {
    let b64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    while (b64.length % 4) b64 += "=";
    const payload = JSON.parse(atob(b64)) as { exp?: number };
    if (typeof payload.exp !== "number") return false;
    return payload.exp * 1000 <= Date.now();
  } catch {
    return false;
  }
}

type RefreshOutcome =
  | { status: "ok"; access: string; refresh: string }
  | { status: "expired" } // backend rejected the refresh token → end session
  | { status: "transient" }; // network/5xx → keep session, fall back to mock

async function refreshTokens(refresh: string): Promise<RefreshOutcome> {
  try {
    const res = await fetch(BASE + endpoints.auth.refresh, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refresh }),
      cache: "no-store",
    });
    if (res.status === 401 || res.status === 403) return { status: "expired" };
    if (!res.ok) return { status: "transient" };
    const data = (await res.json().catch(() => null)) as
      | { access_token?: string; refresh_token?: string }
      | null;
    if (!data?.access_token) return { status: "transient" };
    return { status: "ok", access: data.access_token, refresh: data.refresh_token ?? refresh };
  } catch {
    return { status: "transient" };
  }
}

function redirectToLogin(req: NextRequest): NextResponse {
  const res = NextResponse.redirect(new URL("/login", req.url));
  res.cookies.delete(ACCESS);
  res.cookies.delete(REFRESH);
  res.cookies.delete(REMEMBER);
  return res;
}

export async function proxy(req: NextRequest): Promise<NextResponse> {
  const access = req.cookies.get(ACCESS)?.value;
  const refresh = req.cookies.get(REFRESH)?.value;

  // 1. Live access token → straight through.
  if (access && !isJwtExpired(access)) {
    return NextResponse.next();
  }

  // 2. No usable refresh token → session over.
  if (!refresh || isJwtExpired(refresh)) {
    return redirectToLogin(req);
  }

  // 3. Dev mock session (non-JWT refresh): can't refresh against a real backend
  //    — pass through and let apiClient + withFallback serve mock data.
  if (!isJwt(refresh)) {
    return NextResponse.next();
  }

  // 4. Access expired but refresh valid → mint a fresh access token.
  const outcome = await refreshTokens(refresh);

  if (outcome.status === "expired") return redirectToLogin(req);
  if (outcome.status === "transient") return NextResponse.next();

  // 5. Persist the rotated tokens: forward to THIS render + set on the browser.
  req.cookies.set(ACCESS, outcome.access);
  const res = NextResponse.next({ request: { headers: req.headers } });

  const remember = req.cookies.get(REMEMBER)?.value === "1";
  const cookieOpts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    ...(remember ? { maxAge: REFRESH_WINDOW } : {}),
  };
  res.cookies.set(ACCESS, outcome.access, cookieOpts);
  res.cookies.set(REFRESH, outcome.refresh, cookieOpts);
  return res;
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
