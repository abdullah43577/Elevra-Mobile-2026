import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      /*
        gcTime must outlive the session for persistence to be worth anything.
        At the 5-minute default, a restored cache would be garbage-collected
        almost immediately and the app would still show empty screens offline.
      */
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      staleTime: 1000 * 60 * 5,

      // networkMode "online" (the default) is what we want: while offline,
      // queries stay paused and serve cached data instead of failing.
      retry: 2,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
      refetchOnReconnect: true,
    },
    mutations: {
      // Paused rather than failed while offline, then resumed on reconnect.
      retry: 0,
    },
  },
});
