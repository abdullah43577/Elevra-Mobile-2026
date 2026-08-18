import { API_ENDPOINTS } from "@/provider/endpoints";
import { InterviewPrepStats } from "../../../types/interview-prep";
import { APIResponse } from "../../../types/response";
import { useGetData } from "../use-get-data";

export const useGetPrepStats = function () {
  const { data, isFetching, error, refetch } = useGetData<
    APIResponse<InterviewPrepStats>
  >({
    url: API_ENDPOINTS.interviewPrep.stats,
  });

  return {
    prepStats: data?.data,
    isFetchingPrepStats: isFetching,
    errorPrepStats: error,
    refetchPrepStats: refetch,
  };
};
