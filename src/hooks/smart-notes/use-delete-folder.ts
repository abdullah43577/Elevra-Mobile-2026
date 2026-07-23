import { API_ENDPOINTS } from "@/provider/endpoints";
import { APIResponse } from "../../../types/response";
import { useSubmitData } from "../use-submit-data";

export const useDeleteFolder = function ({ folderId }: { folderId: string }) {
  const { mutate, isPending } = useSubmitData<null, APIResponse<null>>({
    url: API_ENDPOINTS.notes.deleteFolder(folderId),
    method: "delete",
    onSuccessMessage: "Folder deleted successfully",
  });

  return {
    deleteFolder: mutate,
    isDeleting: isPending,
  };
};
