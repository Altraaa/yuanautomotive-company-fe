import { cookies } from "next/headers";

/**
 * Server-only helpers for the admin JWT stored in httpOnly cookies.
 * Set/cleared from the auth server actions; read + rotated by `apiClient`.
 *
 * Token model (backend): access token lives ~1h, refresh token 30 days. The
 * cookies themselves persist for the full refresh window when the user chose
 * "Ingat perangkat ini" — the short-lived access token is silently refreshed by
 * the apiClient interceptor, so the session survives restarts for up to 30 days.
 * Without "remember" both are session cookies (cleared when the browser closes).
 */

const ACCESS = "yd_access_token";
const REFRESH = "yd_refresh_token";
const REMEMBER = "yd_remember";

const REFRESH_WINDOW = 60 * 60 * 24 * 30; // 30 days — the refresh-token lifetime

function baseOpts() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  };
}

export async function setAuthCookies(access: string, refresh: string, remember?: boolean) {
  const jar = await cookies();
  const base = baseOpts();
  // Persistent (30d) when "remember", otherwise session cookies.
  const persist = remember ? { maxAge: REFRESH_WINDOW } : {};
  jar.set(ACCESS, access, { ...base, ...persist });
  jar.set(REFRESH, refresh, { ...base, ...persist });
  jar.set(REMEMBER, remember ? "1" : "0", { ...base, ...persist });
}

/**
 * Persist a rotated access (and optionally refresh) token after a successful
 * silent refresh, preserving the original "remember" persistence choice. Only
 * effective inside a Server Action / Route Handler — a no-op (throws, caught by
 * the caller) during RSC render, where cookies are read-only.
 */
export async function rotateAuthCookies(access: string, refresh: string) {
  const jar = await cookies();
  const base = baseOpts();
  const remember = jar.get(REMEMBER)?.value === "1";
  const persist = remember ? { maxAge: REFRESH_WINDOW } : {};
  jar.set(ACCESS, access, { ...base, ...persist });
  jar.set(REFRESH, refresh, { ...base, ...persist });
}

export async function clearAuthCookies() {
  const jar = await cookies();
  jar.delete(ACCESS);
  jar.delete(REFRESH);
  jar.delete(REMEMBER);
}

export async function getServerAccessToken(): Promise<string | null> {
  try {
    return (await cookies()).get(ACCESS)?.value ?? null;
  } catch {
    return null;
  }
}

export async function getServerRefreshToken(): Promise<string | null> {
  try {
    return (await cookies()).get(REFRESH)?.value ?? null;
  } catch {
    return null;
  }
}

export const AUTH_COOKIES = { ACCESS, REFRESH, REMEMBER } as const;
