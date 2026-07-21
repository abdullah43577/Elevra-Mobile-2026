import { logError } from "@/utils/logger";
import { showToast } from "@/utils/show-toast";
import { AxiosError } from "axios";

export function useHandleErrors() {
  const handleErrors = function (error: unknown) {
    logError(error);

    let errorMessage = "An unexpected error occurred. Please try again later.";

    if (error instanceof AxiosError) {
      if (error.response) {
        // ✅ use the message from the backend API if available
        errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          (typeof error.response.data === "string"
            ? error.response.data
            : "An error occurred");
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
