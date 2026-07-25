import { useState, useRef, useCallback } from "react";
import EventSource from "react-native-sse";
import { tokenStorage } from "@/provider/token-storage";
import { getBaseUrl } from "@/provider/client";

interface SSEOptions {
  onChunk?: (chunk: string, full: string) => void;
  onComplete?: (data: any) => void;
  onError?: (error: string) => void;
}

export const useSSE = function () {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  const connect = useCallback(async function (
    url: string,
    options: SSEOptions = {},
  ) {
    const { onChunk, onComplete, onError } = options;

    try {
      setIsLoading(true);
      setIsConnected(false);

      // Get the access token
      const token = await tokenStorage.getAccessToken();

      if (!token) {
        throw new Error("No access token found");
      }

      // Build the full URL with token as query param
      const fullUrl = `${getBaseUrl()}/${url}?token=${encodeURIComponent(token)}`;

      // Close any existing connection
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }

      const eventSource = new EventSource(fullUrl);
      eventSourceRef.current = eventSource;
      setIsConnected(true);

      let fullResponse = "";

      // Use addEventListener instead of onmessage for react-native-sse
      eventSource.addEventListener("message", (event: any) => {
        try {
          const data = JSON.parse(event.data);

          // Check for error
          if (data.error) {
            if (onError) onError(data.error);
            eventSource.close();
            setIsConnected(false);
            setIsLoading(false);
            return;
          }

          // Check for completion
          if (data.done) {
            if (onComplete) onComplete(data);
            eventSource.close();
            setIsConnected(false);
            setIsLoading(false);
            return;
          }

          // Handle chunk
          if (data.chunk) {
            fullResponse += data.chunk;
            if (onChunk) onChunk(data.chunk, fullResponse);
          }
        } catch (err) {
          console.error("Failed to parse SSE message:", err);
        }
      });

      eventSource.addEventListener("error", (event: any) => {
        // react-native-sse may not have readyState, handle error differently
        setIsConnected(false);
        setIsLoading(false);
        if (onError) onError("Connection lost");
      });

      eventSource.addEventListener("open", () => {
        setIsConnected(true);
        setIsLoading(false);
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to connect";
      setIsLoading(false);
      setIsConnected(false);
      if (options.onError) options.onError(errorMessage);
    }
  }, []);

  /**
   * Disconnect from the SSE stream
   */
  const disconnect = useCallback(function () {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setIsConnected(false);
    setIsLoading(false);
  }, []);

  return {
    connect,
    disconnect,
    isConnected,
    isLoading,
  };
};
