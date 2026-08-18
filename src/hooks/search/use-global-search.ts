import { MIN_SEARCH_LENGTH, SEARCH_LIMIT } from "@/constants/search";
import { API_ENDPOINTS } from "@/provider/endpoints";
import { APIResponse } from "../../../types/response";
import { SearchResponse } from "../../../types/search";
import { useGetData } from "../use-get-data";

interface UseGlobalSearchOptions {
  query: string;
  shouldFetch?: boolean;
}

export const useGlobalSearch = function (options: UseGlobalSearchOptions) {
  const term = options.query.trim();
  const isSearchable = term.length >= MIN_SEARCH_LENGTH;

  const params = new URLSearchParams({ q: term, limit: String(SEARCH_LIMIT) });

  const { data, isFetching, error, refetch } = useGetData<
    APIResponse<SearchResponse>
  >({
    url: `${API_ENDPOINTS.search.query}?${params.toString()}`,
    shouldFetch: isSearchable && options.shouldFetch !== false,
  });

  return {
    searchResults: data?.data,
    isSearching: isFetching,
    errorSearch: error,
    refetchSearch: refetch,
  };
};
