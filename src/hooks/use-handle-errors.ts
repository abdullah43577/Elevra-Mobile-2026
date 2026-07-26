import { logError } from "@/utils/logger";
import { showToast } from "@/utils/show-toast";
import { AxiosError } from "axios";
import { ZodError } from "zod";

function formatZodError(error: ZodError): string {
  return error.issues
    .map((issue) => {
      const field = issue.path.join(".");
      return field ? `${field}: ${issue.message}` : issue.message;
    })
    .join("\n");
}

export function useHandleErrors() {
  const handleErrors = function (error: unknown) {
    logError(error);

    let errorMessage = "An unexpected error occurred. Please try again later.";

    if (error instanceof ZodError) {
      // ✅ client-side schema validation failures (e.g. RHF/Zod form parsing)
      errorMessage = formatZodError(error);
    } else if (error instanceof AxiosError) {
      if (error.response) {
        const data = error.response.data;

        if (Array.isArray(data?.errors) && data.errors.length > 0) {
          // ✅ backend field-level validation errors
          errorMessage = data.errors
            .map(
              (e: { field: string; message: string }) =>
                `${e.field}: ${e.message}`,
            )
            .join("\n");
        } else {
          // ✅ use the message from the backend API if available
          errorMessage =
            data?.message ||
            data?.error ||
            (typeof data === "string" ? data : "An error occurred");
        }
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection.";
      } else {
        errorMessage =
          error.message || "Error occurred while setting up the request";
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    showToast("error", errorMessage);
  };

  return handleErrors;
}
