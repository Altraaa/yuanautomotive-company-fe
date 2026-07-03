"use server";

/**
 * API CLIENT — The ONLY fetch wrapper in the application
 * 
 * Rules:
 * - No other fetch() calls anywhere in the codebase
 * - Handles auth (Bearer token), cache strategy, error parsing, 204 responses
 * - Used by services; services are called by hooks (client) or RSC (server)
 * - Components NEVER call apiClient directly
 */

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

/**
 * Get the Authorization header value
 */
async function getAuthHeader(): Promise<string | null> {
  // TODO: Implement token retrieval from your token store (localStorage, cookies, etc.)
  // For now, returning null. Replace with actual token logic.
  return null;
}

/**
 * Build query string from object
 */
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

/**
 * Determine cache strategy for fetch
 */
function getCacheStrategy(
  opts?: RequestOptions
): Record<string, any> | undefined {
  // If explicitly provided, use it
  if (opts?.cache) {
    return undefined;
  }

  // If auth required or mutation, no cache
  if (opts?.auth) {
    return { cache: "no-store" };
  }

  // Public GET — use ISR
  if (opts?.revalidate !== undefined) {
    return {
      next: {
        revalidate: opts.revalidate,
        tags: opts.tags,
      },
    };
  }

  // Default public GET — 1 hour ISR
  return {
    next: {
      revalidate: 3600,
      tags: opts?.tags,
    },
  };
}

/**
 * Main API client with get/post/patch/put/delete and upload methods
 */
export const apiClient = {
  async get<T>(url: string, opts?: RequestOptions): Promise<T> {
    const fullUrl =
      (process.env.NEXT_PUBLIC_API_URL || "") +
      url +
      (opts?.query ? buildQueryString(opts.query) : "");

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (opts?.auth) {
      const token = await getAuthHeader();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    const response = await fetch(fullUrl, {
      method: "GET",
      headers,
      signal: opts?.signal,
      ...getCacheStrategy(opts),
    });

    if (response.status === 204) {
      return undefined as T;
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const messages = Array.isArray(errorData.message)
        ? errorData.message
        : [errorData.message || response.statusText];
      throw new ApiError(response.status, messages);
    }

    return response.json();
  },

  async post<T>(
    url: string,
    body?: unknown,
    opts?: RequestOptions
  ): Promise<T> {
    const fullUrl = (process.env.NEXT_PUBLIC_API_URL || "") + url;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (opts?.auth) {
      const token = await getAuthHeader();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    const response = await fetch(fullUrl, {
      method: "POST",
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: opts?.signal,
      cache: "no-store", // Mutations never cache
    });

    if (response.status === 204) {
      return undefined as T;
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const messages = Array.isArray(errorData.message)
        ? errorData.message
        : [errorData.message || response.statusText];
      throw new ApiError(response.status, messages);
    }

    return response.json();
  },

  async patch<T>(
    url: string,
    body?: unknown,
    opts?: RequestOptions
  ): Promise<T> {
    const fullUrl = (process.env.NEXT_PUBLIC_API_URL || "") + url;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (opts?.auth) {
      const token = await getAuthHeader();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    const response = await fetch(fullUrl, {
      method: "PATCH",
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: opts?.signal,
      cache: "no-store",
    });

    if (response.status === 204) {
      return undefined as T;
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const messages = Array.isArray(errorData.message)
        ? errorData.message
        : [errorData.message || response.statusText];
      throw new ApiError(response.status, messages);
    }

    return response.json();
  },

  async put<T>(
    url: string,
    body?: unknown,
    opts?: RequestOptions
  ): Promise<T> {
    const fullUrl = (process.env.NEXT_PUBLIC_API_URL || "") + url;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (opts?.auth) {
      const token = await getAuthHeader();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    const response = await fetch(fullUrl, {
      method: "PUT",
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: opts?.signal,
      cache: "no-store",
    });

    if (response.status === 204) {
      return undefined as T;
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const messages = Array.isArray(errorData.message)
        ? errorData.message
        : [errorData.message || response.statusText];
      throw new ApiError(response.status, messages);
    }

    return response.json();
  },

  async delete<T>(url: string, opts?: RequestOptions): Promise<T> {
    const fullUrl = (process.env.NEXT_PUBLIC_API_URL || "") + url;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (opts?.auth) {
      const token = await getAuthHeader();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    const response = await fetch(fullUrl, {
      method: "DELETE",
      headers,
      signal: opts?.signal,
      cache: "no-store",
    });

    if (response.status === 204) {
      return undefined as T;
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const messages = Array.isArray(errorData.message)
        ? errorData.message
        : [errorData.message || response.statusText];
      throw new ApiError(response.status, messages);
    }

    return response.json();
  },

  async upload<T>(url: string, form: FormData, opts?: RequestOptions): Promise<T> {
    const fullUrl = (process.env.NEXT_PUBLIC_API_URL || "") + url;

    const headers: Record<string, string> = {};

    if (opts?.auth) {
      const token = await getAuthHeader();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    const response = await fetch(fullUrl, {
      method: "POST",
      headers,
      body: form,
      signal: opts?.signal,
      cache: "no-store",
    });

    if (response.status === 204) {
      return undefined as T;
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const messages = Array.isArray(errorData.message)
        ? errorData.message
        : [errorData.message || response.statusText];
      throw new ApiError(response.status, messages);
    }

    return response.json();
  },
};
