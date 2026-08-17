import { API_ENDPOINTS } from "@/provider/endpoints";
import {
  CreateApplicationRequest,
  JobApplication,
  UpdateApplicationRequest,
} from "../../../types/job-application";
import { APIResponse } from "../../../types/response";
import { useSubmitData } from "../use-submit-data";

interface UseSaveApplicationOptions {
  applicationId?: string;
  onSuccess?: (data: APIResponse<JobApplication>) => void;
}

export const useSaveApplication = function (
  options?: UseSaveApplicationOptions,
) {
  const { applicationId, onSuccess } = options || {};
  const isUpdate = !!applicationId;

  const { mutate, isPending } = useSubmitData<
    CreateApplicationRequest | UpdateApplicationRequest,
    APIResponse<JobApplication>
  >({
    url: isUpdate
      ? API_ENDPOINTS.jobApplications.update(applicationId)
      : API_ENDPOINTS.jobApplications.create,
    method: isUpdate ? "put" : "post",
    onSuccessMessage: isUpdate
      ? "Application updated"
      : "Application added",
    // The list and the pipeline summary are separate queries, so neither is
    // covered by the mutation's own URL key.
    additionalQueryKeys: [
      [API_ENDPOINTS.jobApplications.list],
      [API_ENDPOINTS.jobApplications.stats],
    ],
    ...(onSuccess && { onSuccess }),
  });

  return { saveApplication: mutate, isSavingApplication: isPending, isUpdate };
};
