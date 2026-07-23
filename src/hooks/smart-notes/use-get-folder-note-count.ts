import { useGetData } from "../use-get-data";
import { API_ENDPOINTS } from "@/provider/endpoints";
import { APIResponse } from "../../../types/response";

interface UseGetFolderNotesCountOptions {
  folderId: string;
  shouldFetch?: boolean;
}

export const useGetFolderNotesCount = function (
  options: UseGetFolderNotesCountOptions,
) {
  const { folderId, shouldFetch = true } = options;

  const { data, isFetching, error, refetch } = useGetData<
    APIResponse<{ count: number }>
  >({
    url: API_ENDPOINTS.notes.folderNotesCount(folderId),
    shouldFetch: shouldFetch && !!folderId,
  });

  return {
    noteCount: data?.data?.count || 0,
    isFetchingCount: isFetching,
    errorCount: error,
    refetchCount: refetch,
  };
};
