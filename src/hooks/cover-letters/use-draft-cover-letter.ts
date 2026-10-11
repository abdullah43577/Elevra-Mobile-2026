import { isAiErrorCode } from "@/constants/ai";
import { API_ENDPOINTS } from "@/provider/endpoints";
import { showToast } from "@/utils/show-toast";
import {
  CoverLetterDraft,
  DraftCoverLetterRequest,
} from "../../../types/cover-letter";
import { APIResponse } from "../../../types/response";
import { useHandleErrors } from "../use-handle-errors";
import { useSubmitData } from "../use-submit-data";

interface UseDraftCoverLetterOptions {
  applicationId?: string;
  onSuccess?: (data: APIResponse<CoverLetterDraft>) => void;
}

export const useDraftCoverLetter = function (
  options: UseDraftCoverLetterOptions = {},
) {
  const handleErrors = useHandleErrors();

  const { mutate, isPending } = useSubmitData<
    DraftCoverLetterRequest,
    APIResponse<CoverLetterDraft>
  >({
    url: API_ENDPOINTS.coverLetters.draft,
    method: "post",
    silent: true,
    // Drafting can extract the posting's keywords, which the match score reads.
    ...(options.applicationId && {
      additionalQueryKeys: [
        [API_ENDPOINTS.jobApplications.match(options.applicationId)],
      ],
    }),
    onError: (error) => {
      const body = error.response?.data;
      if (isAiErrorCode(body?.code)) return showToast("warning", body?.message ?? "Please try again in a moment.");
      handleErrors(error);
    },
    ...(options.onSuccess && { onSuccess: options.onSuccess }),
  });

  return { draftCoverLetter: mutate, isDrafting: isPending };
};
