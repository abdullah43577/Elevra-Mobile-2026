/*
  Codes the two imports — a resume PDF into the career profile, and a job
  posting into a new application — can answer with. Each is something the user
  can act on, so they are shown as a warning, never as an error.

  Mirrors PdfNoTextError, PdfUnreadableError, the multer size limit,
  InvalidLinkError and FetchBlockedError in ../elevra-server/src/lib.
*/
export const IMPORT_ERROR_CODES = {
  PDF_NO_TEXT: "PDF_NO_TEXT",
  PDF_UNREADABLE: "PDF_UNREADABLE",
  FILE_TOO_LARGE: "FILE_TOO_LARGE",
  INVALID_LINK: "INVALID_LINK",
  FETCH_BLOCKED: "FETCH_BLOCKED",
} as const;

export const isImportErrorCode = function (code?: string) {
  return Object.values<string>(IMPORT_ERROR_CODES).includes(code ?? "");
};
