import { Note } from "../../../types/notes";
import { APIResponse } from "../../../types/response";
import { useGetData } from "../use-get-data";
import { API_ENDPOINTS } from "@/provider/endpoints";

interface UseGetNotesOptions {
  folderId?: string;
  search?: string;
  shouldFetch?: boolean;
}

export const useGetNotes = function (options?: UseGetNotesOptions) {
  const { folderId, search, shouldFetch } = options || {};

  const queryParams = new URLSearchParams();
  if (folderId) queryParams.append("folderId", folderId);
  if (search) queryParams.append("search", search);

  const url = queryParams.toString()
    ? `${API_ENDPOINTS.notes.list}?${queryParams.toString()}`
    : API_ENDPOINTS.notes.list;

  const { data, isFetching, error, refetch } = useGetData<APIResponse<Note[]>>({
    url,
    ...(shouldFetch !== undefined && { shouldFetch }),
  });

  return {
    notes: data?.data || [],
    isFetchingNotes: isFetching,
    errorNotes: error,
    refetchNotes: refetch,
  };
};
