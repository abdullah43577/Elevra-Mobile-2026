import { API_ENDPOINTS } from "@/provider/endpoints";
import { APIResponse } from "../../../types/response";
import { Resume } from "../../../types/resume/resume";
import { useSubmitData } from "../use-submit-data";

interface DuplicateResumePayload {
  resumeId: string;
  /** Defaults to the source title with a "(Copy)" suffix, numbered by the server. */
  title?: string;
}

interface UseDuplicateResumeOptions {
  onSuccess?: (data: APIResponse<Resume>) => void;
}

/*
  The resume id travels in the payload rather than being bound at hook level,
  because the list renders one hook for every row's worth of actions. useSubmitData
  accepts a url built from the mutation data, which is what makes that possible
  without a piece of state per pending duplicate.
*/
export const useDuplicateResume = function (
  options: UseDuplicateResumeOptions = {},
) {
  const { mutate, isPending } = useSubmitData<
    DuplicateResumePayload,
    APIResponse<Resume>
  >({
    url: (data) => API_ENDPOINTS.resume.duplicate(data.resumeId),
    getBody: (data) => (data.title ? { title: data.title } : {}),
    method: "post",
    onSuccessMessage: "Resume duplicated",
    // The mutation's own key is the duplicate url, which nothing reads. The
    // list is what has to change.
    additionalQueryKeys: [[API_ENDPOINTS.resume.list]],
    ...(options.onSuccess && { onSuccess: options.onSuccess }),
  });

  return { duplicateResume: mutate, isDuplicatingResume: isPending };
};
