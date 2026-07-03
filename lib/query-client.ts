import { QueryClient } from "@tanstack/react-query";

/**
 * Singleton QueryClient instance for server-side usage.
 * Client-side queries use a separate instance in the provider.
 */
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Don't retry failed requests on the client to avoid unnecessary network traffic
        retry: 1,
        // Cache data for 5 minutes by default
        gcTime: 5 * 60 * 1000,
        // Stale time: data considered fresh for 1 minute
        staleTime: 1 * 60 * 1000,
        // Don't refetch on window focus for initial load
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
      },
      mutations: {
        retry: 0, // Don't retry mutations — let app decide
      },
    },
  });
}

let clientQueryClientInstance: QueryClient | undefined;

export function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new instance
    return makeQueryClient();
  }

  // Browser: reuse single instance
  if (!clientQueryClientInstance) clientQueryClientInstance = makeQueryClient();
  return clientQueryClientInstance;
}
