import { cookies } from "next/headers";

/**
 * Server-only helpers for the admin JWT stored in httpOnly cookies.
 * Set/cleared from the auth server actions; read by `apiClient` for `auth` calls.
 */

const ACCESS = "yd_access_token";
const REFRESH = "yd_refresh_token";

export async function setAuthCookies(access: string, refresh: string, remember?: boolean) {
  const jar = await cookies();
  const base = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  };
  // "Ingat perangkat ini" → persistent cookies; otherwise session cookies.
  jar.set(ACCESS, access, { ...base, ...(remember ? { maxAge: 60 * 60 * 24 * 7 } : {}) });
  jar.set(REFRESH, refresh, { ...base, ...(remember ? { maxAge: 60 * 60 * 24 * 30 } : {}) });
}

export async function clearAuthCookies() {
  const jar = await cookies();
  jar.delete(ACCESS);
  jar.delete(REFRESH);
}

export async function getServerAccessToken(): Promise<string | null> {
  try {
    return (await cookies()).get(ACCESS)?.value ?? null;
  } catch {
    return null;
  }
}
