import { API_ENDPOINTS } from "@/provider/endpoints";
import {
  ApplicationStatus,
  JobApplication,
} from "../../../types/job-application";
import { APIResponse } from "../../../types/response";
import { useGetData } from "../use-get-data";

interface UseGetApplicationsOptions {
  status?: ApplicationStatus;
  search?: string;
  isArchived?: boolean;
}

export const useGetApplications = function (
  options?: UseGetApplicationsOptions,
) {
  const { status, search, isArchived } = options || {};

  const queryParams = new URLSearchParams();
  if (status) queryParams.append("status", status);
  if (search) queryParams.append("search", search);
  if (isArchived !== undefined) {
    queryParams.append("isArchived", String(isArchived));
  }

  const url = queryParams.toString()
    ? `${API_ENDPOINTS.jobApplications.list}?${queryParams.toString()}`
    : API_ENDPOINTS.jobApplications.list;

  const { data, isFetching, error, refetch } = useGetData<
    APIResponse<JobApplication[]>
  >({ url });

  return {
    applications: data?.data || [],
    isFetchingApplications: isFetching,
    errorApplications: error,
    refetchApplications: refetch,
  };
};
