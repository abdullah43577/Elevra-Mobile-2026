/*
  Machine-readable error codes the API sends alongside a message. Matching on
  the message text instead would break the moment anyone rewords a string, and
  these are the errors the client has to *act* on rather than display.

  Mirrors `AppError.code` in ../elevra-server/src/lib/errors.ts.
*/
export const AUTH_ERROR_CODES = {
  EMAIL_NOT_VERIFIED: "EMAIL_NOT_VERIFIED",
} as const;
