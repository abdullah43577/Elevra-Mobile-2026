import { Note } from "../../../types/notes";
import { APIResponse } from "../../../types/response";
import { useGetData } from "../use-get-data";
import { API_ENDPOINTS } from "@/provider/endpoints";

interface UseGetArchivedNotesOptions {
  shouldFetch?: boolean;
}

export const useGetArchivedNotes = function (
  options?: UseGetArchivedNotesOptions,
) {
  const { shouldFetch = true } = options || {};

  const { data, isFetching, error, refetch } = useGetData<APIResponse<Note[]>>({
    url: API_ENDPOINTS.notes.archived,
    shouldFetch,
  });

  return {
    archivedNotes: data?.data || [],
    isFetchingArchivedNotes: isFetching,
    errorArchivedNotes: error,
    refetchArchivedNotes: refetch,
  };
};
