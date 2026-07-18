/**
 * API CLIENT — The ONLY fetch wrapper in the application
 *
 * Rules:
 * - No other fetch() calls anywhere in the codebase
 * - Handles auth (Bearer token), cache strategy, error parsing, 204 responses
 * - Used by services (RSC + server actions); components NEVER call it directly
 * - Server-only: `auth` requests read the JWT from an httpOnly cookie via
 *   `next/headers`, so this module must never be imported into a client bundle.
 *
 * Silent refresh (interceptor):
 * - When an authenticated request gets a 401 (and it isn't itself an /auth/login
 *   or /auth/refresh call), the client calls POST /auth/refresh with the stored
 *   refresh token, gets a fresh access token, and retries the original request
 *   once. The rotated tokens are persisted (Server Action context) so subsequent
 *   requests reuse them.
 * - Only when /auth/refresh ALSO fails (refresh token expired/invalid) is the
 *   original 401 surfaced to the caller, which then ends the session → /login.
 * - A single 401 therefore never logs the user out on its own.
 */

import { cookies } from "next/headers";
import { endpoints } from "@/lib/endpoint";
import { AUTH_COOKIES, rotateAuthCookies } from "@/lib/auth-cookies";
import type { ApiRefreshResponse } from "@/types/api/auth";

/** Base URL of the backend (no trailing slash, no `/api` prefix). */
const BASE = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");

type RequestOptions = {
  auth?: boolean; // Attach Authorization: Bearer <token>
  cache?: RequestCache; // Override cache strategy
  revalidate?: number; // ISR seconds for public GET (default 3600)
  query?: Record<string, string | number | boolean | undefined>;
  signal?: AbortSignal;
  tags?: string[]; // For ISR invalidation (e.g., ['cms-homepage'])
};

/**
 * Custom error class that wraps API errors.
 * NestJS returns { message: string | string[], ... }
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    public messages: string[]
  ) {
    super(messages.join(", "));
    this.name = "ApiError";
  }
}

/** Read a cookie value; returns null outside a request scope (e.g. static gen). */
async function readCookie(name: string): Promise<string | null> {
  try {
    return (await cookies()).get(name)?.value ?? null;
  } catch {
    return null;
  }
}

/** Build query string from object */
function buildQueryString(
  query: Record<string, string | number | boolean | undefined>
): string {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, String(value));
    }
  });
  const str = params.toString();
  return str ? `?${str}` : "";
}

/** Cache strategy for GET requests. */
function getCacheStrategy(opts?: RequestOptions): Record<string, unknown> {
  // Explicit override wins.
  if (opts?.cache) return { cache: opts.cache };
  // Auth reads must never be cached.
  if (opts?.auth) return { cache: "no-store" };
  // Public GET — ISR (explicit seconds or the 1-hour default).
  if (opts?.revalidate !== undefined) {
    return { next: { revalidate: opts.revalidate, tags: opts.tags } };
  }
  return { next: { revalidate: 3600, tags: opts?.tags } };
}

async function parseError(response: Response): Promise<ApiError> {
  const errorData = await response.json().catch(() => ({}));
  const messages = Array.isArray(errorData.message)
    ? errorData.message
    : [errorData.message || response.statusText];
  return new ApiError(response.status, messages);
}

/**
 * Swap the stored refresh token for a fresh access token. Returns the new access
 * token, or null when refresh fails (no refresh cookie, or /auth/refresh itself
 * rejects → refresh token truly expired). Persists rotated tokens when possible
 * (Server Action context; a no-op during RSC render, silently swallowed).
 *
 * Done with a raw fetch (not via the client below) so it can never recurse into
 * the 401→refresh path.
 */
async function refreshAccessToken(): Promise<string | null> {
  const refresh = await readCookie(AUTH_COOKIES.REFRESH);
  if (!refresh) return null;
  try {
    const res = await fetch(BASE + endpoints.auth.refresh, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refresh }),
      cache: "no-store",
    });
    // 401 here = refresh token expired/invalid → caller surfaces the original 401.
    if (!res.ok) return null;
    const data = (await res.json().catch(() => null)) as ApiRefreshResponse | null;
    if (!data?.access_token) return null;
    try {
      await rotateAuthCookies(data.access_token, data.refresh_token ?? refresh);
    } catch {
      // RSC render → cookies are read-only. The new token is still used for the
      // retry below (in-memory); it just isn't persisted until a Server Action.
    }
    return data.access_token;
  } catch {
    // Network error → don't end the session; surface the original response.
    return null;
  }
}

/** Endpoints that must never trigger the refresh interceptor (avoid recursion). */
function isAuthFlow(url: string): boolean {
  return url.startsWith(endpoints.auth.login) || url.startsWith(endpoints.auth.refresh);
}

/**
 * Core request pipeline shared by every verb. Performs the fetch and, on a 401
 * for an authenticated call, transparently refreshes + retries once.
 */
async function performRequest(
  method: string,
  url: string,
  body: BodyInit | undefined,
  isMultipart: boolean,
  opts?: RequestOptions
): Promise<Response> {
  const fullUrl = BASE + url + (opts?.query ? buildQueryString(opts.query) : "");
  const cacheOpts = method === "GET" ? getCacheStrategy(opts) : { cache: "no-store" as const };

  const doFetch = async (overrideToken?: string): Promise<Response> => {
    const headers: Record<string, string> = {};
    if (!isMultipart) headers["Content-Type"] = "application/json";
    if (opts?.auth) {
      const token = overrideToken ?? (await readCookie(AUTH_COOKIES.ACCESS));
      if (token) headers["Authorization"] = `Bearer ${token}`;
    }
    return fetch(fullUrl, {
      method,
      headers,
      body,
      signal: opts?.signal,
      ...cacheOpts,
    });
  };

  let response = await doFetch();

  if (response.status === 401 && opts?.auth && !isAuthFlow(url)) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      response = await doFetch(newToken);
    }
  }

  return response;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) return undefined as T;
  if (!response.ok) throw await parseError(response);
  return response.json();
}

const serializeBody = (body: unknown): BodyInit | undefined =>
  body === undefined || body === null ? undefined : JSON.stringify(body);

/**
 * Main API client with get/post/patch/put/delete and upload methods.
 */
export const apiClient = {
  async get<T>(url: string, opts?: RequestOptions): Promise<T> {
    return handleResponse<T>(await performRequest("GET", url, undefined, false, opts));
  },

  async post<T>(url: string, body?: unknown, opts?: RequestOptions): Promise<T> {
    return handleResponse<T>(await performRequest("POST", url, serializeBody(body), false, opts));
  },

  async patch<T>(url: string, body?: unknown, opts?: RequestOptions): Promise<T> {
    return handleResponse<T>(await performRequest("PATCH", url, serializeBody(body), false, opts));
  },

  async put<T>(url: string, body?: unknown, opts?: RequestOptions): Promise<T> {
    return handleResponse<T>(await performRequest("PUT", url, serializeBody(body), false, opts));
  },

  async delete<T>(url: string, opts?: RequestOptions): Promise<T> {
    return handleResponse<T>(await performRequest("DELETE", url, undefined, false, opts));
  },

  async upload<T>(url: string, form: FormData, opts?: RequestOptions): Promise<T> {
    return handleResponse<T>(await performRequest("POST", url, form, true, opts));
  },
};
