import { API_ENDPOINTS } from "@/provider/endpoints";
import { LinkedRecording } from "../../../types/job-application";
import { APIResponse } from "../../../types/response";
import { useSubmitData } from "../use-submit-data";

interface UseLinkRecordingOptions {
  applicationId: string;
}

export const useLinkRecording = function ({
  applicationId,
}: UseLinkRecordingOptions) {
  const detailKey = [API_ENDPOINTS.jobApplications.detail(applicationId)];

  const { mutate: link, isPending: isLinking } = useSubmitData<
    { recordingId: string },
    APIResponse<LinkedRecording>
  >({
    url: API_ENDPOINTS.jobApplications.linkRecording(applicationId),
    method: "post",
    onSuccessMessage: "Recording linked",
    additionalQueryKeys: [detailKey],
  });

  const { mutate: unlink, isPending: isUnlinking } = useSubmitData<
    { recordingId: string },
    APIResponse<null>
  >({
    url: ({ recordingId }) =>
      API_ENDPOINTS.jobApplications.unlinkRecording(applicationId, recordingId),
    // See use-link-note — a delete body would be read as the axios config.
    getBody: () => undefined,
    method: "delete",
    onSuccessMessage: "Recording unlinked",
    additionalQueryKeys: [detailKey],
  });

  return {
    linkRecording: link,
    unlinkRecording: unlink,
    isLinkingRecording: isLinking,
    isUnlinkingRecording: isUnlinking,
  };
};
