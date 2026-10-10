/*
  Codes the API attaches to AI failures, over HTTP and inside SSE error events.
  Both are expected states rather than faults — busy providers, or the daily
  limit — so they are shown as a warning, never as an error.

  Mirrors `AiUnavailableError` / `AiQuotaExceededError` in
  ../elevra-server/src/lib/errors.ts.
*/
export const AI_ERROR_CODES = {
  AI_UNAVAILABLE: "AI_UNAVAILABLE",
  AI_QUOTA_EXCEEDED: "AI_QUOTA_EXCEEDED",
} as const;

export const isAiErrorCode = function (code?: string) {
  return Object.values<string>(AI_ERROR_CODES).includes(code ?? "");
};
