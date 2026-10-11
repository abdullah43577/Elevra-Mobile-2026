// Mirrors AppError.code in ../elevra-server/src/lib/errors.ts. Branch on these,
// never on message text.
export const AUTH_ERROR_CODES = {
  EMAIL_NOT_VERIFIED: "EMAIL_NOT_VERIFIED",
} as const;
