import { APIResponse } from "../../../types/response";
import { Resume } from "../../../types/resume/resume";
import { useGetData } from "../use-get-data";
import { API_ENDPOINTS } from "@/provider/endpoints";

export const useGetResumeById = function ({ resumeId }: { resumeId: string }) {
  const { data, isFetching, error, refetch } = useGetData<APIResponse<Resume>>({
    url: API_ENDPOINTS.resume.detail(resumeId),
  });

  return {
    resume: data?.data,
    isFetchingResume: isFetching,
    errorResume: error,
    refetchResume: refetch,
  };
};
