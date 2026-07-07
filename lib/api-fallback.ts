import { ApiError } from "@/services/api";

/**
 * withFallback — resilience bridge while the backend is being wired.
 *
 * Runs the real API call. If the backend responds with an error (`ApiError`),
 * that propagates (a live backend bug shouldn't be masked). If the backend is
 * simply unreachable (connection refused / DNS / no server → a non-ApiError
 * throw), we fall back to the mock so the site stays fully functional and the
 * build stays green. Once the NestJS API is live at `NEXT_PUBLIC_API_URL`, the
 * real path is used automatically with no code change.
 *
 * Server-only (imports the fetch wrapper, which reads cookies).
 */
export async function withFallback<T>(
  apiCall: () => Promise<T>,
  mock: () => T | Promise<T>
): Promise<T> {
  try {
    return await apiCall();
  } catch (err) {
    if (err instanceof ApiError) throw err;
    if (process.env.NODE_ENV !== "production") {
      const reason = err instanceof Error ? err.message : String(err);
      console.warn(`[api-fallback] backend unreachable → using mock (${reason})`);
    }
    return mock();
  }
}
