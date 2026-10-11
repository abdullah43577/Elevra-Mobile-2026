import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Must outlive the session, or a restored persisted cache is garbage-collected
      // almost immediately.
      gcTime: 1000 * 60 * 60 * 24,
      staleTime: 1000 * 60 * 5,

      retry: 2,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 0,
    },
  },
});
