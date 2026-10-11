import { API_ENDPOINTS } from "@/provider/endpoints";
import { APIResponse } from "../../../types/response";
import { Resume } from "../../../types/resume/resume";
import { useSubmitData } from "../use-submit-data";

interface DuplicateResumePayload {
  resumeId: string;
  title?: string;
}

interface UseDuplicateResumeOptions {
  onSuccess?: (data: APIResponse<Resume>) => void;
}

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
    additionalQueryKeys: [[API_ENDPOINTS.resume.list]],
    ...(options.onSuccess && { onSuccess: options.onSuccess }),
  });

  return { duplicateResume: mutate, isDuplicatingResume: isPending };
};
