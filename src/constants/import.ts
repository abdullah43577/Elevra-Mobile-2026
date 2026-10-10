/*
  Codes the career-profile import can answer with. Each is something the user
  can act on — a scan, a broken file, a file over the size limit — so they are
  shown as a warning, never as an error.

  Mirrors PdfNoTextError, PdfUnreadableError and the multer size limit in
  ../elevra-server/src/lib.
*/
export const IMPORT_ERROR_CODES = {
  PDF_NO_TEXT: "PDF_NO_TEXT",
  PDF_UNREADABLE: "PDF_UNREADABLE",
  FILE_TOO_LARGE: "FILE_TOO_LARGE",
} as const;

export const isImportErrorCode = function (code?: string) {
  return Object.values<string>(IMPORT_ERROR_CODES).includes(code ?? "");
};
