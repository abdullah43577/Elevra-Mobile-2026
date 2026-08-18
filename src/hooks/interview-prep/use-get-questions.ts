import { API_ENDPOINTS } from "@/provider/endpoints";
import {
  InterviewQuestion,
  QuestionFilters,
} from "../../../types/interview-prep";
import { APIResponse } from "../../../types/response";
import { useGetData } from "../use-get-data";

export const useGetQuestions = function (filters: QuestionFilters = {}) {
  const params = new URLSearchParams();
  if (filters.category) params.set("category", filters.category);
  if (filters.status) params.set("status", filters.status);
  if (filters.search) params.set("search", filters.search);
  if (filters.applicationId) params.set("applicationId", filters.applicationId);
  if (filters.unanswered) params.set("unanswered", "true");

  const query = params.toString();

  const { data, isFetching, error, refetch } = useGetData<
    APIResponse<InterviewQuestion[]>
  >({
    url: `${API_ENDPOINTS.interviewPrep.questions}${query ? `?${query}` : ""}`,
  });

  return {
    questions: data?.data ?? [],
    isFetchingQuestions: isFetching,
    errorQuestions: error,
    refetchQuestions: refetch,
  };
};
