import { API_ENDPOINTS } from "@/provider/endpoints";
import { LinkedNote } from "../../../types/job-application";
import { APIResponse } from "../../../types/response";
import { useSubmitData } from "../use-submit-data";

interface UseLinkNoteOptions {
  applicationId: string;
}

export const useLinkNote = function ({ applicationId }: UseLinkNoteOptions) {
  const detailKey = [API_ENDPOINTS.jobApplications.detail(applicationId)];

  const { mutate: link, isPending: isLinking } = useSubmitData<
    { noteId: string },
    APIResponse<LinkedNote>
  >({
    url: API_ENDPOINTS.jobApplications.linkNote(applicationId),
    method: "post",
    onSuccessMessage: "Note linked",
    additionalQueryKeys: [detailKey],
  });

  const { mutate: unlink, isPending: isUnlinking } = useSubmitData<
    { noteId: string },
    APIResponse<null>
  >({
    url: ({ noteId }) =>
      API_ENDPOINTS.jobApplications.unlinkNote(applicationId, noteId),
    // axios delete is (url, config), so a body would be read as config; the id goes in the URL.
    getBody: () => undefined,
    method: "delete",
    onSuccessMessage: "Note unlinked",
    additionalQueryKeys: [detailKey],
  });

  return {
    linkNote: link,
    unlinkNote: unlink,
    isLinkingNote: isLinking,
    isUnlinkingNote: isUnlinking,
  };
};
