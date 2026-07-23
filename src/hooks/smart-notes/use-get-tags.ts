import { Tag } from "../../../types/notes";
import { APIResponse } from "../../../types/response";
import { useGetData } from "../use-get-data";
import { API_ENDPOINTS } from "@/provider/endpoints";

interface UseGetTagsOptions {
  shouldFetch?: boolean;
}

export const useGetTags = function (options?: UseGetTagsOptions) {
  const { shouldFetch = true } = options || {};

  const { data, isFetching, error, refetch } = useGetData<APIResponse<Tag[]>>({
    url: API_ENDPOINTS.notes.tagsList,
    shouldFetch,
  });

  return {
    tags: data?.data || [],
    isFetchingTags: isFetching,
    errorTags: error,
    refetchTags: refetch,
  };
};
