import { APIResponse } from "../../../types/response";
import { Resume } from "../../../types/resume/resume";
import { useGetData } from "../use-get-data";
import { API_ENDPOINTS } from "@/provider/endpoints";

export const useGetResumes = function () {
  const { data, isFetching, error, refetch } = useGetData<
    APIResponse<Resume[]>
  >({
    url: API_ENDPOINTS.resume.list,
  });

  return {
    resumes: data?.data || [],
    isFetchingResumes: isFetching,
    errorResumes: error,
    refetchResumes: refetch,
  };
};
