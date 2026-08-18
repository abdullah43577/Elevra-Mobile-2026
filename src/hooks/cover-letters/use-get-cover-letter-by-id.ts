import { API_ENDPOINTS } from "@/provider/endpoints";
import { CoverLetter } from "../../../types/cover-letter";
import { APIResponse } from "../../../types/response";
import { useGetData } from "../use-get-data";

export const useGetCoverLetterById = function ({
  coverLetterId,
}: {
  coverLetterId: string;
}) {
  const { data, isFetching, error, refetch } = useGetData<
    APIResponse<CoverLetter>
  >({
    url: API_ENDPOINTS.coverLetters.detail(coverLetterId),
    shouldFetch: !!coverLetterId,
  });

  return {
    coverLetter: data?.data,
    isFetchingCoverLetter: isFetching,
    errorCoverLetter: error,
    refetchCoverLetter: refetch,
  };
};
