import { ApiError } from "@/services/api";

/**
 * withFallback — resilience bridge while the backend is being wired.
 *
 * Runs the real API call and falls back to the mock only when the backend is
 * effectively down:
 * - unreachable (connection refused / DNS / no server → non-ApiError throw), or
 * - a server error (`ApiError` status >= 500 → backend is up but broken).
 *
 * Client errors (4xx: validation, 401, 404) still PROPAGATE so the app handles
 * them normally (e.g. detail pages call `notFound()` on 404). This keeps the
 * site stable when the backend errors out, without masking real client-side
 * contract bugs. Once the NestJS API is healthy at `NEXT_PUBLIC_API_URL`, the
 * real data is used automatically with no code change.
 *
 * Server-only (imports the fetch wrapper, which reads cookies).
 */
export async function withFallback<T>(
  apiCall: () => Promise<T>,
  mock: () => T | Promise<T>,
  opts?: {
    /**
     * Also fall back on 4xx (e.g. admin endpoints not yet implemented → 404, or
     * an invalid/mock token → 401). Use for admin reads that must never crash
     * the panel while the backend is still being built.
     */
    alwaysFallback?: boolean;
  }
): Promise<T> {
  try {
    return await apiCall();
  } catch (err) {
    const isClientError = err instanceof ApiError && err.status < 500;
    if (isClientError && !opts?.alwaysFallback) throw err; // 4xx → handle normally
    if (process.env.NODE_ENV !== "production") {
      const reason = err instanceof Error ? err.message : String(err);
      console.warn(`[api-fallback] backend down → using mock (${reason})`);
    }
    return mock();
  }
}
