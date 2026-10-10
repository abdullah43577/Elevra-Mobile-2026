import { API_ENDPOINTS } from "@/provider/endpoints";
import {
  CoverLetter,
  SaveCoverLetterRequest,
  UpdateCoverLetterRequest,
} from "../../../types/cover-letter";
import { APIResponse } from "../../../types/response";
import { useSubmitData } from "../use-submit-data";

/*
  `applicationId` means the letter was started from an application. The server
  attaches it on create, and the caller returns to the application itself, so
  the usual redirect to the letters list is skipped.
*/
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
    // The list is keyed by its own URL, which the mutation's refetch of the
    // resolved URL never touches.
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
