import { useState, useCallback } from "react";
import { API_ENDPOINTS } from "@/provider/endpoints";
import { useSSE } from "../use-sse";

export const useGenerateSummary = function ({ noteId }: { noteId: string }) {
  const [summary, setSummary] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { connect, disconnect, isLoading } = useSSE();

  const generateSummary = useCallback(
    function (
      onComplete?: (summary: string) => void,
      onError?: (error: string) => void,
    ) {
      if (!noteId) {
        const errorMsg = "Please save the note first";
        setError(errorMsg);
        if (onError) onError(errorMsg);
        return;
      }

      setSummary("");
      setError(null);

      connect(API_ENDPOINTS.notes.generateSummaryStream(noteId), {
        onChunk: (chunk: string, full: string) => {
          setSummary(full);
        },
        onComplete: (data: any) => {
          setSummary(data.summary);
          if (onComplete) onComplete(data.summary);
        },
        onError: (errorMsg: string) => {
          setError(errorMsg);
          if (onError) onError(errorMsg);
        },
      });
    },
    [noteId, connect],
  );

  const resetSummary = useCallback(
    function () {
      setSummary("");
      setError(null);
      disconnect();
    },
    [disconnect],
  );

  return {
    generateSummary,
    summary,
    isLoading,
    error,
    resetSummary,
  };
};
