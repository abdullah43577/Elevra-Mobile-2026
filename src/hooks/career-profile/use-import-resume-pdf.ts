import { isAiErrorCode } from "@/constants/ai";
import { isImportErrorCode } from "@/constants/import";
import { API_ENDPOINTS } from "@/provider/endpoints";
import { showToast } from "@/utils/show-toast";
import { ImportedProfile } from "../../../types/career-profile";
import { APIResponse } from "../../../types/response";
import { useHandleErrors } from "../use-handle-errors";
import { useSubmitData } from "../use-submit-data";

interface UseImportResumePdfOptions {
  onSuccess?: (data: APIResponse<ImportedProfile>) => void;
}

export const useImportResumePdf = function (options: UseImportResumePdfOptions = {}) {
  const handleErrors = useHandleErrors();

  const { mutate, isPending } = useSubmitData<FormData, APIResponse<ImportedProfile>>({
    url: API_ENDPOINTS.careerProfile.import,
    method: "post",
    silent: true,
    onError: (error) => {
      const body = error.response?.data;
      if (isImportErrorCode(body?.code) || isAiErrorCode(body?.code)) {
        return showToast("warning", body?.message ?? "That PDF couldn't be read.");
      }
      handleErrors(error);
    },
    ...(options.onSuccess && { onSuccess: options.onSuccess }),
  });

  return { importResumePdf: mutate, isImportingResumePdf: isPending };
};
