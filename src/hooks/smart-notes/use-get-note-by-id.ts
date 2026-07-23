import { Note } from "../../../types/notes";
import { APIResponse } from "../../../types/response";
import { useGetData } from "../use-get-data";
import { API_ENDPOINTS } from "@/provider/endpoints";

interface UseGetNoteByIdOptions {
  noteId: string;
  shouldFetch?: boolean;
}

export const useGetNoteById = function (options: UseGetNoteByIdOptions) {
  const { noteId, shouldFetch = true } = options;

  const { data, isFetching, error, refetch } = useGetData<APIResponse<Note>>({
    url: API_ENDPOINTS.notes.detail(noteId),
    shouldFetch: shouldFetch && !!noteId,
  });

  return {
    note: data?.data,
    isFetchingNote: isFetching,
    errorNote: error,
    refetchNote: refetch,
  };
};
