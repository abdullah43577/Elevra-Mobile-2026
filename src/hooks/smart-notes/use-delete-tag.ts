import { API_ENDPOINTS } from "@/provider/endpoints";
import { APIResponse } from "../../../types/response";
import { useSubmitData } from "../use-submit-data";

export const useDeleteTag = function ({ tagId }: { tagId: string }) {
  const { mutate, isPending } = useSubmitData<null, APIResponse<null>>({
    url: API_ENDPOINTS.notes.deleteTag(tagId),
    method: "delete",
    onSuccessMessage: "Tag deleted successfully",
  });

  return {
    deleteTag: mutate,
    isDeleting: isPending,
  };
};
