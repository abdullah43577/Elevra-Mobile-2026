import { Folder } from "../../../types/notes";
import { APIResponse } from "../../../types/response";
import { useGetData } from "../use-get-data";
import { API_ENDPOINTS } from "@/provider/endpoints";

interface UseGetFoldersOptions {
  shouldFetch?: boolean;
}

export const useGetFolders = function (options?: UseGetFoldersOptions) {
  const { shouldFetch = true } = options || {};

  const { data, isFetching, error, refetch } = useGetData<
    APIResponse<Folder[]>
  >({
    url: API_ENDPOINTS.notes.foldersList,
    shouldFetch,
  });

  return {
    folders: data?.data || [],
    isFetchingFolders: isFetching,
    errorFolders: error,
    refetchFolders: refetch,
  };
};
