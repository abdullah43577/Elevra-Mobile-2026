import { useState, useRef, useCallback } from "react";
import EventSource from "react-native-sse";
import { tokenStorage } from "@/provider/token-storage";
import { getBaseUrl } from "@/provider/client";

interface SSEOptions {
  onChunk?: (chunk: string, full: string) => void;
  onComplete?: (data: any) => void;
  onError?: (error: string, code?: string) => void;
}

// A refusal before the stream opens arrives as an error event whose message is the raw JSON body.
const parseErrorBody = function (raw: unknown): { message?: string; code?: string } {
  if (typeof raw !== "string" || !raw) return {};
  try {
    const body = JSON.parse(raw);
    return { message: body?.message, code: body?.code };
  } catch {
    return {};
  }
};

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

      const token = await tokenStorage.getAccessToken();

      if (!token) {
        throw new Error("No access token found");
      }

      const fullUrl = `${getBaseUrl()}/${url}?token=${encodeURIComponent(token)}`;

      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }

      const eventSource = new EventSource(fullUrl);
      eventSourceRef.current = eventSource;
      setIsConnected(true);

      let fullResponse = "";

      // react-native-sse needs addEventListener rather than onmessage.
      eventSource.addEventListener("message", (event: any) => {
        try {
          const data = JSON.parse(event.data);

          if (data.error) {
            if (onError) onError(data.error, data.code);
            eventSource.close();
            setIsConnected(false);
            setIsLoading(false);
            return;
          }

          if (data.done) {
            if (onComplete) onComplete(data);
            eventSource.close();
            setIsConnected(false);
            setIsLoading(false);
            return;
          }

          if (data.chunk) {
            fullResponse += data.chunk;
            if (onChunk) onChunk(data.chunk, fullResponse);
          }
        } catch (err) {
          console.error("Failed to parse SSE message:", err);
        }
      });

      eventSource.addEventListener("error", (event: any) => {
        // Without close(), react-native-sse re-polls every 5s after an error.
        eventSource.close();
        setIsConnected(false);
        setIsLoading(false);
        const { message, code } = parseErrorBody(event?.message);
        if (onError) onError(message ?? "Connection lost", code);
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
