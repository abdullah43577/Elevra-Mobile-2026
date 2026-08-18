import { APIResponse } from "../../../types/response";
import { Resume } from "../../../types/resume/resume";
import { useGetData } from "../use-get-data";
import { API_ENDPOINTS } from "@/provider/endpoints";

interface UseGetResumesOptions {
  shouldFetch?: boolean;
}

export const useGetResumes = function (options: UseGetResumesOptions = {}) {
  const { data, isFetching, error, refetch } = useGetData<
    APIResponse<Resume[]>
  >({
    url: API_ENDPOINTS.resume.list,
    ...(options.shouldFetch !== undefined && { shouldFetch: options.shouldFetch }),
  });

  return {
    resumes: data?.data || [],
    isFetchingResumes: isFetching,
    errorResumes: error,
    refetchResumes: refetch,
  };
};
