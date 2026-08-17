import { API_ENDPOINTS } from "@/provider/endpoints";
import { JobApplication } from "../../../types/job-application";
import { APIResponse } from "../../../types/response";
import { useGetData } from "../use-get-data";

interface UseGetApplicationByIdOptions {
  applicationId: string;
  shouldFetch?: boolean;
}

export const useGetApplicationById = function (
  options: UseGetApplicationByIdOptions,
) {
  const { data, isFetching, error, refetch } = useGetData<
    APIResponse<JobApplication>
  >({
    url: API_ENDPOINTS.jobApplications.detail(options.applicationId),
    shouldFetch: (options.shouldFetch ?? true) && !!options.applicationId,
  });

  return {
    application: data?.data,
    isFetchingApplication: isFetching,
    errorApplication: error,
    refetchApplication: refetch,
  };
};
