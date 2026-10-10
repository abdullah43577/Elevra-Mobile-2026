/*
  Codes the API attaches to AI failures, over HTTP and inside SSE error events.
  All are expected states rather than faults — busy providers, the daily limit,
  or a recording with nothing usable in it — so they are shown as a warning,
  never as an error.

  Mirrors the AppError codes in ../elevra-server/src/lib/errors.ts,
  remote-audio.ts and answer-coaching.service.ts.
*/
export const AI_ERROR_CODES = {
  AI_UNAVAILABLE: "AI_UNAVAILABLE",
  AI_QUOTA_EXCEEDED: "AI_QUOTA_EXCEEDED",
  // Recording outcomes — each one the user can act on.
  NO_SPEECH: "NO_SPEECH",
  AUDIO_TOO_LONG: "AUDIO_TOO_LONG",
  TAKE_REPLACED: "TAKE_REPLACED",
} as const;

export const isAiErrorCode = function (code?: string) {
  return Object.values<string>(AI_ERROR_CODES).includes(code ?? "");
};
