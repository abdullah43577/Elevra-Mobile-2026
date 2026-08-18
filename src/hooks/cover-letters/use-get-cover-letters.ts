import { API_ENDPOINTS } from "@/provider/endpoints";
import { CoverLetter } from "../../../types/cover-letter";
import { APIResponse } from "../../../types/response";
import { useGetData } from "../use-get-data";

interface UseGetCoverLettersOptions {
  search?: string;
}

export const useGetCoverLetters = function (
  options: UseGetCoverLettersOptions = {},
) {
  const query = options.search
    ? `?search=${encodeURIComponent(options.search)}`
    : "";

  const { data, isFetching, error, refetch } = useGetData<
    APIResponse<CoverLetter[]>
  >({
    url: `${API_ENDPOINTS.coverLetters.list}${query}`,
  });

  return {
    coverLetters: data?.data ?? [],
    isFetchingCoverLetters: isFetching,
    errorCoverLetters: error,
    refetchCoverLetters: refetch,
  };
};
