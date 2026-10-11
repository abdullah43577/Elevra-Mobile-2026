import { APIResponse } from "../../../types/response";
import { Resume } from "../../../types/resume/resume";
import { useGetData } from "../use-get-data";
import { API_ENDPOINTS } from "@/provider/endpoints";

interface UseGetResumeByIdOptions {
  resumeId: string;
  shouldFetch?: boolean;
}

export const useGetResumeById = function ({
  resumeId,
  shouldFetch,
}: UseGetResumeByIdOptions) {
  const { data, isFetching, error, refetch } = useGetData<APIResponse<Resume>>({
    url: API_ENDPOINTS.resume.detail(resumeId),
    // An empty id would hit the list route instead.
    shouldFetch: shouldFetch ?? !!resumeId,
  });

  return {
    resume: data?.data,
    isFetchingResume: isFetching,
    errorResume: error,
    refetchResume: refetch,
  };
};
