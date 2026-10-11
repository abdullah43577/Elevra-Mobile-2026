import { API_ENDPOINTS } from "@/provider/endpoints";
import {
  CoverLetter,
  SaveCoverLetterRequest,
  UpdateCoverLetterRequest,
} from "../../../types/cover-letter";
import { APIResponse } from "../../../types/response";
import { useSubmitData } from "../use-submit-data";

export const useSaveCoverLetter = function ({
  coverLetterId,
  applicationId,
}: { coverLetterId?: string; applicationId?: string } = {}) {
  const isUpdate = !!coverLetterId;

  const { mutateAsync, isPending } = useSubmitData<
    SaveCoverLetterRequest | UpdateCoverLetterRequest,
    APIResponse<CoverLetter>
  >({
    url: isUpdate
      ? API_ENDPOINTS.coverLetters.update(coverLetterId)
      : API_ENDPOINTS.coverLetters.create,
    method: isUpdate ? "put" : "post",
    onSuccessMessage: isUpdate
      ? "Cover letter updated"
      : "Cover letter created",
    additionalQueryKeys: [
      [API_ENDPOINTS.coverLetters.list],
      ...(applicationId
        ? [
            [API_ENDPOINTS.jobApplications.detail(applicationId)],
            [API_ENDPOINTS.jobApplications.list],
          ]
        : []),
    ],
    ...(!applicationId && {
      redirectTo: "/(dashboard)/(tabs)/workspaces/cover-letters",
    }),
  });

  return {
    saveCoverLetter: mutateAsync,
    isSavingCoverLetter: isPending,
    isUpdate,
  };
};
