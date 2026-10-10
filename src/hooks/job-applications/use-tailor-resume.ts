import { isAiErrorCode } from "@/constants/ai";
import { API_ENDPOINTS } from "@/provider/endpoints";
import { showToast } from "@/utils/show-toast";
import {
  TailorResult,
  TailorResumeRequest,
} from "../../../types/job-application";
import { APIResponse } from "../../../types/response";
import { useHandleErrors } from "../use-handle-errors";
import { useSubmitData } from "../use-submit-data";

interface UseTailorResumeOptions {
  applicationId: string;
  onSuccess?: (data: APIResponse<TailorResult>) => void;
}

export const useTailorResume = function (options: UseTailorResumeOptions) {
  const handleErrors = useHandleErrors();

  const { mutate, isPending } = useSubmitData<
    TailorResumeRequest,
    APIResponse<TailorResult>
  >({
    url: API_ENDPOINTS.jobApplications.tailor(options.applicationId),
    method: "post",
    // The report the caller shows is the confirmation; a toast would sit on top of it.
    silent: true,
    additionalQueryKeys: [
      [API_ENDPOINTS.jobApplications.detail(options.applicationId)],
      [API_ENDPOINTS.jobApplications.match(options.applicationId)],
      [API_ENDPOINTS.jobApplications.list],
      [API_ENDPOINTS.resume.list],
    ],
    onError: (error) => {
      const body = error.response?.data;
      if (isAiErrorCode(body?.code)) return showToast("warning", body?.message ?? "Please try again in a moment.");
      handleErrors(error);
    },
    ...(options.onSuccess && { onSuccess: options.onSuccess }),
  });

  return { tailorResume: mutate, isTailoring: isPending };
};
