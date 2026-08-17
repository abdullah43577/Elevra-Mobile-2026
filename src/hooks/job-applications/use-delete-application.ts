import { API_ENDPOINTS } from "@/provider/endpoints";
import { APIResponse } from "../../../types/response";
import { useSubmitData } from "../use-submit-data";

interface UseDeleteApplicationOptions {
  applicationId: string;
  onSuccess?: () => void;
}

export const useDeleteApplication = function (
  options: UseDeleteApplicationOptions,
) {
  const { mutate, isPending } = useSubmitData<void, APIResponse<null>>({
    url: API_ENDPOINTS.jobApplications.delete(options.applicationId),
    method: "delete",
    onSuccessMessage: "Application deleted",
    additionalQueryKeys: [
      [API_ENDPOINTS.jobApplications.list],
      [API_ENDPOINTS.jobApplications.stats],
    ],
    ...(options.onSuccess && { onSuccess: options.onSuccess }),
  });

  return { deleteApplication: mutate, isDeletingApplication: isPending };
};
