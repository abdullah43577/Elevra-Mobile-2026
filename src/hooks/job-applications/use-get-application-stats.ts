import { API_ENDPOINTS } from "@/provider/endpoints";
import { ApplicationStats } from "../../../types/job-application";
import { APIResponse } from "../../../types/response";
import { useGetData } from "../use-get-data";

export const useGetApplicationStats = function () {
  const { data, isFetching, error, refetch } = useGetData<
    APIResponse<ApplicationStats>
  >({ url: API_ENDPOINTS.jobApplications.stats });

  return {
    stats: data?.data,
    isFetchingStats: isFetching,
    errorStats: error,
    refetchStats: refetch,
  };
};
